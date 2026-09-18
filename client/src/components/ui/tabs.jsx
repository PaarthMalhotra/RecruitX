import * as React from "react";

const TabsContext = React.createContext(null);

export function Tabs({ defaultValue, value, onValueChange, className = "", children, ...props }) {
  const [selectedTab, setSelectedTab] = React.useState(value !== undefined ? value : defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedTab(value);
    }
  }, [value]);

  const handleTabChange = React.useCallback(
    (val) => {
      if (value === undefined) {
        setSelectedTab(val);
      }
      if (onValueChange) {
        onValueChange(val);
      }
    },
    [value, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value: selectedTab, onValueChange: handleTabChange }}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className = "", children, ...props }) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center justify-start rounded-2xl bg-[#F3F3E8] p-1 text-gray-600 border border-black/5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className = "", children, ...props }) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger must be used within Tabs");
  }

  const isSelected = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => context.onValueChange(value)}
      className={`
        inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-medium
        transition-all duration-200 cursor-pointer outline-none select-none shrink-0
        ${
          isSelected
            ? "bg-white text-black shadow-xs font-semibold"
            : "text-gray-600 hover:text-black hover:bg-white/40"
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className = "", children, ...props }) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("TabsContent must be used within Tabs");
  }

  if (context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
