"use client";

import "./Button.css";
import { useTooltip } from "../../Hooks/useTooltip";

export default function Button(
  {
    label,
    children,
    tooltipContent,
    onClick,
    className = "",
    variant = "primary",
    disabled = false,
    tooltipPosition,
    ...props
  },
  ref
) {
  console.log("props", props);

  const { triggerProps, tooltipElement } = useTooltip({
    content: tooltipContent,
    showOnHover: !!tooltipContent,
    showOnFocus: !!tooltipContent,
    showOnClick: false,
    tooltipPosition,
  });

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (triggerProps.onClick) triggerProps.onClick(e);
  };

  return (
    <>
      <button
        {...props}
        {...triggerProps}
        ref={(node) => {
          triggerProps.ref.current = node;
          if (ref) {
            if (typeof ref === "function") ref(node);
            else ref.current = node;
          }
        }}
        className={`btn ${variant} ${disabled ? "disabled" : ""} ${className}`}
        onClick={handleClick}
      >
        {label || children}
      </button>
      {tooltipElement}
    </>
  );
}
