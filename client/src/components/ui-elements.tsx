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
    secondary: "bg-[#A0A0A0] text-white shadow-md shadow-black/5 hover:shadow-lg",
    outline: "bg-transparent border-2 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/5",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-black/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-semibold",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      className={`rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
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

export function Input({ className = "", label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-foreground/80">{label}</label>}
      <input
        className={`w-full px-4 py-3 rounded-lg bg-black/5 border border-transparent focus:bg-white focus:border-[#FF6B6B] focus:ring-4 focus:ring-[#FF6B6B]/10 transition-all outline-none text-foreground placeholder:text-muted-foreground/60 ${error ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/10' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
    </div>
  );
}

export function Select({ className = "", label, error, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-semibold text-foreground/80">{label}</label>}
      <select
        className={`w-full px-4 py-3 rounded-lg bg-black/5 border border-transparent focus:bg-white focus:border-[#FF6B6B] focus:ring-4 focus:ring-[#FF6B6B]/10 transition-all outline-none text-foreground cursor-pointer appearance-none ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
    </div>
  );
}

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
