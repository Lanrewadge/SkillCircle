'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Eye, Lock, Users } from 'lucide-react'

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: September 17, 2025</p>
        </div>

        {/* Privacy Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Data Protection</h3>
              <p className="text-xs text-gray-600">We protect your data with industry-standard security</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Transparency</h3>
              <p className="text-xs text-gray-600">Clear about what data we collect and why</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Lock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Your Control</h3>
              <p className="text-xs text-gray-600">You control your data and privacy settings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">No Selling</h3>
              <p className="text-xs text-gray-600">We never sell your personal information</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="prose max-w-none p-8">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>

                <h3 className="text-lg font-medium mb-3">Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>Account information (name, email, username, location)</li>
                  <li>Profile information (skills, bio, experience, availability)</li>
                  <li>Communication data (messages, reviews, session notes)</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                </ul>

                <h3 className="text-lg font-medium mb-3">Information We Collect Automatically</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Usage data (pages visited, features used, session duration)</li>
                  <li>Device information (browser type, operating system, IP address)</li>
                  <li>Location data (general location for matching local teachers/learners)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide and improve our skill-sharing platform</li>
                  <li>Connect learners with appropriate local teachers</li>
                  <li>Process payments and manage bookings</li>
                  <li>Send important updates and notifications</li>
                  <li>Ensure platform safety and prevent fraud</li>
                  <li>Analyze usage patterns to improve our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>

                <h3 className="text-lg font-medium mb-3">We Share Information:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>With other users as necessary for the service (teacher-learner connections)</li>
                  <li>With service providers who help us operate the platform</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In aggregated, anonymized form for analytics</li>
                </ul>

                <h3 className="text-lg font-medium mb-3">We Never:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sell your personal information to third parties</li>
                  <li>Share your private messages without consent</li>
                  <li>Use your data for purposes you haven't agreed to</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>Secure payment processing through certified partners</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct your information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Download your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to improve your experience, remember your
                  preferences, and analyze how you use our platform.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Essential cookies for platform functionality</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Preference cookies to remember your settings</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
                <p className="text-gray-700 leading-relaxed">
                  We retain your information only as long as necessary to provide our services and comply
                  with legal obligations. Account data is typically deleted within 30 days of account
                  closure, though some information may be retained longer for legal or safety purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                <p className="text-gray-700 leading-relaxed">
                  SkillCircle is not intended for children under 13. We do not knowingly collect personal
                  information from children under 13. If you believe a child has provided us with personal
                  information, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own.
                  We ensure appropriate safeguards are in place to protect your data in accordance with
                  this privacy policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this privacy policy from time to time. We will notify you of any material
                  changes and obtain consent where required by law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have questions about this privacy policy or want to exercise your rights:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4">
                  <p className="text-gray-700">
                    Email: privacy@skillcircle.com<br />
                    Address: [Company Address]<br />
                    Data Protection Officer: dpo@skillcircle.com
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