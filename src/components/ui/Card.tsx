import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: "none" | "indigo" | "purple" | "emerald";
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  glow = "none",
  className = "",
  ...props
}) => {
  const glowStyles = {
    none: "",
    indigo: "hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.25)] hover:border-indigo-500/40",
    purple: "hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.25)] hover:border-purple-500/40",
    emerald: "hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)] hover:border-emerald-500/40",
  };

  return (
    <div
      className={`bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 ${
        hoverable ? "hover:-translate-y-1 hover:border-slate-700 shadow-lg hover:shadow-xl" : "shadow-md"
      } ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-1.5 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <h3 className={`text-xl font-bold text-slate-100 tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <p className={`text-sm text-slate-400 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return <div className={className} {...props}>{children}</div>;
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
};
