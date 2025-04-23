import { useState } from "react";
import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, startOfWeek, addDays } from "date-fns";
import EventForm from "@/components/Events/EventForm";

// Sample recurring events
const sampleSchedule = [
  {
    id: "101",
    title: "Computer Science 101",
    day: "Monday",
    time: "10:00",
    endTime: "11:30",
    location: "Lecture Hall A",
    type: "class",
  },
  {
    id: "102",
    title: "Office Hours",
    day: "Monday",
    time: "15:00",
    endTime: "17:00",
    location: "Office 305",
    type: "office-hours",
  },
  {
    id: "103",
    title: "Advanced Programming",
    day: "Tuesday",
    time: "13:00",
    endTime: "14:30",
    location: "Lab 203",
    type: "class",
  },
  {
    id: "104",
    title: "Department Meeting",
    day: "Wednesday",
    time: "09:00",
    endTime: "10:00",
    location: "Conference Room B",
    type: "meeting",
  },
  {
    id: "105",
    title: "Computer Science 101",
    day: "Wednesday",
    time: "10:00",
    endTime: "11:30",
    location: "Lecture Hall A",
    type: "class",
  },
  {
    id: "106",
    title: "Research Group",
    day: "Thursday",
    time: "14:00",
    endTime: "16:00",
    location: "Research Lab",
    type: "meeting",
  },
  {
    id: "107",
    title: "Advanced Programming",
    day: "Friday",
    time: "13:00",
    endTime: "14:30",
    location: "Lab 203",
    type: "class",
  },
  {
    id: "108",
    title: "Office Hours",
    day: "Friday",
    time: "15:00",
    endTime: "17:00",
    location: "Office 305",
    type: "office-hours",
  },
];

const dayNumbers: Record<string, number> = {
  "Sunday": 0,
  "Monday": 1,
  "Tuesday": 2,
  "Wednesday": 3,
  "Thursday": 4,
  "Friday": 5,
  "Saturday": 6,
};

const Schedule = () => {
  const [schedule, setSchedule] = useState(sampleSchedule);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsEventFormOpen(true);
  };
  
  const handleEditEvent = (event: any) => {
    // Ensure we have all required fields for the event
    const eventData = {
      id: event.id,
      title: event.title,
      date: event.date || new Date().toISOString().split('T')[0],
      time: event.time,
      endTime: event.endTime,
      description: event.description || '',
      location: event.location || '',
      type: event.type,
      reminders: event.reminders !== false,
      day: event.day
    };
    setCurrentEvent(eventData);
    setIsEventFormOpen(true);
  };
  
  const handleSaveEvent = (eventData: any) => {
    const scheduleEvent = {
      ...eventData,
      day: selectedDay,
    };
    
    if (currentEvent) {
      // Update existing event
      setSchedule(schedule.map(e => e.id === scheduleEvent.id ? scheduleEvent : e));
    } else {
      // Add new event
      setSchedule([...schedule, scheduleEvent]);
    }
    setIsEventFormOpen(false);
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setSchedule(schedule.filter(event => event.id !== eventId));
  };
  
  const filterScheduleByDay = (day: string) => {
    return schedule.filter(event => event.day === day);
  };
  
  // Get dates for current week starting from Monday
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = weekDays.map((_, index) => addDays(startOfCurrentWeek, index));
  
  const getEventTypeColor = (type: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCreateEvent={handleAddEvent} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary">Weekly Schedule</h1>
            <p className="text-gray-500">
              Manage your recurring weekly schedule.
            </p>
          </div>
          
          <Tabs defaultValue="weekly" className="mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="weekly">Weekly View</TabsTrigger>
              <TabsTrigger value="daily">Daily View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekly" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => (
                      <div 
                        key={day} 
                        className="text-center cursor-pointer" 
                        onClick={() => setSelectedDay(day)}
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {day}
                        </div>
                        <div className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center text-sm
                          ${day === selectedDay ? "bg-primary text-white" : "bg-gray-100"}`}
                        >
                          {format(weekDates[index], "d")}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
                {weekDays.map(day => (
                  <Card key={day} className={`${day === selectedDay ? "ring-2 ring-primary" : ""}`}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm">{day}</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 px-2">
                      <div className="space-y-2">
                        {filterScheduleByDay(day).length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-2">No events</p>
                        ) : (
                          filterScheduleByDay(day).map(event => (
                            <div 
                              key={event.id}
                              onClick={() => handleEditEvent(event)}
                              className="p-2 rounded-md cursor-pointer hover:bg-gray-50 border border-gray-100"
                            >
                              <div className="flex justify-between items-start">
                                <p className="text-xs font-medium">{event.title}</p>
                                <Badge className={`text-xs ${getEventTypeColor(event.type)}`} variant="secondary">
                                  {event.type.charAt(0).toUpperCase()}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {event.time} - {event.endTime}
                              </p>
                              <p className="text-xs truncate text-gray-500 mt-1">
                                {event.location}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="daily">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{selectedDay}'s Schedule</CardTitle>
                  <Button 
                    onClick={handleAddEvent}
                    className="bg-primary hover:bg-primary/90"
                    size="sm"
                  >
                    Add Event
                  </Button>
                </CardHeader>
                <CardContent>
                  {filterScheduleByDay(selectedDay).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No events scheduled for {selectedDay}. 
                      <Button variant="link" onClick={handleAddEvent} className="text-primary">
                        Add your first event
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filterScheduleByDay(selectedDay)
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(event => (
                          <div 
                            key={event.id}
                            className="p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-primary"
                            onClick={() => handleEditEvent(event)}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-secondary">{event.title}</h4>
                              <Badge className={getEventTypeColor(event.type)}>
                                {event.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                              {event.time} - {event.endTime}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {event.location}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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

export default Schedule;
