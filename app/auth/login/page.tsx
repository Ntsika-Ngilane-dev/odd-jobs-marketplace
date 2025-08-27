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
import { validateData, loginSchema } from "@/lib/validation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    setLoading(true)

    try {
      // Validate form data
      const validation = validateData(loginSchema, formData)
      if (!validation.success) {
        const errors: Record<string, string> = {}
        validation.errors.forEach(error => {
          const [field, message] = error.split(': ')
          errors[field] = message
        })
        setFieldErrors(errors)
        return
      }

      const result = await login(formData.email, formData.password, formData.role)
      
      if (result.success) {
        // Redirect based on role
        switch (formData.role) {
          case "employer":
            router.push("/employer/dashboard")
            break
          case "worker":
            router.push("/worker/dashboard")
            break
          case "admin":
            router.push("/admin/dashboard")
            break
          default:
            router.push("/")
        }
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { value: "employer", label: "Employer - I need work done" },
    { value: "worker", label: "Worker - I want to find work" },
    { value: "admin", label: "Admin - System administrator" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your OddJobs account
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

            <div className="space-y-2">
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
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="text-center space-y-2">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Forgot your password?
              </Link>
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
