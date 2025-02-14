'use client';
import { Alert, Box, Button, Fade, Grid2, Snackbar, Typography, useMediaQuery } from "@mui/material";
import ContentManagerSystem from "../../cms";
import { useEffect, useState } from "react";
import { TransitionProps } from '@mui/material/transitions';
import { getCsrfToken, getDestination, getUserLogin, logout } from "../../api/auth";
import LogoutIcon from '@mui/icons-material/Logout';
import type { UserData, AlertSeverity, DataItem } from "../../components/type";

import Cookies from 'js-cookie';

const ADD = () => {
  const [selectedItem, setSelectedItem] = useState<DataItem>({
    id: "",
    name: "",
    description: "",
    categories: [],
    tags: [],
    address: "",
    thumbnail: '',
    virtual_tour: '',
  });
  const [destination, setDestination] = useState<DataItem[]>([]);
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const [resultMSG, setResultMSG] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);


  // const [destination, setDestination] = useState<DataItem[]>([]);
  const [alertServerity, setAlertServerity] = useState<AlertSeverity>('warning');
  const [stateTrans] = useState<{
    open: boolean;
    Transition: React.ComponentType<TransitionProps & { children: React.ReactElement }>;
  }>({
    open: false,
    Transition: Fade,  // Ensure `Fade` is a valid transition component
  });

  const isTab = useMediaQuery("(max-width:1380px)");
  const isMobile = useMediaQuery("(max-width:820px)");
  const [open, setOpen] = useState<boolean>(false);

  const openExternalPage = ({ val, targ }: { val: string, targ: '_blank' | '_self' }) => {
    window.open(val, targ); // Open in new tab
  };
  const handleClose = () => {
    openExternalPage({ val: '/', targ: '_self' });
    setOpen(false);
  };
  const onClickLogo = () => {
    location.reload();
  }

  const fetchData = async () => {
    await getDestination({ setDestination });
  };
  useEffect(() => {
    // Log previous pageTab for debugging 
    const foundItem = destination.find((val) => val.id == id);
    setSelectedItem({
      id: foundItem?.id.toString() || '',
      name: foundItem?.name || "",
      description: foundItem?.description || "",
      categories: foundItem?.categories || [],
      tags: foundItem?.tags || [],
      address: foundItem?.address || "",
      thumbnail: foundItem?.thumbnail || '',
      virtual_tour: foundItem?.virtual_tour || '',
    });
    console.log(foundItem);
  }, [destination]); // This will run when userData changes 
  useEffect(() => {
    // Log previous pageTab for debugging 

  }, [selectedItem]); // This will run when userData changes 
  useEffect(() => {
    // Log previous pageTab for debugging 

    fetchData();
    const storedUserData = localStorage.getItem('userData');
    const allCookies = Cookies.get();
    // console.log(allCookies['XSRF-TOKEN']);
    if (storedUserData && allCookies['XSRF-TOKEN']) {

    } else {
      // If no user data, fetch CSRF token and login

      getCsrfToken({ setUserData });
    }
  }, [userData]); // This will run when userData changes 
  return (
    <><Snackbar open={open} autoHideDuration={2000} onClose={handleClose}
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
        backgroundColor: 'rgba(0,0,0,0.1)',
        height: '100%',
        width: '100%',
        left: 0,
        right: 0,
        top: 0,
        position: 'fixed',
        zIndex: 1,
        overflowY: 'auto'
      }}>
        <ContentManagerSystem
          setSelectedItem={setSelectedItem}
          dataItem={selectedItem}
        ></ContentManagerSystem>
      </Box ></>

  );
};
export default ADD;  