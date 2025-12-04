import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import { Lock, Zap } from "lucide-react";
import Link from "next/link";

export const UpgradeToProNotice: React.FC = () => (
  <DashboardCard title="Unlock Advanced Analytics">
    <div className="flex flex-col items-center justify-center h-96 text-center p-6">
      <Lock className="h-16 w-16 text-[#643446] mb-4" />
      <h3 className="text-2xl font-semibold text-white mb-2">This is a Pro Feature</h3>
      <p className="text-gray-400 max-w-md mb-6">
        Upgrade to unlock conversion stats, product-level views, customer exports, and more.
      </p>
      <Link
        href="/dashboard/billing"
        className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-gray-200"
      >
        <Zap size={16} />
        Upgrade 
      </Link>
    </div>
  </DashboardCard>
);