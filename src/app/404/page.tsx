"use client"
import { Box, Button, Typography } from "@mui/material"; 
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { useEffect } from "react";

import React from "react";
export default function NotFound() {

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

        <Box sx={{
            textShadow: "0px 0px 70px black", position: 'absolute', width: '100%', left: 0, top: 0, bgcolor: 'transparent', marginY: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            <Box>

                <Typography variant="h1" sx={{ color: 'white' }}>404 Error</Typography>
                <Typography variant="h3" sx={{ color: 'white' }}>Page not found!</Typography>
                <Button variant="text" sx={{ fontSize: 'x-large', mt: 5 }}
                    onClick={onClickLogo}
                    startIcon={<HomeOutlinedIcon></HomeOutlinedIcon>}> Home</Button>
            </Box>
        </Box>
    )
}