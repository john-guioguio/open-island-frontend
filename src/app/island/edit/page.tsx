'use client';
import { Alert, Box, Fade, Snackbar, Typography, } from "@mui/material";
import ContentManagerSystem from "../../cms";
import { useEffect, useState } from "react";
import { TransitionProps } from '@mui/material/transitions';
import { getCsrfToken, getDestination } from "../../api/auth";

import { DataItem, LoginResponse } from "../../components/type";
import l1 from '../../../Images/loading/2s_Leche_Flan 1.png';
import l2 from '../../../Images/loading/3s_Snabaw 1.png';
import l3 from '../../../Images/loading/4s_Taho 1.png';
import l4 from '../../../Images/loading/5s_Pastry 1.png';
import l5 from '../../../Images/loading/6s_Bread 1.png';
import l6 from '../../../Images/loading/7s_E-trycicle 1.png';
// import { rows } from "@/app/types";
import Cookies from 'js-cookie';
import Image, { StaticImageData } from "next/image";
const Edit = () => {
  const [selectedItem, setSelectedItem] = useState<DataItem>({
    id: "",
    name: "",
    description: "",
    categories: [],
    tags: [],
    address: "",
    thumbnail: "",
    virtual_tour: []
  });
  const [loadingImage] = useState<StaticImageData[]>([l1, l2, l3, l4, l5, l6]);
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
  const [randomIndex, setRandomIndex] = useState<number>(0);
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
      virtual_tour: foundItem?.virtual_tour || [],
      thumbnail: foundItem?.thumbnail || ""
    });
  }, [destination, id]); // This will run when userData changes  
  useEffect(() => {
    // Log previous pageTab for debugging 

    setRandomIndex(Math.floor(Math.random() * loadingImage.length));
    const storedUserData = localStorage.getItem('userData');
    const allCookies = Cookies.get();
    // console.log(allCookies['XSRF-TOKEN']);
    if (storedUserData && allCookies['XSRF-TOKEN']) {

      fetchData();
    } else {
      // If no user data, fetch CSRF token and login

      getCsrfToken({ setUserData });
      openExternalPage({ val: '/login', targ: '_self' });
    }
  }, [loadingImage.length]); // This will run when userData changes 
  useEffect(() => {
    //
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
          <Box sx={{ width: '90%', mx: "auto", px: 6, pb: 2, boxShadow: 3, borderRadius: 2, bgcolor: 'rgba(255, 255, 255,1)', mt: 7, minHeight: '85vh', }}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',  // Center element
              margin: 'auto',
            }}>
              <Image
                src={loadingImage[randomIndex].src}
                alt={loadingImage[randomIndex].src}
                width={260}
                height={250}
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              >
              </Image>
              <Typography variant="h4" color="primary">Loading...</Typography>
            </Box>
          </Box>
        }

      </Box>
    </>
  );
};
export default Edit; 