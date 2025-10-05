import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({ label, error, helperText, ...props }) => {
  return (
    <div className="mb-6">
      {label && <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">{label}</label>}
      <input
        {...props}
        className={`mtq-input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
};

export default Input;
