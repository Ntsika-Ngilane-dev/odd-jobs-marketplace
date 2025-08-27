"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Phone, Mail, Edit, Save, X, Plus } from "lucide-react"
import type { User as UserType } from "@/lib/local-db"

function WorkerProfileContent() {
  const [isEditing, setIsEditing] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : null
    }
    return null
  })

  // Extended profile data (would come from database in real app)
  const [profileData, setProfileData] = useState({
    bio: "Experienced cleaner and handyman with 5+ years in residential and commercial properties. Reliable, punctual, and detail-oriented.",
    hourlyRate: 120,
    availability: "available" as "available" | "busy" | "offline",
    location: "Sandton, Johannesburg",
    categories: ["cleaning", "handyman"],
    skills: ["Deep cleaning", "Plumbing", "Electrical work", "Painting"],
    experience: "5+ years",
    languages: ["English", "Afrikaans"],
    rating: 4.8,
    completedJobs: 45,
    responseTime: "Within 2 hours",
    verified: true,
  })

  const [editData, setEditData] = useState(profileData)
  const [newSkill, setNewSkill] = useState("")

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)
    console.log("[v0] Profile updated:", editData)
    alert("Profile updated successfully!")
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && !editData.skills.includes(newSkill.trim())) {
      setEditData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const addCategory = (category: string) => {
    if (!editData.categories.includes(category)) {
      setEditData((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }))
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setEditData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
    }))
  }

  const availableCategories = [
    "cleaning",
    "handyman",
    "gardening",
    "painting",
    "plumbing",
    "electrical",
    "moving",
    "packing",
  ]

  return (
    <DashboardLayout
      userRole="worker"
      userName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Worker"}
      notifications={2}
    >
      <div className="space-y-6 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">My Profile</h2>
            <p className="text-muted-foreground">Manage your professional profile and settings</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {currentUser?.firstName?.[0]}
                    {currentUser?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {currentUser?.firstName} {currentUser?.lastName}
                </h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{profileData.rating}</span>
                  <span className="text-muted-foreground">({profileData.completedJobs} jobs)</span>
                </div>
                <Badge
                  className={
                    profileData.availability === "available"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                  variant="secondary"
                >
                  {profileData.availability}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed Jobs</span>
                  <span className="font-medium">{profileData.completedJobs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-medium">{profileData.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">{profileData.responseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hourly Rate</span>
                  <span className="font-medium">R{profileData.hourlyRate}/hr</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{currentUser?.email}</span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{currentUser?.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editData.location}
                      onChange={(e) => setEditData((prev) => ({ ...prev, location: e.target.value }))}
                      className="mt-1"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{profileData.location}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editData.bio}
                      onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{profileData.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate (ZAR)</Label>
                    {isEditing ? (
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={editData.hourlyRate}
                        onChange={(e) =>
                          setEditData((prev) => ({ ...prev, hourlyRate: Number.parseInt(e.target.value) || 0 }))
                        }
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">R{profileData.hourlyRate}/hour</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    {isEditing ? (
                      <Select
                        value={editData.availability}
                        onValueChange={(value: any) => setEditData((prev) => ({ ...prev, availability: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm font-medium mt-1 capitalize">{profileData.availability}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Service Categories</Label>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(isEditing ? editData.categories : profileData.categories).map((category) => (
                        <Badge key={category} variant="outline" className="capitalize">
                          {category}
                          {isEditing && (
                            <button
                              onClick={() => removeCategory(category)}
                              className="ml-1 text-red-500 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex flex-wrap gap-1">
                        {availableCategories
                          .filter((cat) => !editData.categories.includes(cat))
                          .map((category) => (
                            <Button
                              key={category}
                              size="sm"
                              variant="ghost"
                              onClick={() => addCategory(category)}
                              className="text-xs capitalize"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              {category}
                            </Button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Skills</Label>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(isEditing ? editData.skills : profileData.skills).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                          {isEditing && (
                            <button onClick={() => removeSkill(skill)} className="ml-1 text-red-500 hover:text-red-700">
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a skill..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addSkill()}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={addSkill}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function WorkerProfile() {
  return (
    <AuthGuard requiredRole="worker">
      <WorkerProfileContent />
    </AuthGuard>
  )
}
