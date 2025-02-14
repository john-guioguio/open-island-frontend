'use client'
import { Box, Button, Grid2, useMediaQuery } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import landingPageIMG from "../Images/landingpageBG.png"; // Import your background image
import LogoImg from "../Images/logo.png"; // Import your background image 
import { getCsrfToken, logout } from './api/auth';
import './index.css';
import { UserData } from './components/type';
import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [userData, setUserData] = useState<UserData | null>(null);
  const onClickLogo = () => { 
    window.open(window.location.hostname, '_self');
    if(userData){

    }
  }
  const isTab = useMediaQuery("(max-width:1380px)");
  const isMobile = useMediaQuery("(max-width:820px)");

  // ✅ Corrected Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("userData");
      const xsrfToken = Cookies.get("XSRF-TOKEN");

      if (!storedUser || !xsrfToken) {
        console.log("User not logged in, fetching CSRF token...");

        await getCsrfToken({setUserData}); // ✅ CSRF token first
        // await getUserLogin({ setUserData }); // ✅ Then get user login data

        const updatedUser = localStorage.getItem("userData");
        if (!updatedUser) {

          // openExternalPage({ val: '/login', targ: '_self' });
        }
      } else {
        setUserData(JSON.parse(storedUser));
      }
    };

    checkAuth();
  }, []);  // ✅ Run only once after mount 
  return (
    <html lang="en">
      <body>
        <Box

          style={{
            backgroundImage: `URL(${landingPageIMG.src})`,  // Apply the image as a background
            backgroundSize: '100% 190%',                   // Ensure the image covers the entire Box
            backgroundPositionY: '25%',              // Align the image to the center
            backgroundPositionX: 'center',              // Align the image to the center
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            height: '100vh',                            // Add Flexbox to center content (optional)
            justifyContent: 'center',                  // Center horizontally
            alignItems: 'center',                      // Center vertically
            color: 'black',                            // Change text color to white (optional, depends on background image)
            fontSize: '2rem',                          // Optional: Adjust font size (for visibility)
            textAlign: 'center',
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
          {children}

        </Box>
      </body>
    </html >
  );
}
