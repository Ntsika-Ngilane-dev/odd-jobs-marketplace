"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  Download,
  Search,
  CreditCard,
  TrendingUp,
  Calendar,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import type { Payment } from "@/lib/payment-types"

interface PaymentHistoryProps {
  payments: Payment[]
  userRole: "employer" | "worker" | "admin"
  showFilters?: boolean
}

export function PaymentHistory({ payments, userRole, showFilters = true }: PaymentHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.jobId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesType = typeFilter === "all" || payment.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string, userRole: string) => {
    if (type === "tip") return <TrendingUp className="w-4 h-4 text-green-600" />
    if (userRole === "employer") return <ArrowUpRight className="w-4 h-4 text-red-600" />
    return <ArrowDownRight className="w-4 h-4 text-green-600" />
  }

  const formatAmount = (payment: Payment, userRole: string) => {
    const isOutgoing = userRole === "employer"
    const amount = userRole === "employer" ? payment.totalAmount : payment.amount
    const sign = isOutgoing ? "-" : "+"
    return `${sign}R${amount.toFixed(2)}`
  }

  const totalAmount = filteredPayments.reduce((sum, payment) => {
    return userRole === "employer" ? sum - payment.totalAmount : sum + payment.amount
  }, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment History
            </CardTitle>
            <CardDescription>
              {userRole === "employer" ? "Your payment transactions" : "Your earnings and payments"}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Total {userRole === "employer" ? "Spent" : "Earned"}</p>
            <p className={`text-lg font-bold ${totalAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
              R{Math.abs(totalAmount).toFixed(2)}
            </p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-lg font-bold">R{(totalAmount * 0.3).toFixed(2)}</p>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-lg font-bold">{filteredPayments.length}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by job ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="job_payment">Job Payment</SelectItem>
                <SelectItem value="tip">Tips</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Payment List */}
        <div className="space-y-3">
          {filteredPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                  {getTypeIcon(payment.type, userRole)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Job #{payment.jobId.slice(-6)}</p>
                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {payment.createdAt.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {payment.paymentProvider}
                    </span>
                    {payment.type === "tip" && <span className="text-green-600 font-medium">Tip</span>}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-bold ${userRole === "employer" ? "text-red-600" : "text-green-600"}`}>
                  {formatAmount(payment, userRole)}
                </p>
                {userRole === "employer" && payment.platformFee > 0 && (
                  <p className="text-xs text-muted-foreground">Fee: R{payment.platformFee.toFixed(2)}</p>
                )}
                <Button variant="ghost" size="sm" className="mt-1">
                  <Receipt className="w-3 h-3 mr-1" />
                  Receipt
                </Button>
              </div>
            </div>
          ))}

          {filteredPayments.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payments found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Payments will appear here once you complete jobs"}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
