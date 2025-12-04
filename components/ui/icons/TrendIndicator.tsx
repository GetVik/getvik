import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TrendIndicatorProps {
  trend: 'up' | 'down' | 'neutral'; // Direction of the trend
  percentage: number;            // The percentage value
  label?: string;                 // Optional text like "vs prev 30d"
}

export function TrendIndicator({ trend, percentage, label }: TrendIndicatorProps) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  const colorClass = isPositive ? 'text-green-700' : isNegative ? 'text-red-400' : 'text-gray-400';
  const Icon = isPositive ? ArrowUp : isNegative ? ArrowDown : null; // No icon for neutral

  return (
    <div className={`flex items-center text-xs ${colorClass}`}>
      {Icon && <Icon size={14} className="mr-0.5" />}
      <span className="font-medium">{Math.abs(percentage).toFixed(1)}%</span>
      {label && <span className="ml-1 text-gray-500">{label}</span>}
    </div>
  );
}