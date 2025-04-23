import { useState, useEffect } from "react";
import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Lock, Trash2, Save, Edit, Bell, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { tasks, events, profile } from "@/lib/api";
import { toast } from "sonner";

const DEFAULT_REMINDER_DAYS = 2;

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast: uiToast } = useToast();

  // User info
  const [userData, setUserData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    department: user?.department || "",
    office: "",
    joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  });

  // Editable fields for profile info
  const [editProfile, setEditProfile] = useState(userData);
  const [editMode, setEditMode] = useState(false);

  // Reminder days setting
  const [reminderDays, setReminderDays] = useState(DEFAULT_REMINDER_DAYS);

  // Dialog states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteProfile, setShowDeleteProfile] = useState(false);

  // For Change Password modal
  const [changePw, setChangePw] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isPwSubmitting, setIsPwSubmitting] = useState(false);

  // For Delete Profile modal
  const [isDeleting, setIsDeleting] = useState(false);

  // Statistics and activity data
  const [stats, setStats] = useState({
    totalEvents: 0,
    completedTasks: 0,
    upcomingTasks: 0,
    upcomingEvents: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch tasks
        const userTasks = await tasks.getAll();
        const completedTasks = userTasks.filter(task => task.status === 'completed');
        const upcomingTasks = userTasks.filter(task => task.status !== 'completed');

        // Fetch events
        const userEvents = await events.getAll();
        const upcomingEvents = userEvents.filter(event => new Date(event.startDate) > new Date());

        // Update stats
        setStats({
          totalEvents: userEvents.length,
          completedTasks: completedTasks.length,
          upcomingTasks: upcomingTasks.length,
          upcomingEvents: upcomingEvents.length,
        });

        // Combine and sort recent activity
        const activities = [
          ...userTasks.map(task => ({
            id: task._id,
            action: task.status === 'completed' ? 'Completed task' : 'Created task',
            item: task.title,
            timestamp: new Date(task.createdAt).toLocaleDateString(),
          })),
          ...userEvents.map(event => ({
            id: event._id,
            action: 'Created event',
            item: event.title,
            timestamp: new Date(event.createdAt).toLocaleDateString(),
          })),
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
         .slice(0, 5);

        setRecentActivity(activities);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      }
    };

    fetchUserData();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Handlers for profile edit and save
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    try {
      const updatedUser = await profile.update(editProfile);
      setUserData(updatedUser);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };

  // Email reminder lead time change
  const handleReminderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReminderDays(parseInt(e.target.value));
    toast.success(`Email reminders will now be sent ${e.target.value} day(s) prior`);
  };

  // Change password modal handlers
  const handleChangePwInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePw((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changePw.oldPassword || !changePw.newPassword || !changePw.confirmNewPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (changePw.newPassword !== changePw.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsPwSubmitting(true);
    try {
      await profile.changePassword({
        oldPassword: changePw.oldPassword,
        newPassword: changePw.newPassword
      });
      setShowChangePassword(false);
      setChangePw({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error("Failed to change password");
      console.error("Password change error:", error);
    } finally {
      setIsPwSubmitting(false);
    }
  };

  // Delete profile modal handler
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await profile.delete();
      logout();
      toast.success("Profile deleted successfully");
    } catch (error) {
      toast.error("Failed to delete profile");
      console.error("Profile deletion error:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary flex items-center gap-2">
              <User size={24} className="text-primary" /> My Profile
            </h1>
            <p className="text-gray-500">
              View and manage your profile information, reminders, and account security.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Avatar and options */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-3">
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials(userData.name)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1">{userData.name}</h2>
                <p className="text-gray-500 mb-3">{userData.department}</p>
                <div className="text-sm text-gray-500 space-y-1 mb-5 text-left mx-auto w-fit">
                  <p>📧 {userData.email}</p>
                  <p>🏢 {userData.office}</p>
                  <p>📅 Joined {userData.joinDate}</p>
                </div>
                {/* Reminder Settings */}
                <div className="mb-5">
                  <Label htmlFor="reminderDays" className="mb-1 flex items-center gap-1">
                    <Bell size={16} className="text-accent" />
                    Email reminders
                  </Label>
                  <div className="flex items-center gap-2 mt-1 justify-center">
                    <select
                      id="reminderDays"
                      value={reminderDays}
                      onChange={handleReminderChange}
                      className="border rounded px-2 py-1 text-sm bg-white focus:ring-2 focus:ring-primary"
                    >
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <option value={day} key={day}>
                          {day} day{day > 1 ? "s" : ""} prior
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Set when you want to receive email reminders before events/tasks.
                  </div>
                </div>
                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 justify-center"
                    onClick={() => setShowChangePassword(true)}
                  >
                    <Lock size={16} />
                    Change Password
                  </Button>
                  <Button
                    onClick={() => setShowDeleteProfile(true)}
                    className="w-full flex items-center gap-2 justify-center"
                    variant="destructive"
                  >
                    <Trash2 size={16} />
                    Delete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Center/Right: Profile Edit and Activity */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Edit size={20} className="text-primary" /> Profile Information
                  </CardTitle>
                  {!editMode ? (
                    <Button variant="outline" onClick={() => setEditMode(true)} size="sm">
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                  ) : null}
                </CardHeader>
                <CardContent>
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleProfileSave();
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={editProfile.name}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={editProfile.email}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={editProfile.department}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="office">Office Location</Label>
                      <Input
                        id="office"
                        name="office"
                        value={editProfile.office}
                        onChange={handleProfileChange}
                        disabled={!editMode}
                      />
                    </div>
                    {editMode && (
                      <div className="md:col-span-2 flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditProfile(userData);
                            setEditMode(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-primary">
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-gray-500">Total Events</h3>
                      <p className="text-2xl font-bold">{stats.totalEvents}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-gray-500">Completed Tasks</h3>
                      <p className="text-2xl font-bold">{stats.completedTasks}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-gray-500">Upcoming Tasks</h3>
                      <p className="text-2xl font-bold">{stats.upcomingTasks}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
                      <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                    </div>
                  </div>

                  <h3 className="font-medium mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.item}</p>
                        </div>
                        <span className="text-sm text-gray-400">{activity.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitChangePassword}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={changePw.oldPassword}
                  onChange={handleChangePwInput}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={changePw.newPassword}
                  onChange={handleChangePwInput}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  type="password"
                  value={changePw.confirmNewPassword}
                  onChange={handleChangePwInput}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowChangePassword(false)}
                disabled={isPwSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPwSubmitting}>
                {isPwSubmitting ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Profile Dialog */}
      <Dialog open={showDeleteProfile} onOpenChange={setShowDeleteProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 mb-4">
            Are you sure you want to delete your profile? This action cannot be undone and will permanently
            delete all your data.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteProfile(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;

