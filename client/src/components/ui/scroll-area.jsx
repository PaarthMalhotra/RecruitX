import * as React from "react";

export function ScrollArea({ className = "", children, ...props }) {
  return (
    <div
      className={`relative overflow-x-auto overflow-y-hidden max-w-full no-scrollbar select-none ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function ScrollBar({ orientation = "horizontal", className = "", ...props }) {
  return (
    <div
      className={`flex touch-none select-none transition-colors ${
        orientation === "horizontal"
          ? "h-1.5 flex-col border-t border-t-transparent p-[1px]"
          : "h-full w-1.5 border-l border-l-transparent p-[1px]"
      } ${className}`}
      {...props}
    />
  );
}
