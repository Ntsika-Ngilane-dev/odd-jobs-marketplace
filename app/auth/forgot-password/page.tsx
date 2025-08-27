"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { FormField } from "@/components/form-field"
import { validateData, forgotPasswordSchema } from "@/lib/validation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { requestPasswordReset } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    setLoading(true)

    try {
      // Validate form data
      const validation = validateData(forgotPasswordSchema, { email })
      if (!validation.success) {
        const errors: Record<string, string> = {}
        validation.errors.forEach(error => {
          const [field, message] = error.split(': ')
          errors[field] = message
        })
        setFieldErrors(errors)
        return
      }

      const result = await requestPasswordReset(email)
      
      if (result.success) {
        setSuccess(true)
        // In a real app, you would send an email here
        console.log("Password reset requested for:", email)
      } else {
        setError(result.error || "Failed to send reset email")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-xl">Check your email</CardTitle>
            <CardDescription>
              We&apos;ve sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => setSuccess(false)}
                className="text-primary hover:underline"
              >
                try again
              </button>
            </div>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Forgot password?</CardTitle>
          <CardDescription className="text-center">
            Enter your email and we&apos;ll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="relative">
              <FormField
                id="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={setEmail}
                error={fieldErrors.email}
                required
              />
              <Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <Link href="/auth/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
