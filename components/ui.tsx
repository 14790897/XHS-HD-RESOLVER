import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-xhs-brand text-white hover:bg-red-600 focus:ring-red-500",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-700",
    outline: "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-slate-200",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`mr-2 h-4 w-4 ${size === 'lg' ? 'h-5 w-5' : ''}`} />}
      {children}
    </button>
  );
};

// --- Toggle Switch ---
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, label }) => {
  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onCheckedChange(!checked)}>
      <div 
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${checked ? 'bg-xhs-brand' : 'bg-slate-200'}`}
      >
        <span
          className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
        />
      </div>
      {label && <span className="text-sm font-medium text-slate-700 select-none">{label}</span>}
    </div>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>}
      <input
        className={`w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-xhs-brand focus:outline-none focus:ring-2 focus:ring-xhs-brand/20 disabled:bg-slate-50 ${error ? 'border-red-500 focus:ring-red-200' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);
