import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function TermsAndConditions() {
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
                Terms & Conditions
              </h1>
              <p className="text-sm text-muted-foreground mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-8 text-foreground">
              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Agreement to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using Streak, you agree to be bound by these
                  Terms and Conditions. If you disagree with any part of these
                  terms, you may not access the service. These terms apply to
                  all visitors, users, and others who access or use the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Use License</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Permission is granted to use Streak for personal,
                  non-commercial habit tracking purposes. This license shall
                  automatically terminate if you violate any of these
                  restrictions. Under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to reverse engineer any software</li>
                  <li>Remove any copyright or proprietary notations</li>
                  <li>Transfer the materials to another person</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you create an account with us, you must provide accurate,
                  complete, and current information. You are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    Maintaining the confidentiality of your account and password
                  </li>
                  <li>Restricting access to your computer and account</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Subscriptions and Payments
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Some parts of the service are billed on a subscription basis.
                  You will be billed in advance on a recurring basis. Billing
                  cycles are set on a monthly or annual basis, depending on the
                  subscription plan you select. At the end of each billing
                  cycle, your subscription will automatically renew unless you
                  cancel it or we cancel it.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may not use Streak:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>
                    In any way that violates any applicable law or regulation
                  </li>
                  <li>
                    To transmit or procure the sending of any advertising or
                    promotional material
                  </li>
                  <li>
                    To impersonate or attempt to impersonate the company or
                    another user
                  </li>
                  <li>
                    To engage in any conduct that restricts or inhibits
                    anyone&apos;s use of the service
                  </li>
                  <li>
                    To use any robot, spider, or other automatic device to
                    access the service
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Content Ownership
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You retain all rights to your personal data and habit
                  information that you input into Streak. We do not claim
                  ownership of your content. However, by using our service, you
                  grant us the right to use your content solely for the purpose
                  of providing and improving our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The service and its original content, features, and
                  functionality are owned by Streak and are protected by
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason, including if you
                  breach these Terms. Upon termination, your right to use the
                  service will immediately cease. All provisions of the Terms
                  which by their nature should survive termination shall
                  survive.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall Streak, nor its directors, employees,
                  partners, agents, suppliers, or affiliates, be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages, including without limitation, loss of profits, data,
                  use, goodwill, or other intangible losses, resulting from your
                  access to or use of or inability to access or use the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your use of the service is at your sole risk. The service is
                  provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
                  basis. We make no warranties, expressed or implied, and hereby
                  disclaim all warranties including, without limitation, implied
                  warranties of merchantability, fitness for a particular
                  purpose, and non-infringement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">
                  Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify or replace these Terms at any
                  time. If a revision is material, we will try to provide at
                  least 30 days notice prior to any new terms taking effect.
                  What constitutes a material change will be determined at our
                  sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed and construed in accordance with
                  the laws of your jurisdiction, without regard to its conflict
                  of law provisions.
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
