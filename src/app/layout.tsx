'use client'
import { Box, Button, Grid2, useMediaQuery } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

import landingPageIMG from "../Images/landingpageBG.png"; // Import your background image
import LogoImg from "../Images/logo.png"; // Import your background image 
import t1 from "../Images/loading/2s_Leche_Flan 1.png"; // Import your background image  
import { getCsrfToken, logout } from './api/auth';
import './index.css';
import { LoginResponse } from './components/type';
import { useEffect, useState } from 'react';
import Favicon from '../Images/openisland icon.png'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [userData, setUserData] = useState<LoginResponse | null>(null);
  const onClickLogo = () => {
    window.open(window.location.hostname, '_self');
    if (userData) {

    }
  } 

  // ✅ Corrected Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("userData");

      if (!storedUser) {
        console.log("User not logged in, fetching CSRF token...");

        await getCsrfToken({ setUserData }); // ✅ CSRF token first
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
      <head>
        <link rel="icon" type="image/png" href={Favicon.src} />
        <title>CMS - Open Island</title>
        <meta name="description" content="This is a Content Manager System For Open Island"></meta>
        <meta name="keywords" content="tourism, adventure, travel, 360 photos, cms, open, island"></meta>
        <meta name="author" content="Mata Technologies"></meta>
        <meta name="robots" content="index, follow"></meta>
        <meta property="og:title" content="CMS - Open Island"></meta>
        <meta property="og:description" content="This is a Content Manager System For Open Island"></meta>
        <meta property="og:image" content={t1.src}></meta>
        <meta property="og:image:width" content="1200"></meta>
        <meta property="og:image:height" content="630"></meta>
        <meta property="og:url" content="https://cms.openisland.com/dashboard"></meta>
        <meta property="og:type" content="website"></meta>
      </head>
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
              <Grid2 size={4}
                sx={{
                  fontSize: "2rem", // Example of custom styling
                  fontFamily: "inter",
                  fontWeight: "900",
                  color: "white",
                  padding: 2,
                }}
              >
                <Box component={'img'} sx={{ width: '100%' }} src={LogoImg.src} onClick={onClickLogo}></Box>
              </Grid2>
              <Grid2 size={5}>
              </Grid2>
              <Grid2 size={3}>
                {userData?.user &&
                  <Button variant="text" fullWidth sx={{
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
                }

              </Grid2>
            </Grid2>
          </Box>
          {children}

        </Box>
      </body>
    </html >
  );
}
