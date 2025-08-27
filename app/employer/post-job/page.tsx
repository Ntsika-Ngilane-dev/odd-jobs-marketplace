"use client"

import { useState } from "react"
import { JobPostForm } from "@/components/job-post-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PostJobPage() {
  const [jobPosted, setJobPosted] = useState(false)

  const handleJobSubmit = (jobData: any) => {
    // TODO: Submit job to backend
    console.log("[v0] Job posted:", jobData)
    setJobPosted(true)
  }

  const handleCancel = () => {
    window.location.href = "/employer/dashboard"
  }

  if (jobPosted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="container mx-auto max-w-md">
          <Card className="text-center animate-fade-in-up">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Job Posted Successfully!</CardTitle>
              <CardDescription>
                Your job has been posted and workers can now apply. You'll be notified when someone applies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => (window.location.href = "/employer/dashboard")} className="w-full">
                View My Jobs
              </Button>
              <Button variant="outline" onClick={() => setJobPosted(false)} className="w-full">
                Post Another Job
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <div className="mb-6 animate-fade-in-up">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="animate-slide-in-right">
          <JobPostForm onSubmit={handleJobSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}
