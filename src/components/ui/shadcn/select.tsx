import * as React from "react";

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Select({
  value,
  onValueChange,
  children,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  let selectedLabel = null;
  React.Children.forEach(children, (child: any) => {
    if (child && child.props && child.props.value === value) {
      selectedLabel = child.props.children;
    }
  });

  return (
    <div
      className={`relative inline-block min-w-[140px] ${className || ""}`}
      ref={ref}
    >
      <button
        type="button"
        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full flex justify-between items-center bg-surface-light dark:bg-surface-dark text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 shadow-sm"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-sm font-medium">{selectedLabel}</span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl backdrop-blur-sm max-h-60 overflow-y-auto">
          {React.Children.map(children, (child: any) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value);
                setOpen(false);
              },
              selected: child.props.value === value,
            })
          )}
        </div>
      )}
    </div>
  );
}

export function SelectItem({
  value,
  children,
  onClick,
  selected,
}: {
  value: string;
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      className={`block w-full text-right px-4 py-3 text-sm font-medium hover:bg-accent/10 focus:bg-accent/20 focus:outline-none transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
        selected
          ? "bg-accent/10 text-accent border-r-2 border-accent"
          : "text-gray-700 dark:text-gray-300"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
