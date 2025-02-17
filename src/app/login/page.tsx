"use client";
import { Alert, Box, Fade, Snackbar } from "@mui/material"; 
import Login_CMS from "./login_cmpnts";
import { useEffect, useState } from "react";
import { TransitionProps } from '@mui/material/transitions';
import { getCsrfToken } from "../api/auth"; 
import Cookies from 'js-cookie';
type AlertSeverity = "error" | "warning" | "info" | "success"; // ✅ Define the type 
 import { LoginResponse } from "../components/type";

const LoginCMS = () => {
  const [resultMSG, setResultMSG] = useState<string>('');
  const [alertServerity, setAlertServerity] = useState<AlertSeverity>('warning');
  const [userData, setUserData] = useState<LoginResponse | null>(null);
  const [stateTrans] = useState<{
    open: boolean;
    Transition: React.ComponentType<TransitionProps & { children: React.ReactElement }>;
  }>({
    open: false,
    Transition: Fade,  // Ensure `Fade` is a valid transition component
  });

  const [open, setOpen] = useState<boolean>(false); 
  const openExternalPage = ({ val, targ }: { val: string, targ: '_blank' | '_self' }) => {
    window.open(val, targ); // Open in new tab
  };
  const handleClose = () => {
    openExternalPage({ val: '/dashboard', targ: '_self' });
    setOpen(false);
  };

  useEffect(() => {
    // Log previous pageTab for debugging
    // console.log(pageTab);

    const storedUserData = localStorage.getItem('userData');
    const allCookies = Cookies.get();
    // console.log(allCookies['XSRF-TOKEN']);
    if (storedUserData && allCookies['XSRF-TOKEN'] && userData != null) {
      openExternalPage({ val: '/dashboard', targ: '_self' });

    } else {

      // openExternalPage({ val: '/login', targ: '_self' });
      getCsrfToken({ setUserData });
    }
  }, [userData]); // This will run when userData changes

  return (
    <>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}

        TransitionComponent={stateTrans.Transition}
      >
        <Alert
          onClose={handleClose}
          severity={alertServerity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {resultMSG}
        </Alert>
      </Snackbar>
      <Box sx={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        height: '100%',
        width: '100%',
        left: 0,
        right: 0,
        top: 0,
        position: 'fixed',
        zIndex: 1,
        overflowY: 'auto'
      }}>
        <Login_CMS
          // user={userData}
          setUser={setUserData}
          setResultMSG={setResultMSG}
          setOpen={setOpen}
          setAlertServerity={setAlertServerity}
          prev_pageTab={null}
          setPageTab={() => { }}

        ></Login_CMS>

      </Box>
    </>
  );
};  
export default LoginCMS; 