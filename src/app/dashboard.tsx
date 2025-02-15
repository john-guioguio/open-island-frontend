import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  IconButton,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Button,
  TableHead,
  Fade,
  Snackbar,
  Alert,
  Grid2,
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { Delete } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import type { DataItem } from './components/type';
import { TransitionProps } from '@mui/material/transitions';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteDialog from './components/DeleteDialog';
import axiosClient from '@/lib/axiosClient';

import Cookies from 'js-cookie';
type TabType = "SignUp" | "Login" | "Dashboard" | "CMS" | "Destination" | "ForgotPassword"; // ✅ Define the type
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
 
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function CustomPaginationActionsTable({ rows,
  setPageTab, setSelectedItem, handleDeleteButton, handleClickOpen, handleCloseConfirm, openDelete }: { openDelete: boolean; handleClickOpen: () => void; handleCloseConfirm: () => void; setSelectedItem: (setSelectedItem: DataItem) => void; rows: DataItem[]; setPageTab: (setPageTab: TabType) => void; handleDeleteButton: (e: React.FormEvent, id: string) => void }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [tagFilter, setTagFilter] = React.useState('');
  const [open, setOpen] = React.useState<boolean>(false);

 
  const [selectedDeleteID, setSelectedDeleteID] = React.useState<string>(''); 
  const [stateTrans] = React.useState<{
    open: boolean;
    Transition: React.ComponentType<TransitionProps & { children: React.ReactElement }>;
  }>({
    open: false,
    Transition: Fade,  // Ensure `Fade` is a valid transition component
  });

  const handleClose = () => {
    setOpen(false);
  };
  // Extract unique categories and tags for filtering
  const uniqueCategories = Array.from(new Set(rows.flatMap(row => row.categories)));
  const uniqueTags = Array.from(new Set(rows.flatMap(row => row.tags)));

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
    setPage(0);
  };

  // Handle tag change
  const handleTagChange = (event: SelectChangeEvent) => {
    setTagFilter(event.target.value);
    setPage(0);
  };

  // Filter rows based on search, category, and tag filters
  const filteredRows = rows.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? row.categories.includes(categoryFilter) : true;
    const matchesTag = tagFilter ? row.tags.includes(tagFilter) : true;
    return matchesSearch && matchesCategory && matchesTag;
  });

  // Avoid layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openExternalPage = ({ val, targ }: { val: string, targ: '_blank' | '_self' }) => {
    window.open(val, targ); // Open in new tab
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      // Make the request with Axios, fetching the image as a Blob
      const allCookies = Cookies.get();
      const response = await axiosClient.get("/" + imageUrl + "/" + filename, {
        headers: {
          'X-XSRF-TOKEN': allCookies['XSRF-TOKEN'],
        }, withCredentials: true,

        responseType: "blob", // Request the data as a Blob
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data]);

      // Create a temporary link element to download the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename; // Set the file name
      document.body.appendChild(link);
      link.click(); // Trigger the download
      document.body.removeChild(link); // Remove the temporary link
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  return (
    <Box sx={{ bgcolor: 'white' }}>
      {/* Search and Filter Controls */}
      <Box display="flex" gap={2} p={2}  >
        <TextField label="Search by Name" variant="outlined" value={search} onChange={handleSearchChange} fullWidth />
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Filter by Category</InputLabel>
          <Select value={categoryFilter} onChange={handleCategoryChange} label="Filter by Category">
            <MenuItem value="">All</MenuItem>
            {uniqueCategories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" fullWidth>
          <InputLabel>Filter by Tag</InputLabel>
          <Select value={tagFilter} onChange={handleTagChange} label="Filter by Tag">
            <MenuItem value="">All</MenuItem>
            {uniqueTags.map(tag => (
              <MenuItem key={tag} value={tag}>{tag}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant='outlined' sx={{ mx: 1, minWidth: 150 }} startIcon={<AddLocationAltIcon />} onClick={() =>
          openExternalPage({ val: '/island/add', targ: '_self' })}>Add Island</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">

          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Categories</TableCell>
              <TableCell align="center">Tags</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Thumbnail</TableCell>
              <TableCell align="center">Virtual Tour</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : filteredRows
            ).map(row => (
              <TableRow key={row.id}  >
                <TableCell component="th" scope="row" sx={{ height: 40 }}>
                  {row.name}
                </TableCell>
                <TableCell style={{ width: 160, }} align="center">
                  {row.description}
                </TableCell>
                <TableCell style={{ width: 160, }} align="center">
                  {row.categories.join(', ')}
                </TableCell>
                <TableCell style={{ width: 160, }} align="center">
                  {row.tags.join(', ')}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {row.address}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <Button startIcon={<FileDownloadIcon></FileDownloadIcon>} onClick={() => downloadImage(row.thumbnail?.toString() || "", row.name + '_thumbnail.jpg')}  >Download</Button>
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  <Button startIcon={<FileDownloadIcon></FileDownloadIcon>} onClick={() => downloadImage(row.virtual_tour?.toString() || "", row.name + '_Virtual_tour.jpg')}>Download</Button>
                </TableCell>
                <TableCell style={{ width: 220 }} align="right">
                  <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                      <Button variant='outlined' sx={{ mx: 1, minWidth: 100 }} color="error" startIcon={<Delete />} onClick={() => { setSelectedDeleteID(row.id); handleClickOpen() }}>Delete</Button>
                    </Grid2>
                    <Grid2 size={6}>
                      <Button variant='outlined' sx={{ mx: 1, minWidth: 100 }} startIcon={<EditIcon />} onClick={() => { setSelectedItem(row); setPageTab('CMS'); openExternalPage({ val: "/island/edit?id=" + row.id, targ: '_self' }) }}>Edit</Button>
                    </Grid2>
                  </Grid2>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 46 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={5}
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <DeleteDialog open={openDelete} handleClose={handleCloseConfirm} confirmDelete={handleDeleteButton} selectedID={selectedDeleteID}></DeleteDialog>
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
    </Box >
  );
}
