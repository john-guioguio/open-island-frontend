'use client';
import { Alert, Box, Fade, Snackbar, Typography } from "@mui/material";
import ContentManagerSystem from "../../cms";
import { useEffect, useState } from "react";
import { TransitionProps } from '@mui/material/transitions';
import { getCsrfToken, getDestination } from "../../api/auth";

import { DataItem, LoginResponse, VirtualTour_OBJ } from "../../components/type";
// import { rows } from "@/app/types";
import Cookies from 'js-cookie';
const Edit = () => {
  const [selectedItem, setSelectedItem] = useState<DataItem>({
    id: "",
    name: "",
    description: "",
    categories: [],
    tags: [],
    address: "",
    thumbnail: "",
    virtual_tour:[]
  });
  const [destination, setDestination] = useState<DataItem[]>([]);
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    // This runs only in the client
    const searchParams = new URLSearchParams(window.location.search);
    setParams(searchParams);
  }, []);
  const id = params?.get("id");
  const [userData, setUserData] = useState<LoginResponse | null>(null);

  // const [destination, setDestination] = useState<DataItem[]>([]); 
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
    openExternalPage({ val: '/', targ: '_self' });
    setOpen(false);
  };
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
      virtual_tour: foundItem?.virtual_tour||[],
      thumbnail: foundItem?.thumbnail || ""
    });
  }, [destination, id]); // This will run when userData changes  
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
    <>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}

        TransitionComponent={stateTrans.Transition}
      >
        <Alert
          onClose={handleClose}
          variant="filled"
          sx={{ width: '100%' }}
        >
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
        {selectedItem.id ?
          <ContentManagerSystem
            setSelectedItem={setSelectedItem}
            dataItem={selectedItem}
          ></ContentManagerSystem>
          :
          <Box>
            <Typography> Invalid URL</Typography>
          </Box>
        }

      </Box>
    </>
  );
};
export default Edit; 