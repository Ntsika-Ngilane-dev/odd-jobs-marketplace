"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { FormField, SelectField } from "@/components/form-field"
import { validateData, registerSchema } from "@/lib/validation"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
    bankName: "",
    accountNumber: "",
    accountHolder: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    setLoading(true)

    try {
      // Validate form data
      const validation = validateData(registerSchema, formData)
      if (!validation.success) {
        const errors: Record<string, string> = {}
        validation.errors.forEach(error => {
          const [field, message] = error.split(': ')
          errors[field] = message
        })
        setFieldErrors(errors)
        return
      }

      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role as "employer" | "worker",
        bankName: formData.bankName || undefined,
        accountNumber: formData.accountNumber || undefined,
        accountHolder: formData.accountHolder || undefined
      })
      
      if (result.success) {
        // Redirect based on role
        switch (formData.role) {
          case "employer":
            router.push("/employer/dashboard")
            break
          case "worker":
            router.push("/worker/dashboard")
            break
          default:
            router.push("/")
        }
      } else {
        setError(result.error || "Registration failed")
      }
    } catch (error) {
      setError("An error occurred during registration. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { value: "employer", label: "Employer - I need work done" },
    { value: "worker", label: "Worker - I want to find work" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Join OddJobs and start connecting with opportunities
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="firstName"
                label="First Name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(value) => setFormData(prev => ({ ...prev, firstName: value }))}
                error={fieldErrors.firstName}
                required
              />

              <FormField
                id="lastName"
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(value) => setFormData(prev => ({ ...prev, lastName: value }))}
                error={fieldErrors.lastName}
                required
              />
            </div>

            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              error={fieldErrors.email}
              required
            />

            <FormField
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
              error={fieldErrors.phone}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FormField
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                  error={fieldErrors.password}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-8 h-10 px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              <div className="relative">
                <FormField
                  id="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
                  error={fieldErrors.confirmPassword}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-8 h-10 px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <SelectField
              label="I am a"
              placeholder="Select your role"
              value={formData.role}
              onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
              options={roleOptions}
              error={fieldErrors.role}
              required
            />

            {formData.role === "worker" && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium">Payment Information (Optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Add your bank details to receive payments faster
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    id="bankName"
                    label="Bank Name"
                    placeholder="e.g. Standard Bank"
                    value={formData.bankName}
                    onChange={(value) => setFormData(prev => ({ ...prev, bankName: value }))}
                    error={fieldErrors.bankName}
                  />

                  <FormField
                    id="accountHolder"
                    label="Account Holder Name"
                    placeholder="Full name on account"
                    value={formData.accountHolder}
                    onChange={(value) => setFormData(prev => ({ ...prev, accountHolder: value }))}
                    error={fieldErrors.accountHolder}
                  />
                </div>

                <FormField
                  id="accountNumber"
                  label="Account Number"
                  placeholder="Enter your account number"
                  value={formData.accountNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, accountNumber: value }))}
                  error={fieldErrors.accountNumber}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
