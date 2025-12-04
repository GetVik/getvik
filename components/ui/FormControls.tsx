import { Loader2 } from 'lucide-react';
import React from 'react';

interface SaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const FormLabel = ({
  children,
  htmlFor,
  className = '',
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-medium text-gray-300 mb-1 ${className}`}
  >
    {children}
  </label>
);
export const FormInput = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => (
  <input
    {...props}
    className={`w-full rounded-lg border border-gray-700 bg-[#262626] p-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 ${props.className}`}
  />
);

export const FormTextarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
  <textarea
    {...props}
    rows={4}
    className="w-full rounded-lg border border-gray-700 bg-[#262626] p-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500"
  ></textarea>
);

export const FormSelect = (
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) => (
  <select
    {...props}
    className={`w-full rounded-lg border border-gray-700 bg-[#262626] p-2.5 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 ${props.className}`}
  >
    {props.children}
  </select>
);


export const SaveButton: React.FC<SaveButtonProps> = ({
  isLoading,
  children,
  className = '',
  ...props
}) => (
  <button
    type="submit"
    disabled={isLoading}
    className={`flex items-center justify-center gap-2 rounded-lg bg-white text-black font-medium px-4 py-2 transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {isLoading ? <Loader2 className="animate-spin" size={16} /> : null}
    {children}
  </button>
);