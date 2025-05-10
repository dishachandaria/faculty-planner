import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: any) => void;
  onDelete?: (eventId: string) => void;
  initialData?: any;
}

const EventForm = ({ open, onClose, onSave, onDelete, initialData }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    endTime: "",
    description: "",
    location: "",
    type: "meeting",
    reminders: true,
    recurring: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        date: initialData.date || new Date().toISOString().split("T")[0],
        time: initialData.time || "",
        endTime: initialData.endTime || "",
        description: initialData.description || "",
        location: initialData.location || "",
        type: initialData.type || "meeting",
        reminders: initialData.reminders !== false,
        recurring: initialData.recurring || false,
      });
    } else {
      setFormData({
        title: "",
        date: new Date().toISOString().split("T")[0],
        time: "",
        endTime: "",
        description: "",
        location: "",
        type: "meeting",
        reminders: true,
        recurring: false,
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: initialData?.id || Date.now().toString(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            Fill in the details for your {initialData ? "event" : "new event"}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event title"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="office-hours">Office Hours</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Event location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Event details..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="reminders"
              checked={formData.reminders}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, reminders: checked }))
              }
            />
            <Label htmlFor="reminders">Send notification (2 days before)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, recurring: checked }))
              }
            />
            <Label htmlFor="recurring">Repeat weekly</Label>
          </div>
          
          <DialogFooter className="flex justify-between items-center">
            {initialData && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => {
                  if (onDelete) {
                    onDelete(initialData.id);
                    onClose();
                  }
                }}
                className="mr-auto"
              >
                Delete Event
              </Button>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary">
                {initialData ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
