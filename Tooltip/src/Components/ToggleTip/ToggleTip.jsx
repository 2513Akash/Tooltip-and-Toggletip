import { useTooltip } from "../../Hooks/useTooltip";
import Button from "../Button/Button";

export const ToggleTip = ({
  tooltip, // Content for hover tooltip
  toggletip, // Content for click toggletip
  tooltipPosition = "BOTTOM_CENTER",
  withTip = true,
  disabled = false,
  gap = 8,
  avoidOverlapping = false,
  className = "",
  variant = "primary",
  label,
  children,
}) => {
  const { tooltipProps, renderTooltip, visible } = useTooltip({
    content: toggletip,
    tooltipPosition,
    withTip,
    disabled,
    gap,
    avoidOverlapping,
    triggerType: "click", // This makes it a toggletip
  });

  return (
    <>
      <Button
        {...tooltipProps}
        tooltip={tooltip} // Pass tooltip content to Button
        className={className}
        variant={variant}
        disabled={disabled}
        tooltipPosition={tooltipPosition}
        data-toggle-tip={visible}
        aria-expanded={visible}
      >
        {label || children}
      </Button>
      {renderTooltip()}
    </>
  );
};
