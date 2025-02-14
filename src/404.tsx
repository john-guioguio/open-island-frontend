"use client"
import { Box, Button, Grid2, Typography, useMediaQuery } from "@mui/material";
import landingPageIMG from './Images/landingpageBG.png';
import LogoImg from './Images/logo.png';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useEffect } from "react";

import React from "react";
export default function NotFound() {

    const isTab = useMediaQuery("(max-width:1380px)");
    const isMobile = useMediaQuery("(max-width:820px)");
    const onClickLogo = () => {
        openExternalPage({ val: '/', targ: '_self' });
    };
    const openExternalPage = ({ val, targ }: { val: string, targ: '_blank' | '_self' }) => {
        window.open(val, targ); // Open in new tab
    };
    useEffect(() => {
        const title = document.getElementById("title");
        if (title) {
            title.innerText = "404 Page Not Found - Open Island";
        }
    }, []);
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
                width: '100%',
                position: 'absolute'
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

                    </Grid2>
                </Grid2>
                <Box sx={{ marginTop: 25, textShadow: "0px 0px 70px black" }}>
                    <Typography variant="h1" sx={{ color: 'white' }}>404 Error</Typography>
                    <Typography variant="h3" sx={{ color: 'white' }}>Page not found!</Typography>
                    <Button variant="text" sx={{ fontSize: 'x-large', mt: 5 }}
                        onClick={onClickLogo}
                        startIcon={<HomeOutlinedIcon></HomeOutlinedIcon>}> Home</Button>
                </Box>
            </Box>
        </Box>
    )
}