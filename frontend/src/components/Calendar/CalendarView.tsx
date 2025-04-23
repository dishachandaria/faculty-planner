import { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO,
  startOfWeek,
  endOfWeek,
  addDays
} from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  time?: string;
  endTime?: string;
  description?: string;
  location?: string;
  type: "class" | "meeting" | "office-hours" | "other";
  recurring?: boolean;
}

interface Task {
  id: string;
  title: string;
  date: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
}

interface CalendarViewProps {
  events: Event[];
  tasks: Task[];
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: Event) => void;
}

const CalendarView = ({ events, tasks, onSelectDate, onSelectEvent }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    onSelectDate(day);
  };

  // Get the start of the week for the first day of the month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Generate all days for the calendar view
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get events for the selected date
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      if (event.recurring) {
        // For recurring events, check if the day of week matches
        return eventDate.getDay() === day.getDay();
      }
      return isSameDay(eventDate, day);
    });
  };

  // Get tasks for the selected date
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => 
      isSameDay(parseISO(task.date), day)
    );
  };

  // Get color for event type
  const getEventColor = (type: Event["type"]) => {
    switch (type) {
      case "class":
        return "bg-primary text-white";
      case "meeting":
        return "bg-accent text-secondary";
      case "office-hours":
        return "bg-secondary text-white";
      default:
        return "bg-gray-200 text-secondary";
    }
  };

  // Get color for task priority
  const getTaskColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-white";
      case "medium":
        return "bg-accent text-secondary";
      case "low":
        return "bg-muted text-secondary";
      default:
        return "bg-gray-200 text-secondary";
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-secondary" />
          <h2 className="text-xl font-semibold text-secondary">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const dayTasks = getTasksForDay(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={day.toString()}
              className={cn(
                "h-24 border rounded-md p-1 overflow-hidden cursor-pointer transition-colors",
                isCurrentMonth ? "bg-white" : "bg-gray-50",
                isToday && "border-primary",
                isSelected && "ring-2 ring-primary ring-opacity-50",
                !isCurrentMonth && "text-gray-400"
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">
                  {format(day, "d")}
                </span>
                {isToday && (
                  <span className="text-xs text-primary font-medium">
                    Today
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "text-xs p-1 rounded truncate cursor-pointer",
                      getEventColor(event.type)
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "text-xs p-1 rounded truncate",
                      getTaskColor(task.priority)
                    )}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CalendarView;
