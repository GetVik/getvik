'use client';
import { DashboardCard } from './DashboardCard';

export const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
  <DashboardCard title="">
    <div className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  </DashboardCard>
);