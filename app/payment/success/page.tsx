"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Loader2,
  Crown,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function PaymentSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [paymentDetails, setPaymentDetails] = useState<{
    amount?: number;
    currency?: string;
    transactionId?: string;
    planId?: string;
  }>({});

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setIsProcessing(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/payment/success?session_id=${sessionId}`
        );
        const data = await response.json();

        if (response.ok && data.success) {
          setIsSuccess(true);
          setPaymentDetails({
            amount: data.amount,
            currency: data.currency,
            transactionId: data.transactionId,
            planId: data.planId,
          });
          toast.success("Welcome to Streak Pro!");
        } else {
          toast.error(data.error || "Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Failed to verify payment");
      } finally {
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-500/20 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Processing Payment...
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we confirm your payment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background  flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-500/20 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-semibold mb-2">
              Invalid Payment Session
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              No payment session found
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-red-600 hover:bg-red-700 dark:text-white rounded-xl"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-red-500/20 shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            {isSuccess ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle
                    className="w-10 h-10 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center border-4 border-red-200 dark:border-red-900/50">
                <XCircle
                  className="w-10 h-10 text-red-600 dark:text-red-400"
                  strokeWidth={2.5}
                />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          {isSuccess ? (
            <>
              <div className="flex flex-col items-center gap-2">
                <Badge className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 px-3 py-1 text-xs font-semibold shadow-lg">
                  <Crown className="w-3.5 h-3.5 mr-1" />
                  PRO MEMBER
                </Badge>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  Welcome to Streak Pro!
                </h3>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl p-5 border border-red-200/50 dark:border-red-900/30">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Your subscription is now active. Enjoy unlimited habits,
                  increased AI limits, and exclusive pro features!
                </p>

                {paymentDetails.amount && (
                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Amount Paid:
                      </span>
                      <span className="font-semibold">
                        ₹{(paymentDetails.amount / 100).toFixed(2)}{" "}
                        {paymentDetails.currency}
                      </span>
                    </div>
                    {paymentDetails.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Transaction ID:
                        </span>
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                          {paymentDetails.transactionId.slice(-8)}
                        </span>
                      </div>
                    )}
                    {paymentDetails.planId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan:</span>
                        <span className="font-semibold capitalize">
                          {paymentDetails.planId.replace("_", " ")}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/settings")}
                  className="w-full rounded-xl border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                >
                  View Subscription Details
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-5 border border-red-200/50 dark:border-red-900/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  There was an issue processing your payment. Please try again
                  or contact support if the problem persists.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-red-600 hover:bg-red-700 dark:text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/pricing")}
                  className="w-full rounded-xl border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
                >
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
