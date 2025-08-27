"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PaymentSummary } from "@/components/payment-summary"
import { CheckCircle, Star, DollarSign, CreditCard, AlertCircle } from "lucide-react"
import type { Job, JobCompletion } from "@/lib/types"

interface JobCompletionFlowProps {
  job: Job
  userRole: "employer" | "worker"
  onCompleteJob: (data: {
    rating: number
    comment: string
    tip?: number
    paymentMethodId?: string
  }) => void
  onConfirmCompletion: () => void
  completion?: JobCompletion
  isProcessing?: boolean
}

export function JobCompletionFlow({
  job,
  userRole,
  onCompleteJob,
  onConfirmCompletion,
  completion,
  isProcessing = false,
}: JobCompletionFlowProps) {
  const [step, setStep] = useState<"mark_done" | "rate_and_pay" | "confirm_payment" | "completed">(
    completion?.workerConfirmed && !completion?.employerConfirmed ? "rate_and_pay" : "mark_done",
  )
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [tip, setTip] = useState(0)
  const [paymentMethodId, setPaymentMethodId] = useState("card_1234")

  const handleMarkDone = () => {
    if (userRole === "worker") {
      onCompleteJob({ rating: 0, comment: "Job marked as done by worker" })
      setStep("rate_and_pay")
    }
  }

  const handleRateAndPay = () => {
    onCompleteJob({
      rating,
      comment,
      tip: tip > 0 ? tip : undefined,
      paymentMethodId,
    })
    setStep("confirm_payment")
  }

  const handleConfirmPayment = () => {
    onConfirmCompletion()
    setStep("completed")
  }

  if (step === "completed" || job.status === "completed") {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Job Completed!</CardTitle>
          <CardDescription>Payment has been processed successfully</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Final Payment</p>
            <p className="text-2xl font-bold text-primary">
              R{(job.budget.max + (tip || 0) + job.budget.max * 0.15).toFixed(2)}
            </p>
          </div>
          <Button onClick={() => (window.location.href = `/${userRole}/dashboard`)} className="w-full">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (step === "mark_done" && userRole === "worker") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mark Job as Done</CardTitle>
          <CardDescription>Let the employer know you&apos;ve completed the work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{job.title}</h4>
            <p className="text-sm text-muted-foreground">{job.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">
                Expected: R{job.budget.min} - R{job.budget.max}
              </Badge>
            </div>
          </div>

          <Button onClick={handleMarkDone} disabled={isProcessing} className="w-full">
            {isProcessing ? "Processing..." : "Mark Job as Done"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            The employer will be notified and can then process payment
          </p>
        </CardContent>
      </Card>
    )
  }

  if (step === "rate_and_pay" && userRole === "employer") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Rate & Pay Worker</CardTitle>
            <CardDescription>
              {completion?.workerConfirmed
                ? "The worker has marked this job as done. Please rate their work and process payment."
                : "Rate the worker's performance and process payment"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">{job.title}</h4>
              <p className="text-sm text-muted-foreground mb-2">{job.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">Worker:</span>
                <span className="font-medium">{job.workerId}</span>
              </div>
            </div>

            {/* Rating */}
            <div>
              <Label className="text-base font-medium">Rate the Worker</Label>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button key={star} variant="ghost" size="sm" onClick={() => setRating(star)} className="p-1 h-auto">
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this worker..."
                rows={3}
              />
            </div>

            {/* Tip */}
            <div>
              <Label htmlFor="tip">Add Tip (Optional)</Label>
              <div className="relative mt-2">
                <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="tip"
                  type="number"
                  min="0"
                  step="10"
                  value={tip || ""}
                  onChange={(e) => setTip(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">100% of tips go directly to the worker</p>
            </div>

            {/* Payment Method */}
            <div>
              <Label>Payment Method</Label>
              <div className="mt-2 p-3 border border-border rounded-lg flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">•••• •••• •••• 1234</p>
                  <p className="text-sm text-muted-foreground">Visa ending in 1234</p>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </div>

            <Button onClick={handleRateAndPay} disabled={isProcessing} className="w-full">
              {isProcessing ? "Processing..." : "Continue to Payment"}
            </Button>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <PaymentSummary jobAmount={job.budget.max} tip={tip} />
      </div>
    )
  }

  if (step === "confirm_payment" && userRole === "employer") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Confirm Payment</CardTitle>
            <CardDescription>Review and confirm your payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Payment Details */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Worker:</span>
                <span className="font-medium">{job.workerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Job:</span>
                <span className="font-medium">{job.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Rating Given:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{rating}/5</span>
                </div>
              </div>
              {tip > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Tip:</span>
                  <span className="font-medium text-primary">R{tip.toFixed(2)}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Secure Payment</p>
                <p className="text-blue-700">
                  Your payment is processed securely. The worker will receive their payment within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("rate_and_pay")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleConfirmPayment} disabled={isProcessing} className="flex-1">
                {isProcessing ? "Processing Payment..." : "Confirm & Pay"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <PaymentSummary jobAmount={job.budget.max} tip={tip} />
      </div>
    )
  }

  return null
}
