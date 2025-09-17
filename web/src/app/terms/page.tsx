'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: September 17, 2025</p>
        </div>

        <Card>
          <CardContent className="prose max-w-none p-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using SkillCircle, you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not
                  use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-gray-700 leading-relaxed">
                  SkillCircle is a platform that connects learners with local teachers for skill-sharing
                  and educational purposes. We provide tools for scheduling, communication, and payment
                  processing, but we do not directly provide educational services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">For All Users:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Provide accurate and truthful information</li>
                    <li>Maintain the confidentiality of your account</li>
                    <li>Respect other users and maintain appropriate conduct</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>

                  <h3 className="text-lg font-medium mt-6">For Teachers:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Provide accurate information about your skills and qualifications</li>
                    <li>Deliver sessions as scheduled and described</li>
                    <li>Maintain professional conduct during all interactions</li>
                    <li>Ensure a safe learning environment</li>
                  </ul>

                  <h3 className="text-lg font-medium mt-6">For Learners:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Attend scheduled sessions or provide reasonable notice of cancellation</li>
                    <li>Pay for services as agreed upon</li>
                    <li>Respect teachers' time and expertise</li>
                    <li>Provide honest feedback and reviews</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Payment and Fees</h2>
                <p className="text-gray-700 leading-relaxed">
                  SkillCircle charges a service fee for facilitating connections and processing payments.
                  Payment terms are clearly displayed before booking. Refunds are subject to our refund
                  policy and must be requested within the specified timeframe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Privacy and Data Protection</h2>
                <p className="text-gray-700 leading-relaxed">
                  We are committed to protecting your privacy. Please review our Privacy Policy to
                  understand how we collect, use, and protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Prohibited Activities</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Harassment, discrimination, or inappropriate behavior</li>
                  <li>Sharing false or misleading information</li>
                  <li>Attempting to circumvent our payment system</li>
                  <li>Using the platform for illegal activities</li>
                  <li>Spamming or sending unsolicited communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Account Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to terminate or suspend accounts that violate these terms of
                  service. Users may also delete their accounts at any time through their account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  SkillCircle provides a platform for connecting users but is not responsible for the
                  quality of educational services, disputes between users, or any damages that may occur
                  during sessions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update these terms from time to time. Users will be notified of significant
                  changes, and continued use of the platform constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <p className="text-gray-700">
                    Email: legal@skillcircle.com<br />
                    Address: [Company Address]<br />
                    Phone: [Company Phone]
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button asChild>
            <Link href="/auth">Get Started with SkillCircle</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}