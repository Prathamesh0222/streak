import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b w-full">
        <Header />
      </div>
      <div className="flex-1">
        <div className="max-w-7xl mx-auto md:border-x min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 text-red-600">
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to Streak. We are committed to protecting your
                  personal information and your right to privacy. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard
                  your information when you use our habit tracking application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Information We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information that you provide directly to us when
                  you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Create an account</li>
                  <li>Use our habit tracking features</li>
                  <li>Subscribe to our services</li>
                  <li>Contact us for support</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  This may include your name, email address, password, habit
                  data, and payment information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide and maintain our services</li>
                  <li>Process your transactions and subscriptions</li>
                  <li>Send you updates and notifications</li>
                  <li>Improve our application and user experience</li>
                  <li>Provide customer support</li>
                  <li>Detect and prevent fraud or abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Data Storage and Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate security measures to protect your
                  personal information. Your data is stored securely and we use
                  encryption for sensitive information. However, no method of
                  transmission over the internet is 100% secure, and we cannot
                  guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Third-Party Services
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may use third-party services for payment processing,
                  analytics, and authentication. These services have their own
                  privacy policies and we encourage you to review them. We do
                  not share your personal information with third parties except
                  as necessary to provide our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Your Data Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Cookies and Tracking
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to track
                  activity on our service and hold certain information. You can
                  instruct your browser to refuse all cookies or to indicate
                  when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Children&apos;s Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our service is not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If you become aware that a child has
                  provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update our Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &quot;Last updated&quot; date.
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
