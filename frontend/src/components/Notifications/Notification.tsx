import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";

interface Task {
  id: string;
  title: string;
  date: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
}

interface NotificationProps {
  tasks: Task[];
}

const Notification = ({ tasks }: NotificationProps) => {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

  useEffect(() => {
    const checkUpcomingTasks = () => {
      const today = new Date();
      const twoDaysFromNow = addDays(today, 2);
      
      const upcoming = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return isSameDay(taskDate, twoDaysFromNow) && task.status !== "completed";
      });
      
      setUpcomingTasks(upcoming);
    };

    checkUpcomingTasks();
    // Check every hour for new upcoming tasks
    const interval = setInterval(checkUpcomingTasks, 3600000);
    
    return () => clearInterval(interval);
  }, [tasks]);

  if (upcomingTasks.length === 0) return null;

  return (
    <Card className="p-4 mb-4 bg-yellow-50 border-yellow-200">
      <div className="flex items-center space-x-2">
        <Bell className="h-5 w-5 text-yellow-600" />
        <h3 className="font-medium text-yellow-800">Upcoming Tasks</h3>
      </div>
      <div className="mt-2 space-y-2">
        {upcomingTasks.map(task => (
          <div key={task.id} className="text-sm text-yellow-700">
            <p className="font-medium">{task.title}</p>
            <p className="text-xs">Due in 2 days</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Notification; 