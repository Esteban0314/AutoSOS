import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = "left",
      containerClassName = "",
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-wider text-[#0C3B2E] mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            className={`
              w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-200 outline-none
              placeholder:text-gray-400
              ${icon && iconPosition === "left" ? "pl-11" : ""}
              ${icon && iconPosition === "right" ? "pr-11" : ""}
              ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-3 focus:ring-red-500/15"
                  : "border-[#DCE7DE] hover:border-[#6D9773]/70 focus:border-[#6D9773] focus:ring-3 focus:ring-[#6D9773]/20"
              }
              disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />

          {icon && iconPosition === "right" && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
        )}

        {!error && helperText && (
          <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName = "",
      className = "",
      children,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-wider text-[#0C3B2E] mb-2"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          className={`
            w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-200 outline-none
            ${
              error
                ? "border-red-400 focus:border-red-500 focus:ring-3 focus:ring-red-500/15"
                : "border-[#DCE7DE] hover:border-[#6D9773]/70 focus:border-[#6D9773] focus:ring-3 focus:ring-[#6D9773]/20"
            }
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {children}
        </select>

        {error && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
        )}

        {!error && helperText && (
          <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
