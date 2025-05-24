import { useEffect, useRef } from "react";
import { useTooltip } from "../../hooks/useTooltip";
export const useButtonTooltipManager = ({
  tooltip,
  toggletip,
  disabled,
  tooltipPosition,
  withTip,
  gap,
  avoidOverlapping,
}) => {
  // Common tooltip config
  const commonTooltipConfig = {
    tooltipPosition,
    withTip,
    disabled,
    gap,
    avoidOverlapping,
  };

  // Tooltip hooks
  const hoverTooltip = useTooltip({
    ...commonTooltipConfig,
    content: tooltip,
  });

  const toggleTooltip = useTooltip({
    ...commonTooltipConfig,
    content: toggletip,
  });

  // Track if we should suppress hover tooltip after click
  const suppressHoverRef = useRef(false);

  // Event handlers
  const handleMouseEnter = () => {
    if (!disabled && !toggleTooltip.visible && !suppressHoverRef.current) {
      hoverTooltip.setVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      hoverTooltip.setVisible(false);
      // Reset suppression when mouse leaves
      suppressHoverRef.current = false;
    }
  };

  const handleClick = () => {
    if (disabled) return;

    hoverTooltip.setVisible(false);

    if (toggletip) {
      toggleTooltip.setVisible((prev) => !prev);
    } else {
      // For buttons without toggletip, suppress hover until mouse leaves
      suppressHoverRef.current = true;
    }
  };

  // Close toggle tip when clicking outside
  useEffect(() => {
    if (!toggleTooltip.visible) return;

    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".tooltip") &&
        !e.target.closest("[data-toggle-tip='true']")
      ) {
        toggleTooltip.setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toggleTooltip.visible, toggleTooltip.setVisible, toggleTooltip]);

  // Combine refs
  const setButtonRef = (el) => {
    hoverTooltip.triggerRef.current = el;
    toggleTooltip.triggerRef.current = el;
  };

  return {
    buttonProps: {
      ref: setButtonRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleClick,
      "data-toggle-tip": toggleTooltip.visible,
      "aria-expanded": toggleTooltip.visible,
      ...hoverTooltip.tooltipProps,
    },
    renderTooltips: () => (
      <>
        {hoverTooltip.visible &&
          !toggleTooltip.visible &&
          hoverTooltip.renderTooltip()}
        {toggleTooltip.visible && toggleTooltip.renderTooltip()}
      </>
    ),
  };
};

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ("use client");

// import { useState, useRef, useCallback, useEffect } from "react";
// import { createPortal } from "react-dom";

// export function useTooltip({
//   content,
//   tooltipPosition = "top",
//   withTip = true,
//   disabled = false,
//   gap = 8,
//   avoidOverlapping = false,
//   triggerType = "hover",
// }) {
//   const [visible, setVisible] = useState(false);
//   const [position, setPosition] = useState(tooltipPosition);
//   const triggerRef = useRef(null);
//   const tooltipRef = useRef(null);
//   const isToggleTip = triggerType === "click";

//   // Calculate position and handle overlapping
//   const updatePosition = useCallback(() => {
//     if (!triggerRef.current || !tooltipRef.current) return;

//     const triggerRect = triggerRef.current.getBoundingClientRect();
//     const tooltipRect = tooltipRef.current.getBoundingClientRect();

//     let newPosition = tooltipPosition;

//     if (avoidOverlapping) {
//       // Logic to avoid overlapping by changing position if needed
//       const viewportHeight = window.innerHeight;
//       const viewportWidth = window.innerWidth;

//       if (newPosition === "top" && triggerRect.top < tooltipRect.height + gap) {
//         newPosition = "bottom";
//       } else if (
//         newPosition === "bottom" &&
//         triggerRect.bottom + tooltipRect.height + gap > viewportHeight
//       ) {
//         newPosition = "top";
//       } else if (
//         newPosition === "left" &&
//         triggerRect.left < tooltipRect.width + gap
//       ) {
//         newPosition = "right";
//       } else if (
//         newPosition === "right" &&
//         triggerRect.right + tooltipRect.width + gap > viewportWidth
//       ) {
//         newPosition = "left";
//       }
//     }

//     setPosition(newPosition);
//   }, [tooltipPosition, gap, avoidOverlapping]);

//   // Render tooltip with proper positioning
//   const renderTooltip = useCallback(() => {
//     if (!visible || !content) return null;

//     // Use portal to render at the document body level
//     return createPortal(
//       <div
//         ref={tooltipRef}
//         className={`tooltip ${isToggleTip ? "toggle-tip" : ""}`}
//         data-position={position}
//         style={{
//           position: "absolute",
//           zIndex: 1000,
//           // Positioning will be calculated in a useEffect after render
//         }}
//         role="tooltip"
//       >
//         <div className="tooltip-content">{content}</div>
//         {withTip && <div className="tooltip-arrow" />}
//       </div>,
//       document.body
//     );
//   }, [visible, content, withTip, isToggleTip, position]);

//   // Position the tooltip after it's rendered
//   useEffect(() => {
//     if (visible && triggerRef.current && tooltipRef.current) {
//       const triggerRect = triggerRef.current.getBoundingClientRect();
//       const tooltipRect = tooltipRef.current.getBoundingClientRect();

//       let top = 0;
//       let left = 0;

//       switch (position) {
//         case "top":
//           top = triggerRect.top - tooltipRect.height - gap;
//           left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
//           break;
//         case "bottom":
//           top = triggerRect.bottom + gap;
//           left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
//           break;
//         case "left":
//           top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
//           left = triggerRect.left - tooltipRect.width - gap;
//           break;
//         case "right":
//           top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
//           left = triggerRect.right + gap;
//           break;
//       }

//       if (tooltipRef.current) {
//         tooltipRef.current.style.top = `${top}px`;
//         tooltipRef.current.style.left = `${left}px`;
//       }
//     }
//   }, [visible, position, gap]);

//   // Update position when tooltip becomes visible
//   useEffect(() => {
//     if (visible) {
//       updatePosition();
//     }
//   }, [visible, updatePosition]);

//   return {
//     triggerRef,
//     tooltipRef,
//     visible,
//     setVisible,
//     renderTooltip,
//     position,
//   };
// }

// import { useRef, useLayoutEffect, useState, useEffect, useMemo } from "react";
// import { createPortal } from "react-dom";

// /**
//  * Animation control system to prevent animation spamming
//  * - After an animation plays, subsequent animations will be instant for 1 second
//  * - This provides better UX when multiple tooltips appear in quick succession
//  */
// let globalAnimationEnabled = true;
// let animationTimeout = null;

// // Reset animation availability after 1 second of inactivity
// const resetAnimationSession = () => {
//   clearTimeout(animationTimeout);
//   animationTimeout = setTimeout(() => {
//     globalAnimationEnabled = true;
//   }, 1000);
// };

// /**
//  * Ordered list of preferred tooltip positions (fallback order)
//  * - The component will try these positions in order until it finds one that fits
//  */
// const POSITION_PRIORITY = [
//   "BOTTOM_CENTER", // Most preferred position (default)
//   "BOTTOM_RIGHT",
//   "BOTTOM_LEFT",
//   "TOP_CENTER",
//   "TOP_RIGHT",
//   "TOP_LEFT",
//   "MIDDLE_RIGHT",
//   "MIDDLE_LEFT",
//   "MIDDLE_CENTER", // Least preferred position
// ];

// /**
//  * Mirror positions for fallback strategy
//  * - When preferred position doesn't fit, try the opposite position
//  * - Example: If TOP_CENTER doesn't work, try BOTTOM_CENTER
//  */
// const POSITION_MIRROR = {
//   BOTTOM_CENTER: "TOP_CENTER",
//   TOP_CENTER: "BOTTOM_CENTER",
//   BOTTOM_RIGHT: "TOP_RIGHT",
//   BOTTOM_LEFT: "TOP_LEFT",
//   TOP_RIGHT: "BOTTOM_RIGHT",
//   TOP_LEFT: "BOTTOM_LEFT",
//   MIDDLE_RIGHT: "MIDDLE_LEFT",
//   MIDDLE_LEFT: "MIDDLE_RIGHT",
//   MIDDLE_CENTER: "MIDDLE_CENTER",
// };

// /**
//  * Calculates tooltip coordinates based on position relative to trigger element
//  * @param {string} pos - Position identifier (e.g., "BOTTOM_CENTER")
//  * @param {DOMRect} triggerRect - Trigger element's bounding rectangle
//  * @param {Object} tooltipRect - Tooltip dimensions {width, height}
//  * @param {number} gap - Space between trigger and tooltip
//  * @returns {Object} Coordinates {top, left}
//  */
// const getPositionCoords = (pos, triggerRect, tooltipRect, gap) => {
//   switch (pos) {
//     case "BOTTOM_CENTER":
//       return {
//         top: triggerRect.bottom + gap,
//         left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
//       };
//     case "BOTTOM_RIGHT":
//       return {
//         top: triggerRect.bottom + gap,
//         left: triggerRect.right - tooltipRect.width,
//       };
//     case "BOTTOM_LEFT":
//       return {
//         top: triggerRect.bottom + gap,
//         left: triggerRect.left,
//       };
//     case "TOP_CENTER":
//       return {
//         top: triggerRect.top - tooltipRect.height - gap,
//         left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
//       };
//     case "TOP_RIGHT":
//       return {
//         top: triggerRect.top - tooltipRect.height - gap,
//         left: triggerRect.right - tooltipRect.width,
//       };
//     case "TOP_LEFT":
//       return {
//         top: triggerRect.top - tooltipRect.height - gap,
//         left: triggerRect.left,
//       };
//     case "MIDDLE_RIGHT":
//       return {
//         top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
//         left: triggerRect.right + gap,
//       };
//     case "MIDDLE_LEFT":
//       return {
//         top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
//         left: triggerRect.left - tooltipRect.width - gap,
//       };
//     case "MIDDLE_CENTER":
//       return {
//         top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
//         left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
//       };
//     default:
//       return null;
//   }
// };

// /**
//  * Checks if tooltip position is within viewport boundaries
//  * @param {Object} coords - Tooltip coordinates {top, left}
//  * @param {Object} tooltipRect - Tooltip dimensions {width, height}
//  * @param {number} viewportWidth
//  * @param {number} viewportHeight
//  * @returns {boolean}
//  */
// const isPositionInViewport = (
//   coords,
//   tooltipRect,
//   viewportWidth,
//   viewportHeight
// ) => {
//   if (!coords) return false;
//   return (
//     coords.top >= 0 &&
//     coords.left >= 0 &&
//     coords.top + tooltipRect.height <= viewportHeight &&
//     coords.left + tooltipRect.width <= viewportWidth
//   );
// };

// /**
//  * Checks if tooltip would overlap with other page elements
//  * @param {Object} coords - Tooltip coordinates
//  * @param {string} pos - Position identifier
//  * @param {Object} tooltipRect - Tooltip dimensions
//  * @param {DOMRect} triggerRect - Trigger element's bounds
//  * @param {HTMLElement} trigger - Trigger DOM element
//  * @param {HTMLElement} tooltip - Tooltip DOM element
//  * @returns {boolean}
//  */
// const isPositionNotOverlapping = (
//   coords,
//   pos,
//   tooltipRect,
//   triggerRect,
//   trigger,
//   tooltip
// ) => {
//   // Special case for center position which might cover the trigger
//   if (pos === "MIDDLE_CENTER") {
//     const triggerCenter = {
//       x: triggerRect.left + triggerRect.width / 2,
//       y: triggerRect.top + triggerRect.height / 2,
//     };
//     if (
//       coords.left <= triggerCenter.x &&
//       coords.left + tooltipRect.width >= triggerCenter.x &&
//       coords.top <= triggerCenter.y &&
//       coords.top + tooltipRect.height >= triggerCenter.y
//     ) {
//       return false;
//     }
//   }

//   const tooltipArea = {
//     top: coords.top,
//     left: coords.left,
//     width: tooltipRect.width,
//     height: tooltipRect.height,
//   };

//   return !hasOverlap(tooltipArea, [trigger, tooltip]);
// };

// /**
//  * Detects if an element overlaps with other page elements
//  * @param {Object} elementRect - Rectangle {top, left, width, height}
//  * @param {Array} excludeElements - Elements to ignore in overlap check
//  * @returns {boolean}
//  */
// function hasOverlap(elementRect, excludeElements = []) {
//   if (!elementRect || elementRect.width <= 0 || elementRect.height <= 0)
//     return false;

//   // Check multiple points within the element to detect overlaps
//   const points = [
//     { x: elementRect.left, y: elementRect.top }, // Top-left
//     { x: elementRect.left + elementRect.width, y: elementRect.top }, // Top-right
//     { x: elementRect.left, y: elementRect.top + elementRect.height }, // Bottom-left
//     {
//       x: elementRect.left + elementRect.width,
//       y: elementRect.top + elementRect.height,
//     }, // Bottom-right
//     { x: elementRect.left + elementRect.width / 2, y: elementRect.top }, // Top-center
//     {
//       x: elementRect.left + elementRect.width,
//       y: elementRect.top + elementRect.height / 2,
//     }, // Right-center
//     {
//       x: elementRect.left + elementRect.width / 2,
//       y: elementRect.top + elementRect.height,
//     }, // Bottom-center
//     { x: elementRect.left, y: elementRect.top + elementRect.height / 2 }, // Left-center
//     {
//       x: elementRect.left + elementRect.width / 2,
//       y: elementRect.top + elementRect.height / 2,
//     }, // Center
//   ];

//   return points.some((point) => {
//     const elements = document.elementsFromPoint(point.x, point.y);
//     return elements.some((el) => {
//       return (
//         el !== document.body &&
//         !el.classList.contains("tooltip") &&
//         !excludeElements.includes(el) &&
//         !el.contains(excludeElements[0])
//       );
//     });
//   });
// }

// /**
//  * Custom hook for creating accessible, auto-positioning tooltips
//  * @param {Object} config - Configuration object
//  * @param {string} config.content - Tooltip text/content
//  * @param {string} [config.tooltipPosition] - Preferred position
//  * @param {boolean} [config.withTip=true] - Show arrow tip
//  * @param {boolean} [config.disabled=false] - Disable tooltip
//  * @param {number} [config.delay=500] - Show delay (ms)
//  * @param {number} [config.gap=8] - Space between trigger and tooltip
//  * @param {boolean} [config.avoidOverlapping=false] - Avoid overlapping other elements
//  * @returns {Object} { tooltipProps, renderTooltip }
//  */

// export const useTooltip = ({
//   content,
//   toggleContent,
//   tooltipPosition,
//   withTip = true,
//   disabled = false,
//   delay = 500,
//   gap = 8,
//   avoidOverlapping = false,
//   triggerType = "hover",
// }) => {
//   const triggerRef = useRef(null);
//   const tooltipRef = useRef(null);
//   const [state, setState] = useState({
//     visible: false,
//     show: false,
//     isToggleActive: false,
//     ready: false,
//   });
//   const [style, setStyle] = useState({ opacity: 0 });
//   const [position, setPosition] = useState(tooltipPosition);

//   const currentContent = useMemo(() => {
//     if (!state.ready) return null;
//     return state.isToggleActive ? toggleContent || content : content;
//   }, [state.isToggleActive, state.ready, toggleContent, content]);

//   useEffect(() => {
//     let timeout;

//     if (state.visible) {
//       timeout = setTimeout(
//         () => {
//           setState((prev) => ({ ...prev, show: true }));
//           if (globalAnimationEnabled) globalAnimationEnabled = false;
//           resetAnimationSession();
//         },
//         globalAnimationEnabled ? delay : 0
//       );
//     } else {
//       setState((prev) => ({ ...prev, show: false, isToggleActive: false }));
//       resetAnimationSession();
//     }

//     const handleScroll = () => {
//       if (!state.isToggleActive) {
//         setState((prev) => ({ ...prev, visible: false }));
//       }
//     };

//     const handleKeyDown = (e) => {
//       if (e.key === "Escape" && state.visible) {
//         setState((prev) => ({ ...prev, visible: false }));
//       }
//     };

//     window.addEventListener("scroll", handleScroll, true);
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener("scroll", handleScroll, true);
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [state.visible, delay, state.isToggleActive]);

//   useLayoutEffect(() => {
//     if (!state.show || disabled) return;

//     const trigger = triggerRef.current;
//     const tooltip = tooltipRef.current;
//     if (!trigger || !tooltip) return;

//     const triggerRect = trigger.getBoundingClientRect();
//     const viewportHeight = window.innerHeight;
//     const viewportWidth = window.innerWidth;

//     const originalStyles = {
//       display: tooltip.style.display,
//       visibility: tooltip.style.visibility,
//       position: tooltip.style.position,
//     };

//     tooltip.style.display = "block";
//     tooltip.style.visibility = "hidden";
//     tooltip.style.position = "fixed";

//     const tooltipRect = {
//       width: tooltip.offsetWidth,
//       height: tooltip.offsetHeight,
//     };

//     Object.assign(tooltip.style, originalStyles);
//     if (tooltipRect.width <= 0 || tooltipRect.height <= 0) return;

//     const tryPosition = (pos) => {
//       const coords = getPositionCoords(pos, triggerRect, tooltipRect, gap);
//       if (!coords) return { isValid: false };

//       const inViewport = isPositionInViewport(
//         coords,
//         tooltipRect,
//         viewportWidth,
//         viewportHeight
//       );
//       const notOverlapping = avoidOverlapping
//         ? isPositionNotOverlapping(
//             coords,
//             pos,
//             tooltipRect,
//             triggerRect,
//             trigger,
//             tooltip
//           )
//         : true;

//       return { coords, pos, isValid: inViewport && notOverlapping };
//     };

//     if (tooltipPosition) {
//       const { coords, pos, isValid } = tryPosition(tooltipPosition);
//       if (isValid) {
//         setStyle({ ...coords, opacity: 1 });
//         setPosition(pos);
//         return;
//       }

//       const mirrorPos = POSITION_MIRROR[tooltipPosition];
//       if (mirrorPos) {
//         const mirror = tryPosition(mirrorPos);
//         if (mirror.isValid) {
//           setStyle({ ...mirror.coords, opacity: 1 });
//           setPosition(mirror.pos);
//           return;
//         }
//       }
//     }

//     for (const pos of POSITION_PRIORITY) {
//       const test = tryPosition(pos);
//       if (test.isValid) {
//         setStyle({ ...test.coords, opacity: 1 });
//         setPosition(test.pos);
//         return;
//       }
//     }

//     const fallbackPos = tooltipPosition || POSITION_PRIORITY[0];
//     const fallbackCoords = getPositionCoords(
//       fallbackPos,
//       triggerRect,
//       tooltipRect,
//       gap
//     ) || {
//       top: 0,
//       left: 0,
//     };
//     setStyle({
//       ...fallbackCoords,
//       top: Math.max(
//         0,
//         Math.min(fallbackCoords.top, viewportHeight - tooltipRect.height)
//       ),
//       left: Math.max(
//         0,
//         Math.min(fallbackCoords.left, viewportWidth - tooltipRect.width)
//       ),
//       opacity: 1,
//     });
//     setPosition(fallbackPos);
//   }, [disabled, gap, avoidOverlapping, tooltipPosition, state.show]);

//   useEffect(() => {
//     if (triggerType !== "click" || !state.isToggleActive) return;

//     const handleClickOutside = (e) => {
//       if (
//         !e.target.closest(".tooltip") &&
//         !e.target.closest("[data-toggle-tip]")
//       ) {
//         setState({
//           visible: false,
//           show: false,
//           isToggleActive: false,
//           ready: true,
//         });
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [state.isToggleActive, triggerType]);

//   const handleClick = () => {
//     if (disabled) return;

//     setState((prev) => ({
//       visible: !prev.visible,
//       show: false,
//       isToggleActive: true,
//       ready: true,
//     }));
//   };

//   const handleMouseEnter = () => {
//     if (disabled || state.isToggleActive) return;

//     setState({
//       visible: true,
//       show: false,
//       isToggleActive: false,
//       ready: true,
//     });
//   };

//   const handleMouseLeave = () => {
//     if (!state.isToggleActive) {
//       setState((prev) => ({ ...prev, visible: false }));
//     }
//   };

//   const getTooltipProps = () => {
//     const baseProps = {
//       ref: triggerRef,
//       "aria-label": content,
//       onMouseEnter: handleMouseEnter,
//       onMouseLeave: handleMouseLeave,
//       onFocus: handleMouseEnter,
//       onBlur: handleMouseLeave,
//     };

//     if (triggerType === "click") {
//       return {
//         ...baseProps,
//         "data-toggle-tip": state.isToggleActive,
//         "aria-expanded": state.isToggleActive,
//         onClick: handleClick,
//         onKeyDown: (e) => {
//           if (e.key === "Escape") {
//             setState({
//               visible: false,
//               show: false,
//               isToggleActive: false,
//               ready: true,
//             });
//           }
//           if (e.key === "Enter" || e.key === " ") {
//             e.preventDefault();
//             handleClick();
//           }
//         },
//       };
//     }

//     return {
//       ...baseProps,
//       onKeyDown: (e) =>
//         e.key === "Escape" && setState((prev) => ({ ...prev, visible: false })),
//     };
//   };
//   const renderTooltip = () =>
//     state.show && currentContent
//       ? createPortal(
//           <div
//             ref={tooltipRef}
//             role="tooltip"
//             aria-hidden={!state.visible}
//             className={`tooltip ${state.isToggleActive ? "toggle-tip" : ""}`}
//             style={{
//               position: "fixed",
//               pointerEvents: state.isToggleActive ? "auto" : "none",
//               zIndex: 9999,
//               background: "#37324A",
//               color: "#fff",
//               padding: "8px 12px",
//               borderRadius: "0.25rem",
//               fontSize: "0.875rem",
//               maxWidth: "28.375rem",
//               boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
//               transition: "opacity 0.2s ease",
//               ...style,
//               opacity: state.visible ? 1 : 0,
//             }}
//           >
//             <div
//               aria-live={state.isToggleActive ? "assertive" : "polite"}
//               style={{
//                 display: "-webkit-box",
//                 WebkitLineClamp: 3,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//               }}
//             >
//               {currentContent}
//             </div>

//             {withTip && (
//               <div
//                 style={{
//                   position: "absolute",
//                   width: 0,
//                   height: 0,
//                   ...(position.startsWith("TOP") && {
//                     borderLeft: "5px solid transparent",
//                     borderRight: "5px solid transparent",
//                     borderTop: "5px solid #37324A",
//                     top: "100%",
//                     ...(position.endsWith("CENTER") && {
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                     }),
//                     ...(position.endsWith("LEFT") && { left: "10px" }),
//                     ...(position.endsWith("RIGHT") && { right: "10px" }),
//                   }),
//                   ...(position.startsWith("BOTTOM") && {
//                     borderLeft: "5px solid transparent",
//                     borderRight: "5px solid transparent",
//                     borderBottom: "5px solid #37324A",
//                     bottom: "100%",
//                     ...(position.endsWith("CENTER") && {
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                     }),
//                     ...(position.endsWith("LEFT") && { left: "10px" }),
//                     ...(position.endsWith("RIGHT") && { right: "10px" }),
//                   }),
//                   ...(position === "MIDDLE_LEFT" && {
//                     borderTop: "5px solid transparent",
//                     borderBottom: "5px solid transparent",
//                     borderLeft: "5px solid #37324A",
//                     left: "100%",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                   }),
//                   ...(position === "MIDDLE_RIGHT" && {
//                     borderTop: "5px solid transparent",
//                     borderBottom: "5px solid transparent",
//                     borderRight: "5px solid #37324A",
//                     right: "100%",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                   }),
//                 }}
//               />
//             )}
//           </div>,
//           document.body
//         )
//       : null;

//   return {
//     tooltipProps: getTooltipProps(),
//     visible: state.visible,
//     setVisible: (val) => setState((prev) => ({ ...prev, visible: val })),
//     renderTooltip,
//     triggerRef,
//   };
// };




// =======================LATEST CODE=========================
// import { useRef, useLayoutEffect, useState, useEffect } from "react";
// import { createPortal } from "react-dom";

// /**
//  * Animation control system to prevent animation spamming
//  * - After an animation plays, subsequent animations will be instant for 1 second
//  * - This provides better UX when multiple tooltips appear in quick succession
//  */
// let globalAnimationEnabled = true;
// let animationTimeout = null;

// // Reset animation availability after 1 second of inactivity
// const resetAnimationSession = () => {
//   clearTimeout(animationTimeout);
//   animationTimeout = setTimeout(() => {
//     globalAnimationEnabled = true;
//   }, 1000);
// };

// /**
//  * Ordered list of preferred tooltip positions (fallback order)
//  * - The component will try these positions in order until it finds one that fits
//  */
// const POSITION_PRIORITY = [
//   "BOTTOM_CENTER", // Most preferred position (default)
//   "BOTTOM_RIGHT",
//   "BOTTOM_LEFT",
//   "TOP_RIGHT",
//   "TOP_LEFT",
//   "MIDDLE_RIGHT",
//   "MIDDLE_LEFT",
//   "MIDDLE_CENTER", // Least preferred position
// ];

// /**
//  * Mirror positions for fallback strategy
//  * - When preferred position doesn't fit, try the opposite position
//  * - Example: If TOP_CENTER doesn't work, try BOTTOM_CENTER
//  */
// const POSITION_MIRROR = {
//   BOTTOM_CENTER: "TOP_CENTER",
//   TOP_CENTER: "BOTTOM_CENTER",
//   BOTTOM_RIGHT: "TOP_RIGHT",
//   BOTTOM_LEFT: "TOP_LEFT",
//   TOP_RIGHT: "BOTTOM_RIGHT",
//   TOP_LEFT: "BOTTOM_LEFT",
//   MIDDLE_RIGHT: "MIDDLE_LEFT",
//   MIDDLE_LEFT: "MIDDLE_RIGHT",
//   MIDDLE_CENTER: "MIDDLE_CENTER",
// };

// /**
//  * Calculates tooltip coordinates based on position relative to trigger element
//  * @param {string} pos - Position identifier (e.g., "BOTTOM_CENTER")
//  * @param {DOMRect} triggerRect - Trigger element's bounding rectangle
//  * @param {Object} tooltipRect - Tooltip dimensions {width, height}
//  * @param {number} gap - Space between trigger and tooltip
//  * @returns {Object} Coordinates {top, left}
//  */
// const getPositionCoords = (pos, triggerRect, tooltipRect, gap) => {
//   switch (pos) {
//     case "BOTTOM_CENTER":
//       return {
//         top: triggerRect.bottom + gap,
//         left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
//       };
//     case "BOTTOM_RIGHT":
//       return {
//         top: triggerRect.bottom + gap,
//         left: triggerRect.right - tooltipRect.width,
//       };
//     case "BOTTOM_LEFT":
//       return {
//         top: triggerRect.bottom + gap,
//         left: triggerRect.left,
//       };
//     case "TOP_CENTER":
//       return {
//         top: triggerRect.top - tooltipRect.height - gap,
//         left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
//       };
//     case "TOP_RIGHT":
//       return {
//         top: triggerRect.top - tooltipRect.height - gap,
//         left: triggerRect.right - tooltipRect.width,
//       };
//     case "TOP_LEFT":
//       return {
//         top: triggerRect.top - tooltipRect.height - gap,
//         left: triggerRect.left,
//       };
//     case "MIDDLE_RIGHT":
//       return {
//         top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
//         left: triggerRect.right + gap,
//       };
//     case "MIDDLE_LEFT":
//       return {
//         top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
//         left: triggerRect.left - tooltipRect.width - gap,
//       };
//     case "MIDDLE_CENTER":
//       return {
//         top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
//         left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
//       };
//     default:
//       return null;
//   }
// };

// /**
//  * Checks if tooltip position is within viewport boundaries
//  * @param {Object} coords - Tooltip coordinates {top, left}
//  * @param {Object} tooltipRect - Tooltip dimensions {width, height}
//  * @param {number} viewportWidth
//  * @param {number} viewportHeight
//  * @returns {boolean}
//  */
// const isPositionInViewport = (
//   coords,
//   tooltipRect,
//   viewportWidth,
//   viewportHeight
// ) => {
//   if (!coords) return false;
//   return (
//     coords.top >= 0 &&
//     coords.left >= 0 &&
//     coords.top + tooltipRect.height <= viewportHeight &&
//     coords.left + tooltipRect.width <= viewportWidth
//   );
// };

// /**
//  * Checks if tooltip would overlap with other page elements
//  * @param {Object} coords - Tooltip coordinates
//  * @param {string} pos - Position identifier
//  * @param {Object} tooltipRect - Tooltip dimensions
//  * @param {DOMRect} triggerRect - Trigger element's bounds
//  * @param {HTMLElement} trigger - Trigger DOM element
//  * @param {HTMLElement} tooltip - Tooltip DOM element
//  * @returns {boolean}
//  */
// const isPositionNotOverlapping = (
//   coords,
//   pos,
//   tooltipRect,
//   triggerRect,
//   trigger,
//   tooltip
// ) => {
//   // Special case for center position which might cover the trigger
//   if (pos === "MIDDLE_CENTER") {
//     const triggerCenter = {
//       x: triggerRect.left + triggerRect.width / 2,
//       y: triggerRect.top + triggerRect.height / 2,
//     };
//     if (
//       coords.left <= triggerCenter.x &&
//       coords.left + tooltipRect.width >= triggerCenter.x &&
//       coords.top <= triggerCenter.y &&
//       coords.top + tooltipRect.height >= triggerCenter.y
//     ) {
//       return false;
//     }
//   }

//   const tooltipArea = {
//     top: coords.top,
//     left: coords.left,
//     width: tooltipRect.width,
//     height: tooltipRect.height,
//   };

//   return !hasOverlap(tooltipArea, [trigger, tooltip]);
// };

// /**
//  * Detects if an element overlaps with other page elements
//  * @param {Object} elementRect - Rectangle {top, left, width, height}
//  * @param {Array} excludeElements - Elements to ignore in overlap check
//  * @returns {boolean}
//  */
// function hasOverlap(elementRect, excludeElements = []) {
//   if (!elementRect || elementRect.width <= 0 || elementRect.height <= 0)
//     return false;

//   // Check multiple points within the element to detect overlaps
//   const points = [
//     { x: elementRect.left, y: elementRect.top }, // Top-left
//     { x: elementRect.left + elementRect.width, y: elementRect.top }, // Top-right
//     { x: elementRect.left, y: elementRect.top + elementRect.height }, // Bottom-left
//     {
//       x: elementRect.left + elementRect.width,
//       y: elementRect.top + elementRect.height,
//     }, // Bottom-right
//     { x: elementRect.left + elementRect.width / 2, y: elementRect.top }, // Top-center
//     {
//       x: elementRect.left + elementRect.width,
//       y: elementRect.top + elementRect.height / 2,
//     }, // Right-center
//     {
//       x: elementRect.left + elementRect.width / 2,
//       y: elementRect.top + elementRect.height,
//     }, // Bottom-center
//     { x: elementRect.left, y: elementRect.top + elementRect.height / 2 }, // Left-center
//     {
//       x: elementRect.left + elementRect.width / 2,
//       y: elementRect.top + elementRect.height / 2,
//     }, // Center
//   ];

//   return points.some((point) => {
//     const elements = document.elementsFromPoint(point.x, point.y);
//     return elements.some((el) => {
//       return (
//         el !== document.body &&
//         !el.classList.contains("tooltip") &&
//         !excludeElements.includes(el) &&
//         !el.contains(excludeElements[0])
//       );
//     });
//   });
// }

// /**
//  * Custom hook for creating accessible, auto-positioning tooltips
//  * @param {Object} config - Configuration object
//  * @param {string} config.content - Tooltip text/content
//  * @param {string} [config.tooltipPosition] - Preferred position
//  * @param {boolean} [config.withTip=true] - Show arrow tip
//  * @param {boolean} [config.disabled=false] - Disable tooltip
//  * @param {number} [config.delay=500] - Show delay (ms)
//  * @param {number} [config.gap=8] - Space between trigger and tooltip
//  * @param {boolean} [config.avoidOverlapping=false] - Avoid overlapping other elements
//  * @returns {Object} { tooltipProps, renderTooltip }
//  */
// export const useTooltip = ({
//   content, // Always shown on hover
//   toggletipContent, // Shown when toggle tip is active (only for triggerType="click")
//   tooltipPosition,
//   withTip = true,
//   disabled = false,
//   delay = 500,
//   gap = 8,
//   avoidOverlapping = false,
//   triggerType = "hover",
// }) => {
//   const triggerRef = useRef(null);
//   const tooltipRef = useRef(null);
//   const [visible, setVisible] = useState(false);
//   const [show, setShow] = useState(false);
//   const [style, setStyle] = useState({ opacity: 0 });
//   const [position, setPosition] = useState("BOTTOM_CENTER");
//   const [isToggleTipActive, setIsToggleTipActive] = useState(false);

//   // Determine which content to show
//   const currentContent = isToggleTipActive
//     ? toggletipContent || content
//     : content;

//   useEffect(() => {
//     console.log("Tooltip content: ", currentContent);
//   }, [currentContent]);

//   // Handle show/hide with delay and cleanup
//   useEffect(() => {
//     let timeout;

//     if (visible) {
//       timeout = setTimeout(
//         () => {
//           setShow(true);
//           if (globalAnimationEnabled) globalAnimationEnabled = false;
//           resetAnimationSession();
//         },
//         globalAnimationEnabled ? delay : 0
//       );
//     } else {
//       setShow(false);
//       if (!visible) {
//         setIsToggleTipActive(false);
//       }
//       resetAnimationSession();
//     }

//     const handleScroll = () => {
//       setVisible(false);
//     };

//     const handleKeyDown = (e) => {
//       if (e.key === "Escape" && visible) {
//         setVisible(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll, true);
//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener("scroll", handleScroll, true);
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [visible, delay]);

//   // Calculate and set tooltip position whenever shown
//   useLayoutEffect(() => {
//     if (!show || disabled) return;

//     const trigger = triggerRef.current;
//     const tooltip = tooltipRef.current;
//     if (!trigger || !tooltip) return;

//     const triggerRect = trigger.getBoundingClientRect();
//     if (!triggerRect || triggerRect.width === 0 || triggerRect.height === 0)
//       return;

//     const viewportHeight = window.innerHeight;
//     const viewportWidth = window.innerWidth;

//     // Temporarily show tooltip to measure its dimensions
//     const originalStyles = {
//       display: tooltip.style.display,
//       visibility: tooltip.style.visibility,
//       position: tooltip.style.position,
//     };
//     tooltip.style.display = "block";
//     tooltip.style.visibility = "hidden";
//     tooltip.style.position = "fixed";

//     const tooltipRect = {
//       width: tooltip.offsetWidth,
//       height: tooltip.offsetHeight,
//     };

//     // Restore original styles
//     Object.assign(tooltip.style, originalStyles);
//     if (tooltipRect.width <= 0 || tooltipRect.height <= 0) return;

//     /**
//      * Tests if a position is valid (in viewport and optionally not overlapping)
//      * @param {string} pos - Position to test
//      * @returns {Object} { coords, pos, isValid }
//      */
//     const tryPosition = (pos) => {
//       const coords = getPositionCoords(pos, triggerRect, tooltipRect, gap);
//       if (!coords) return { isValid: false };

//       const inViewport = isPositionInViewport(
//         coords,
//         tooltipRect,
//         viewportWidth,
//         viewportHeight
//       );
//       const notOverlapping = avoidOverlapping
//         ? isPositionNotOverlapping(
//             coords,
//             pos,
//             tooltipRect,
//             triggerRect,
//             trigger,
//             tooltip
//           )
//         : true;

//       return { coords, pos, isValid: inViewport && notOverlapping };
//     };

//     // Position selection strategy:
//     // 1. First try user-specified position
//     if (tooltipPosition) {
//       const { coords, pos, isValid } = tryPosition(tooltipPosition);
//       if (isValid) {
//         setStyle({ ...coords, opacity: 1 });
//         setPosition(pos);
//         return;
//       }

//       // 2. Then try mirror position
//       const mirrorPos = POSITION_MIRROR[tooltipPosition];
//       if (mirrorPos) {
//         const {
//           coords: mirrorCoords,
//           pos: mirrorPosFinal,
//           isValid: mirrorValid,
//         } = tryPosition(mirrorPos);
//         if (mirrorValid) {
//           setStyle({ ...mirrorCoords, opacity: 1 });
//           setPosition(mirrorPosFinal);
//           return;
//         }
//       }
//     }

//     // 3. Try all positions in priority order
//     for (const pos of POSITION_PRIORITY) {
//       const { coords, pos: validPos, isValid } = tryPosition(pos);
//       if (isValid) {
//         setStyle({ ...coords, opacity: 1 });
//         setPosition(validPos);
//         return;
//       }
//     }

//     // 4. Fallback: Find first position that fits in viewport (when avioid overlapping fails)
//     const positionsToTry = tooltipPosition
//       ? [tooltipPosition, ...POSITION_PRIORITY]
//       : POSITION_PRIORITY;

//     for (const pos of positionsToTry) {
//       const coords = getPositionCoords(pos, triggerRect, tooltipRect, gap);
//       if (
//         coords &&
//         isPositionInViewport(coords, tooltipRect, viewportWidth, viewportHeight)
//       ) {
//         setStyle({ ...coords, opacity: 1 });
//         setPosition(pos);
//         return;
//       }
//     }

//     // 5. Ultimate fallback: Clamp first position to viewport edges
//     const fallbackPos = positionsToTry[0];
//     const fallbackCoords = getPositionCoords(
//       fallbackPos,
//       triggerRect,
//       tooltipRect,
//       gap
//     ) || { top: 0, left: 0 };
//     setStyle({
//       ...fallbackCoords,
//       top: Math.max(
//         0,
//         Math.min(fallbackCoords.top, viewportHeight - tooltipRect.height)
//       ),
//       left: Math.max(
//         0,
//         Math.min(fallbackCoords.left, viewportWidth - tooltipRect.width)
//       ),
//       opacity: 1,
//     });
//     setPosition(fallbackPos);
//   }, [show, disabled, gap, avoidOverlapping, tooltipPosition]);

//   useEffect(() => {
//     if (triggerType !== "click" || !isToggleTipActive) return;

//     const handleClickOutside = (e) => {
//       if (
//         !e.target.closest(".tooltip") &&
//         !e.target.closest("[data-toggle-tip='true']")
//       ) {
//         setVisible(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [isToggleTipActive, triggerType]);

//   const handleClick = () => {
//     if (disabled) return;

//     if (triggerType === "click") {
//       setIsToggleTipActive(true);
//       setVisible(true);
//     }
//   };

//   const handleMouseEnter = () => {
//     if (disabled || isToggleTipActive) return;
//     setVisible(true);
//   };

//   const handleMouseLeave = () => {
//     if (isToggleTipActive) return;
//     setVisible(false);
//   };

//   const getTooltipProps = () => {
//     const baseProps = {
//       ref: triggerRef,
//       "aria-label": content,
//       onMouseEnter: handleMouseEnter,
//       onMouseLeave: handleMouseLeave,
//       onFocus: handleMouseEnter,
//       onBlur: handleMouseLeave,
//     };

//     if (triggerType === "click") {
//       return {
//         ...baseProps,
//         "data-toggle-tip": isToggleTipActive,
//         "aria-expanded": isToggleTipActive,
//         onClick: handleClick,
//         onKeyDown: (e) => {
//           if (e.key === "Escape" && visible) {
//             setVisible(false);
//             setIsToggleTipActive(false);
//           }
//           if (e.key === "Enter" || e.key === " ") {
//             e.preventDefault();
//             handleClick();
//           }
//         },
//       };
//     }

//     return {
//       ...baseProps,
//       onClick: () => setVisible(false),
//       onKeyDown: (e) => e.key === "Escape" && setVisible(false),
//     };
//   };

//   const renderTooltip = () =>
//     show && currentContent
//       ? createPortal(
//           <div
//             ref={tooltipRef}
//             role="tooltip"
//             aria-hidden={!visible}
//             className={`tooltip ${isToggleTipActive ? "toggle-tip" : ""}`}
//             style={{
//               position: "fixed",
//               pointerEvents: isToggleTipActive ? "auto" : "none",
//               zIndex: 9999,
//               background: "#37324A",
//               color: "#fff",
//               padding: "8px 12px",
//               borderRadius: "0.25rem",
//               fontSize: "0.875rem",
//               minWidth: "2rem",
//               maxWidth: "28.375rem",
//               boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
//               transform: globalAnimationEnabled ? "scale(0.95)" : "scale(1)",
//               transition: globalAnimationEnabled
//                 ? "opacity 0.2s ease, transform 0.2s ease"
//                 : "opacity 0.1s ease",
//               ...style,
//               opacity: visible ? 1 : 0,
//             }}
//           >
//             <div
//               aria-live={isToggleTipActive ? "assertive" : "polite"}
//               style={{
//                 display: "-webkit-box",
//                 WebkitLineClamp: 3,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "normal",
//               }}
//             >
//               {currentContent}
//             </div>

//             {withTip && (
//               <div
//                 style={{
//                   position: "absolute",
//                   width: 0,
//                   height: 0,
//                   ...(position.startsWith("TOP") && {
//                     borderLeft: "5px solid transparent",
//                     borderRight: "5px solid transparent",
//                     borderTop: "5px solid #37324A",
//                     top: "100%",
//                     ...(position.endsWith("CENTER") && {
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                     }),
//                     ...(position.endsWith("LEFT") && { left: "10px" }),
//                     ...(position.endsWith("RIGHT") && { right: "10px" }),
//                   }),
//                   ...(position.startsWith("BOTTOM") && {
//                     borderLeft: "5px solid transparent",
//                     borderRight: "5px solid transparent",
//                     borderBottom: "5px solid #37324A",
//                     bottom: "100%",
//                     ...(position.endsWith("CENTER") && {
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                     }),
//                     ...(position.endsWith("LEFT") && { left: "10px" }),
//                     ...(position.endsWith("RIGHT") && { right: "10px" }),
//                   }),
//                   ...(position === "MIDDLE_LEFT" && {
//                     borderTop: "5px solid transparent",
//                     borderBottom: "5px solid transparent",
//                     borderLeft: "5px solid #37324A",
//                     left: "100%",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                   }),
//                   ...(position === "MIDDLE_RIGHT" && {
//                     borderTop: "5px solid transparent",
//                     borderBottom: "5px solid transparent",
//                     borderRight: "5px solid #37324A",
//                     right: "100%",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                   }),
//                 }}
//               />
//             )}
//           </div>,
//           document.body
//         )
//       : null;

//   return {
//     tooltipProps: getTooltipProps(),
//     visible,
//     setVisible,
//     renderTooltip,
//   };
// };

// =============================ZIP CODE==========================================

// import { useRef, useLayoutEffect, useState, useEffect } from "react";
// import { createPortal } from "react-dom";

// /**
//  * Animation control system to prevent animation spamming
//  * - After an animation plays, subsequent animations will be instant for 1 second
//  * - This provides better UX when multiple tooltips appear in quick succession
//  */
// let globalAnimationEnabled = true;
// let animationTimeout = null;

// // Reset animation availability after 1 second of inactivity
// const resetAnimationSession = () => {
//   clearTimeout(animationTimeout);
//   animationTimeout = setTimeout(() => {
//     globalAnimationEnabled = true;
//   }, 1000);
// };

// /**
//  * Ordered list of preferred tooltip positions (fallback order)
//  * - The component will try these positions in order until it finds one that fits
//  */
// const POSITION_PRIORITY = [
//   "BOTTOM_CENTER", // Most preferred position (default)
//   "BOTTOM_RIGHT",
//   "BOTTOM_LEFT",
//   "TOP_CENTER",
//   "TOP_RIGHT",
//   "TOP_LEFT",
//   "MIDDLE_RIGHT",
//   "MIDDLE_LEFT",
//   "MIDDLE_CENTER", // Least preferred position
// ];

// /**
//  * Mirror positions for fallback strategy
//  * - When preferred position doesn't fit, try the opposite position
//  * - Example: If TOP_CENTER doesn't work, try BOTTOM_CENTER
//  */
// const POSITION_MIRROR = {
//   BOTTOM_CENTER: "TOP_CENTER",
//   TOP_CENTER: "BOTTOM_CENTER",
//   BOTTOM_RIGHT: "TOP_RIGHT",
//   BOTTOM_LEFT: "TOP_LEFT",
//   TOP_RIGHT: "BOTTOM_RIGHT",
//   TOP_LEFT: "BOTTOM_LEFT",
//   MIDDLE_RIGHT: "MIDDLE_LEFT",
//   MIDDLE_LEFT: "MIDDLE_RIGHT",
//   MIDDLE_CENTER: "MIDDLE_CENTER",
// };

// /**
//  * Calculates tooltip coordinates based on position relative to trigger element
//  * @param {string} pos - Position identifier (e.g., "BOTTOM_CENTER")
//  * @param {DOMRect} triggerRect - Trigger element's bounding rectangle
//  * @param {Object} tooltipRect - Tooltip dimensions {width, height}
//  * @param {number} gap - Space between trigger and tooltip
//  * @returns {Object} Coordinates {top, left}
//  */
// const getPositionCoords = (pos, triggerRect, tooltipRect, gap) => {
//   switch (pos) {
//     case "BOTTOM_CENTER":
//       return {
//         top: triggerRect.bottom + gap,
//         left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
//       };
//     case "BOTTOM_RIGHT":
//       return {
//         top: triggerRect.bottom + gap,
//         left: triggerRect.right - tooltipRect.width,
//       };
//     case "BOTTOM_LEFT":
//       return {
//         top: triggerRect.bottom + gap,
//         left: triggerRect.left,
//       };
//     case "TOP_CENTER":
//       return {
//         top: triggerRect.top - tooltipRect.height - gap,
//         left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
//       };
//     case "TOP_RIGHT":
//       return {
//         top: triggerRect.top - tooltipRect.height - gap,
//         left: triggerRect.right - tooltipRect.width,
//       };
//     case "TOP_LEFT":
//       return {
//         top: triggerRect.top - tooltipRect.height - gap,
//         left: triggerRect.left,
//       };
//     case "MIDDLE_RIGHT":
//       return {
//         top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
//         left: triggerRect.right + gap,
//       };
//     case "MIDDLE_LEFT":
//       return {
//         top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
//         left: triggerRect.left - tooltipRect.width - gap,
//       };
//     case "MIDDLE_CENTER":
//       return {
//         top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
//         left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
//       };
//     default:
//       return null;
//   }
// };

// /**
//  * Checks if tooltip position is within viewport boundaries
//  * @param {Object} coords - Tooltip coordinates {top, left}
//  * @param {Object} tooltipRect - Tooltip dimensions {width, height}
//  * @param {number} viewportWidth
//  * @param {number} viewportHeight
//  * @returns {boolean}
//  */
// const isPositionInViewport = (
//   coords,
//   tooltipRect,
//   viewportWidth,
//   viewportHeight
// ) => {
//   if (!coords) return false;
//   return (
//     coords.top >= 0 &&
//     coords.left >= 0 &&
//     coords.top + tooltipRect.height <= viewportHeight &&
//     coords.left + tooltipRect.width <= viewportWidth
//   );
// };

// /**
//  * Checks if tooltip would overlap with other page elements
//  * @param {Object} coords - Tooltip coordinates
//  * @param {string} pos - Position identifier
//  * @param {Object} tooltipRect - Tooltip dimensions
//  * @param {DOMRect} triggerRect - Trigger element's bounds
//  * @param {HTMLElement} trigger - Trigger DOM element
//  * @param {HTMLElement} tooltip - Tooltip DOM element
//  * @returns {boolean}
//  */
// const isPositionNotOverlapping = (
//   coords,
//   pos,
//   tooltipRect,
//   triggerRect,
//   trigger,
//   tooltip
// ) => {
//   // Special case for center position which might cover the trigger
//   if (pos === "MIDDLE_CENTER") {
//     const triggerCenter = {
//       x: triggerRect.left + triggerRect.width / 2,
//       y: triggerRect.top + triggerRect.height / 2,
//     };
//     if (
//       coords.left <= triggerCenter.x &&
//       coords.left + tooltipRect.width >= triggerCenter.x &&
//       coords.top <= triggerCenter.y &&
//       coords.top + tooltipRect.height >= triggerCenter.y
//     ) {
//       return false;
//     }
//   }

//   const tooltipArea = {
//     top: coords.top,
//     left: coords.left,
//     width: tooltipRect.width,
//     height: tooltipRect.height,
//   };

//   return !hasOverlap(tooltipArea, [trigger, tooltip]);
// };

// /**
//  * Detects if an element overlaps with other page elements
//  * @param {Object} elementRect - Rectangle {top, left, width, height}
//  * @param {Array} excludeElements - Elements to ignore in overlap check
//  * @returns {boolean}
//  */
// function hasOverlap(elementRect, excludeElements = []) {
//   if (!elementRect || elementRect.width <= 0 || elementRect.height <= 0)
//     return false;

//   // Check multiple points within the element to detect overlaps
//   const points = [
//     { x: elementRect.left, y: elementRect.top }, // Top-left
//     { x: elementRect.left + elementRect.width, y: elementRect.top }, // Top-right
//     { x: elementRect.left, y: elementRect.top + elementRect.height }, // Bottom-left
//     {
//       x: elementRect.left + elementRect.width,
//       y: elementRect.top + elementRect.height,
//     }, // Bottom-right
//     { x: elementRect.left + elementRect.width / 2, y: elementRect.top }, // Top-center
//     {
//       x: elementRect.left + elementRect.width,
//       y: elementRect.top + elementRect.height / 2,
//     }, // Right-center
//     {
//       x: elementRect.left + elementRect.width / 2,
//       y: elementRect.top + elementRect.height,
//     }, // Bottom-center
//     { x: elementRect.left, y: elementRect.top + elementRect.height / 2 }, // Left-center
//     {
//       x: elementRect.left + elementRect.width / 2,
//       y: elementRect.top + elementRect.height / 2,
//     }, // Center
//   ];

//   return points.some((point) => {
//     const elements = document.elementsFromPoint(point.x, point.y);
//     return elements.some((el) => {
//       return (
//         el !== document.body &&
//         !el.classList.contains("tooltip") &&
//         !excludeElements.includes(el) &&
//         !el.contains(excludeElements[0])
//       );
//     });
//   });
// }

// /**
//  * Custom hook for creating accessible, auto-positioning tooltips
//  * @param {Object} config - Configuration object
//  * @param {string} config.content - Tooltip text/content
//  * @param {string} [config.tooltipPosition] - Preferred position
//  * @param {boolean} [config.withTip=true] - Show arrow tip
//  * @param {boolean} [config.disabled=false] - Disable tooltip
//  * @param {number} [config.delay=500] - Show delay (ms)
//  * @param {number} [config.gap=8] - Space between trigger and tooltip
//  * @param {boolean} [config.avoidOverlapping=false] - Avoid overlapping other elements
//  * @returns {Object} { tooltipProps, renderTooltip }
//  */
// export const useTooltip = ({
//   content,
//   tooltipPosition,
//   withTip = true,
//   disabled = false,
//   delay = 500,
//   gap = 8,
//   avoidOverlapping = false,
// }) => {
//   const triggerRef = useRef(null);
//   const tooltipRef = useRef(null);
//   const [visible, setVisible] = useState(false); // Controls visibility state
//   const [show, setShow] = useState(false); // Controls render state (with delay)
//   const [style, setStyle] = useState({ opacity: 0 }); // Tooltip positioning styles
//   const [position, setPosition] = useState("BOTTOM_CENTER"); // Current position

//   useEffect(() => {
//     console.log(content);
//   }, [content]);

//   // Handle show/hide with delay and cleanup
//   useEffect(() => {
//     let timeout;

//     if (visible) {
//       timeout = setTimeout(
//         () => {
//           setShow(true);
//           if (globalAnimationEnabled) globalAnimationEnabled = false;
//           resetAnimationSession();
//         },
//         globalAnimationEnabled ? delay : 0 // Skip delay if animations are disabled
//       );
//     } else {
//       setShow(false);
//       resetAnimationSession();
//     }

//     // Hide tooltip on scroll or Escape key
//     const handleScroll = () => setVisible(false);
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") setVisible(false);
//     };

//     if (visible) {
//       window.addEventListener("scroll", handleScroll, true);
//       window.addEventListener("keydown", handleKeyDown);
//     }

//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener("scroll", handleScroll, true);
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [visible, delay]);

//   // Calculate and set tooltip position whenever shown
//   useLayoutEffect(() => {
//     if (!show || disabled) return;

//     const trigger = triggerRef.current;
//     const tooltip = tooltipRef.current;
//     if (!trigger || !tooltip) return;

//     const triggerRect = trigger.getBoundingClientRect();
//     if (!triggerRect || triggerRect.width === 0 || triggerRect.height === 0)
//       return;

//     const viewportHeight = window.innerHeight;
//     const viewportWidth = window.innerWidth;

//     // Temporarily show tooltip to measure its dimensions
//     const originalStyles = {
//       display: tooltip.style.display,
//       visibility: tooltip.style.visibility,
//       position: tooltip.style.position,
//     };
//     tooltip.style.display = "block";
//     tooltip.style.visibility = "hidden";
//     tooltip.style.position = "fixed";

//     const tooltipRect = {
//       width: tooltip.offsetWidth,
//       height: tooltip.offsetHeight,
//     };

//     // Restore original styles
//     Object.assign(tooltip.style, originalStyles);
//     if (tooltipRect.width <= 0 || tooltipRect.height <= 0) return;

//     /**
//      * Tests if a position is valid (in viewport and optionally not overlapping)
//      * @param {string} pos - Position to test
//      * @returns {Object} { coords, pos, isValid }
//      */
//     const tryPosition = (pos) => {
//       const coords = getPositionCoords(pos, triggerRect, tooltipRect, gap);
//       if (!coords) return { isValid: false };

//       const inViewport = isPositionInViewport(
//         coords,
//         tooltipRect,
//         viewportWidth,
//         viewportHeight
//       );
//       const notOverlapping = avoidOverlapping
//         ? isPositionNotOverlapping(
//             coords,
//             pos,
//             tooltipRect,
//             triggerRect,
//             trigger,
//             tooltip
//           )
//         : true;

//       return { coords, pos, isValid: inViewport && notOverlapping };
//     };

//     // Position selection strategy:
//     // 1. First try user-specified position
//     if (tooltipPosition) {
//       const { coords, pos, isValid } = tryPosition(tooltipPosition);
//       if (isValid) {
//         setStyle({ ...coords, opacity: 1 });
//         setPosition(pos);
//         return;
//       }

//       // 2. Then try mirror position
//       const mirrorPos = POSITION_MIRROR[tooltipPosition];
//       if (mirrorPos) {
//         const {
//           coords: mirrorCoords,
//           pos: mirrorPosFinal,
//           isValid: mirrorValid,
//         } = tryPosition(mirrorPos);
//         if (mirrorValid) {
//           setStyle({ ...mirrorCoords, opacity: 1 });
//           setPosition(mirrorPosFinal);
//           return;
//         }
//       }
//     }

//     // 3. Try all positions in priority order
//     for (const pos of POSITION_PRIORITY) {
//       const { coords, pos: validPos, isValid } = tryPosition(pos);
//       if (isValid) {
//         setStyle({ ...coords, opacity: 1 });
//         setPosition(validPos);
//         return;
//       }
//     }

//     // 4. Fallback: Find first position that fits in viewport (when avioid overlapping fails)
//     const positionsToTry = tooltipPosition
//       ? [tooltipPosition, ...POSITION_PRIORITY]
//       : POSITION_PRIORITY;

//     for (const pos of positionsToTry) {
//       const coords = getPositionCoords(pos, triggerRect, tooltipRect, gap);
//       if (
//         coords &&
//         isPositionInViewport(coords, tooltipRect, viewportWidth, viewportHeight)
//       ) {
//         setStyle({ ...coords, opacity: 1 });
//         setPosition(pos);
//         return;
//       }
//     }

//     // 5. Ultimate fallback: Clamp first position to viewport edges
//     const fallbackPos = positionsToTry[0];
//     const fallbackCoords = getPositionCoords(
//       fallbackPos,
//       triggerRect,
//       tooltipRect,
//       gap
//     ) || { top: 0, left: 0 };
//     setStyle({
//       ...fallbackCoords,
//       top: Math.max(
//         0,
//         Math.min(fallbackCoords.top, viewportHeight - tooltipRect.height)
//       ),
//       left: Math.max(
//         0,
//         Math.min(fallbackCoords.left, viewportWidth - tooltipRect.width)
//       ),
//       opacity: 1,
//     });
//     setPosition(fallbackPos);
//   }, [show, disabled, gap, avoidOverlapping, tooltipPosition]);

//   // Props to spread on the trigger element
//   const tooltipProps = {
//     ref: triggerRef,
//     "aria-label": content,
//     onMouseEnter: () => !disabled && setVisible(true),
//     onMouseLeave: () => setVisible(false),
//     onFocus: () => !disabled && setVisible(true),
//     onBlur: () => setVisible(false),
//     onKeyDown: (e) => {
//       if (e.key === "Escape") setVisible(false);
//     },
//   };

//   // Function to render the tooltip portal
//   const renderTooltip = () =>
//     show && content
//       ? createPortal(
//           <div
//             ref={tooltipRef}
//             role="tooltip"
//             aria-hidden={!visible}
//             className="tooltip"
//             style={{
//               position: "fixed",
//               pointerEvents: "none",
//               zIndex: 9999,
//               background: "#37324A",
//               color: "#fff",
//               padding: "8px 12px",
//               borderRadius: "0.25rem",
//               fontSize: "0.875rem",
//               minWidth: "2rem",
//               maxWidth: "28.375rem",
//               boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
//               transform: globalAnimationEnabled ? "scale(0.95)" : "scale(1)",
//               transition: globalAnimationEnabled
//                 ? "opacity 0.2s ease, transform 0.2s ease"
//                 : "opacity 0.1s ease",
//               ...style,
//               opacity: visible ? 1 : 0,
//             }}
//           >
//             {/* Tooltip content with ellipsis for multi-line text */}
//             <div
//               aria-live="polite"
//               style={{
//                 display: "-webkit-box",
//                 WebkitLineClamp: 3,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "normal",
//               }}
//             >
//               {content}
//             </div>

//             {/* Optional arrow/tip based on position */}
//             {withTip && (
//               <div
//                 style={{
//                   position: "absolute",
//                   width: 0,
//                   height: 0,
//                   ...(position.startsWith("TOP") && {
//                     borderLeft: "5px solid transparent",
//                     borderRight: "5px solid transparent",
//                     borderTop: "5px solid #37324A",
//                     top: "100%",
//                     ...(position.endsWith("CENTER") && {
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                     }),
//                     ...(position.endsWith("LEFT") && { left: "10px" }),
//                     ...(position.endsWith("RIGHT") && { right: "10px" }),
//                   }),
//                   ...(position.startsWith("BOTTOM") && {
//                     borderLeft: "5px solid transparent",
//                     borderRight: "5px solid transparent",
//                     borderBottom: "5px solid #37324A",
//                     bottom: "100%",
//                     ...(position.endsWith("CENTER") && {
//                       left: "50%",
//                       transform: "translateX(-50%)",
//                     }),
//                     ...(position.endsWith("LEFT") && { left: "10px" }),
//                     ...(position.endsWith("RIGHT") && { right: "10px" }),
//                   }),
//                   ...(position === "MIDDLE_LEFT" && {
//                     borderTop: "5px solid transparent",
//                     borderBottom: "5px solid transparent",
//                     borderLeft: "5px solid #37324A",
//                     left: "100%",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                   }),
//                   ...(position === "MIDDLE_RIGHT" && {
//                     borderTop: "5px solid transparent",
//                     borderBottom: "5px solid transparent",
//                     borderRight: "5px solid #37324A",
//                     right: "100%",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                   }),
//                   ...(position === "MIDDLE_CENTER" && {
//                     borderLeft: "5px solid transparent",
//                     borderRight: "5px solid transparent",
//                     borderTop: "5px solid #37324A",
//                     top: "100%",
//                     left: "50%",
//                     transform: "translateX(-50%)",
//                   }),
//                 }}
//               />
//             )}
//           </div>,
//           document.body
//         )
//       : null;

//   return {
//     tooltipProps,
//     renderTooltip,
//     visible,
//     setVisible,
//     triggerRef,
//     tooltipRef,
//     style,
//     position,
//   };
// };
