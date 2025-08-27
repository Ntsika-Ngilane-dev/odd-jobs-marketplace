"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PaymentHistory } from "@/components/payment-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Clock, Wallet, Download, Calendar } from "lucide-react"
import type { Payment, Payout } from "@/lib/payment-types"

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
]

const mockPayouts: Payout[] = [
  {
    id: "payout_1",
    workerId: "worker1",
    amount: 450,
    currency: "ZAR",
    status: "completed",
    paymentIds: ["pay_1", "pay_2"],
    bankAccount: {
      bankName: "FNB",
      accountNumber: "••••5678",
      accountHolder: "Sarah Johnson",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
  },
]

export default function WorkerEarningsPage() {
  const [payments] = useState<Payment[]>(mockPayments)
  const [payouts] = useState<Payout[]>(mockPayouts)

  const stats = {
    totalEarnings: payments.reduce((sum, p) => sum + p.amount, 0),
    thisMonth: payments
      .filter((p) => p.createdAt.getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + p.amount, 0),
    pendingPayout: payments
      .filter((p) => p.status === "completed" && !payouts.some((payout) => payout.paymentIds.includes(p.id)))
      .reduce((sum, p) => sum + p.amount, 0),
    completedJobs: payments.filter((p) => p.type === "job_payment").length,
    totalTips: payments.filter((p) => p.type === "tip").reduce((sum, p) => sum + p.amount, 0),
  }

  return (
    <DashboardLayout userRole="worker" userName="Sarah Johnson" notifications={2}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Earnings</h2>
            <p className="text-muted-foreground">Track your income and payout history</p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R{stats.totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{stats.thisMonth.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Current month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">R{stats.pendingPayout.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Available for payout</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tips Received</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">R{stats.totalTips.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From {stats.completedJobs} jobs</p>
            </CardContent>
          </Card>
        </div>

        {/* Payout Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Next Payout</CardTitle>
            <CardDescription>Payouts are processed weekly on Fridays</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Available for payout</span>
              <span className="text-lg font-bold text-green-600">R{stats.pendingPayout.toFixed(2)}</span>
            </div>
            <Progress value={75} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Next payout: Friday, Dec 15</span>
              <span>Minimum: R100</span>
            </div>
            {stats.pendingPayout >= 100 && (
              <Button className="w-full">
                <Wallet className="w-4 h-4 mr-2" />
                Request Early Payout
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Recent Payouts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
            <CardDescription>Your payout history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">Payout #{payout.id.slice(-6)}</p>
                        <Badge className="bg-green-100 text-green-800">{payout.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {payout.completedAt?.toLocaleDateString()}
                        </span>
                        <span>
                          {payout.bankAccount.bankName} {payout.bankAccount.accountNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+R{payout.amount.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{payout.paymentIds.length} payments</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <PaymentHistory payments={payments} userRole="worker" />
      </div>
    </DashboardLayout>
  )
}
