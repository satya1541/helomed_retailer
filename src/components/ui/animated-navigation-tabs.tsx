import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";

type NavItem = {
  id: number;
  title: string;
  href: string;
};

export function AnimatedNavigationTabs({ items }: { items: NavItem[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Find active item based on current route
  const activeItem = items.find(item => location.pathname === item.href) || items[0];
  const [active, setActive] = useState<NavItem>(activeItem);
  const [isHover, setIsHover] = useState<NavItem | null>(null);

  const handleClick = (item: NavItem) => {
    setActive(item);
    navigate(item.href);
  };

  return (
    <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1">
      <ul className="flex items-center justify-start md:justify-center gap-1 min-w-max">
        {items.map((item) => (
          <li key={item.id}>
            <button
              className={cn(
                "py-2 relative duration-300 transition-colors hover:!text-primary",
                active.id === item.id ? "text-primary" : "text-muted-foreground"
              )}
              onClick={() => handleClick(item)}
              onMouseEnter={() => setIsHover(item)}
              onMouseLeave={() => setIsHover(null)}
            >
              <div className="px-5 py-2 relative">
                {item.title}
                {isHover?.id === item.id && (
                  <motion.div
                    layoutId="hover-bg"
                    className="absolute inset-0 w-full h-full bg-primary/10 rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </div>
              {active.id === item.id && (
                <motion.div
                  layoutId="active"
                  className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
