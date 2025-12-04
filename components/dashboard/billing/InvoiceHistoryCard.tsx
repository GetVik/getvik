import React, { useState } from "react";
import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import { Loader2, Download } from "lucide-react";
import { IInvoice } from "@/types/billing";
import { downloadInvoice } from "@/services/subscription.service";
import toast from "react-hot-toast";

interface Props {
  invoices: IInvoice[] | undefined;
  isLoading: boolean;
}

const formatDate = (dateVal: string | number): string => {
  if (!dateVal) return "N/A";
  try {
    const date = new Date(dateVal);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Error";
  }
};

const formatAmount = (amount: number, currency: string): string =>
  `${currency === "INR" || currency === "₹" ? "₹" : currency}${amount.toLocaleString("en-IN")}`;

export function InvoiceHistoryCard({ invoices, isLoading }: Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    try {
      setDownloadingId(invoiceId);
      const blob = await downloadInvoice(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download invoice");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <DashboardCard title="Invoice History">
      <div className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : !invoices || invoices.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">
            No invoices yet. Once you&apos;re billed, your invoices will appear here.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="hidden md:grid md:grid-cols-5 text-xs font-medium text-gray-500 border-b border-gray-800 pb-2">
              <span>Date</span>
              <span>Invoice ID</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Status</span>
              <span className="text-right">Download</span>
            </div>
            <div className="flex flex-col">
              {invoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="flex flex-col gap-2 py-3 border-b border-gray-800/60 last:border-b-0 md:grid md:grid-cols-5 md:items-center"
                >
                  <div className="flex justify-between md:block">
                    <span className="text-xs text-gray-500 md:hidden">Date:</span>
                    <span className="text-sm text-gray-300">
                      {formatDate(invoice.createdAt)}
                    </span>
                  </div>

                  <div className="flex justify-between md:block">
                    <span className="text-xs text-gray-500 md:hidden">Invoice:</span>
                    <span className="text-xs text-gray-400 truncate">{invoice._id}</span>
                  </div>

                  <div className="flex justify-between md:block">
                    <span className="text-xs text-gray-500 md:hidden">Amount:</span>
                    <span className="text-sm text-gray-300 md:text-right">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between md:block">
                    <span className="text-xs text-gray-500 md:hidden">Status:</span>
                    <span className="text-xs md:text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 ${invoice.status === "paid"
                          ? "bg-green-500/10 text-green-400"
                          : invoice.status === "refunded"
                            ? "bg-blue-500/10 text-blue-400"
                            : invoice.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                      >
                        {invoice.status.toUpperCase()}
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between md:block">
                    <span className="text-xs text-gray-500 md:hidden">Download:</span>
                    <button
                      onClick={() => handleDownload(invoice._id, invoice.invoiceNumber)}
                      disabled={downloadingId === invoice._id}
                      className="inline-flex items-center gap-1 text-xs font-medium text-gray-300 hover:text-white md:justify-end disabled:opacity-50"
                    >
                      {downloadingId === invoice._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      PDF
                    </button>
                  </div>


                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
