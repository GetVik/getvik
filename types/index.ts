import React from 'react';

export type IconProps = {
  icon: React.ElementType;
  className?: string;
  active?: boolean;
  children?: React.ReactNode;
};

export type DropdownButtonProps = {
  children: React.ReactNode;
};

export type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export type AvatarProps = {
  src: string;
  alt: string;
  className?: string;
};

export type LegendItemProps = {
  colorClass: string;
  text: string;
};