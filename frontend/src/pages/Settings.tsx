
import { useState } from "react";
import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "Dr. John Smith",
    email: "john.smith@university.edu",
    department: "Computer Science",
    office: "Room 305, Engineering Building"
  });
  
  const [emailSettings, setEmailSettings] = useState({
    enableReminders: true,
    reminderDays: 2,
    includeTaskReminders: true,
    includeEventReminders: true,
    dailySummary: false
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEmailSettingsChange = (key: string, value: boolean | number) => {
    setEmailSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSaveProfile = async () => {
    setLoading(true);
    
    try {
      // This would connect to your backend to save the profile
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile information was successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: "An error occurred while saving your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveEmailSettings = async () => {
    setLoading(true);
    
    try {
      // This would connect to your backend to save the email settings
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Email settings updated",
        description: "Your email notification preferences were successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Failed to update settings",
        description: "An error occurred while saving your email settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary">Settings</h1>
            <p className="text-gray-500">
              Manage your account settings and email preferences.
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="email">Email Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={profile.department}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="office">Office Location</Label>
                    <Input
                      id="office"
                      name="office"
                      value={profile.office}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleSaveProfile} 
                      className="bg-primary hover:bg-primary/90"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Configure how and when you receive email reminders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-secondary">Enable Email Reminders</p>
                        <p className="text-sm text-gray-500">
                          Receive email notifications for upcoming events and tasks
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.enableReminders}
                        onCheckedChange={(checked) => 
                          handleEmailSettingsChange("enableReminders", checked)
                        }
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminderDays">Reminder Days in Advance</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="reminderDays"
                          type="number"
                          min={1}
                          max={7}
                          value={emailSettings.reminderDays}
                          onChange={(e) => 
                            handleEmailSettingsChange("reminderDays", parseInt(e.target.value))
                          }
                          disabled={!emailSettings.enableReminders}
                          className="w-20"
                        />
                        <span className="text-gray-500">days before</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-secondary">Task Reminders</p>
                          <p className="text-sm text-gray-500">
                            Receive reminders for upcoming task due dates
                          </p>
                        </div>
                        <Switch
                          checked={emailSettings.includeTaskReminders}
                          onCheckedChange={(checked) => 
                            handleEmailSettingsChange("includeTaskReminders", checked)
                          }
                          disabled={!emailSettings.enableReminders}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-secondary">Event Reminders</p>
                          <p className="text-sm text-gray-500">
                            Receive reminders for scheduled events and meetings
                          </p>
                        </div>
                        <Switch
                          checked={emailSettings.includeEventReminders}
                          onCheckedChange={(checked) => 
                            handleEmailSettingsChange("includeEventReminders", checked)
                          }
                          disabled={!emailSettings.enableReminders}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-secondary">Daily Summary</p>
                          <p className="text-sm text-gray-500">
                            Receive a daily email with all upcoming events and tasks
                          </p>
                        </div>
                        <Switch
                          checked={emailSettings.dailySummary}
                          onCheckedChange={(checked) => 
                            handleEmailSettingsChange("dailySummary", checked)
                          }
                          disabled={!emailSettings.enableReminders}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleSaveEmailSettings} 
                        className="bg-primary hover:bg-primary/90"
                        disabled={loading || !emailSettings.enableReminders}
                      >
                        {loading ? "Saving..." : "Save Preferences"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
