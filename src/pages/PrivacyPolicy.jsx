import React from 'react';
import SEO from '../components/layout/SEO';
import { Shield, Lock } from 'lucide-react';
import { getBreadcrumbSchema } from '../utils/seo';

export default function PrivacyPolicy() {
  const crumbsSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://www.terranovarealestates.in/' },
    { name: 'Privacy Policy', url: 'https://www.terranovarealestates.in/privacy' }
  ]);

  return (
    <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
      <SEO 
        title="Privacy Policy"
        description="Read the Privacy Policy of TerraNova Real Estates. Understand how we protect your personal data, manage device permissions, and secure private client information."
        canonicalPath="/privacy"
        schema={crumbsSchema}
      />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Title */}
        <div className="space-y-4 mb-16 max-w-xl">
          <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Legal Statement</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-primary">Privacy Policy</h1>
          <p className="font-sans text-xs text-neutral-laurel uppercase tracking-widest">
            Last Updated: July 4, 2026
          </p>
        </div>

        {/* Decorative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Sidebar Highlights */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-primary text-bg-cream rounded-[18px] p-6 border border-accent-gold/25 shadow-luxury space-y-4">
              <Shield className="w-8 h-8 text-accent-gold stroke-1" />
              <h3 className="font-display text-xl font-bold">Client Discretion</h3>
              <p className="font-sans text-xs text-neutral-laurel leading-relaxed">
                We implement bank-level encryption standards and maintain absolute discretion regarding private property portfolios.
              </p>
            </div>
            <div className="bg-white rounded-[18px] p-6 border border-neutral-laurel/20 shadow-luxury space-y-4">
              <Lock className="w-8 h-8 text-primary stroke-1" />
              <h3 className="font-display text-xl font-bold text-primary">Secure Auth</h3>
              <p className="font-sans text-xs text-neutral-laurel leading-relaxed">
                All secure sign-in features and device permission interfaces adhere to modern web safety regulations.
              </p>
            </div>
          </div>

          {/* Main Policy Content */}
          <div className="lg:col-span-2 space-y-10 font-sans text-sm text-primary/80 leading-relaxed bg-white border border-neutral-laurel/20 rounded-[22px] p-8 md:p-12 shadow-luxury">
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">1. Overview and Commitment</h2>
              <p>
                At TerraNova Real Estates, we treat your privacy with the highest degree of respect. This Privacy Policy describes how we collect, use, and share personal information when you use our website, services, and secure broker portals. We do not sell or lease your personal information to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">2. Information Collection</h2>
              <p>
                We collect information that you voluntarily provide to us when you enquire about properties, schedule viewings, or sign up for account services. This may include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Contact details (name, email address, phone number).</li>
                <li>Enquiry records and message history.</li>
                <li>Secure credentials for portal access.</li>
              </ul>
            </section>

            {/* Device Permissions Section */}
            <section className="space-y-4 border-t border-neutral-laurel/20 pt-8">
              <h2 className="font-display text-2xl font-bold text-primary text-secondary">3. Device Permissions</h2>
              <p>
                When using our website, your web browser or operating system may display a security popup asking:
                <strong className="block my-2 text-primary bg-bg-cream border border-accent-gold/30 px-4 py-2.5 rounded-[12px] italic text-xs">
                  "www.terranovarealestates.in wants to access other apps and services on this device."
                </strong>
              </p>
              <p>
                This standard prompt is triggered by modern browser security standards (such as WebAuthn or Credential Management APIs) only when you choose to use secure, hardware-backed sign-in options, biometric passkeys, or integrated third-party identity authentication services.
              </p>
              <p>
                Please note the following regarding device permissions:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Optional Permission:</strong> Allowing this access is completely optional. You may safely deny the permission request.</li>
                <li><strong>No Impact on General Browsing:</strong> Denying this request will not affect your ability to browse our property listings, view images, or use general parts of the website.</li>
                <li><strong>Limited Feature Impact:</strong> If denied, certain advanced features like passwordless secure sign-in or direct authentication integrations may not function.</li>
                <li><strong>No Unwanted Tracking:</strong> TerraNova Real Estates does not access, read, or track any personal files, app data, or device services without your explicit consent.</li>
                <li><strong>Third-Party Authentication:</strong> When you use external authentication providers (such as Google or other identity services), they manage your verification in accordance with their own respective privacy policies.</li>
              </ul>
            </section>

            <section className="space-y-4 border-t border-neutral-laurel/20 pt-8">
              <h2 className="font-display text-2xl font-bold text-primary">4. Data Usage and Security</h2>
              <p>
                We use collected data solely to deliver real estate brokerage services, answer enquiries, and maintain secure portal operations. All user authentication details are protected by advanced cryptographic hashing and secure firewalls.
              </p>
            </section>

            <section className="space-y-4 border-t border-neutral-laurel/20 pt-8">
              <h2 className="font-display text-2xl font-bold text-primary">5. Contact Information</h2>
              <p>
                If you have questions about this policy or your data rights, please contact our legal representative at:
              </p>
              <p className="font-semibold text-primary">
                Email: terranovarealestateoffice@gmail.com<br />
                Phone: +91 8089729949
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
