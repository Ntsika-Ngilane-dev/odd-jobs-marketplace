export interface Payment {
  id: string
  jobId: string
  employerId: string
  workerId: string
  type: "job_payment" | "tip" | "refund"
  amount: number
  platformFee: number
  totalAmount: number
  currency: "ZAR"
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  paymentMethod: "card" | "bank_transfer" | "wallet"
  paymentProvider: "stripe" | "paystack" | "flutterwave"
  transactionId?: string
  createdAt: Date
  completedAt?: Date
  failureReason?: string
}

export interface PaymentMethod {
  id: string
  userId: string
  type: "card" | "bank_account"
  provider: "stripe" | "paystack" | "flutterwave"
  last4: string
  brand?: string
  bankName?: string
  isDefault: boolean
  createdAt: Date
}

export interface Payout {
  id: string
  workerId: string
  amount: number
  currency: "ZAR"
  status: "pending" | "processing" | "completed" | "failed"
  paymentIds: string[]
  bankAccount: {
    bankName: string
    accountNumber: string
    accountHolder: string
  }
  createdAt: Date
  completedAt?: Date
  failureReason?: string
}

export interface JobCompletion {
  id: string
  jobId: string
  workerId: string
  employerId: string
  completedAt: Date
  workerConfirmed: boolean
  employerConfirmed: boolean
  paymentTriggered: boolean
  paymentId?: string
  rating?: {
    workerRating: number
    employerRating: number
    workerComment?: string
    employerComment?: string
  }
}

export const PLATFORM_FEE_PERCENTAGE = 15
export const calculatePlatformFee = (amount: number) => Math.round(amount * (PLATFORM_FEE_PERCENTAGE / 100))
export const calculateTotalAmount = (amount: number) => amount + calculatePlatformFee(amount)
