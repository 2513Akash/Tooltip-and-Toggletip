"use client";

import "./Button.css";
import { useTooltip } from "../../Hooks/useTooltip";

export default function Button({
  className = "",
  variant = "primary",
  tooltip, // hover tooltip content
  tooltipPosition = "BOTTOM_CENTER",
  withTip = false,
  gap = 8,
  avoidOverlapping = false,
  disabled = false,
  label,
  children,
  ...toggletipProps
}) {
  const { tooltipProps, renderTooltip } = useTooltip({
    content: tooltip, // Hover tooltip only
    tooltipPosition,
    withTip,
    disabled,
    gap,
    avoidOverlapping,
    triggerType: "hover",
  });

  return (
    <>
      <button
        {...tooltipProps}
        {...toggletipProps}
        className={`btn ${variant} ${disabled ? "disabled" : ""} ${className}`}
        disabled={disabled}
      >
        {label || children}
      </button>
      {renderTooltip()}
    </>
  );
}
