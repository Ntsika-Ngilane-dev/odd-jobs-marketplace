export type JobStatus = "posted" | "assigned" | "in-progress" | "completed" | "cancelled"

export type JobCategory =
  | "cleaning"
  | "handyman"
  | "packing"
  | "gardening"
  | "moving"
  | "painting"
  | "plumbing"
  | "electrical"
  | "carpentry"
  | "delivery"
  | "pet-care"
  | "childcare"
  | "elderly-care"
  | "tutoring"
  | "cooking"
  | "laundry"
  | "shopping"
  | "event-help"
  | "tech-support"
  | "other"

export interface Job {
  id: string
  title: string
  description: string
  category: JobCategory
  location: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  budget: {
    min: number
    max: number
    currency: "ZAR"
  }
  duration: {
    estimated: number // in hours
    flexible: boolean
  }
  requirements: string[]
  status: JobStatus
  employerId: string
  workerId?: string
  createdAt: Date
  updatedAt: Date
  scheduledFor?: Date
  completedAt?: Date
  rating?: {
    employer: number
    worker: number
  }
  images?: string[]
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "employer" | "worker" | "admin"
  profilePhoto?: string
  verified: boolean
  rating: number
  completedJobs: number
  createdAt: Date
  bankName?: string
  accountNumber?: string
  accountHolder?: string
  reviews?: Array<{
    id: string
    rating: number
    comment: string
    jobId: string
    reviewerId: string
    createdAt: Date
  }>
}

export interface JobCompletion {
  id: string
  jobId: string
  workerId: string
  employerId: string
  completedAt: Date
  workerNotes?: string
  employerNotes?: string
  photos?: string[]
  rating?: {
    employer: number
    worker: number
  }
  status: "pending-review" | "approved" | "disputed"
  workerConfirmed?: boolean
  employerConfirmed?: boolean
}

export const JOB_CATEGORIES: Record<JobCategory, { label: string; icon: string; description: string }> = {
  cleaning: { label: "Cleaning", icon: "🧹", description: "House cleaning, office cleaning, deep cleaning" },
  handyman: { label: "Handyman", icon: "🔧", description: "General repairs, maintenance, installations" },
  packing: { label: "Packing", icon: "📦", description: "Moving assistance, packing services" },
  gardening: { label: "Gardening", icon: "🌱", description: "Lawn care, plant maintenance, landscaping" },
  moving: { label: "Moving", icon: "🚚", description: "Furniture moving, relocation assistance" },
  painting: { label: "Painting", icon: "🎨", description: "Interior/exterior painting, touch-ups" },
  plumbing: { label: "Plumbing", icon: "🚿", description: "Pipe repairs, installations, maintenance" },
  electrical: { label: "Electrical", icon: "⚡", description: "Wiring, installations, electrical repairs" },
  carpentry: { label: "Carpentry", icon: "🪚", description: "Wood work, furniture assembly, repairs" },
  delivery: { label: "Delivery", icon: "📦", description: "Package delivery, courier services" },
  "pet-care": { label: "Pet Care", icon: "🐕", description: "Dog walking, pet sitting, grooming" },
  childcare: { label: "Childcare", icon: "👶", description: "Babysitting, child supervision" },
  "elderly-care": { label: "Elderly Care", icon: "👴", description: "Companion care, assistance" },
  tutoring: { label: "Tutoring", icon: "📚", description: "Academic support, lessons" },
  cooking: { label: "Cooking", icon: "👨‍🍳", description: "Meal preparation, catering" },
  laundry: { label: "Laundry", icon: "👕", description: "Washing, ironing, dry cleaning" },
  shopping: { label: "Shopping", icon: "🛒", description: "Grocery shopping, errands" },
  "event-help": { label: "Event Help", icon: "🎉", description: "Party setup, event assistance" },
  "tech-support": { label: "Tech Support", icon: "💻", description: "Computer help, tech setup" },
  other: { label: "Other", icon: "⭐", description: "Custom jobs and services" },
}
