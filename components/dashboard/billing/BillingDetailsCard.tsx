"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import { Loader2, Lock, MapPin } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";
import { ICreatorSettings } from "@/types/billing";

interface Props {
  details: ICreatorSettings | undefined;
  isLoading: boolean;
  mutation: UseMutationResult<ICreatorSettings, unknown, ICreatorSettings>;
}

// Extending the interface locally for the UI fields 
// that aren't in your backend yet but are needed for the form
interface ExtendedSettings extends ICreatorSettings {
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

export function BillingDetailsCard({ details, isLoading, mutation }: Props) {
  const [formState, setFormState] = useState<ExtendedSettings>({
    storeName: "",
    storeSlug: "",
    gstin: "",
    panNumber: "",
    kycStatus: "Pending",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  useEffect(() => {
    if (details) {
      setFormState((prev) => ({ ...prev, ...details }));
    }
  }, [details]);

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
  //   const { name, value } = e.target;
  //   setFormState((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    mutation.mutate(formState);
  };

  return (
    <DashboardCard title="Billing Details">
      <div className="p-4 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Section 1: Store Identity (Active) */}
            {/* <div className="grid grid-cols-1 gap-3"> */}
              {/* <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Store Identity
              </h4>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Store Name</label>
                <input
                  name="storeName"
                  value={formState.storeName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-800 bg-[#121212] px-3 py-2 text-sm text-white outline-none focus:border-gray-500 transition-colors"
                  placeholder="Your store name"
                />
              </div> */}

              {/* <div>
                <label className="block text-xs text-gray-400 mb-1">Store Link (slug)</label>
                <div className="flex rounded-md border border-gray-800 bg-[#121212]">
                  <span className="flex items-center pl-3 text-xs text-gray-500 border-r border-gray-800 pr-2">
                    store.com/
                  </span>
                  <input
                    name="storeSlug"
                    value={formState.storeSlug}
                    onChange={handleChange}
                    className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600"
                    placeholder="your-slug"
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-500">
                  This controls your public store URL. Must be unique.
                </p>
              </div>
            </div> */}

            <div className="h-px bg-gray-800/50" />

            {/* Section 2: Billing Address (Disabled for Beta) */}
            <div className="relative rounded-lg border border-gray-800/50 bg-gray-900/20 p-4">
              
              {/* Beta Overlay */}
              <div className="absolute -top-3 left-3 flex items-center gap-1 rounded bg-[#262626] px-2 py-1 text-[10px] font-medium text-gray-400 shadow-sm border border-gray-700">
                <Lock size={10} />
                Not required in Beta
              </div>

              <div className="grid grid-cols-1 gap-3 opacity-50 pointer-events-none select-none grayscale">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} className="text-gray-500" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Business Address
                  </h4>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">GSTIN</label>
                  <input
                    disabled
                    name="gstin"
                    value={formState.gstin || ""}
                    className="w-full rounded-md border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-gray-500"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Address</label>
                  <input
                    disabled
                    name="addressLine1"
                    value={formState.addressLine1 || ""}
                    className="w-full rounded-md border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-gray-500"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <input
                      disabled
                      name="city"
                      value={formState.city || ""}
                      className="w-full rounded-md border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-gray-500"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">State</label>
                    <input
                      disabled
                      name="state"
                      value={formState.state || ""}
                      className="w-full rounded-md border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-gray-500"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Pincode</label>
                    <input
                      disabled
                      name="pincode"
                      value={formState.pincode || ""}
                      className="w-full rounded-md border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-gray-500"
                      placeholder="000000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Country</label>
                    <select
                      disabled
                      name="country"
                      value={formState.country || "India"}
                      className="w-full rounded-md border border-gray-800 bg-[#0a0a0a] px-3 py-2 text-sm text-gray-500"
                    >
                      <option value="India">India</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                {mutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardCard>
  );
}