"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload } from "lucide-react"
import type { JobCategory } from "@/lib/types"
import { JOB_CATEGORIES } from "@/lib/types"
import { LocationPicker } from "@/components/location-picker"

interface JobPostFormProps {
  onSubmit: (jobData: any) => void
  onCancel: () => void
}

export function JobPostForm({ onSubmit, onCancel }: JobPostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as JobCategory | "",
    location: "",
    locationCoords: null as { lat: number; lng: number } | null,
    budgetMin: "",
    budgetMax: "",
    estimatedHours: "",
    flexibleTiming: false,
    requirements: [] as string[],
    scheduledDate: "",
    images: [] as File[],
  })

  const [newRequirement, setNewRequirement] = useState("")

  const handleLocationSelect = (location: { address: string; lat: number; lng: number }) => {
    setFormData((prev) => ({
      ...prev,
      location: location.address,
      locationCoords: { lat: location.lat, lng: location.lng },
    }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)],
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const triggerImageUpload = () => {
    document.getElementById("images")?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Job post form submitted:", formData)
    onSubmit(formData)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Post a New Job</CardTitle>
        <CardDescription>Fill in the details to find the right worker for your job</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., House cleaning needed"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value: JobCategory) => setFormData((prev) => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(JOB_CATEGORIES).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what needs to be done, any specific requirements, and what you expect..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Location */}
          <LocationPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={
              formData.location && formData.locationCoords
                ? { address: formData.location, ...formData.locationCoords }
                : undefined
            }
          />

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budgetMin">Minimum Budget (ZAR) *</Label>
              <Input
                id="budgetMin"
                type="number"
                value={formData.budgetMin}
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetMin: e.target.value }))}
                placeholder="100"
                required
              />
            </div>
            <div>
              <Label htmlFor="budgetMax">Maximum Budget (ZAR) *</Label>
              <Input
                id="budgetMax"
                type="number"
                value={formData.budgetMax}
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetMax: e.target.value }))}
                placeholder="500"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="estimatedHours">Estimated Duration (hours) *</Label>
            <Input
              id="estimatedHours"
              type="number"
              step="0.5"
              value={formData.estimatedHours}
              onChange={(e) => setFormData((prev) => ({ ...prev, estimatedHours: e.target.value }))}
              placeholder="2"
              required
            />
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="flexible"
                checked={formData.flexibleTiming}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, flexibleTiming: checked as boolean }))}
              />
              <Label htmlFor="flexible" className="text-sm">
                Flexible timing
              </Label>
            </div>
          </div>

          {/* Scheduled Date */}
          <div>
            <Label htmlFor="scheduledDate">Preferred Date (optional)</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
            />
          </div>

          {/* Requirements */}
          <div>
            <Label>Requirements & Skills</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a requirement..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" variant="outline" onClick={addRequirement}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.requirements.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {req}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeRequirement(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <Label>Job Images (optional)</Label>
            <div
              className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={triggerImageUpload}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Upload images to help workers understand the job</p>
              <p className="text-xs text-muted-foreground">Click here or drag and drop images</p>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="images"
              />
            </div>
            {formData.images.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground mb-2">{formData.images.length} image(s) selected:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((image, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {image.name.length > 20 ? `${image.name.substring(0, 20)}...` : image.name}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeImage(index)
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Post Job
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
