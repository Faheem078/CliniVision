"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ProfileData {
  fullName: string;
  role: string;
  email: string;
  medicalLicense: string;
  primaryAffiliation: string;
  avatarUrl?: string;
}

export interface ProfileContextValue extends ProfileData {
  updateProfile: (data: Partial<ProfileData>) => void;
}

const PROFILE_STORAGE_KEY = "profile";

export const DEFAULT_PROFILE: ProfileData = {
  fullName: "Dr. Umer",
  role: "Head Radiologist",
  email: "umer@clinivision.com",
  medicalLicense: "CA-MED-849201",
  primaryAffiliation: "St. Jude Medical Center",
  avatarUrl: undefined,
};

const ProfileContext = createContext<
  ProfileContextValue | undefined
>(undefined);

export function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] =
    useState<ProfileData>(DEFAULT_PROFILE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(
        PROFILE_STORAGE_KEY
      );

      if (!stored) {
        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (
        parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed)
      ) {
        const saved =
          parsed as Partial<ProfileData>;

        setProfile({
          ...DEFAULT_PROFILE,
          ...saved,
        });
      }
    } catch (error) {
      console.error(
        "CliniVision: Unable to load profile.",
        error
      );
    }
  }, []);

  const updateProfile = useCallback(
    (data: Partial<ProfileData>) => {
      setProfile((current) => {
        const updated: ProfileData = {
          ...current,
          ...data,
        };

        try {
          window.localStorage.setItem(
            PROFILE_STORAGE_KEY,
            JSON.stringify(updated)
          );
        } catch (error) {
          console.error(
            "CliniVision: Unable to save profile.",
            error
          );
        }

        return updated;
      });
    },
    []
  );

  const value = useMemo<ProfileContextValue>(
    () => ({
      ...profile,
      updateProfile,
    }),
    [profile, updateProfile]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfile must be used inside a ProfileProvider"
    );
  }

  return context;
}

export default ProfileContext;