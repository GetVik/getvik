/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { User, Store, Banknote, Loader2, ImageIcon, X } from "lucide-react";
import { DashboardCard } from "@/components/ui/cards/dashboard/DashboardCard";
import { AvatarWithFallback } from "@/components/ui/avatar/AvatarWithFallback";
import {
  FormLabel,
  FormInput,
  FormTextarea,
  FormSelect,
  SaveButton,
} from "@/components/ui/FormControls";
import { useSession } from "next-auth/react";
import { IFile } from "../../../../types/product.interface";
import { FileUploadComponent } from "@/components/ui/FileUploadComponent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
import {
  fetchCreatorSettings,
  updateProfileSettings,
  updateStoreSettings,
  updatePayoutSettings,
  CreatorDetails,
} from "@/services/settings.service";
import { fixR2Url } from "@/lib/image.utils";

type Tab = "profile" | "store" | "payouts";

export default function SettingsPage() {
  const { data: session, status, update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const queryClient = useQueryClient();

  const {
    data: creatorDetails,
    error: fetchError,
    isLoading,
  } = useQuery<CreatorDetails, Error>({
    queryKey: ["creatorSettings"],
    queryFn: fetchCreatorSettings,
    enabled: status === "authenticated",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingStore, setIsSavingStore] = useState(false);
  const [isSavingPayouts, setIsSavingPayouts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [userName, setUserName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [socialsX, setSocialsX] = useState("");
  const [socialsInsta, setSocialsInsta] = useState("");
  const [socialsWeb, setSocialsWeb] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [storeBio, setStoreBio] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountNumberConfirm, setAccountNumberConfirm] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountType, setAccountType] = useState<"Savings" | "Current">(
    "Savings"
  );
  const [upiId, setUpiId] = useState("");
  const [panNumber, setPanNumber] = useState("");

  // Initial State for Dirty Checking
  const [initialProfileData, setInitialProfileData] = useState<any>(null);
  const [initialStoreData, setInitialStoreData] = useState<any>(null);
  const [initialPayoutData, setInitialPayoutData] = useState<any>(null);

  useEffect(() => {
    if (creatorDetails) {
      // Profile Data
      const profileData = {
        userName: creatorDetails.userId?.name ?? session?.user?.name ?? "",
        profileBio: creatorDetails.bio ?? "",
        profileImageUrl: creatorDetails.profileImageUrl ?? session?.user?.image ?? "",
        socialsX: creatorDetails.socials?.x ?? "",
        socialsInsta: creatorDetails.socials?.instagram ?? "",
        socialsWeb: creatorDetails.socials?.website ?? "",
      };
      setUserName(profileData.userName);
      setProfileBio(profileData.profileBio);
      setProfileImageUrl(profileData.profileImageUrl);
      setSocialsX(profileData.socialsX);
      setSocialsInsta(profileData.socialsInsta);
      setSocialsWeb(profileData.socialsWeb);
      setInitialProfileData(profileData);

      // Store Data
      const storeData = {
        storeName: creatorDetails.storeName ?? "",
        storeSlug: creatorDetails.storeSlug ?? "",
        storeBio: creatorDetails.bio ?? "",
        coverImageUrl: creatorDetails.coverImageUrl ?? "",
      };
      setStoreName(storeData.storeName);
      setStoreSlug(storeData.storeSlug);
      setStoreBio(storeData.storeBio);
      setCoverImageUrl(storeData.coverImageUrl);
      setInitialStoreData(storeData);

      // Payout Data
      const payoutData = {
        accountHolderName: creatorDetails.bankDetails?.accountHolderName ?? "",
        accountNumber: creatorDetails.bankDetails?.accountNumber ?? "",
        ifscCode: creatorDetails.bankDetails?.ifscCode ?? "",
        accountType: creatorDetails.bankDetails?.accountType ?? "Savings",
        upiId: creatorDetails.upiId ?? "",
        panNumber: creatorDetails.panNumber ?? "",
      };
      setAccountHolderName(payoutData.accountHolderName);
      setAccountNumber(payoutData.accountNumber);
      setAccountNumberConfirm(payoutData.accountNumber);
      setIfscCode(payoutData.ifscCode);
      setAccountType(payoutData.accountType as "Savings" | "Current");
      setUpiId(payoutData.upiId);
      setPanNumber(payoutData.panNumber);
      setInitialPayoutData(payoutData);
    }
  }, [creatorDetails, session]);

  // Dirty Check Logic
  const isProfileDirty = useMemo(() => {
    if (!initialProfileData) return false;
    return (
      userName !== initialProfileData.userName ||
      profileBio !== initialProfileData.profileBio ||
      profileImageUrl !== initialProfileData.profileImageUrl ||
      socialsX !== initialProfileData.socialsX ||
      socialsInsta !== initialProfileData.socialsInsta ||
      socialsWeb !== initialProfileData.socialsWeb
    );
  }, [
    userName,
    profileBio,
    profileImageUrl,
    socialsX,
    socialsInsta,
    socialsWeb,
    initialProfileData,
  ]);

  const isStoreDirty = useMemo(() => {
    if (!initialStoreData) return false;
    return (
      storeName !== initialStoreData.storeName ||
      storeSlug !== initialStoreData.storeSlug ||
      storeBio !== initialStoreData.storeBio ||
      coverImageUrl !== initialStoreData.coverImageUrl
    );
  }, [storeName, storeSlug, storeBio, coverImageUrl, initialStoreData]);

  const isPayoutDirty = useMemo(() => {
    if (!initialPayoutData) return false;
    return (
      accountHolderName !== initialPayoutData.accountHolderName ||
      accountNumber !== initialPayoutData.accountNumber ||
      ifscCode !== initialPayoutData.ifscCode ||
      accountType !== initialPayoutData.accountType ||
      upiId !== initialPayoutData.upiId ||
      panNumber !== initialPayoutData.panNumber
    );
  }, [
    accountHolderName,
    accountNumber,
    ifscCode,
    accountType,
    upiId,
    panNumber,
    initialPayoutData,
  ]);

  const handleProfileImageUpload = (fileInfo: IFile | null) => {
    setProfileImageUrl(fileInfo?.url || "");
  };

  const handleCoverUpload = (fileInfo: IFile | null) => {
    setCoverImageUrl(fileInfo?.url || "");
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setError(null);
    try {
      const payload = {
        userName,
        bio: profileBio,
        profileImageUrl: profileImageUrl,
        socials: {
          x: socialsX || undefined,
          instagram: socialsInsta || undefined,
          website: socialsWeb || undefined,
        },
      };
      await updateProfileSettings(payload);

      if (
        session?.user?.name !== userName ||
        session?.user?.image !== profileImageUrl
      ) {
        await updateSession({
          ...session,
          user: { ...session?.user, name: userName, image: profileImageUrl },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["creatorSettings"] });
      toast.success("Profile updated successfully!");

      // Update initial state to new values
      setInitialProfileData({
        userName,
        profileBio,
        profileImageUrl,
        socialsX,
        socialsInsta,
        socialsWeb,
      });

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to save profile.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleStoreSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStore(true);
    setError(null);
    try {
      const payload = {
        storeName,
        storeSlug,
        bio: storeBio,
        coverImageUrl: coverImageUrl,
      };
      const response = await updateStoreSettings(payload);
      const updatedCreator = response.creator;

      if (session?.user?.storeSlug !== updatedCreator.storeSlug) {
        await updateSession({
          ...session,
          user: { ...session?.user, storeSlug: updatedCreator.storeSlug },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["creatorSettings"] });
      toast.success("Store settings updated successfully!");

      // Update initial state
      setInitialStoreData({
        storeName,
        storeSlug,
        storeBio,
        coverImageUrl,
      });

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to save store settings.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSavingStore(false);
    }
  };

  const handlePayoutSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accountNumber !== accountNumberConfirm) {
      const errorMsg = "Bank account numbers do not match.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setIsSavingPayouts(true);
    setError(null);
    try {
      const payload = {
        panNumber,
        accountHolderName,
        bankDetails: {
          accountNumber,
          ifscCode,
          accountType,
        },
        upiId: upiId || undefined,
      };
      await updatePayoutSettings(payload);
      toast.success("Payout details updated successfully!");
      setAccountNumberConfirm(accountNumber);
      queryClient.invalidateQueries({ queryKey: ["creatorSettings"] });

      // Update initial state
      setInitialPayoutData({
        accountHolderName,
        accountNumber,
        ifscCode,
        accountType,
        upiId,
        panNumber,
      });

    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to save payout details.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSavingPayouts(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-light text-white">Settings</h1>
        <div className="flex justify-center items-center h-64">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (fetchError && !creatorDetails) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-light text-white">Settings</h1>
        <div className="text-red-400 p-4 bg-[#1A1A1A] rounded-lg border border-red-800">
          {(fetchError as Error).message ||
            "Could not load your settings. Please try again later."}
        </div>
      </div>
    );
  }

  const TabButton = ({
    tabName,
    icon: Icon,
    label,
  }: {
    tabName: Tab;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      onClick={() => {
        setActiveTab(tabName);
        setError(null);
      }}
      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-all
        ${activeTab === tabName
          ? "bg-white text-black"
          : "text-gray-300 hover:bg-[#262626] hover:text-white"
        }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl px-2 font-light text-white">Settings</h1>

      <nav className="flex gap-2">
        <TabButton tabName="profile" icon={User} label="Profile" />
        <TabButton tabName="store" icon={Store} label="Settings" />
        <TabButton tabName="payouts" icon={Banknote} label="Payout" />
      </nav>

      {error && (
        <div className="text-red-400 p-3 bg-[#1A1A1A] rounded-lg border border-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="mt-2">
        {activeTab === "profile" && (
          <DashboardCard title="Public Profile">
            <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
              <FormLabel>Profile Photo</FormLabel>
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <AvatarWithFallback
                    src={profileImageUrl}
                    alt="Your Avatar"
                    size={40}
                    fallbackText={userName}
                    className="h-10 w-10"
                  />
                  {profileImageUrl && (
                    <button
                      type="button"
                      onClick={() => setProfileImageUrl("")}
                      className="absolute -top-1 -right-1 z-10 p-1 bg-gray-900 border border-gray-700 rounded-full text-white hover:bg-red-500 hover:border-red-500"
                      title="Remove Image"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="grow">
                  <FileUploadComponent
                    title="Upload Profile Photo"
                    description="Square, max 10MB."
                    icon={ImageIcon}
                    uploadFieldName="coverImage"
                    onFileUpload={handleProfileImageUpload}
                    accept="image/*"
                  />
                </div>
              </div>

              <div>
                <FormLabel htmlFor="userName">Full Name</FormLabel>
                <FormInput
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>

              <div>
                <FormLabel htmlFor="profileBio">Bio / Description</FormLabel>
                <FormTextarea
                  id="profileBio"
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Tell your customers a bit about yourself..."
                />
              </div>

              <h3 className="text-lg font-light text-white border-b border-gray-700 pb-2">
                Social Links
              </h3>
              <div>
                <FormLabel htmlFor="socialsX">X (Twitter) URL</FormLabel>
                <FormInput
                  id="socialsX"
                  type="url"
                  value={socialsX}
                  onChange={(e) => setSocialsX(e.target.value)}
                  placeholder="https://x.com/yourhandle"
                />
              </div>
              <div>
                <FormLabel htmlFor="socialsInsta">Instagram URL</FormLabel>
                <FormInput
                  id="socialsInsta"
                  type="url"
                  value={socialsInsta}
                  onChange={(e) => setSocialsInsta(e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              <div>
                <FormLabel htmlFor="socialsWeb">
                  Website/Portfolio URL
                </FormLabel>
                <FormInput
                  id="socialsWeb"
                  type="url"
                  value={socialsWeb}
                  onChange={(e) => setSocialsWeb(e.target.value)}
                  placeholder="https://yoursite.com"
                />
              </div>

              <SaveButton isLoading={isSavingProfile} disabled={!isProfileDirty}>Save Profile</SaveButton>
            </form>
          </DashboardCard>
        )}

        {activeTab === "store" && (
          <DashboardCard title="Store Settings">
            <form onSubmit={handleStoreSave} className="flex flex-col gap-6">
              <div>
                <FormLabel htmlFor="storeName">Store Name</FormLabel>
                <FormInput
                  id="storeName"
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>
              <div>
                <FormLabel htmlFor="storeSlug">Store Link</FormLabel>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-700 bg-gray-600 px-3 text-sm text-gray-300">
                    getvik.live
                  </span>
                  <FormInput
                    id="storeSlug"
                    type="text"
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(e.target.value)}
                    className="rounded-l-none"
                    placeholder="your-store-link"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Changing your link will invalidate old links. *IN LOWERCASE*
                </p>
              </div>
              <div>
                <FormLabel htmlFor="storeBio">
                  Store Description (Bio)
                </FormLabel>
                <FormTextarea
                  id="storeBio"
                  value={storeBio}
                  onChange={(e) => setStoreBio(e.target.value)}
                  placeholder="Welcome to my store! Here you'll find..."
                />
              </div>

              <div>
                <FormLabel>Store Cover Photo</FormLabel>
                {coverImageUrl ? (
                  <div className="mb-4 relative w-full group rounded-xl overflow-hidden border border-gray-700 shadow-sm">
                    <div className="w-full h-32 sm:h-40 md:h-48 relative">
                      <Image
                        src={fixR2Url(coverImageUrl)}
                        alt="Cover preview"
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        priority={false}
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent/10 to-transparent pointer-events-none" />

                      <div className="absolute left-3 bottom-3 z-10 px-2 py-0.5 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm text-white">
                        {decodeURIComponent(
                          (coverImageUrl.split("/").pop() || "").split("?")[0]
                        ) || "Cover image"}
                      </div>

                      <button
                        type="button"
                        onClick={() => setCoverImageUrl("")}
                        aria-label="Remove cover image"
                        title="Remove Image"
                        className="absolute top-3 right-3 z-20 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <FileUploadComponent
                    title="Upload Store Cover"
                    description="Recommended: 16:9, max 10MB."
                    icon={ImageIcon}
                    uploadFieldName="coverImage"
                    onFileUpload={handleCoverUpload}
                    accept="image/*"
                  />
                )}
              </div>

              <SaveButton isLoading={isSavingStore} disabled={!isStoreDirty}>
                Save Store Settings
              </SaveButton>
            </form>
          </DashboardCard>
        )}

        {activeTab === "payouts" && (
          <DashboardCard title="Payout Details">
            <form onSubmit={handlePayoutSave} className="flex flex-col gap-6">
              <div className="rounded-lg bg-[#1A1A1A] border border-blue-800 p-4 text-sm text-blue-200">
                Payments are paid out weekly to verified accounts. Ensure
                details are accurate. KYC status:{" "}
                <span
                  className={`font-medium ${creatorDetails?.kycStatus === "Verified"
                    ? "text-green-700"
                    : "text-yellow-400"
                    }`}
                >
                  {creatorDetails?.kycStatus || "Pending"}
                </span>
              </div>
              <div>
                <FormLabel htmlFor="panNumber">PAN Number</FormLabel>
                <FormInput
                  id="panNumber"
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="Your Permanent Account Number"
                  maxLength={10}
                  required
                />
              </div>
              <div>
                <FormLabel htmlFor="accountHolderName">
                  Account Holder Name
                </FormLabel>
                <FormInput
                  id="accountHolderName"
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="As per bank records"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FormLabel htmlFor="accountNumber">
                    Bank Account Number
                  </FormLabel>
                  <FormInput
                    id="accountNumber"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Your account number"
                    required
                  />
                </div>
                <div>
                  <FormLabel htmlFor="accountNumberConfirm">
                    Re-enter Account Number
                  </FormLabel>
                  <FormInput
                    id="accountNumberConfirm"
                    type="text"
                    value={accountNumberConfirm}
                    onChange={(e) => setAccountNumberConfirm(e.target.value)}
                    placeholder="Confirm account number"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FormLabel htmlFor="ifscCode">IFSC Code</FormLabel>
                  <FormInput
                    id="ifscCode"
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="e.g., SBIN0001234"
                    maxLength={11}
                    required
                  />
                </div>
                <div>
                  <FormLabel htmlFor="accountType">Account Type</FormLabel>
                  <FormSelect
                    id="accountType"
                    value={accountType}
                    onChange={(e) =>
                      setAccountType(e.target.value as "Savings" | "Current")
                    }
                  >
                    <option value="Savings">Savings</option>
                    <option value="Current">Current</option>
                  </FormSelect>
                </div>
              </div>
              <div>
                <FormLabel htmlFor="upiId">UPI ID (Optional)</FormLabel>
                <FormInput
                  id="upiId"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g., yourname@upi"
                />
              </div>

              <SaveButton isLoading={isSavingPayouts} disabled={!isPayoutDirty}>
                Save Payout Details
              </SaveButton>
            </form>
          </DashboardCard>
        )}
      </div>
    </div>
  );
}
