"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Shield, ArrowRight, CheckCircle, Star } from "lucide-react"

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (showIntro) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">OddJobs</h1>
          <p className="text-muted-foreground text-lg">Connect. Work. Earn.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">OddJobs</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => (window.location.href = "/auth/login")}>
              Sign In
            </Button>
            <Button onClick={() => (window.location.href = "/auth/signup")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl animate-fade-in-up">
          <Badge variant="secondary" className="mb-6">
            Professional Marketplace
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Connect with skilled workers for any job
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From cleaning and handyman services to packing and gardening - find trusted professionals or offer your
            skills on our secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => (window.location.href = "/auth/signup?role=employer")}
            >
              Hire Workers
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent"
              onClick={() => (window.location.href = "/auth/signup?role=worker")}
            >
              Find Work
              <Users className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose OddJobs?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Secure, efficient, and designed for both employers and workers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="animate-slide-in-right">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  All transactions are processed securely through the app with automatic payouts
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Verified Profiles</CardTitle>
                <CardDescription>
                  All users are verified with ID documents and background checks for safety
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="animate-slide-in-right" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Rating System</CardTitle>
                <CardDescription>Build your reputation with our comprehensive rating and review system</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Choose Your Path</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card
              className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => (window.location.href = "/auth/signup?role=employer")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">For Employers</CardTitle>
                <CardDescription className="text-lg">Post jobs and find skilled workers</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Post jobs in multiple categories
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Browse verified worker profiles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Secure in-app payments
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Track job progress
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="p-8 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => (window.location.href = "/auth/signup?role=worker")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">For Workers</CardTitle>
                <CardDescription className="text-lg">Find jobs and build your reputation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Browse available jobs nearby
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Set your own rates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Get paid instantly
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Build your profile
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">OddJobs</span>
          </div>
          <p className="text-muted-foreground mb-4">Connecting employers with skilled workers across South Africa</p>
          <p className="text-sm text-muted-foreground">© 2024 OddJobs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
