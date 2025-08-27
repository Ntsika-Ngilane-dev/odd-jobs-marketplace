"use client"

import type React from "react"
import { localDB } from "@/lib/local-db"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Users, Upload, ArrowLeft } from "lucide-react"

type UserRole = "employer" | "worker"

export default function SignupPage() {
  const searchParams = useSearchParams()
  const [role, setRole] = useState<UserRole | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    // Document uploads
    idDocument: null as File | null,
    proofOfResidence: null as File | null,
    visaDocuments: null as File | null,
    profilePhoto: null as File | null,
    // Banking details
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  })

  useEffect(() => {
    const roleParam = searchParams.get("role") as UserRole
    if (roleParam === "employer" || roleParam === "worker") {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const triggerFileInput = (inputId: string) => {
    document.getElementById(inputId)?.click()
  }

  const getFileName = (field: keyof typeof formData) => {
    const file = formData[field] as File | null
    return file ? file.name : null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    // Check if user already exists
    if (localDB.findUserByEmail(formData.email)) {
      alert("An account with this email already exists!")
      return
    }

    // Create new user
    try {
      const newUser = localDB.createUser({
        email: formData.email,
        password: formData.password,
        role: role!,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountHolder: formData.accountHolder,
      })

      alert(`Account created successfully! Welcome ${newUser.firstName}!`)

      // Redirect to login
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("[v0] Signup error:", error)
      alert("Error creating account. Please try again.")
    }
  }

  if (!role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Choose Your Role</CardTitle>
              <CardDescription>Select how you want to use OddJobs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full h-16 flex items-center gap-4 bg-transparent"
                onClick={() => setRole("employer")}
              >
                <Briefcase className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">I'm an Employer</div>
                  <div className="text-sm text-muted-foreground">I want to hire workers</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full h-16 flex items-center gap-4 bg-transparent"
                onClick={() => setRole("worker")}
              >
                <Users className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">I'm a Worker</div>
                  <div className="text-sm text-muted-foreground">I want to find work</div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => (window.location.href = "/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 animate-fade-in-up">
          <Button variant="ghost" onClick={() => setRole(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {role === "employer" ? (
                <Briefcase className="w-8 h-8 text-primary" />
              ) : (
                <Users className="w-8 h-8 text-primary" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {role === "employer" ? "Employer Signup" : "Worker Signup"}
            </h1>
            <p className="text-muted-foreground">
              {role === "employer"
                ? "Create your account to start posting jobs"
                : "Create your account to start finding work"}
            </p>
          </div>
        </div>

        <Card className="animate-slide-in-right">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Please provide your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Document Uploads */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Required Documents</h3>

                <div>
                  <Label htmlFor="idDocument">{role === "worker" ? "ID or Passport *" : "ID Document *"}</Label>
                  <div
                    className="mt-2 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => triggerFileInput("idDocument")}
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {getFileName("idDocument") || "Click to upload or drag and drop"}
                    </p>
                    {getFileName("idDocument") && (
                      <p className="text-xs text-primary mt-1">✓ {getFileName("idDocument")}</p>
                    )}
                    <Input
                      id="idDocument"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload("idDocument", e.target.files?.[0] || null)}
                    />
                  </div>
                </div>

                {role === "employer" && (
                  <div>
                    <Label htmlFor="proofOfResidence">Proof of Residence *</Label>
                    <div
                      className="mt-2 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => triggerFileInput("proofOfResidence")}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {getFileName("proofOfResidence") || "Click to upload or drag and drop"}
                      </p>
                      {getFileName("proofOfResidence") && (
                        <p className="text-xs text-primary mt-1">✓ {getFileName("proofOfResidence")}</p>
                      )}
                      <Input
                        id="proofOfResidence"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileUpload("proofOfResidence", e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                )}

                {role === "worker" && (
                  <div>
                    <Label htmlFor="visaDocuments">Visa Documents (if not South African)</Label>
                    <div
                      className="mt-2 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => triggerFileInput("visaDocuments")}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {getFileName("visaDocuments") || "Click to upload or drag and drop"}
                      </p>
                      {getFileName("visaDocuments") && (
                        <p className="text-xs text-primary mt-1">✓ {getFileName("visaDocuments")}</p>
                      )}
                      <Input
                        id="visaDocuments"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileUpload("visaDocuments", e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="profilePhoto">Profile Photo *</Label>
                  <div
                    className="mt-2 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => triggerFileInput("profilePhoto")}
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {getFileName("profilePhoto") || "Click to upload or drag and drop"}
                    </p>
                    {getFileName("profilePhoto") && (
                      <p className="text-xs text-primary mt-1">✓ {getFileName("profilePhoto")}</p>
                    )}
                    <Input
                      id="profilePhoto"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => handleFileUpload("profilePhoto", e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              {/* Banking Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Banking Details</h3>
                <p className="text-sm text-muted-foreground">Required for secure payments and payouts</p>

                <div>
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, bankName: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="absa">ABSA</SelectItem>
                      <SelectItem value="fnb">FNB</SelectItem>
                      <SelectItem value="nedbank">Nedbank</SelectItem>
                      <SelectItem value="standard-bank">Standard Bank</SelectItem>
                      <SelectItem value="capitec">Capitec</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="accountHolder">Account Holder Name *</Label>
                  <Input
                    id="accountHolder"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData((prev) => ({ ...prev, accountHolder: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
                />
                <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the Terms & Conditions, including cashless transactions, 15% service fee for employers,
                  secure data storage, and platform-based work arrangements.
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={!formData.agreeToTerms}>
                Create Account
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/auth/login" className="text-primary hover:underline">
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
