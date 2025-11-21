import React, { useContext, useState } from "react";
import { Moon, Sun, X, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeProviderContext } from "@/components/ui/theme-provider";

export function Settings() {
  const [name, setName] = useState("");
  const [prename, setPrename] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [jobPreferences, setJobPreferences] = useState([
    "Developer",
    "Designer",
  ]);
  const [newJob, setNewJob] = useState("");
  const { theme, setTheme } = useContext(ThemeProviderContext);

  const addJobPreference = () => {
    if (newJob.trim() && !jobPreferences.includes(newJob.trim())) {
      setJobPreferences([...jobPreferences, newJob.trim()]);
      setNewJob("");
    }
  };

  const removeJobPreference = (job: string) => {
    setJobPreferences(jobPreferences.filter((j) => j !== job));
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prename">First Name</Label>
                  <Input
                    id="prename"
                    value={prename}
                    onChange={(e) => setPrename(e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Last Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Preferences */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
              <CardDescription>
                Add or remove your job interests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newJob}
                  onChange={(e) => setNewJob(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addJobPreference()}
                  placeholder="Type job name and press Enter"
                  className="flex-1"
                />
                <Button onClick={addJobPreference} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {jobPreferences.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No job preferences added yet
                  </p>
                ) : (
                  jobPreferences.map((job) => (
                    <Badge
                      key={job}
                      variant="secondary"
                      className="text-sm py-1.5 px-3 flex items-center gap-2"
                    >
                      {job}
                      <button
                        onClick={() => removeJobPreference(job)}
                        className="hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} size="lg" className="px-8">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
