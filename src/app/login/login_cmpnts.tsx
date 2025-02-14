"use client";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { Box, Checkbox, FormControlLabel, Grid2, Link, TextField, useMediaQuery } from '@mui/material';
import { Fragment, useEffect, useState, ChangeEvent } from 'react';
import {  loginUser } from '../api/auth';

type AlertSeverity = "error" | "warning" | "info" | "success"; // ✅ Define the type
type TabType = "SignUp" | "Login" | "Dashboard" | "CMS" | "Destination" | "ForgotPassword"; // ✅ Define the type
const styleFormInput = { mx: 1, display: 'block', width: '100%' };
type login = {
    setPageTab: (setPageTab: TabType) => void;
    prev_pageTab: TabType | null;
    setResultMSG: (setResultMSG: string) => void;
    setOpen: (setOpen: boolean) => void;
    setAlertServerity: (setAlertServerity: AlertSeverity) => void;
    // user: UserData | null;
    setUser: (setUser: UserData) => void;
};
type UserData = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    password: string;
    remember_token?: string;
    created_at: string;
    updated_at: string;
};
interface BootstrapDialogProps extends DialogProps {
    isMobile?: boolean;
    isTab?: boolean;
}
const BootstrapDialog = styled(({  ...props }: BootstrapDialogProps) => (
    <Dialog {...props} />
))(({ theme, isMobile, isTab }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
    "& .MuiDialog-paper": {
        borderRadius: 15, // Apply border-radius to the dialog
        width: "60%",
        maxWidth: isMobile ? "80%" : isTab ? "50%" : "30%",
        fontFamily: "Inter",
    },
}));
export default function Login({ setPageTab, prev_pageTab, setResultMSG, setOpen, setAlertServerity, setUser }: login) {
    const [checked, setChecked] = useState<boolean>(false); // Track the "Remember Me" checkbox state
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const isTab = useMediaQuery("(max-width:1380px)");
    const isMobile = useMediaQuery("(max-width:720px)");
    const openExternalPage = ({ val, targ }: { val: string, targ: '_blank' | '_self' }) => {
        window.open(val, targ); // Open in new tab
    };
    const handleClose = () => {
        openExternalPage({ val: '/cms', targ: '_self' });
        if(prev_pageTab){

        }
    };


    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setChecked(true); // Check "Remember Me" by default if credentials exist
        }

    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked); // Update the "Remember Me" state
    };

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle the login logic, including checking the "Remember Me" state
        if (checked) {
            // Store the username and password in localStorage or cookies
            localStorage.setItem('rememberedUsername', username);
            localStorage.setItem('rememberedPassword', password);
        }
        if (!username) {
            setResultMSG('Empty Username');
            setAlertServerity('warning');

            setOpen(true);
        } else if (!password) {
            setResultMSG('Empty Password');
            setAlertServerity('warning');
            setOpen(true);
        } else if (!username && !password) {

            setResultMSG('Empty Password & Username');
            setAlertServerity('warning');
            setOpen(true);
        } else {

            // setPageTab('Dashboard');
            try {
                const response = await loginUser(username, password);
                if (response.user) {
                    setUser(response.user as UserData);
                    setResultMSG('Success!');
                    setAlertServerity('success');
                    setOpen(true);
                } else {
                    setResultMSG(response.message || 'Something went wrong');
                    setOpen(true);
                }
            } catch (err) {
                setResultMSG('Server error, please try again.');
                console.error(err);
                setOpen(true);
            }
        };

        // Call the close dialog or do other login actions
        // handleClose();
    };

    return (
        <>
            <Fragment>

                <BootstrapDialog
                    isMobile={isMobile}
                    isTab={isTab}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    open={true}
                >
                    <DialogTitle sx={{ m: 0, pt: 5, px: 5, pb: 3 }} id="customized-dialog-title">
                        <Box sx={{ width: '92%', m: 'auto' }}>
                            <Typography sx={{
                                fontSize: 'x-large',
                                fontWeight: 'bold', fontFamily: 'Inter, sans-serif'
                            }}>
                                Login
                            </Typography>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Box component="form" sx={{ width: '90%', px: 1, m: 'auto' }} onSubmit={handleLogin}>
                            <Typography sx={styleFormInput}>Email:</Typography>
                            <TextField
                                sx={{ my: 1, fontFamily: 'inter' }}
                                name='email'
                                fullWidth
                                id="username_login"
                                placeholder='Email'
                                value={username}
                                type='email'
                                onChange={(e) => setUsername(e.target.value)} // Update username state
                                required
                            />
                            <Typography sx={styleFormInput}>Password:</Typography>
                            <TextField
                                sx={{ my: 1, fontFamily: 'inter' }}
                                name='password'
                                fullWidth
                                id="Password_login"
                                placeholder='Password'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Update password state
                                required
                            />


                            <Button
                                variant='contained'
                                sx={{
                                    display: 'block',
                                    mx: 'auto',
                                    mt: 4,
                                    p: 'auto',
                                    borderRadius: 10,
                                    width: '95%',
                                    textAlign: 'center',
                                    fontFamily: 'inter',
                                    textTransform: 'none',
                                    backgroundColor: '#2E7AA9',
                                    fontSize: 'large'
                                }}
                                type='submit' // Handle login
                            >
                                Log In
                            </Button>

                            <Grid2 container>
                                <Grid2 size={6}>
                                    <FormControlLabel
                                        control={<Checkbox checked={checked} onChange={handleChange} />}
                                        label="Remember me"
                                    />

                                </Grid2>
                                <Grid2 size={6} sx={{ mt: 1, color: '#2E7AA9', textDecoration: 'none', textAlign: 'right' }}>
                                    <Typography>
                                        <Link sx={{ color: '#2E7AA9', textDecoration: 'none', textAlign: 'right' }} onClick={() => setPageTab('ForgotPassword')} >Forgot Password</Link></Typography>

                                </Grid2>
                            </Grid2>
                            <Typography sx={{
                                mx: 'auto',
                                mt: 5,
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}>
                                Don’t have an account? <Link onClick={() => openExternalPage({ val: '/cms/signup', targ: '_self' })} sx={{ color: '#2E7AA9', textDecoration: 'none' }}>Signup</Link>
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </BootstrapDialog>

            </Fragment>

        </>
    );
}
