"use client";

import { useTooltip } from "../../hooks/useTooltip";
import "../Button/Button.css";
export const ToggleTip = ({
  children,
  tooltipContent,
  toggletipContent,
  className = "",
  variant = "primary",
  label,
  disabled = false,
  tooltipPosition,
}) => {
  const { triggerProps, tooltipElement } = useTooltip({
    tooltipContent,
    toggletipContent,
    showOnHover: !!tooltipContent,
    showOnFocus: !!tooltipContent,
    showOnClick: !!toggletipContent,
    tooltipPosition,
  });

  return (
    <>
      <button
        {...triggerProps}
        className={`btn ${variant} ${disabled ? "disabled" : ""} ${className}`}
        variant={variant}
        disabled={disabled}
      >
        {label || children}
      </button>
      {tooltipElement}
    </>
  );
};
