"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DollarSign, Info } from "lucide-react"
import { calculatePlatformFee, calculateTotalAmount, PLATFORM_FEE_PERCENTAGE } from "@/lib/payment-types"

interface PaymentSummaryProps {
  jobAmount: number
  tip?: number
  showPlatformFee?: boolean
  className?: string
}

export function PaymentSummary({ jobAmount, tip = 0, showPlatformFee = true, className }: PaymentSummaryProps) {
  const platformFee = calculatePlatformFee(jobAmount)
  const subtotal = jobAmount + tip
  const totalAmount = showPlatformFee ? calculateTotalAmount(jobAmount) + tip : subtotal

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="w-5 h-5" />
          Payment Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Job Amount</span>
          <span className="font-medium">R{jobAmount.toFixed(2)}</span>
        </div>

        {tip > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm">Tip</span>
            <span className="font-medium text-primary">R{tip.toFixed(2)}</span>
          </div>
        )}

        {showPlatformFee && (
          <>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-sm">Platform Fee ({PLATFORM_FEE_PERCENTAGE}%)</span>
                <Info className="w-3 h-3 text-muted-foreground" />
              </div>
              <span className="font-medium">R{platformFee.toFixed(2)}</span>
            </div>
            <Separator />
          </>
        )}

        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Total Amount</span>
          <span className="text-primary">R{totalAmount.toFixed(2)}</span>
        </div>

        {showPlatformFee && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Platform Fee Breakdown:</p>
                <p>• Worker receives: R{jobAmount.toFixed(2)}</p>
                <p>• Platform fee: R{platformFee.toFixed(2)}</p>
                {tip > 0 && <p>• Tip (100% to worker): R{tip.toFixed(2)}</p>}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
