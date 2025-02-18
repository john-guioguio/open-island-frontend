export interface LoginResponse {
  user?: UserData; // The user object might be undefined if login fails
  message?: string; // Optional error message
}

export type DataItem = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  address: string;
  thumbnail:string;
  virtual_tour: VirtualTour_OBJ[] ;
};
export type VirtualTour_OBJ = {
  title: string;
  path: string;
  file?: File;
}
export const categoriesOptions = ["Cultural and Heritage Tourism", "Nature and Eco-tourism", "Adventure Tourism", "Gastronomy", "Recreational Tourism", "Religious and Spiritual Tourism", "Accommodation"];
export const tagsOptions = ["Adventure tourism", "Recreational tourism", "Religious and spiritual tourism", "Nature and eco-tourism", "Local activities", "Wildlife encounters", "Foodie adventure", "Hidden gems", "Luxury stays", "Short-Term Rental", "Residential accommodations"];

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
