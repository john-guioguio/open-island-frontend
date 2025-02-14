'use client';
import { Alert, Box, Fade, Snackbar } from "@mui/material"; 
import CMS_Dashboard from "./dashboard";
import { useEffect, useState } from "react";
import { TransitionProps } from '@mui/material/transitions';
import { getCsrfToken} from "./api/auth"; 
import { getDestination } from "./api/auth"; 
import React from "react";
import type { TabType, UserData, AlertSeverity, DataItem } from "./components/type";
// import  {  rows } from "@/app/types";
import Cookies from 'js-cookie';
import axios from "@/lib/axiosClient";
function Dashboard_CMS () {
  const [prev_pageTab, setPageTab] = useState<TabType>('Login');
  const [resultMSG, setResultMSG] = useState<string>('');
  const [isLoad, setLoad] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [selectedItem, setSelectedItem] = useState<DataItem>({
    id: "",
    name: "",
    description: "",
    categories: [],
    tags: [],
    address: "",
    thumbnail: '',
    virtual_tour:[],
  });
  const [alertServerity, setAlertServerity] = useState<AlertSeverity>('warning');
  const [stateTrans] = useState<{
    open: boolean;
    Transition: React.ComponentType<TransitionProps & { children: React.ReactElement }>;
  }>({
    open: false,
    Transition: Fade,  // Ensure `Fade` is a valid transition component
  });
 
  const [open, setOpen] = useState<boolean>(false);
  const [destination, setDestination] = useState<DataItem[]>([]);
  // const onChangePageTab = (tab: TabType) => {
  //   setPageTab(tab);
  //   openExternalPage({ val: '/cms', targ: '_self' });
  //   // console.log(tab);
  // }
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
    if(selectedItem){

    }else if(prev_pageTab){
      
    } 
    fetchData();
    const storedUserData = localStorage.getItem('userData');
    const allCookies = Cookies.get();
    // console.log(allCookies['XSRF-TOKEN']);
    if (storedUserData && allCookies['XSRF-TOKEN']) {
      setPageTab('Dashboard');

      setLoad(true);
    } else {
      // If no user data, fetch CSRF token and login 
      // setPageTab('Login');

      openExternalPage({ val: '/login', targ: '_self' });
      getCsrfToken({ setUserData });
    }
  }, [userData,prev_pageTab,selectedItem]); // This will run when userData changes

  const fetchData = async () => {
    await getDestination({ setDestination });
  };


  const handleDeleteButton = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    try {
      const response = await axios.delete("/api/destinations/" + id);
      setOpen(true);
      setAlertServerity('success');
      console.log("Success:", response.data);
      fetchData();
      setResultMSG('Island Deleted!');
    } catch (error) {

      setOpen(true);
      setAlertServerity('error');
      setResultMSG('Error to Update Island');
      console.error("Error submitting form:", error);
    }
  }

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const handleClickOpen = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  return (
    <>
      {
        isLoad ?

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
              <Box sx={{ mx: 'auto', width: '90%', mt: '10%' }}>
                <CMS_Dashboard
                  rows={destination}
                  handleCloseConfirm={handleCloseDelete}
                  setPageTab={setPageTab}
                  handleDeleteButton={handleDeleteButton}
                  setSelectedItem={setSelectedItem}
                  handleClickOpen={handleClickOpen}
                  openDelete={openDelete}
                ></CMS_Dashboard>
              </Box>


            </Box>
          </> :
          <></>
      }
    </>

  );
};

export default Dashboard_CMS; 