import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="mb-6">
      {label && <label className="block mb-2 font-semibold text-gray-700">{label}</label>}
      <input
        {...props}
        className="w-full border-2 border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
      />
    </div>
  );
};

export default Input;
