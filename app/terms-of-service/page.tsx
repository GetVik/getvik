import React from "react";
import { generateTermsMetadata } from "@/lib/metadata";

export const metadata = generateTermsMetadata();

const EFFECTIVE_DATE = "19 November 2025";

export default function TermsOfServicePage() {
  return (
    <section
      aria-labelledby="tos-heading"
      className="bg-gray-50 text-black py-12 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 items-start">
          {/* Main */}
          <main className="min-w-0">
            <header className="mb-8 sm:mb-12">
              <h1
                id="tos-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#2b281f]"
              >
                Terms of Service
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Effective date:{" "}
                <time dateTime="2025-11-19">{EFFECTIVE_DATE}</time>
              </p>
            </header>

            <article
              className="prose prose-lg prose-slate max-w-none bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-sm border border-gray-100
                         prose-a:font-medium prose-a:text-blue-600 hover:prose-a:underline
                         prose-li:mb-2 prose-p:leading-relaxed prose-h3:mt-6 prose-h3:mb-2"
            >
              <p>
                These Terms of Service (<strong>&quot;Terms&quot;</strong>)
                govern your use of the <strong>GetVik</strong> digital
                marketplace. By accessing or using the platform, you agree to be
                bound by these Terms. If you do not agree, you should not use
                GetVik.
              </p>

              <h3 id="acceptance">1. Acceptance</h3>
              <p>
                By creating an account, accessing, or using GetVik, you confirm
                that:
              </p>
              <ul>
                <li>You are at least 18 years old.</li>
                <li>
                  You are capable of entering into a binding agreement under
                  applicable law.
                </li>
                <li>
                  You agree to these Terms and our{" "}
                  <a href="/privacy">Privacy Policy</a>.
                </li>
              </ul>

              <h3 id="accounts">2. Accounts &amp; Registration</h3>
              <p>
                To use certain features (such as buying or selling products),
                you must create an account and provide accurate information.
                You are responsible for:
              </p>
              <ul>
                <li>Keeping your login details secure.</li>
                <li>All activity that occurs under your account.</li>
                <li>
                  Informing us promptly at{" "}
                  <a href="mailto:contact.getvik@gmail.com">
                    contact.getvik@gmail.com
                  </a>{" "}
                  if you suspect unauthorized access.
                </li>
              </ul>
              <p>
                Creators may be asked to provide additional information, such as
                PAN and payout details (bank or UPI), to receive earnings.
              </p>

              <h3 id="listings">3. Listings &amp; Content</h3>
              <p>
                GetVik allows creators to list and sell digital products (for
                example, files, assets, templates, or courses). As a creator:
              </p>
              <ul>
                <li>
                  You are responsible for the accuracy of your product
                  descriptions, pricing, and any claims you make.
                </li>
                <li>
                  You must own or have the necessary rights to all content you
                  upload and sell.
                </li>
                <li>
                  You must not list or distribute content that is pirated,
                  infringing, deceptive, illegal, or harmful.
                </li>
              </ul>
              <p>
                We may remove or restrict any listing or content that, in our
                reasonable opinion, violates these Terms, the law, or someone
                else&apos;s rights, or creates risk for users or GetVik.
              </p>

              <h3 id="payments-fees">4. Payments &amp; Fees</h3>
              <p>
                Payments on GetVik are processed through third-party payment
                gateways and payout providers. We do not store full card
                details.
              </p>
              <ul>
                <li>
                  Buyers pay the price shown for a digital product via supported
                  payment methods.
                </li>
                <li>
                  Creators receive payouts (e.g. to bank/UPI) after applicable
                  platform fees, payment processing fees, refunds, or holds.
                </li>
                <li>
                  Platform fees and any applicable charges are disclosed in the
                  creator dashboard or during onboarding.
                </li>
              </ul>
              <p>
                Any taxes on your income or sales (for example, GST if you are
                registered, or income tax on earnings) are your own
                responsibility as a creator. GetVik may provide basic reports
                (such as order and payout summaries), but does not provide
                personalised tax or legal advice.
              </p>

              <h3 id="prohibited">5. Prohibited Conduct</h3>
              <p>When using GetVik, you must not:</p>
              <ul>
                <li>
                  Engage in fraud, payment abuse, or attempts to bypass platform
                  fees.
                </li>
                <li>
                  Upload malware, malicious code, or attempt to attack or
                  disrupt the service.
                </li>
                <li>
                  Post or sell content that is illegal, hateful, abusive, or
                  infringes third-party rights.
                </li>
                <li>
                  Manipulate ratings, reviews, or any metrics on the platform.
                </li>
              </ul>

              <h3 id="intellectual-property">6. Intellectual Property</h3>
              <p>
                You retain ownership of the content you create and upload to
                GetVik. By listing or uploading content, you grant GetVik a
                non-exclusive, worldwide license to host, store, display, and
                deliver your content as necessary to operate the platform
                (including showing previews, processing orders, and delivering
                files to buyers).
              </p>
              <p>
                If you believe your intellectual property has been infringed on
                GetVik, contact us with a clear description of the content,
                relevant URLs, and proof of ownership so we can review and
                respond.
              </p>

              <h3 id="privacy">7. Privacy</h3>
              <p>
                Our handling of personal data is described in the{" "}
                <a href="/privacy">GetVik Privacy Policy</a>. By using the
                platform, you consent to the collection and use of your
                information as described there.
              </p>

              <h3 id="termination">8. Suspension &amp; Termination</h3>
              <p>
                We may suspend or terminate your access to GetVik if we believe
                that:
              </p>
              <ul>
                <li>You have violated these Terms or our policies.</li>
                <li>You are involved in fraud, abuse, or illegal activity.</li>
                <li>
                  We are required to do so by law, regulation, or court order.
                </li>
              </ul>
              <p>
                Termination may result in removal of your listings and
                restricted access to your account. Termination does not cancel
                obligations that reasonably survive (such as payment of any
                outstanding fees or refunds owed to buyers).
              </p>

              <h3 id="disclaimer">9. Disclaimers</h3>
              <p>
                GetVik is provided on an <strong>&quot;as is&quot;</strong> and{" "}
                <strong>&quot;as available&quot;</strong> basis. We do not make
                any promises that:
              </p>
              <ul>
                <li>The service will be uninterrupted, secure, or error-free.</li>
                <li>
                  All listings or content will be accurate, complete, or
                  suitable for your specific needs.
                </li>
              </ul>
              <p>
                To the fullest extent permitted by law, we disclaim all
                warranties, whether express or implied.
              </p>

              <h3 id="liability">10. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, GetVik will not be
                liable for:
              </p>
              <ul>
                <li>
                  Indirect, incidental, special, punitive, or consequential
                  damages.
                </li>
                <li>
                  Loss of profits, revenue, data, or goodwill arising from your
                  use of (or inability to use) the platform.
                </li>
              </ul>
              <p>
                Where our liability cannot be excluded, it is limited to the
                total amount you paid to GetVik (for platform fees, if any)
                during the 12 months immediately before the event giving rise to
                the claim, to the extent allowed by law.
              </p>

              <h3 id="indemnity">11. Indemnity</h3>
              <p>
                You agree to indemnify and hold harmless GetVik from and against
                any claims, losses, or expenses (including reasonable legal
                fees) arising out of:
              </p>
              <ul>
                <li>Your use of the platform.</li>
                <li>Your listings, products, or content.</li>
                <li>Your violation of these Terms or applicable law.</li>
                <li>
                  Your infringement of any third party&apos;s rights (including
                  intellectual property or privacy rights).
                </li>
              </ul>

              <h3 id="payments-security">12. Payment Security &amp; Disputes</h3>
              <p>
                Payment processing and chargebacks are handled according to the
                rules of the payment gateways and banks involved. If a dispute
                or chargeback occurs, creators are expected to cooperate by
                providing accurate information (for example, proof of delivery
                of digital goods).
              </p>
              <p>
                We may temporarily hold or reverse payouts if we suspect fraud,
                abuse, or payment disputes related to a transaction.
              </p>

              <h3 id="governing-law">13. Governing Law &amp; Dispute Resolution</h3>
              <p>
                These Terms are governed by the laws of India. Any disputes that
                cannot be resolved informally will be subject to the exclusive
                jurisdiction of the courts in Uttar Pradesh, India, unless
                applicable law requires otherwise.
              </p>

              <h3 id="modifications">14. Modifications to Terms</h3>
              <p>
                We may update these Terms from time to time. When we make
                material changes, we will update the effective date at the top
                of this page and may provide additional notice (for example, via
                email or in-app messages). Your continued use of GetVik after
                changes take effect constitutes your acceptance of the updated
                Terms.
              </p>

              <h3 id="third-party">15. Third-party Services</h3>
              <p>
                GetVik may link to or integrate with third-party services (such
                as payment gateways or analytics tools). We are not responsible
                for those third parties, their terms, or their actions. Your use
                of any third-party service is subject to their own terms and
                policies.
              </p>

              <h3 id="misc">16. Miscellaneous</h3>
              <ul>
                <li>
                  If any part of these Terms is held invalid or unenforceable,
                  the remaining provisions remain in full force.
                </li>
                <li>
                  These Terms, together with our Privacy Policy and any creator
                  or platform-specific agreements, form the entire agreement
                  between you and GetVik regarding your use of the platform.
                </li>
              </ul>

              <h3 id="grievance">17. Contact &amp; Support</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 not-prose">
                <p className="text-sm font-semibold text-[#2b281f]">Contact</p>
                <p className="text-sm text-gray-600">GetVik</p>
                <p className="text-sm text-gray-600">Meerut, Uttar Pradesh, India</p>
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
                <li>
                  <a className="block hover:text-blue-600" href="#acceptance">
                    1. Acceptance
                  </a>
                </li>
                <li>
                  <a className="block hover:text-blue-600" href="#accounts">
                    2. Accounts
                  </a>
                </li>
                <li>
                  <a className="block hover:text-blue-600" href="#listings">
                    3. Listings
                  </a>
                </li>
                <li>
                  <a className="block hover:text-blue-600" href="#payments-fees">
                    4. Payments
                  </a>
                </li>
                <li>
                  <a className="block hover:text-blue-600" href="#prohibited">
                    5. Prohibited
                  </a>
                </li>
                <li>
                  <a
                    className="block hover:text-blue-600"
                    href="#intellectual-property"
                  >
                    6. IP
                  </a>
                </li>
                <li>
                  <a className="block hover:text-blue-600" href="#termination">
                    8. Termination
                  </a>
                </li>
                <li>
                  <a className="block hover:text-blue-600" href="#liability">
                    10. Liability
                  </a>
                </li>
                <li>
                  <a className="block hover:text-blue-600" href="#grievance">
                    17. Contact
                  </a>
                </li>
              </ul>
            </nav>
          </aside>
        </div>
      </div>
    </section>
  );
}
