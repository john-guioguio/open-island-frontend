import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function DeleteDialog({ open, handleClose, confirmDelete, selectedID }: { selectedID: string; open: boolean; handleClose: () => void; confirmDelete: (e: React.FormEvent, id: string) => void; }) {
    const [confirmText, setConfirmText] = React.useState<string>("");
    const HandleconfirmDelete = (e: React.FormEvent) => {
        if (confirmText == "Delete Island") {
            confirmDelete(e, selectedID);
            handleClose();
        }
    }

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',

                }}
            >
                <DialogTitle>Delete Island</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To Delete Island Please enter <span style={{fontWeight:'bold'}}>Delete Island</span> to confirm.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        
                        margin="dense"
                        id="confirm_delete"
                        name="confirm_delete"
                        label="Delete Island"
                        type="text"
                        fullWidth
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={HandleconfirmDelete} disabled={confirmText=="Delete Island"?false:true}>Delete</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
