import { z } from "zod"

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["employer", "worker", "admin"], {
    required_error: "Please select a role"
  })
})

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["employer", "worker"], {
    required_error: "Please select a role"
  }),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountHolder: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const passwordResetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
})

// Job validation schemas
export const jobPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum([
    "cleaning", "handyman", "packing", "gardening", "moving", "painting",
    "plumbing", "electrical", "carpentry", "delivery", "pet-care", "childcare",
    "elderly-care", "tutoring", "cooking", "laundry", "shopping", "event-help",
    "tech-support", "other"
  ]),
  location: z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  }),
  budget: z.object({
    min: z.number().min(50, "Minimum budget must be at least R50"),
    max: z.number().min(50, "Maximum budget must be at least R50"),
    currency: z.literal("ZAR")
  }).refine((data) => data.max >= data.min, {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["max"]
  }),
  duration: z.object({
    estimated: z.number().min(1, "Duration must be at least 1 hour"),
    flexible: z.boolean()
  }),
  requirements: z.array(z.string()).min(1, "At least one requirement is needed"),
  scheduledFor: z.date().optional(),
  images: z.array(z.string()).optional()
})

export const jobApplicationSchema = z.object({
  proposal: z.string().min(50, "Proposal must be at least 50 characters"),
  proposedRate: z.number().min(50, "Rate must be at least R50"),
  estimatedDuration: z.number().min(1, "Duration must be at least 1 hour"),
  availableFrom: z.date(),
  portfolio: z.array(z.string()).optional(),
  questions: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional()
})

// Payment validation schemas
export const paymentMethodSchema = z.object({
  type: z.enum(["card", "bank_account"]),
  provider: z.enum(["stripe", "paystack", "flutterwave"]),
  last4: z.string().length(4, "Last 4 digits must be exactly 4 characters"),
  brand: z.string().optional(),
  bankName: z.string().optional(),
  isDefault: z.boolean()
})

export const payoutRequestSchema = z.object({
  amount: z.number().min(100, "Minimum payout amount is R100"),
  bankAccount: z.object({
    bankName: z.string().min(2, "Bank name is required"),
    accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
    accountHolder: z.string().min(2, "Account holder name is required")
  })
})

// Profile validation schemas
export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().max(1000, "Experience must be less than 1000 characters").optional(),
  hourlyRate: z.number().min(50, "Hourly rate must be at least R50").optional(),
  availability: z.object({
    days: z.array(z.string()),
    hours: z.object({
      start: z.string(),
      end: z.string()
    })
  }).optional()
})

// Message validation schemas
export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
  type: z.enum(["text", "image", "file", "system"])
})

// Report validation schemas
export const reportSchema = z.object({
  type: z.enum(["user", "job", "payment", "content"]),
  category: z.enum(["harassment", "fraud", "inappropriate_content", "spam", "safety_concern", "other"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  evidence: z.array(z.string()).optional()
})

// Validation helper functions
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ["Validation failed"] }
  }
}

export function getFieldError(errors: z.ZodError, field: string): string | undefined {
  const error = errors.errors.find(err => err.path.join('.') === field)
  return error?.message
}
