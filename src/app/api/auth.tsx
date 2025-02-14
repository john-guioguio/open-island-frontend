import { DataItem } from '../components/type';
import axiosClient from "@/lib/axiosClient";
import Cookies from 'js-cookie';
type UserData = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  password: string;
  remember_token?: string;
  created_at: string;
  updated_at: string;
};
interface LoginResponse {
  user?: UserData; // The user object might be undefined if login fails
  message?: string; // Optional error message
}

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



export const getUserLogin = async ({ setUserData }: { setUserData: (setUserData: UserData | null) => void }) => {
  try {
    const response = await axiosClient.get('/api/checkAuth', { withCredentials: true });
    if (response.data.user == false) {

      setUserData(null); // Clear user data if login fails
      return;
    }
    setUserData(response.data as UserData | null); // Update the state with user data

    localStorage.setItem('userData', JSON.stringify(response.data as UserData | null));
  } catch (error) {
    console.error(error);
    setUserData(null); // Clear user data if login fails
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
        },
        withCredentials: true, // Maintain session using cookies
      }
    );

    // Return the user data if login is successful
    return response.data as LoginResponse; // Assuming response contains the 'user' data

  } catch (error) {
    console.error('Error logging in user:', error);
    return { message: 'Something went wrong' }; // Return an error message if login fails
  }
};
export const getDestination = async ({ setDestination }: { setDestination: (destination: DataItem[]) => void }) => {
  try {
    const response = await axiosClient.get("/api/destinations");
    setDestination(response.data as DataItem[]);
  } catch (error) {
    console.error("Error fetching data:", error);

    setDestination([{
      id: "",
      name: "",
      description: "",
      categories: [],
      tags: [],
      address: "",
      thumbnail: '',
      virtual_tour: [],
    }]);
  }
};
export const getCsrfToken = async ({ setUserData }: { setUserData: (setUserData: UserData | null) => void }) => {
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

export const logout = async ({ setUserData }: { setUserData: (setUserData: UserData | null) => void }) => {
  try {
    const allCookies = Cookies.get();
    // Send the logout request to the backend
   await axiosClient.post('/api/logout', {}, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-XSRF-TOKEN': allCookies['XSRF-TOKEN'],
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