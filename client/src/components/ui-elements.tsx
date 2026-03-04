import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Link, LinkProps } from "wouter";

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  disabled,
  children,
  ...props
}: HTMLMotionProps<"button"> & { variant?: "primary" | "secondary" | "outline" | "ghost", size?: "sm" | "md" | "lg" }) {
  
  const variants = {
    primary: "bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white shadow-lg shadow-[#FF6B6B]/25 hover:shadow-xl hover:shadow-[#FF6B6B]/30",
    secondary: "bg-black/5 text-muted-foreground hover:bg-black/10",
    outline: "bg-transparent border-2 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/5",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-black/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base font-semibold",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      className={`rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-[13px] font-semibold text-foreground/70">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 rounded-lg bg-black/5 border border-transparent focus:bg-white focus:border-[#FF6B6B] focus:ring-4 focus:ring-[#FF6B6B]/10 transition-all outline-none text-[14px] text-foreground placeholder:text-muted-foreground/50 ${error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : ''} ${className}`}
          {...props}
        />
        {error && <span className="text-[12px] text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }>(
  ({ className = "", label, error, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-[13px] font-semibold text-foreground/70">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-2.5 rounded-lg bg-black/5 border border-transparent focus:bg-white focus:border-[#FF6B6B] focus:ring-4 focus:ring-[#FF6B6B]/10 transition-all outline-none text-[14px] text-foreground cursor-pointer appearance-none ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        {error && <span className="text-[12px] text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";

export const RadioGroup = ({ 
  label, 
  options, 
  value, 
  onChange, 
  error 
}: { 
  label: string; 
  options: { label: string; value: string }[]; 
  value: string; 
  onChange: (value: string) => void;
  error?: string;
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[13px] font-semibold text-foreground/70">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label 
            key={option.value} 
            className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border transition-all ${value === option.value ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]' : 'border-black/5 bg-black/5 hover:border-black/10'}`}
          >
            <input 
              type="radio" 
              className="sr-only" 
              name="revealOption"
              value={option.value} 
              checked={value === option.value} 
              onChange={() => onChange(option.value)}
            />
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${value === option.value ? 'border-[#FF6B6B]' : 'border-muted-foreground/40'}`}>
              {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B]" />}
            </div>
            <span className="text-[14px] font-medium">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <span className="text-[12px] text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export function Nav() {
  return (
    <header className="w-full py-6 px-4 sm:px-8 max-w-5xl mx-auto flex items-center justify-between">
      <Link href="/" className="text-2xl font-display font-bold text-foreground flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
          🎁
        </div>
        SecretWish
      </Link>
    </header>
  );
}
