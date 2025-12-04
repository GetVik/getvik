import React, { JSX } from "react";
import { generateGSTMetadata } from "@/lib/metadata";

export const metadata = generateGSTMetadata();

const EFFECTIVE_DATE = "19 November 2025";

export default function GstTaxesPage(): JSX.Element {
  return (
    <section
      aria-labelledby="gst-heading"
      className="bg-gray-50 text-black py-10 sm:py-16 lg:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <h1
            id="gst-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2b281f]"
          >
            GST &amp; Taxes — How GetVik Handles It Today
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Effective date:{" "}
            <time dateTime="2025-11-19">{EFFECTIVE_DATE}</time>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12">
          {/* Main Content */}
          <main className="min-w-0">
            <article
              className="prose-sm md:prose-lg prose-slate max-w-none bg-white p-5 sm:p-8 md:p-12 
                         rounded-2xl shadow-sm border border-gray-100
                         prose-a:text-blue-600 hover:prose-a:underline prose-h3:mt-8"
            >
              <p>
                This page explains, in simple terms, how GST and taxes are
                handled on <strong>GetVik</strong> right now and what creators
                should keep in mind when selling digital products through the
                platform.
              </p>

              <h3 id="status">1. Current GST Status of GetVik</h3>
              <p>
                GetVik is currently <strong>not registered under GST</strong>.
                That means:
              </p>
              <ul>
                <li>GetVik does not charge GST on platform fees.</li>
                <li>GetVik does not collect GST or GST TCS from buyers.</li>
                <li>
                  GetVik does not file GST returns or GSTR-8 as an e-commerce
                  operator at this time.
                </li>
              </ul>
              <p>
                This may change in the future if the business scale or
                regulation requires GST registration. If that happens, we will
                update this page and notify users.
              </p>

              <h3 id="creators">2. GST &amp; Tax Considerations for Creators</h3>
              <p>
                As a creator selling on GetVik, <strong>you</strong> are
                responsible for understanding and complying with your own tax
                obligations. In particular:
              </p>
              <ul>
                <li>
                  You should determine whether your turnover or business type
                  requires GST registration under current Indian law.
                </li>
                <li>
                  If you are GST-registered, you are responsible for issuing
                  GST-compliant invoices to your customers and reporting sales
                  in your returns.
                </li>
                <li>
                  Your income from GetVik may be taxable under the Income Tax
                  Act; you should keep proper records and consult a CA where
                  needed.
                </li>
              </ul>
              <p>
                GetVik does <strong>not</strong> provide individual tax advice
                or file returns on your behalf.
              </p>

              <h3 id="buyers">3. Buyer Pricing &amp; Taxes</h3>
              <p>
                When a buyer purchases a digital product on GetVik today:
              </p>
              <ul>
                <li>
                  The price shown is the amount charged to the buyer by the
                  creator via GetVik.
                </li>
                <li>
                  GetVik does not add GST on top of this price in its own name.
                </li>
                <li>
                  If a GST-registered creator includes GST in their pricing,
                  that is between the creator and the buyer and should be
                  handled directly by the creator in their records.
                </li>
              </ul>

              <h3 id="future">4. If GetVik Registers Under GST in the Future</h3>
              <p>
                If and when GetVik becomes GST-registered or qualifies as an
                e-commerce operator for GST purposes:
              </p>
              <ul>
                <li>
                  Platform fees may become subject to GST, and tax invoices for
                  those fees may be issued.
                </li>
                <li>
                  Additional compliance (such as TCS under GST) may be
                  implemented if legally required.
                </li>
                <li>
                  Creators may receive additional tax reports or summaries from
                  GetVik to help with reconciliation.
                </li>
              </ul>
              <p>
                Any such change will be communicated clearly before it goes
                live.
              </p>

              <h3 id="records">5. Basic Record-Keeping for Creators</h3>
              <p>
                Regardless of GST registration status, creators should maintain
                simple, clean records, such as:
              </p>
              <ul>
                <li>Copies of orders and payout reports from GetVik.</li>
                <li>
                  Bank statements showing payouts received from GetVik or its
                  payment partners.
                </li>
                <li>
                  Any invoices or receipts you issue directly to customers.
                </li>
              </ul>
              <p>
                These records will help with income tax filing and future GST
                compliance if you cross thresholds later.
              </p>

              <h3 id="disclaimer">6. Disclaimer</h3>
              <p>
                This page is for general understanding only and does not
                constitute legal or tax advice. Tax rules change and their
                application depends on your specific situation. Always consult a
                qualified chartered accountant or tax professional before
                relying on this information for compliance decisions.
              </p>

              <footer className="mt-6 text-sm text-gray-600">
                <p>
                  Last updated:{" "}
                  <time dateTime="2025-11-19">{EFFECTIVE_DATE}</time>.
                </p>
              </footer>
            </article>
          </main>

          {/* Desktop TOC (hidden on mobile) */}
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
                  <a className="hover:text-blue-600" href="#status">
                    1. Current GST status
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600" href="#creators">
                    2. For creators
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600" href="#buyers">
                    3. For buyers
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600" href="#future">
                    4. Future changes
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600" href="#records">
                    5. Record-keeping
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600" href="#disclaimer">
                    6. Disclaimer
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
