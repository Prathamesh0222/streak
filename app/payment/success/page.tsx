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

export default function PaymentSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

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
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Processing Payment...
            </h2>
            <p className="text-gray-600 text-center">
              Please wait while we confirm your payment
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Invalid Payment Session
            </h2>
            <p className="text-gray-600 text-center mb-6">
              No payment session found
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-red-500 hover:bg-red-600"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {isSuccess ? (
            <>
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="text-lg font-semibold text-gray-800">
                  Welcome to Streak Pro!
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                Your subscription is now active. Enjoy unlimited habits,
                increased AI limits, and more!
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/settings")}
                  className="w-full"
                >
                  View Subscription Details
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                There was an issue processing your payment. Please try again or
                contact support.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/settings")}
                  className="w-full"
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
