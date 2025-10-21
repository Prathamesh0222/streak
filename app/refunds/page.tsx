import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function RefundsAndCancellation() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b w-full">
        <Header />
      </div>
      <div className="flex-1">
        <div className="max-w-7xl mx-auto md:border-x min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Refunds & Cancellation
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We want you to be completely satisfied with Streak. This
                  Refunds and Cancellation Policy explains how you can cancel
                  your subscription and request refunds. Please read this policy
                  carefully before subscribing to our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Subscription Cancellation
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You can cancel your subscription at any time through your
                  account settings. Here&apos;s what happens when you cancel:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    Your subscription will remain active until the end of your
                    current billing period
                  </li>
                  <li>
                    You will continue to have access to all features until the
                    end of the paid period
                  </li>
                  <li>
                    No further charges will be made to your payment method
                  </li>
                  <li>You can reactivate your subscription at any time</li>
                  <li>
                    Your data will be retained for 30 days after cancellation
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">How to Cancel</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To cancel your subscription:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Log in to your Streak account</li>
                  <li>Go to Settings &gt; Subscription</li>
                  <li>Click on &quot;Cancel Subscription&quot;</li>
                  <li>Follow the prompts to complete the cancellation</li>
                  <li>You will receive a confirmation email</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We offer refunds under the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    <strong>7-Day Money-Back Guarantee:</strong> First-time
                    subscribers can request a full refund within 7 days of their
                    initial purchase
                  </li>
                  <li>
                    <strong>Technical Issues:</strong> If you experience
                    persistent technical problems that prevent you from using
                    the service
                  </li>
                  <li>
                    <strong>Duplicate Charges:</strong> If you were accidentally
                    charged multiple times for the same subscription
                  </li>
                  <li>
                    <strong>Billing Errors:</strong> If there was an error in
                    billing or pricing
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Refund Exclusions
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Refunds are not available for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    Subscriptions that have been active for more than 7 days
                  </li>
                  <li>Partial month refunds after the 7-day period</li>
                  <li>
                    Change of mind after the 7-day money-back guarantee period
                  </li>
                  <li>Failure to cancel before the next billing cycle</li>
                  <li>
                    Account suspensions due to violation of our Terms of Service
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  How to Request a Refund
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To request a refund:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Contact our support team at refunds@streak.com</li>
                  <li>
                    Include your account email and reason for the refund request
                  </li>
                  <li>Provide your order number or transaction ID</li>
                  <li>Allow up to 5-7 business days for review</li>
                  <li>
                    Approved refunds will be processed within 10 business days
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Refund Processing
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once your refund is approved, it will be processed and a
                  credit will automatically be applied to your original method
                  of payment within 10 business days. The exact time frame
                  depends on your payment provider&apos;s policies. If you
                  haven&apos;t received a refund within this time, please
                  contact your payment provider.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Pro-Rated Refunds
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not offer pro-rated refunds for partial month usage
                  after the 7-day money-back guarantee period. If you cancel
                  your subscription, you will retain access to paid features
                  until the end of your current billing period, but no refund
                  will be issued for the remaining time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Annual Subscriptions
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Annual subscriptions are eligible for a full refund within 7
                  days of purchase. After this period, annual subscriptions are
                  non-refundable. However, you can cancel at any time and your
                  subscription will remain active until the end of your annual
                  billing period.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Free Trial Cancellation
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If we offer a free trial, you can cancel at any time during
                  the trial period without being charged. If you do not cancel
                  before the trial ends, you will be automatically charged for
                  your chosen subscription plan.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Account Deletion
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you wish to permanently delete your account and all
                  associated data, you can do so through your account settings.
                  Please note that account deletion is irreversible and will
                  result in the loss of all your data. Make sure to export any
                  data you wish to keep before deleting your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify this Refunds and Cancellation
                  Policy at any time. Changes will be effective immediately upon
                  posting to the website. Your continued use of the service
                  after changes are posted constitutes acceptance of the
                  modified policy.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t w-full">
        <Footer />
      </div>
    </div>
  );
}
