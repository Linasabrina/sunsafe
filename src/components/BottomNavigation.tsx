
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, History } from "lucide-react";

interface NavItemProps {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, icon: Icon, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center h-full px-5",
        "transition-colors duration-200",
        isActive
          ? "text-sunsafe-teal"
          : "text-sunsafe-muted-text hover:text-white"
      )}
    >
      <Icon className={cn("h-5 w-5", isActive && "animate-pulse-slow")} />
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-sunsafe-blue border-t border-slate-800 flex justify-around z-10">
      <NavItem
        to="/"
        label="Dashboard"
        icon={LayoutDashboard}
        isActive={pathname === "/" || pathname === "/dashboard"}
      />
      <NavItem
        to="/history"
        label="History"
        icon={History}
        isActive={pathname === "/history"}
      />
    </nav>
  );
};

export default BottomNavigation;
