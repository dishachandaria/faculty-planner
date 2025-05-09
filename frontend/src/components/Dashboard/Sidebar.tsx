
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Check, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      name: "Calendar",
      path: "/dashboard",
      icon: <Calendar className="mr-2 h-4 w-4" />,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: <Check className="mr-2 h-4 w-4" />,
    },

  ];

  return (
    <div className="h-full w-64 border-r border-gray-200 bg-white">
      <div className="flex flex-col h-full py-6">
        <div className="space-y-1 px-4">
          {navItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <Button
                variant={currentPath === item.path ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  currentPath === item.path ? "bg-primary text-white" : "text-secondary"
                )}
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
        
        
      </div>
    </div>
  );
};

export default Sidebar;
