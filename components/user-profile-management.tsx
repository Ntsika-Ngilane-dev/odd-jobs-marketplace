"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Camera, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Briefcase,
  Award,
  Shield,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from "lucide-react"
import type { User as UserType, JobCategory } from "@/lib/types"

interface UserProfile extends UserType {
  bio?: string
  skills?: string[]
  experience?: string
  hourlyRate?: number
  availability?: {
    days: string[]
    hours: { start: string; end: string }
  }
  portfolio?: {
    id: string
    title: string
    description: string
    images: string[]
    category: JobCategory
  }[]
  reviews?: {
    id: string
    rating: number
    comment: string
    reviewerName: string
    jobTitle: string
    date: Date
  }[]
  certifications?: {
    id: string
    name: string
    issuer: string
    date: Date
    verified: boolean
  }[]
}

interface UserProfileManagementProps {
  user: UserProfile
  onUpdateProfile: (updates: Partial<UserProfile>) => void
  onUploadPhoto: (file: File) => void
  isEditing?: boolean
}

export function UserProfileManagement({
  user,
  onUpdateProfile,
  onUploadPhoto,
  isEditing = false,
}: UserProfileManagementProps) {
  const [editMode, setEditMode] = useState(isEditing)
  const [editedUser, setEditedUser] = useState<UserProfile>(user)
  const [newSkill, setNewSkill] = useState("")
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    date: "",
  })
  const [isAddingCertification, setIsAddingCertification] = useState(false)

  const handleSave = () => {
    onUpdateProfile(editedUser)
    setEditMode(false)
  }

  const handleCancel = () => {
    setEditedUser(user)
    setEditMode(false)
  }

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setEditedUser(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditedUser(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }))
  }

  const handleAddCertification = () => {
    if (newCertification.name && newCertification.issuer) {
      setEditedUser(prev => ({
        ...prev,
        certifications: [...(prev.certifications || []), {
          id: Date.now().toString(),
          ...newCertification,
          date: new Date(newCertification.date),
          verified: false,
        }]
      }))
      setNewCertification({ name: "", issuer: "", date: "" })
      setIsAddingCertification(false)
    }
  }

  const getProfileCompleteness = () => {
    const fields = [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.profilePhoto,
      user.bio,
      user.skills?.length,
      user.experience,
    ]
    const completedFields = fields.filter(field => field && field !== "").length
    return Math.round((completedFields / fields.length) * 100)
  }

  const averageRating = user.reviews?.reduce((sum, review) => sum + review.rating, 0) / (user.reviews?.length || 1) || 0

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profilePhoto} />
                <AvatarFallback className="text-2xl">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {editMode && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onUploadPhoto(e.target.files[0])}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {editMode ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={editedUser.firstName}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="First Name"
                          className="w-32"
                        />
                        <Input
                          value={editedUser.lastName}
                          onChange={(e) => setEditedUser(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Last Name"
                          className="w-32"
                        />
                      </div>
                    </div>
                  ) : (
                    <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                  )}
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{averageRating.toFixed(1)} ({user.reviews?.length || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{user.completedJobs} jobs completed</span>
                    </div>
                    {user.verified && (
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editMode ? (
                    <>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditMode(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile Completeness */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completeness</span>
                  <span className="text-sm text-muted-foreground">{getProfileCompleteness()}%</span>
                </div>
                <Progress value={getProfileCompleteness()} className="h-2" />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {editMode ? (
                    <Input
                      value={editedUser.email}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Email"
                      className="h-8"
                    />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {editMode ? (
                    <Input
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone"
                      className="h-8"
                    />
                  ) : (
                    <span>{user.phone}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {editMode ? (
                <Textarea
                  value={editedUser.bio || ""}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself, your experience, and what makes you unique..."
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">
                  {user.bio || "No bio provided yet."}
                </p>
              )}
            </CardContent>
          </Card>

          {user.role === "worker" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <Textarea
                      value={editedUser.experience || ""}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="Describe your relevant work experience..."
                      rows={3}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      {user.experience || "No experience provided yet."}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hourly Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <div className="flex items-center gap-2">
                      <span>R</span>
                      <Input
                        type="number"
                        value={editedUser.hourlyRate || ""}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) }))}
                        placeholder="0"
                        className="w-24"
                      />
                      <span>/hour</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold">
                      R{user.hourlyRate || 0}/hour
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skills & Expertise</CardTitle>
                {editMode && (
                  <div className="flex items-center gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="w-32"
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <Button size="sm" onClick={handleAddSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(editMode ? editedUser.skills : user.skills)?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    {editMode && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                )) || <p className="text-muted-foreground">No skills added yet.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {user.reviews?.map((review) => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating ? "text-yellow-400 fill-current" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">{review.reviewerName}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.jobTitle}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(review.date)}
                        </span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  )) || <p className="text-muted-foreground">No reviews yet.</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Portfolio</CardTitle>
                {editMode && (
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.portfolio?.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                        {project.images[0] && (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h4 className="font-medium mb-1">{project.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                      <Badge variant="outline">{project.category}</Badge>
                    </CardContent>
                  </Card>
                )) || <p className="text-muted-foreground">No portfolio items yet.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Certifications</CardTitle>
                {editMode && (
                  <Dialog open={isAddingCertification} onOpenChange={setIsAddingCertification}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Certification
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Certification</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="certName">Certification Name</Label>
                          <Input
                            id="certName"
                            value={newCertification.name}
                            onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., First Aid Certificate"
                          />
                        </div>
                        <div>
                          <Label htmlFor="issuer">Issuing Organization</Label>
                          <Input
                            id="issuer"
                            value={newCertification.issuer}
                            onChange={(e) => setNewCertification(prev => ({ ...prev, issuer: e.target.value }))}
                            placeholder="e.g., Red Cross"
                          />
                        </div>
                        <div>
                          <Label htmlFor="certDate">Date Obtained</Label>
                          <Input
                            id="certDate"
                            type="date"
                            value={newCertification.date}
                            onChange={(e) => setNewCertification(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsAddingCertification(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddCertification}>Add</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(editMode ? editedUser.certifications : user.certifications)?.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Award className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer} • {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                          }).format(cert.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {cert.verified ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                      {editMode && (
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                )) || <p className="text-muted-foreground">No certifications added yet.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
