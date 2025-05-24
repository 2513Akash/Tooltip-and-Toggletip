import { useRef, useLayoutEffect, useState, useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Animation control system to prevent animation spamming
 * - After an animation plays, subsequent animations will be instant for 1 second
 * - This provides better UX when multiple tooltips appear in quick succession
 */
let globalAnimationEnabled = true;
let animationTimeout = null;

// Reset animation availability after 1 second of inactivity
const resetAnimationSession = () => {
  clearTimeout(animationTimeout);
  animationTimeout = setTimeout(() => {
    globalAnimationEnabled = true;
  }, 1000);
};

/**
 * Ordered list of preferred tooltip positions (fallback order)
 * - The component will try these positions in order until it finds one that fits
 */
const POSITION_PRIORITY = [
  "bottom-center", // Most preferred position (default)
  "bottom-right",
  "bottom-left",
  "top-center",
  "top-right",
  "top-left",
  "center-right",
  "center-left",
  "center", // Least preferred position
];

/**
 * Mirror positions for fallback strategy
 */
const POSITION_MIRROR = {
  "bottom-center": "top-center",
  "top-center": "bottom-center",
  "bottom-right": "top-right",
  "bottom-left": "top-left",
  "top-right": "bottom-right",
  "top-left": "bottom-left",
  "center-right": "center-left",
  "center-left": "center-right",
  center: "center",
};

/**
 * Calculates tooltip coordinates based on position relative to trigger element
 */
const getPositionCoords = (pos, triggerRect, tooltipRect, gap) => {
  switch (pos) {
    case "bottom-center":
      return {
        top: triggerRect.bottom + gap,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case "bottom-right":
      return {
        top: triggerRect.bottom + gap,
        left: triggerRect.right - tooltipRect.width,
      };
    case "bottom-left":
      return {
        top: triggerRect.bottom + gap,
        left: triggerRect.left,
      };
    case "top-center":
      return {
        top: triggerRect.top - tooltipRect.height - gap,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    case "top-right":
      return {
        top: triggerRect.top - tooltipRect.height - gap,
        left: triggerRect.right - tooltipRect.width,
      };
    case "top-left":
      return {
        top: triggerRect.top - tooltipRect.height - gap,
        left: triggerRect.left,
      };
    case "center-right":
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.right + gap,
      };
    case "center-left":
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left - tooltipRect.width - gap,
      };
    case "center":
      return {
        top: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
        left: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
      };
    default:
      return null;
  }
};

/**
 * Checks if tooltip position is within viewport boundaries
 * @param {Object} coords - Tooltip coordinates {top, left}
 * @param {Object} tooltipRect - Tooltip dimensions {width, height}
 * @param {number} viewportWidth
 * @param {number} viewportHeight
 * @returns {boolean}
 */
const isPositionInViewport = (
  coords,
  tooltipRect,
  viewportWidth,
  viewportHeight
) => {
  if (!coords) return false;
  return (
    coords.top >= 0 &&
    coords.left >= 0 &&
    coords.top + tooltipRect.height <= viewportHeight &&
    coords.left + tooltipRect.width <= viewportWidth
  );
};

/**
 * Checks if tooltip would overlap with other page elements
 * @param {Object} coords - Tooltip coordinates
 * @param {string} pos - Position identifier
 * @param {Object} tooltipRect - Tooltip dimensions
 * @param {DOMRect} triggerRect - Trigger element's bounds
 * @param {HTMLElement} trigger - Trigger DOM element
 * @param {HTMLElement} tooltip - Tooltip DOM element
 * @returns {boolean}
 */
const isPositionNotOverlapping = (
  coords,
  pos,
  tooltipRect,
  triggerRect,
  trigger,
  tooltip
) => {
  // Special case for center position which might cover the trigger
  if (pos === "MIDDLE_CENTER") {
    const triggerCenter = {
      x: triggerRect.left + triggerRect.width / 2,
      y: triggerRect.top + triggerRect.height / 2,
    };
    if (
      coords.left <= triggerCenter.x &&
      coords.left + tooltipRect.width >= triggerCenter.x &&
      coords.top <= triggerCenter.y &&
      coords.top + tooltipRect.height >= triggerCenter.y
    ) {
      return false;
    }
  }

  const tooltipArea = {
    top: coords.top,
    left: coords.left,
    width: tooltipRect.width,
    height: tooltipRect.height,
  };

  return !hasOverlap(tooltipArea, [trigger, tooltip]);
};

/**
 * Detects if an element overlaps with other page elements
 * @param {Object} elementRect - Rectangle {top, left, width, height}
 * @param {Array} excludeElements - Elements to ignore in overlap check
 * @returns {boolean}
 */
function hasOverlap(elementRect, excludeElements = []) {
  if (!elementRect || elementRect.width <= 0 || elementRect.height <= 0)
    return false;

  // Check multiple points within the element to detect overlaps
  const points = [
    { x: elementRect.left, y: elementRect.top }, // Top-left
    { x: elementRect.left + elementRect.width, y: elementRect.top }, // Top-right
    { x: elementRect.left, y: elementRect.top + elementRect.height }, // Bottom-left
    {
      x: elementRect.left + elementRect.width,
      y: elementRect.top + elementRect.height,
    }, // Bottom-right
    { x: elementRect.left + elementRect.width / 2, y: elementRect.top }, // Top-center
    {
      x: elementRect.left + elementRect.width,
      y: elementRect.top + elementRect.height / 2,
    }, // Right-center
    {
      x: elementRect.left + elementRect.width / 2,
      y: elementRect.top + elementRect.height,
    }, // Bottom-center
    { x: elementRect.left, y: elementRect.top + elementRect.height / 2 }, // Left-center
    {
      x: elementRect.left + elementRect.width / 2,
      y: elementRect.top + elementRect.height / 2,
    }, // Center
  ];

  return points.some((point) => {
    const elements = document.elementsFromPoint(point.x, point.y);
    return elements.some((el) => {
      return (
        el !== document.body &&
        !el.classList.contains("tooltip") &&
        !excludeElements.includes(el) &&
        !el.contains(excludeElements[0])
      );
    });
  });
}

/**
 * Custom hook for creating accessible, auto-positioning tooltips
 * @param {Object} config - Configuration object
 * @param {string} config.content - Tooltip text/content
 * @param {string} [config.tooltipPosition] - Preferred position
 * @param {boolean} [config.withTip=true] - Show arrow tip
 * @param {boolean} [config.disabled=false] - Disable tooltip
 * @param {number} [config.delay=500] - Show delay (ms)
 * @param {number} [config.gap=8] - Space between trigger and tooltip
 * @param {boolean} [config.avoidOverlapping=false] - Avoid overlapping other elements
 * @returns {Object} { tooltipProps, renderTooltip }
 */
export const useTooltip = ({
  content, // Always shown on hover
  // toggletipContent,
  tooltipPosition,
  withTip = true,
  disabled = false,
  delay = 500,
  gap = 8,
  avoidOverlapping = false,
  triggerType = "hover",
}) => {
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [style, setStyle] = useState({ opacity: 0 });
  const [position, setPosition] = useState("BOTTOM_CENTER");
  const [isToggleTipActive, setIsToggleTipActive] = useState(false);

  // const currentContent = isToggleTipActive ? toggletipContent : content;

  useEffect(() => {
    console.log("Tooltip content: ", typeof content);
  }, [content]);

  // Handle show/hide with delay and cleanup
  useEffect(() => {
    let timeout;

    if (visible) {
      timeout = setTimeout(
        () => {
          setShow(true);
          if (globalAnimationEnabled) globalAnimationEnabled = false;
          resetAnimationSession();
        },
        globalAnimationEnabled ? delay : 0
      );
    } else {
      setShow(false);
      if (!visible) {
        setIsToggleTipActive(false);
      }
      resetAnimationSession();
    }

    const handleScroll = () => {
      setVisible(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && visible) {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, delay]);

  // Calculate and set tooltip position whenever shown
  useLayoutEffect(() => {
    if (!show || disabled) return;

    const trigger = triggerRef.current;
    const tooltip = tooltipRef.current;
    if (!trigger || !tooltip) return;

    const triggerRect = trigger.getBoundingClientRect();
    if (!triggerRect || triggerRect.width === 0 || triggerRect.height === 0)
      return;

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Temporarily show tooltip to measure its dimensions
    const originalStyles = {
      display: tooltip.style.display,
      visibility: tooltip.style.visibility,
      position: tooltip.style.position,
    };
    tooltip.style.display = "block";
    tooltip.style.visibility = "hidden";
    tooltip.style.position = "fixed";

    const tooltipRect = {
      width: tooltip.offsetWidth,
      height: tooltip.offsetHeight,
    };

    // Restore original styles
    Object.assign(tooltip.style, originalStyles);
    if (tooltipRect.width <= 0 || tooltipRect.height <= 0) return;

    /**
     * Tests if a position is valid (in viewport and optionally not overlapping)
     * @param {string} pos - Position to test
     * @returns {Object} { coords, pos, isValid }
     */
    const tryPosition = (pos) => {
      const coords = getPositionCoords(pos, triggerRect, tooltipRect, gap);
      if (!coords) return { isValid: false };

      const inViewport = isPositionInViewport(
        coords,
        tooltipRect,
        viewportWidth,
        viewportHeight
      );
      const notOverlapping = avoidOverlapping
        ? isPositionNotOverlapping(
            coords,
            pos,
            tooltipRect,
            triggerRect,
            trigger,
            tooltip
          )
        : true;

      return { coords, pos, isValid: inViewport && notOverlapping };
    };

    // Position selection strategy:
    // 1. First try user-specified position
    if (tooltipPosition) {
      const { coords, pos, isValid } = tryPosition(tooltipPosition);
      if (isValid) {
        setStyle({ ...coords, opacity: 1 });
        setPosition(pos);
        return;
      }

      // 2. Then try mirror position
      const mirrorPos = POSITION_MIRROR[tooltipPosition];
      if (mirrorPos) {
        const {
          coords: mirrorCoords,
          pos: mirrorPosFinal,
          isValid: mirrorValid,
        } = tryPosition(mirrorPos);
        if (mirrorValid) {
          setStyle({ ...mirrorCoords, opacity: 1 });
          setPosition(mirrorPosFinal);
          return;
        }
      }
    }

    // 3. Try all positions in priority order
    for (const pos of POSITION_PRIORITY) {
      const { coords, pos: validPos, isValid } = tryPosition(pos);
      if (isValid) {
        setStyle({ ...coords, opacity: 1 });
        setPosition(validPos);
        return;
      }
    }

    // 4. Fallback: Find first position that fits in viewport (when avioid overlapping fails)
    const positionsToTry = tooltipPosition
      ? [tooltipPosition, ...POSITION_PRIORITY]
      : POSITION_PRIORITY;

    for (const pos of positionsToTry) {
      const coords = getPositionCoords(pos, triggerRect, tooltipRect, gap);
      if (
        coords &&
        isPositionInViewport(coords, tooltipRect, viewportWidth, viewportHeight)
      ) {
        setStyle({ ...coords, opacity: 1 });
        setPosition(pos);
        return;
      }
    }

    // 5. Ultimate fallback: Clamp first position to viewport edges
    const fallbackPos = positionsToTry[0];
    const fallbackCoords = getPositionCoords(
      fallbackPos,
      triggerRect,
      tooltipRect,
      gap
    ) || { top: 0, left: 0 };
    setStyle({
      ...fallbackCoords,
      top: Math.max(
        0,
        Math.min(fallbackCoords.top, viewportHeight - tooltipRect.height)
      ),
      left: Math.max(
        0,
        Math.min(fallbackCoords.left, viewportWidth - tooltipRect.width)
      ),
      opacity: 1,
    });
    setPosition(fallbackPos);
  }, [show, disabled, gap, avoidOverlapping, tooltipPosition]);

  // Handle click outside to close tooltip when triggerType is "click"
  useEffect(() => {
    if (triggerType !== "click" || !isToggleTipActive) return;

    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".tooltip") &&
        !e.target.closest("[data-toggle-tip='true']")
      ) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isToggleTipActive, triggerType]);

  const handleClick = () => {
    if (disabled) return;

    if (triggerType === "click") {
      console.log("Click event triggered inside toggletip");

      setIsToggleTipActive(true);
      setVisible(true);
    }
  };

  const handleMouseEnter = () => {
    if (disabled || isToggleTipActive) return;
    setVisible(true);
  };

  const handleMouseLeave = () => {
    if (isToggleTipActive) return;
    setVisible(false);
  };

  const getTooltipProps = () => {
    const baseProps = {
      ref: triggerRef,
      "aria-label": content,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleMouseEnter,
      onBlur: handleMouseLeave,
    };

    if (triggerType === "click") {
      return {
        ...baseProps,
        "data-toggle-tip": isToggleTipActive,
        "aria-description": content,
        onClick: handleClick,
        onKeyDown: (e) => {
          if (e.key === "Escape" && visible) {
            setVisible(false);
            setIsToggleTipActive(false);
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        },
      };
    }

    return {
      ...baseProps,
      onClick: () => {
        console.log("Click event triggered inside tooltip");
        setVisible(false);
      },
      onKeyDown: (e) => e.key === "Escape" && setVisible(false),
    };
  };

  const renderTooltip = () => {
    const portalRoot = document.fullscreenElement || document.body;

    return show && content
      ? createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            aria-hidden={!visible}
            className="tooltip"
            style={{
              position: "fixed",
              pointerEvents: "none",
              zIndex: 9999,
              background: "#37324A",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              textAlign: content?.trim().length <= 4 ? "center" : "left",
              minWidth: "2rem",
              maxWidth: "28.375rem",
              boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
              transform: globalAnimationEnabled ? "scale(0.95)" : "scale(1)",
              transition: globalAnimationEnabled
                ? "opacity 0.2s ease, transform 0.2s ease"
                : "opacity 0.1s ease",
              ...style,
              opacity: visible ? 1 : 0,
            }}
          >
            <div
              aria-live="polite"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
              }}
            >
              {content}
            </div>

            {withTip && (
              <div
                style={{
                  position: "absolute",
                  width: 0,
                  height: 0,
                  ...(position.startsWith("TOP") && {
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid #37324A",
                    top: "100%",
                    ...(position.endsWith("CENTER") && {
                      left: "50%",
                      transform: "translateX(-50%)",
                    }),
                    ...(position.endsWith("LEFT") && { left: "10px" }),
                    ...(position.endsWith("RIGHT") && { right: "10px" }),
                  }),
                  ...(position.startsWith("BOTTOM") && {
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderBottom: "5px solid #37324A",
                    bottom: "100%",
                    ...(position.endsWith("CENTER") && {
                      left: "50%",
                      transform: "translateX(-50%)",
                    }),
                    ...(position.endsWith("LEFT") && { left: "10px" }),
                    ...(position.endsWith("RIGHT") && { right: "10px" }),
                  }),
                  ...(position === "MIDDLE_LEFT" && {
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderLeft: "5px solid #37324A",
                    left: "100%",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }),
                  ...(position === "MIDDLE_RIGHT" && {
                    borderTop: "5px solid transparent",
                    borderBottom: "5px solid transparent",
                    borderRight: "5px solid #37324A",
                    right: "100%",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }),
                  ...(position === "MIDDLE_CENTER" && {
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid #37324A",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }),
                }}
              />
            )}
          </div>,
          portalRoot // Changed from document.body to portalRoot
        )
      : null;
  };
  return {
    tooltipProps: getTooltipProps(),
    visible,
    setVisible,
    renderTooltip,
    isToggleTipActive,
    triggerRef,
    tooltipRef,
  };
};
