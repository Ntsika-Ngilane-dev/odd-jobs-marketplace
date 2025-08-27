"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  Download, 
  Filter,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import type { Payment, PaymentMethod, Payout } from "@/lib/payment-types"

interface PaymentManagementProps {
  payments: Payment[]
  paymentMethods: PaymentMethod[]
  payouts: Payout[]
  onAddPaymentMethod: (method: Omit<PaymentMethod, "id" | "createdAt">) => void
  onDeletePaymentMethod: (methodId: string) => void
  onSetDefaultPaymentMethod: (methodId: string) => void
  onRequestPayout: (amount: number, bankAccount: any) => void
  userRole: "employer" | "worker"
}

export function PaymentManagement({
  payments,
  paymentMethods,
  payouts,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  onSetDefaultPaymentMethod,
  onRequestPayout,
  userRole,
}: PaymentManagementProps) {
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false)
  const [isRequestingPayout, setIsRequestingPayout] = useState(false)
  const [paymentFilter, setPaymentFilter] = useState<"all" | "completed" | "pending" | "failed">("all")
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: "card" as "card" | "bank_account",
    provider: "stripe" as "stripe" | "paystack" | "flutterwave",
    last4: "",
    brand: "",
    bankName: "",
    isDefault: false,
  })
  const [payoutRequest, setPayoutRequest] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  })

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "processing":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredPayments = payments.filter(payment => {
    if (paymentFilter === "all") return true
    return payment.status === paymentFilter
  })

  const totalEarnings = payments
    .filter(p => p.status === "completed" && userRole === "worker")
    .reduce((sum, p) => sum + p.amount, 0)

  const totalSpent = payments
    .filter(p => p.status === "completed" && userRole === "employer")
    .reduce((sum, p) => sum + p.totalAmount, 0)

  const handleAddPaymentMethod = () => {
    onAddPaymentMethod({
      userId: "current-user", // This would come from auth context
      ...newPaymentMethod,
    })
    setNewPaymentMethod({
      type: "card",
      provider: "stripe",
      last4: "",
      brand: "",
      bankName: "",
      isDefault: false,
    })
    setIsAddingPaymentMethod(false)
  }

  const handleRequestPayout = () => {
    onRequestPayout(parseFloat(payoutRequest.amount), {
      bankName: payoutRequest.bankName,
      accountNumber: payoutRequest.accountNumber,
      accountHolder: payoutRequest.accountHolder,
    })
    setPayoutRequest({
      amount: "",
      bankName: "",
      accountNumber: "",
      accountHolder: "",
    })
    setIsRequestingPayout(false)
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {userRole === "worker" ? "Total Earnings" : "Total Spent"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R{(userRole === "worker" ? totalEarnings : totalSpent).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentMethods.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payouts.filter(p => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          {userRole === "worker" && <TabsTrigger value="payouts">Payouts</TabsTrigger>}
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transaction History</h3>
            <div className="flex items-center gap-2">
              <Select value={paymentFilter} onValueChange={(value: any) => setPaymentFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredPayments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPaymentStatusIcon(payment.status)}
                        <div>
                          <p className="font-medium">
                            {payment.type === "job_payment" ? "Job Payment" : 
                             payment.type === "tip" ? "Tip" : "Refund"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(payment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          R{payment.amount.toLocaleString()}
                        </p>
                        <Badge className={getPaymentStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <Dialog open={isAddingPaymentMethod} onOpenChange={setIsAddingPaymentMethod}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={newPaymentMethod.type} onValueChange={(value: any) => 
                      setNewPaymentMethod(prev => ({ ...prev, type: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank_account">Bank Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newPaymentMethod.type === "card" ? (
                    <>
                      <div>
                        <Label htmlFor="last4">Last 4 Digits</Label>
                        <Input
                          id="last4"
                          value={newPaymentMethod.last4}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, last4: e.target.value }))}
                          placeholder="1234"
                          maxLength={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="brand">Card Brand</Label>
                        <Input
                          id="brand"
                          value={newPaymentMethod.brand}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, brand: e.target.value }))}
                          placeholder="Visa, Mastercard, etc."
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={newPaymentMethod.bankName}
                        onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, bankName: e.target.value }))}
                        placeholder="Standard Bank, FNB, etc."
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={newPaymentMethod.isDefault}
                      onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, isDefault: e.target.checked }))}
                    />
                    <Label htmlFor="isDefault">Set as default</Label>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingPaymentMethod(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPaymentMethod}>Add Method</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {method.type === "card" 
                            ? `${method.brand} •••• ${method.last4}`
                            : `${method.bankName} •••• ${method.last4}`
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Added {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(method.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSetDefaultPaymentMethod(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeletePaymentMethod(method.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {userRole === "worker" && (
          <TabsContent value="payouts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Payout History</h3>
              <Dialog open={isRequestingPayout} onOpenChange={setIsRequestingPayout}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Request Payout
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Payout</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Amount (ZAR)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={payoutRequest.amount}
                        onChange={(e) => setPayoutRequest(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={payoutRequest.bankName}
                        onChange={(e) => setPayoutRequest(prev => ({ ...prev, bankName: e.target.value }))}
                        placeholder="Standard Bank"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={payoutRequest.accountNumber}
                        onChange={(e) => setPayoutRequest(prev => ({ ...prev, accountNumber: e.target.value }))}
                        placeholder="123456789"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountHolder">Account Holder</Label>
                      <Input
                        id="accountHolder"
                        value={payoutRequest.accountHolder}
                        onChange={(e) => setPayoutRequest(prev => ({ ...prev, accountHolder: e.target.value }))}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsRequestingPayout(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleRequestPayout}>Request Payout</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              {payouts.map((payout) => (
                <Card key={payout.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getPaymentStatusIcon(payout.status)}
                        <div>
                          <p className="font-medium">Payout to {payout.bankAccount.bankName}</p>
                          <p className="text-sm text-muted-foreground">
                            {payout.bankAccount.accountHolder} • •••• {payout.bankAccount.accountNumber.slice(-4)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }).format(payout.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R{payout.amount.toLocaleString()}</p>
                        <Badge className={getPaymentStatusColor(payout.status)}>
                          {payout.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
