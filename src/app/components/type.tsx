
export type DataItem = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  address: string;
  thumbnail: File | string | null;
  virtual_tour: VirtualTour_OBJ[] | null; // Ensure consistent type
};
export type VirtualTour_OBJ = {
  title: string;
  path: string;
  file: File;
} 
export const categoriesOptions = ["Adventure", "Beach", "Historical", "Mountain", "Cultural", ""];
export const tagsOptions = ["Nature", "Hiking", "Family", "Romantic", "Wildlife", ""];

export type AlertSeverity = "error" | "warning" | "info" | "success"; // ✅ Define the type
export type TabType = "SignUp" | "Login" | "Dashboard" | "CMS" | "Destination" | "ForgotPassword"; // ✅ Define the type
export type UserData = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  password: string;
  remember_token?: string;
  created_at: string;
  updated_at: string;
};
 