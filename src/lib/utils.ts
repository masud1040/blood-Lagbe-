import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export interface User {
  id: number;
  email: string;
  name: string;
  blood_group: string;
  phone: string;
  location: string;
  is_verified: boolean;
  is_admin: boolean;
  donation_count: number;
  last_donation_date?: string;
  created_at: string;
}

export interface CMSData {
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  important_notice: string;
}
