import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  date: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
}

interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  endTime?: string;
  description?: string;
  location?: string;
  type: "class" | "meeting" | "office-hours" | "other";
}

interface NotificationDropdownProps {
  tasks?: Task[];
  events?: Event[];
}

const NotificationDropdown = ({ tasks = [], events = [] }: NotificationDropdownProps) => {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  useEffect(() => {
    const checkUpcomingItems = () => {
      try {
        const today = new Date();
        const twoDaysFromNow = addDays(today, 2);
        
        // Check upcoming tasks
        const upcomingTasks = (tasks || []).filter(task => {
          if (!task || !task.date) return false;
          const taskDate = new Date(task.date);
          return isSameDay(taskDate, twoDaysFromNow) && task.status !== "completed";
        });
        
        // Check upcoming events
        const upcomingEvents = (events || []).filter(event => {
          if (!event || !event.date) return false;
          const eventDate = new Date(event.date);
          return isSameDay(eventDate, twoDaysFromNow);
        });
        
        setUpcomingTasks(upcomingTasks);
        setUpcomingEvents(upcomingEvents);
      } catch (error) {
        console.error('Error checking upcoming items:', error);
        setUpcomingTasks([]);
        setUpcomingEvents([]);
      }
    };

    checkUpcomingItems();
    // Check every hour for new upcoming items
    const interval = setInterval(checkUpcomingItems, 3600000);
    
    return () => clearInterval(interval);
  }, [tasks, events]);

  const totalNotifications = upcomingTasks.length + upcomingEvents.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative">
        <Bell className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
        {totalNotifications > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
          >
            {totalNotifications}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          {upcomingTasks.length > 0 && (
            <>
              <h3 className="font-medium text-sm mb-2">Upcoming Tasks</h3>
              <div className="space-y-2 mb-4">
                {upcomingTasks.map(task => (
                  <DropdownMenuItem key={task.id} className="flex flex-col items-start p-2">
                    <span className="font-medium text-sm">{task.title}</span>
                    <span className="text-xs text-gray-500">Due in 2 days</span>
                  </DropdownMenuItem>
                ))}
              </div>
            </>
          )}
          
          {upcomingEvents.length > 0 && (
            <>
              <h3 className="font-medium text-sm mb-2">Upcoming Events</h3>
              <div className="space-y-2">
                {upcomingEvents.map(event => (
                  <DropdownMenuItem key={event.id} className="flex flex-col items-start p-2">
                    <span className="font-medium text-sm">{event.title}</span>
                    <span className="text-xs text-gray-500">
                      {event.time ? `${event.time} - ${event.endTime || 'N/A'}` : 'Due in 2 days'}
                    </span>
                  </DropdownMenuItem>
                ))}
              </div>
            </>
          )}
          
          {totalNotifications === 0 && (
            <p className="text-sm text-gray-500 text-center py-2">
              No upcoming items
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown; 