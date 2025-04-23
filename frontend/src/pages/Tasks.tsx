import { useState, useEffect } from "react";
import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import TaskList from "@/components/Tasks/TaskList";
import TaskForm from "@/components/Tasks/TaskForm";
import { tasks as tasksApi } from "@/lib/api";
import { toast } from "sonner";

// Define the Task interface
interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  user: string;
  createdAt: string;
  reminders?: boolean;
}

// Sample data
const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Grade midterm exams",
    description: "Review and grade 30 student midterm papers",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    completed: false,
    priority: "high",
    reminders: true,
  },
  {
    id: "2",
    title: "Prepare lecture slides",
    description: "Complete slides for next week's lecture on advanced topics",
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(), // 4 days from now
    completed: false,
    priority: "medium",
    reminders: true,
  },
  {
    id: "3",
    title: "Submit department report",
    description: "Finalize and submit monthly teaching report to department head",
    dueDate: new Date().toISOString(), // Today
    completed: true,
    priority: "medium",
    reminders: false,
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const taskList = await tasksApi.getAll();
      setTasks(taskList);
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setCurrentTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: any) => {
    setCurrentTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      const formattedTaskData = {
        title: taskData.title,
        description: taskData.description || '',
        dueDate: taskData.dueDate,
        priority: taskData.priority || 'medium',
        status: taskData.status || 'pending',
        reminders: taskData.reminders !== false
      };

      if (currentTask) {
        // Update existing task
        const updatedTask = await tasksApi.update(currentTask._id, formattedTaskData);
        setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
      } else {
        // Create new task
        const newTask = await tasksApi.create(formattedTaskData);
        setTasks([...tasks, newTask]);
      }
      setIsTaskFormOpen(false);
      toast.success(currentTask ? "Task updated successfully" : "Task created successfully");
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task. Please try again.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksApi.delete(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const updatedTask = await tasksApi.update(taskId, {
        ...task,
        status: task.status === 'completed' ? 'pending' : 'completed'
      });

      setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
      toast.success(`Task marked as ${updatedTask.status}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again.");
    }
  };

  const handleCreateTask = () => {
    // Implement task creation logic
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCreateEvent={handleCreateTask} 
        tasks={tasks} 
        events={events} 
      />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary">Tasks</h1>
            <p className="text-gray-500">
              Manage your tasks and deadlines.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <TaskList
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </main>
      </div>
      
      <TaskForm
        open={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSave={handleSaveTask}
        initialData={currentTask}
      />
    </div>
  );
};

export default Tasks;
