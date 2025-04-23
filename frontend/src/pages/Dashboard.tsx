import { useState, useEffect } from "react";
import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import CalendarView from "@/components/Calendar/CalendarView";
import EventForm from "@/components/Events/EventForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { tasks as tasksApi, events as eventsApi } from "@/lib/api";
import { toast } from "sonner";

// Define the Event type
interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  time?: string;
  endTime?: string;
  description?: string;
  location?: string;
  type: "class" | "meeting" | "office-hours" | "other";
}

// Define the Task type
interface Task {
  id: string;
  title: string;
  date: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
}

const Dashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchEvents();
  }, []);

  const fetchTasks = async () => {
    try {
      const taskList = await tasksApi.getAll();
      setTasks(taskList.map(task => ({
        id: task._id,
        title: task.title,
        date: task.dueDate,
        description: task.description,
        priority: task.priority,
        status: task.status
      })));
    } catch (error) {
      toast.error("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return new Date().toISOString().split('T')[0]; // Return today's date as fallback
    }
  };

  const formatTime = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toTimeString().slice(0, 5);
    } catch (error) {
      console.error('Error formatting time:', error);
      return '00:00'; // Return midnight as fallback
    }
  };

  const fetchEvents = async () => {
    try {
      const eventList = await eventsApi.getAll();
      setEvents(eventList.map(event => ({
        id: event._id,
        title: event.title,
        date: formatDate(event.startDate),
        time: formatTime(event.startDate),
        endTime: formatTime(event.endDate),
        description: event.description || '',
        location: event.location || '',
        type: event.type
      })));
    } catch (error) {
      toast.error("Failed to fetch events");
      console.error("Error fetching events:", error);
    }
  };

  const handleCreateEvent = () => {
    setCurrentEvent(null);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event: any) => {
    setCurrentEvent(event);
    setIsEventFormOpen(true);
  };

  const handleSaveEvent = async (eventData: any) => {
    try {
      console.log('Saving event with data:', eventData);
      
      if (currentEvent) {
        // Update existing event
        const updatedEvent = await eventsApi.update(currentEvent.id, eventData);
        console.log('Event updated successfully:', updatedEvent);
        setEvents(events.map(e => e.id === updatedEvent._id ? {
          id: updatedEvent._id,
          title: updatedEvent.title,
          date: formatDate(updatedEvent.startDate),
          time: formatTime(updatedEvent.startDate),
          endTime: formatTime(updatedEvent.endDate),
          description: updatedEvent.description || '',
          location: updatedEvent.location || '',
          type: updatedEvent.type
        } : e));
      } else {
        // Create new event
        const newEvent = await eventsApi.create(eventData);
        console.log('Event created successfully:', newEvent);
        setEvents([...events, {
          id: newEvent._id,
          title: newEvent.title,
          date: formatDate(newEvent.startDate),
          time: formatTime(newEvent.startDate),
          endTime: formatTime(newEvent.endDate),
          description: newEvent.description || '',
          location: newEvent.location || '',
          type: newEvent.type
        }]);
      }
      setIsEventFormOpen(false);
      toast.success(currentEvent ? "Event updated successfully" : "Event created successfully");
    } catch (error: any) {
      console.error('Error saving event:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || "Failed to save event. Please try again.");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventsApi.delete(eventId);
      setEvents(events.filter(event => event.id !== eventId));
      toast.success("Event deleted successfully");
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || "Failed to delete event. Please try again.");
    }
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Filter events for the selected date
  const eventsForSelectedDate = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onCreateEvent={handleCreateEvent} 
        tasks={tasks} 
        events={events} 
      />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back! Here's your schedule for today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CalendarView
                events={events}
                tasks={tasks}
                onSelectDate={handleSelectDate}
                onSelectEvent={handleEditEvent}
              />
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Events for {format(selectedDate, "MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {eventsForSelectedDate.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No events scheduled for this day.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {eventsForSelectedDate.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 rounded-lg border border-gray-200 cursor-pointer hover:border-primary"
                          onClick={() => handleEditEvent(event)}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-secondary">{event.title}</h4>
                            <span className="text-xs font-medium bg-gray-100 rounded-full px-2 py-1">
                              {event.type}
                            </span>
                          </div>
                          {event.time && (
                            <p className="text-sm text-gray-600 mt-1">
                              {event.time} - {event.endTime || "N/A"}
                            </p>
                          )}
                          {event.location && (
                            <p className="text-xs text-gray-500 mt-1">
                              {event.location}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
      
      <EventForm
        open={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        initialData={currentEvent}
      />
    </div>
  );
};

export default Dashboard;
