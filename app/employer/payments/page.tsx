"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PaymentHistory } from "@/components/payment-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, Settings, AlertCircle, TrendingUp, DollarSign } from "lucide-react"
import type { Payment, PaymentMethod } from "@/lib/payment-types"

// Mock data
const mockPayments: Payment[] = [
  {
    id: "pay_1",
    jobId: "job_1",
    employerId: "emp1",
    workerId: "worker1",
    type: "job_payment",
    amount: 400,
    platformFee: 60,
    totalAmount: 460,
    currency: "ZAR",
    status: "completed",
    paymentMethod: "card",
    paymentProvider: "stripe",
    transactionId: "txn_123456",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "pay_2",
    jobId: "job_1",
    employerId: "emp1",
    workerId: "worker1",
    type: "tip",
    amount: 50,
    platformFee: 0,
    totalAmount: 50,
    currency: "ZAR",
    status: "completed",
    paymentMethod: "card",
    paymentProvider: "stripe",
    transactionId: "txn_123457",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "pay_3",
    jobId: "job_2",
    employerId: "emp1",
    workerId: "worker2",
    type: "job_payment",
    amount: 300,
    platformFee: 45,
    totalAmount: 345,
    currency: "ZAR",
    status: "processing",
    paymentMethod: "card",
    paymentProvider: "stripe",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
]

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    userId: "emp1",
    type: "card",
    provider: "stripe",
    last4: "1234",
    brand: "visa",
    isDefault: true,
    createdAt: new Date(),
  },
  {
    id: "pm_2",
    userId: "emp1",
    type: "bank_account",
    provider: "stripe",
    last4: "5678",
    bankName: "FNB",
    isDefault: false,
    createdAt: new Date(),
  },
]

export default function EmployerPaymentsPage() {
  const [payments] = useState<Payment[]>(mockPayments)
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)

  const stats = {
    totalSpent: payments.reduce((sum, p) => sum + p.totalAmount, 0),
    totalFees: payments.reduce((sum, p) => sum + p.platformFee, 0),
    pendingPayments: payments.filter((p) => p.status === "pending" || p.status === "processing").length,
    completedPayments: payments.filter((p) => p.status === "completed").length,
  }

  return (
    <DashboardLayout userRole="employer" userName="John Smith" notifications={3}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Payments</h2>
            <p className="text-muted-foreground">Manage your payment methods and transaction history</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Including platform fees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.totalFees.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">15% service fee</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">Processing payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedPayments}</div>
              <p className="text-xs text-muted-foreground">Successful payments</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment methods</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {method.type === "card"
                            ? `•••• •••• •••• ${method.last4}`
                            : `${method.bankName} •••• ${method.last4}`}
                        </p>
                        {method.isDefault && <Badge variant="secondary">Default</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.type === "card" ? `${method.brand?.toUpperCase()} card` : "Bank account"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <PaymentHistory payments={payments} userRole="employer" />
      </div>
    </DashboardLayout>
  )
}
