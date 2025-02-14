"use client"; 
import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { Box, Link, TextField } from '@mui/material'; 

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    }, '& .MuiDialog-paper': {
        borderRadius: 15,  // Apply border-radius to the dialog
        width: "80%",
        maxWidth: '30%',
        fontFamily: 'inter' // Disable the default maxWidth behavior of Dialog
    },
}));
 
const styleFormInput = { mx: 1, display: 'block', width: '100%' };

export default function SignUp() {
    const openExternalPage = ({val,targ}:{val:string,targ:'_blank'|'_self'}) => {
        window.open(val, targ); // Open in new tab
      }; 
    const handleClose = () => {
        openExternalPage({val:'/cms',targ:'_self'});
    };

    return (
        <React.Fragment>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={true}
            >
                <DialogTitle sx={{ m: 0, p: 5 }} id="customized-dialog-title">


                    <Box sx={{ width: '92%', m: 'auto' }}>
                        <Typography sx={{
                            fontSize: 'x-large',
                            fontWeight: 'bold', fontFamily: 'inter'
                        }}>
                            Sign Up Now
                        </Typography>
                        <Typography sx={{
                            fontSize: 'small', fontFamily: 'inter'
                        }}>
                            Ready to Start Your Journey?
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{
                    p: 3,
                }}>
                    <Box sx={{ width: '90%', px: 1, m: 'auto' }}>
                        <Typography sx={styleFormInput}>Username:</Typography>
                        <TextField
                            sx={{ my: 1, fontFamily: 'inter' }}
                            name='username'
                            fullWidth
                            id="outlined-error-helper-text"
                            placeholder='Username'
                        />
                        <Typography sx={styleFormInput}>Email Address:</Typography>
                        <TextField
                            sx={{ my: 1, fontFamily: 'inter' }}
                            name='email'
                            fullWidth
                            id="outlined-error-helper-text"
                            placeholder='Email Address'
                        />
                        <Typography sx={styleFormInput}>Password:</Typography>
                        <TextField
                            sx={{ my: 1, fontFamily: 'inter', }}
                            name='password'
                            fullWidth
                            id="outlined-error-helper-text"
                            placeholder='Password'
                        />
                        <Typography sx={styleFormInput}>Confirm Password:</Typography>
                        <TextField
                            sx={{ my: 1, fontFamily: 'inter' }}
                            name='cmf_password'
                            fullWidth
                            id="outlined-error-helper-text"
                            placeholder='Confirm Password'
                        />

                        <Button variant='contained'
                            sx={{
                                display: 'block',
                                mx: 'auto',
                                mt: 4,
                                p: 'auto',
                                borderRadius: 10,
                                width: '95%',
                                textAlign: 'center',
                                fontFamily: 'inter',
                                textTransform: 'none', backgroundColor: '#2E7AA9',
                            }}
                            autoFocus onClick={handleClose}>
                            Sign Up
                        </Button>
                        <Typography sx={{
                            mx: 'auto',
                            mt: 5,
                            textAlign: 'center',
                            color: '#282e31', fontFamily: 'inter'
                        }}>Already have an account? <Link sx={{ textDecoration: 'none',cursor:'pointer' , color: '#2E7AA9'}} onClick={() =>  openExternalPage({val:'/cms/login',targ:'_self'})}>Login</Link></Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}
