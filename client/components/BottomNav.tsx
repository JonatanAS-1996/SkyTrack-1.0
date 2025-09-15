import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  FileText,
  Calendar,
  User,
  Settings,
} from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/dashboard/classes", icon: BookOpen, label: "Classes" },
  { to: "/dashboard/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/dashboard/notes", icon: FileText, label: "Notes" },
  { to: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center">
      <nav className="pointer-events-auto flex items-center gap-3 rounded-3xl bg-background/70 px-4 py-3 shadow-2xl backdrop-blur-lg">
        {items.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "group relative flex flex-col items-center justify-center rounded-2xl p-2 transition-all duration-200 ease-out",
                active
                  ? "shadow-md"
                  : "hover:shadow hover:bg-accent/30"
              )}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: active ? 1.2 : 1, opacity: active ? 1 : 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    active ? "text-primary" : "text-foreground/80"
                  )}
                />
              </motion.div>

              <span
                className={cn(
                  "mt-1 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {label}
              </span>

              {/* Active Background Indicator */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 rounded-2xl bg-accent/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
