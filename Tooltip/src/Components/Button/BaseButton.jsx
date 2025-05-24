// BaseButton.js
export default function BaseButton({
  className = "",
  variant = "primary",
  disabled = false,
  label,
  children,
  ...props
}) {
  return (
    <button
      className={`btn ${variant} ${disabled ? "disabled" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {label || children}
    </button>
  );
}
