import React from 'react';
// Import the renamed cards
import { EarningsCard } from '../ui/cards/dashboard/EarningsCard';
import { OrdersCard } from '../ui/cards/dashboard/OrdersCard';
import { TopProductsCard } from '../ui/cards/dashboard/TopProductsCard';
import { ActivityCard } from '../ui/cards/dashboard/ActivityCard';

export function MainContent() {
  return (

    <main className="flex-1">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
      {/* Dashboard Grid */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left Column */}
        <div className="flex w-full flex-col gap-6 lg:w-2/3">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <EarningsCard />
            <OrdersCard />
          </div>
          <TopProductsCard />
        </div>
        {/* Right Column */}
        <div className="w-full lg:w-1/3">
          <ActivityCard />
        </div>
      </div>
    </main>
  );
}