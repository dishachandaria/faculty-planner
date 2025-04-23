import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isPast, isToday } from "date-fns";
import { tasks } from "@/lib/api";
import { toast } from "sonner";

interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
}

interface TaskListProps {
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

const TaskList = ({ onAddTask, onEditTask }: TaskListProps) => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await tasks.getAll();
      setTaskList(data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasks.delete(taskId);
      setTaskList(prev => prev.filter(task => task._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "completed" ? "pending" : "completed";
      const updatedTask = await tasks.update(taskId, { status: newStatus });
      setTaskList(prev => 
        prev.map(task => task._id === taskId ? { ...task, status: newStatus } : task)
      );
      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update task status");
      console.error("Error updating task status:", error);
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-white";
      case "medium":
        return "bg-accent text-secondary";
      case "low":
        return "bg-muted text-secondary";
    }
  };

  const getDateStatus = (dateString: string) => {
    const date = new Date(dateString);
    if (isPast(date) && !isToday(date)) return "text-destructive font-medium";
    if (isToday(date)) return "text-accent font-medium";
    return "text-gray-500";
  };

  const filteredTasks = taskList.filter(task => {
    if (filter === "active") return task.status !== "completed";
    if (filter === "completed") return task.status === "completed";
    return true;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p>Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Tasks</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-primary" : ""}
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
            className={filter === "active" ? "bg-primary" : ""}
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "bg-primary" : ""}
          >
            Completed
          </Button>
          <Button
            onClick={onAddTask}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks available. Add a new task to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  task.status === "completed" ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-start space-x-3 flex-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-6 w-6 rounded-full ${
                      task.status === "completed" ? "bg-success text-success-foreground" : "bg-white"
                    }`}
                    onClick={() => handleToggleStatus(task._id, task.status)}
                  >
                    {task.status === "completed" && <Check className="h-3 w-3" />}
                  </Button>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : "text-secondary"}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className={`text-sm ${task.status === "completed" ? "text-gray-400" : "text-gray-600"}`}>
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <span className={`text-xs ${getDateStatus(task.dueDate)}`}>
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditTask(task)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteTask(task._id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
