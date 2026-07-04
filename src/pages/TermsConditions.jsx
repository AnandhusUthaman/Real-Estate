import React from 'react';
import SEO from '../components/layout/SEO';
import { Scale, FileText } from 'lucide-react';
import { getBreadcrumbSchema } from '../utils/seo';

export default function TermsConditions() {
  const crumbsSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://www.terranovarealestates.in/' },
    { name: 'Terms & Conditions', url: 'https://www.terranovarealestates.in/terms' }
  ]);

  return (
    <div className="pt-32 pb-24 bg-bg-cream min-h-screen">
      <SEO 
        title="Terms & Conditions"
        description="Read the Terms and Conditions of TerraNova Real Estates. Learn about our website usage rules, device permission options, and disclaimer of liability."
        canonicalPath="/terms"
        schema={crumbsSchema}
      />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        {/* Header Title */}
        <div className="space-y-4 mb-16 max-w-xl">
          <span className="text-accent-gold font-sans font-semibold text-xs uppercase tracking-[0.2em] block">Legal Statement</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-primary">Terms &amp; Conditions</h1>
          <p className="font-sans text-xs text-neutral-laurel uppercase tracking-widest">
            Last Updated: July 4, 2026
          </p>
        </div>

        {/* Decorative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Sidebar Highlights */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-primary text-bg-cream rounded-[18px] p-6 border border-accent-gold/25 shadow-luxury space-y-4">
              <Scale className="w-8 h-8 text-accent-gold stroke-1" />
              <h3 className="font-display text-xl font-bold">Regulatory Compliance</h3>
              <p className="font-sans text-xs text-neutral-laurel leading-relaxed">
                Our operations align with regional real estate licensing rules and digital standards in Kerala.
              </p>
            </div>
            <div className="bg-white rounded-[18px] p-6 border border-neutral-laurel/20 shadow-luxury space-y-4">
              <FileText className="w-8 h-8 text-primary stroke-1" />
              <h3 className="font-display text-xl font-bold text-primary">Usage Rules</h3>
              <p className="font-sans text-xs text-neutral-laurel leading-relaxed">
                By accessing this portal, you agree to comply with standard legal codes and copyright terms.
              </p>
            </div>
          </div>

          {/* Main Terms Content */}
          <div className="lg:col-span-2 space-y-10 font-sans text-sm text-primary/80 leading-relaxed bg-white border border-neutral-laurel/20 rounded-[22px] p-8 md:p-12 shadow-luxury">
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">1. Agreement to Terms</h2>
              <p>
                Welcome to TerraNova Real Estates. By accessing or using our website, services, and online property listings, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not access or use our platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-primary">2. Use of Website</h2>
              <p>
                Our platform provides property curation, listings lookup, and concierge booking services. All content, images, and brand materials are intellectual property of TerraNova Real Estates. You agree not to copy, scrape, or distribute any site information without our express written permission.
              </p>
            </section>

            {/* Device Permissions Section */}
            <section className="space-y-4 border-t border-neutral-laurel/20 pt-8">
              <h2 className="font-display text-2xl font-bold text-primary text-secondary">3. Device Permissions</h2>
              <p>
                While navigating our portal, you may see a browser permission popup stating:
                <strong className="block my-2 text-primary bg-bg-cream border border-accent-gold/30 px-4 py-2.5 rounded-[12px] italic text-xs">
                  "www.terranovarealestates.in wants to access other apps and services on this device."
                </strong>
              </p>
              <p>
                This request is triggered by native web credentials standards when you utilize features such as passwordless secure sign-in, biometric passkeys, or external third-party identity integrations.
              </p>
              <p>
                Please understand the following terms regarding this permission request:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Optional Request:</strong> This permission request is optional. You may choose to deny it without any penalty.</li>
                <li><strong>General Browsing:</strong> Denying the request will not affect standard website browsing, property search filters, or map tools.</li>
                <li><strong>Advanced Features:</strong> If you deny the request, certain security-based features like third-party quick logins or passkeys may not function.</li>
                <li><strong>Privacy Assurance:</strong> TerraNova Real Estates does not collect or access personal files or services on your device. Any security verification details are handled locally in your browser.</li>
                <li><strong>Third-Party Providers:</strong> Identity verification managed via third-party providers (such as Google or other single sign-on tools) remains subject to their own service terms and privacy guidelines.</li>
              </ul>
            </section>

            <section className="space-y-4 border-t border-neutral-laurel/20 pt-8">
              <h2 className="font-display text-2xl font-bold text-primary">4. Limitation of Liability</h2>
              <p>
                TerraNova Real Estates provides all listings, layouts, and estate measurements in good faith as general guides. We do not guarantee absolute accuracy. In no event shall we be liable for any damages resulting from your use of this site or its information.
              </p>
            </section>

            <section className="space-y-4 border-t border-neutral-laurel/20 pt-8">
              <h2 className="font-display text-2xl font-bold text-primary">5. Contact and Enquiries</h2>
              <p>
                For legal enquiries regarding these terms, please reach out to us:
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
