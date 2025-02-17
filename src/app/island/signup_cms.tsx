"use client";
import { Alert, Box, Button, Fade, Grid2, Snackbar,  useMediaQuery } from "@mui/material";
import landingPageIMG from "../../../Images/landingpageBG.png"; // Import your background image
import LogoImg from "../../../Images/logo.png"; // Import your background image
import SignUp_CMS from "../signup/page";
import { useEffect, useState } from "react";
import { TransitionProps } from '@mui/material/transitions';
import { getCsrfToken, logout } from "../api/auth";
import LogoutIcon from '@mui/icons-material/Logout';
import Cookies from 'js-cookie';
import { LoginResponse } from "../components/type";
type AlertSeverity = "error" | "warning" | "info" | "success"; // ✅ Define the type 
 
const LoginCMS = () => {
  const [resultMSG] = useState<string>('');
  const [alertServerity] = useState<AlertSeverity>('warning');
  const [userData, setUserData] = useState<LoginResponse | null>(null);
  const [stateTrans] = useState<{
    open: boolean;
    Transition: React.ComponentType<TransitionProps & { children: React.ReactElement }>;
  }>({
    open: false,
    Transition: Fade,  // Ensure `Fade` is a valid transition component
  });

  const isTab = useMediaQuery("(max-width:1380px)");
  const isMobile = useMediaQuery("(max-width:820px)"); 

  const openExternalPage = ({ val, targ }: { val: string, targ: '_blank' | '_self' }) => {
    window.open(val, targ); // Open in new tab
  };
  const handleClose = () => {
    openExternalPage({ val: '/cms', targ: '_self' });
  };

  const onClickLogo = () => {
    location.reload();
  }
  useEffect(() => {
    // Log previous pageTab for debugging
    // console.log(pageTab);

    const storedUserData = localStorage.getItem('userData');
    const allCookies = Cookies.get();
    // console.log(allCookies['XSRF-TOKEN']);
    if (storedUserData && allCookies['XSRF-TOKEN']) {
    } else {
      // If no user data, fetch CSRF token and login

      // openExternalPage({ val: '/cms/login', targ: '_self' });
      getCsrfToken({ setUserData });
    }
  }, [userData]); // This will run when userData changes

  return (
    <Box
      style={{
        backgroundImage: `URL(${landingPageIMG})`,  // Apply the image as a background
        backgroundSize: '100% 190%',                   // Ensure the image covers the entire Box
        backgroundPositionY: '25%',              // Align the image to the center
        backgroundPositionX: 'center',              // Align the image to the center
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        height: '100%',                            // Add Flexbox to center content (optional)
        justifyContent: 'center',                  // Center horizontally
        alignItems: 'center',                      // Center vertically
        color: 'black',                            // Change text color to white (optional, depends on background image)
        fontSize: '2rem',                          // Optional: Adjust font size (for visibility)
        textAlign: 'center',
        width:'100%',
        position:'absolute'
      }}
    >
      <Box sx={{
        backgroundColor: 'rgba(0,0,0,0.1)',
        height: '100%',                     // Optional: Center text alignment
        overflowY: 'auto'
      }}>
        <Grid2 container spacing={2} sx={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0))', width: '100%', position: 'sticky', zIndex: 999 }}>
          <Grid2 size={isMobile ? 8 : isTab ? 5 : 4}
            sx={{
              fontSize: "2rem", // Example of custom styling
              fontFamily: "inter",
              fontWeight: "900",
              color: "white",
              padding: 2,
            }}
          >
            <Box component={'img'} sx={{ width: '50%' }} src={LogoImg.src} onClick={onClickLogo}></Box>
          </Grid2>
          <Grid2 size={6}>
          </Grid2>
          <Grid2 size={1}>
            <Button variant="text" sx={{
              p: 5, color: 'white',
              transition: 'all 0.3s ease', // Smooth transition for all effects 
              bgcolor: '',
              '&:hover': {
                color: 'rgba(168, 168, 168, 0.68)',
                bgcolor: 'rgba(168, 168, 168, 0)',
              },
            }} startIcon={<LogoutIcon> </LogoutIcon>}
              onClick={() => logout({ setUserData })}
            >Logout</Button>
          </Grid2>
        </Grid2>
      </Box>
      <Snackbar open={false} autoHideDuration={2000} onClose={handleClose}
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

        <SignUp_CMS

        ></SignUp_CMS>
      </Box>
    </Box>
  );
};  
export default LoginCMS; 