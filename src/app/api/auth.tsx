'use client'
import { DataItem, VirtualTour_OBJ } from '../components/type';
import axiosClient from "@/lib/axiosClient";
import Cookies from 'js-cookie';
import { LoginResponse } from '../components/type';
// Register user
export const registerUser = async (name: string, email: string, password: string, password_confirmation: string) => {

  try {
    const response = await axiosClient.post(
      '/api/register',
      { name, email, password, password_confirmation },
      { withCredentials: true } // Important for maintaining session
    );
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};



export const getUserLogin = async ({ setUserData }: { setUserData: (setUserData: LoginResponse) => void }) => {
  try {
    const response = await axiosClient.get('/api/checkAuth', { withCredentials: true });
    if (response.data.user == false) {

      setUserData(response.data.message); // Clear user data if login fails
      return;
    }
    setUserData(response.data as LoginResponse); // Update the state with user data

    localStorage.setItem('userData', JSON.stringify(response.data as LoginResponse | null));
  } catch (error) {
    console.error(error);
    setUserData(error as LoginResponse); // Clear user data if login fails
  }
};

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Fetch CSRF Token
    const allCookies = Cookies.get();

    // Send login request with CSRF token and credentials
    const response = await axiosClient.post(
      '/api/login',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-XSRF-TOKEN': allCookies['XSRF-TOKEN'],
          'CSRF-TOKEN': allCookies['XSRF-TOKEN'],
        },
        withCredentials: true, // Maintain session using cookies
      }
    );
    return response.data as LoginResponse; // Assuming response contains the 'user' data 
    // Return the user data if login is successful

  } catch (error) {
    console.error('Error logging in user:', error);
    return { message: 'Something went wrong' }; // Return an error message if login fails
  }
};
export const getDestination = async ({ setDestination }: { setDestination: (destination: DataItem[]) => void }) => {
  try {
    const response = await axiosClient.get("/api/destinations", { withCredentials: true });
    const data = response.data as DataItem[];
    
    setDestination(data.map((item: DataItem) => {
      // Ensure virtual_tour is an array, even if it's a string or already a valid array
      let vt: VirtualTour_OBJ[] = [];
    
      if (item.virtual_tour) {
        try {
          // Parse virtual_tour if it's a string (in case it's a JSON string)
          vt = Array.isArray(item.virtual_tour) ? item.virtual_tour : JSON.parse(item.virtual_tour);
        } catch (error) {
          console.error("Error parsing virtual_tour:", error);
          vt = []; // Default to empty array if parsing fails
        }
      }
    
      return {
        ...item,
        virtual_tour: vt.map((val) => ({
          title: val.title || '',  // Ensure the title exists
          path: val.path || '',    // Ensure the path exists
          file: val.file || undefined,  // Ensure file exists or set it to undefined
        })),
      };
    }));
    
  } catch (error) {
    console.error("Error fetching data:", error);

    setDestination([{
      id: "",
      name: "",
      description: "",
      categories: [],
      tags: [],
      address: "",
      thumbnail:'',
      virtual_tour:[]
    }]);
  }
};
export const getCsrfToken = async ({ setUserData }: { setUserData: (setUserData: LoginResponse) => void }) => {
  const allCookies = Cookies.get();

  // Check if CSRF token exists in cookies
  if (allCookies['XSRF-TOKEN']) {
    // If CSRF token exists, proceed to login
    await getUserLogin({ setUserData });
    return;
  }

  // Otherwise, fetch CSRF token from the server
  try {
    await axiosClient.get('/sanctum/csrf-cookie', { withCredentials: true });
    // After obtaining CSRF cookie, try to log in
    await getUserLogin({ setUserData });
  } catch (error) {
    console.error('Error getting CSRF Token:', error);
    return { message: 'Something went wrong with CSRF token retrieval' };
  }
};

export const logout = async ({ setUserData }: { setUserData: (setUserData: LoginResponse | null) => void }) => {
  try {
    const allCookies = Cookies.get();
    // Send the logout request to the backend
    await axiosClient.post('/api/logout', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': allCookies['XSRF-TOKEN'],
        'CSRF-TOKEN': allCookies['XSRF-TOKEN'],
      }, withCredentials: true
    });

    // Optionally, clear any local storage/session storage
    localStorage.removeItem('userData');  // or any other local data storage
    setUserData(null);

    const openExternalPage = ({ val, targ }: { val: string, targ: '_blank' | '_self' }) => {
      window.open(val, targ); // Open in new tab
    };
    openExternalPage({ val: '/login', targ: '_self' });
  } catch (error) {
    console.error('Error during logout:', error);
  }
};