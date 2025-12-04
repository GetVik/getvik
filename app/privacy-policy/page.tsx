import React from "react";
import { generatePrivacyMetadata } from "@/lib/metadata";

export const metadata = generatePrivacyMetadata();

const EFFECTIVE_DATE = "19 November 2025";

export default function PrivacyPolicyPage() {
  return (
    <section
      aria-labelledby="privacy-heading"
      className="bg-gray-50 text-black py-12 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">
          
          {/* Main */}
          <main className="min-w-0">
            <header className="mb-8 sm:mb-12">
              <h1
                id="privacy-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#2b281f]"
              >
                Privacy Policy
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Effective date:{" "}
                <time dateTime="2025-11-19">{EFFECTIVE_DATE}</time>
              </p>
            </header>

            {/* Policy Content */}
            <article
              className="prose prose-lg prose-slate max-w-none bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-sm border border-gray-100
              prose-a:font-medium prose-a:text-blue-600 hover:prose-a:underline
              prose-li:mb-2 prose-p:leading-relaxed prose-h3:mt-6 prose-h3:mb-2"
            >
              <p>
                At <strong>GetVik</strong>, we respect your privacy and are 
                committed to protecting your personal information. This policy 
                explains what data we collect, how we use it, and the rights 
                available to you.
              </p>

              <h3 id="scope">1. Scope & Applicability</h3>
              <p>
                This Privacy Policy applies to all users of the GetVik 
                marketplace, including buyers, creators, and visitors accessing 
                our website or related services.
              </p>

              <h3 id="definitions">2. Key Definitions</h3>
              <ul>
                <li>
                  <strong>Personal Information:</strong> Name, email, phone, 
                  payment identifiers, PAN (for creators), and payout details.
                </li>
                <li>
                  <strong>Usage Data:</strong> IP address, device details, 
                  browser type, and activity logs.
                </li>
                <li>
                  <strong>Sensitive Personal Data:</strong> PAN, bank/UPI 
                  information (only for verified creators).
                </li>
              </ul>

              <h3 id="collection">3. Information We Collect</h3>
              <p>We collect information necessary to operate and secure the platform:</p>
              <ul>
                <li><strong>Account:</strong> Name, email, password.</li>
                <li>
                  <strong>Creator Verification:</strong> PAN, payout details 
                  (bank/UPI).
                </li>
                <li>
                  <strong>Transactions:</strong> Payment reference IDs, order 
                  details, timestamps. We do <em>not</em> store full card details.
                </li>
                <li>
                  <strong>Usage Data:</strong> Logs, analytics, IP addresses, 
                  device/browser info.
                </li>
                <li>
                  <strong>Support:</strong> Messages, emails, reports, feedback.
                </li>
              </ul>

              <h3 id="use">4. How We Use Your Information</h3>
              <ul>
                <li>To operate and improve the GetVik platform.</li>
                <li>To process purchases and deliver digital products.</li>
                <li>To send payouts to creators securely.</li>
                <li>To prevent fraud, abuse, and security threats.</li>
                <li>To send emails: receipts, alerts, account updates.</li>
                <li>To provide customer support.</li>
              </ul>

              <h3 id="sharing">5. Data Sharing</h3>
              <p>We never sell personal data. We only share it with:</p>
              <ul>
                <li>
                  <strong>Payment processors</strong> for payments and payouts.
                </li>
                <li>
                  <strong>Hosting & cloud infrastructure</strong> partners.
                </li>
                <li>
                  <strong>Email and analytics tools</strong> to operate the service.
                </li>
                <li>
                  <strong>Authorities</strong> when required by applicable law.
                </li>
              </ul>

              <h3 id="cookies">6. Cookies</h3>
              <p>
                We use cookies for login sessions, preferences, and basic 
                analytics. Disabling essential cookies may affect website 
                functionality.
              </p>

              <h3 id="retention">7. Data Retention</h3>
              <p>We retain information only as long as necessary:</p>
              <ul>
                <li>Account data: kept until you delete your account.</li>
                <li>Transaction records: retained as required for accounting.</li>
                <li>Logs & diagnostics: retained for security and reliability.</li>
              </ul>

              <h3 id="security">8. Security</h3>
              <p>
                We use encryption, secure storage practices, access controls, 
                and monitoring to protect your data. No system is perfect—report 
                any concerns to our support team.
              </p>

              <h3 id="children">9. Children’s Privacy</h3>
              <p>
                GetVik is not intended for individuals under the age of 18. We 
                do not knowingly collect data from minors.
              </p>

              <h3 id="rights">10. Your Rights</h3>
              <p>You may request to:</p>
              <ul>
                <li>Access your personal data.</li>
                <li>Correct inaccurate information.</li>
                <li>Request deletion of your data (where legally allowed).</li>
                <li>Export your account information.</li>
              </ul>

              <h3 id="grievance">11. Contact</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 not-prose">
                <p className="text-sm font-semibold text-[#2b281f]">Contact</p>
                <p className="text-sm text-gray-600">GetVik</p>
                <p className="text-sm text-gray-600">Meerut, Uttar Pradesh</p>
                <p className="text-sm text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:contact.getvik@gmail.com"
                    className="text-blue-600 hover:underline"
                  >
                    contact.getvik@gmail.com
                  </a>
                </p>
                <p className="text-sm text-gray-600">Phone: +91 </p>
              </div>

              <h3 id="updates">12. Changes to This Policy</h3>
              <p>
                We may update this policy from time to time. Significant changes 
                will be posted with an updated effective date.
              </p>

              <footer className="mt-6 text-sm text-gray-600">
                <p>
                  Last updated:{" "}
                  <time dateTime="2025-11-19">{EFFECTIVE_DATE}</time>.
                </p>
              </footer>
            </article>
          </main>

          {/* Sticky TOC */}
          <aside className="hidden lg:block sticky top-20 self-start">
            <nav
              aria-label="Quick links"
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"
            >
              <p className="text-xs font-semibold text-gray-500 mb-3">
                On this page
              </p>
              <ul className="space-y-2 text-sm">
                <li><a className="hover:text-blue-600" href="#scope">1. Scope</a></li>
                <li><a className="hover:text-blue-600" href="#definitions">2. Definitions</a></li>
                <li><a className="hover:text-blue-600" href="#collection">3. What we collect</a></li>
                <li><a className="hover:text-blue-600" href="#use">4. How we use it</a></li>
                <li><a className="hover:text-blue-600" href="#sharing">5. Sharing</a></li>
                <li><a className="hover:text-blue-600" href="#retention">7. Retention</a></li>
                <li><a className="hover:text-blue-600" href="#grievance">11. Contact</a></li>
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </section>
  );
}
