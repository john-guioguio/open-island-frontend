'use client';

import React, { useEffect, useState } from "react";
import {
  TextField, Button, MenuItem, Select, InputLabel, FormControl, Chip,
  OutlinedInput, Box, Typography, SelectChangeEvent, Grid2, Snackbar, Alert, Fade, LinearProgress, List, IconButton,
  Skeleton
} from "@mui/material";
import { useDropzone, Accept } from "react-dropzone"; // Import react-dropzone
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AlertSeverity, DataItem, VirtualTour_OBJ, categoriesOptions, tagsOptions } from "./components/type";
import axios from "@/lib/axiosClient";
import { TransitionProps } from "@mui/material/transitions";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Image from "next/image";
const acceptFormats: Accept = {
  "image/jpeg": [],
  "image/png": [],
  "image/webp": [],
};
const CustomVirtualTour = ({ fileImage, titleHostpot, setTitleHostpot, index, deleteSelectedVtour }: { deleteSelectedVtour: (key: number) => void, index: number, fileImage: string, titleHostpot: string, setTitleHostpot: (val: string) => void }) => {

  const [loading, setLoading] = useState<boolean>(true);
  return (
    <Grid2 container key={index} spacing={1} sx={{mt:1}}>
      <Grid2 size={2}>
        {loading ?

          <Skeleton animation="wave"
            width={50}
            height={50} sx={{ aspectRatio: '1/1', minHeight: 50,maxWidth: "100%", }} />
          : ''
        }
        <Image
          src={fileImage}
          alt={fileImage}
          width={50}
          height={loading ? 0 : 50}
          onLoadingComplete={() => setLoading(false)}
          style={{ aspectRatio: '1/1', minHeight: loading ? 0 : 50, objectFit: "cover", opacity: loading ? 0 : 1 }}
        />
      </Grid2>
      <Grid2 size={7}>
        <TextField label="Title" variant="outlined" value={titleHostpot} onChange={(e) => setTitleHostpot(e.target.value)} fullWidth />
      </Grid2>
      <Grid2 size={1}>
        <IconButton aria-label="remove" size="large" color="error" sx={{ aspectRatio: '1/1', maxHeight: 50 }} onClick={() => deleteSelectedVtour(index)}><RemoveCircleIcon></RemoveCircleIcon></IconButton>
      </Grid2>
    </Grid2>
  )
}
// type TabType = "SignUp" | "Login" | "Dashboard" | "CMS" | "Destination" | "ForgotPassword"; // ✅ Define the type
export default function ContentManagementSystem({ dataItem, setSelectedItem }: { dataItem: DataItem, setSelectedItem: (val: DataItem) => void }) {

  const [open, setOpen] = useState<boolean>(false);
  const [onLoading, setOnloading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [resultMSG, setResultMSG] = useState<string>('');
  const [thumbnail, setThumbnail] = useState<File| string | null>('');
  const [virtualTour, setVirtualTour] = useState<VirtualTour_OBJ[] | null>([]);
  const [alertServerity, setAlertServerity] = useState<AlertSeverity>('warning');
  const [stateTrans] = useState<{
    open: boolean;
    Transition: React.ComponentType<TransitionProps & { children: React.ReactElement }>;
  }>({
    open: false,
    Transition: Fade,  // Ensure `Fade` is a valid transition component
  });
  const [formData, setFormData] = useState<DataItem>(dataItem);
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle multiple select changes
  const handleSelectChange = (e: SelectChangeEvent<string[]>, field: "categories" | "tags") => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value as string[] }));
  };
  const handleFileChange = (acceptedFiles: File[], imageType: "thumbnail" | "virtual_tour") => {
    if (acceptedFiles) {
      if (imageType === "thumbnail") {
        // Handle thumbnail file change
        setThumbnail(URL.createObjectURL(acceptedFiles[0] as File));
      } else if (imageType === "virtual_tour") {
        // Handle virtual tour file changes
        const newVirtualTours = acceptedFiles.map((file) => ({
          title: '', // You can allow users to add a title later
          path: URL.createObjectURL(file),
          file: file, // Store the file itself
        }));

        // Update the virtual tour state by merging the new files
        setVirtualTour((prev) => [...(prev ?? []), ...newVirtualTours]);
      }
    }
  };
  const deleteSelectedVtour = (index: number) => {
    setVirtualTour((prev) => {
      // Check if prev is null, default to an empty array if so
      const updatedVirtualTour = (prev ?? []).filter((_, i) => i !== index);

      // Set to null if the array is empty, else return the updated array
      return updatedVirtualTour.length > 0 ? updatedVirtualTour : null;
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnloading(true);
    console.log("Form Submitted", formData);
    const formDataToSend = new FormData();
    formDataToSend.append("id", formData?.id);
    formDataToSend.append("name", formData?.name);
    formDataToSend.append("description", formData?.description);
    formDataToSend.append("address", formData?.address);
    formDataToSend.append("categories", JSON.stringify(formData?.categories));
    formDataToSend.append("tags", JSON.stringify(formData?.tags));
    if (thumbnail instanceof File) {
      formDataToSend.append("thumbnail", thumbnail); // Append file
    } else {
      console.error("No Thumbnail");
    }
    if (Array.isArray(virtualTour)) {
      virtualTour.forEach((val) => {

        formDataToSend.append("virtual_tour_title[]", val.title);
        if (val.file instanceof File) {
          formDataToSend.append("virtual_tour_file[]", val.file);
        }else{
            
          formDataToSend.append("virtual_tour_file[]", val.path);
        }
      });
    }

    formDataToSend.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    if (formData?.id) {
      try {

        formDataToSend.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
        const response = await axios.post(
          `/api/destinations/${formData?.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setOpen(true);
        setAlertServerity('success');
        console.log("Success:", response.data);
        setResultMSG('Island Updated!');
        setTimeout(() => { openExternalPage({ val: '/dashboard', targ: '_self' }); }, 500);
        setOnloading(false);
      } catch (error) {

        setOnloading(false);
        setOpen(true);
        setAlertServerity('error');
        setResultMSG('Error to Update Island');
        console.error("Error submitting form:", error);
      }
    } else {
      try {
        const response = await axios.post("/api/destinations", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setOpen(true);
        setAlertServerity('success');
        console.log("Success:", response.data);
        setResultMSG('New Island Added!');
        setOnloading(false);
        setTimeout(() => { openExternalPage({ val: '/dashboard', targ: '_self' }); }, 500);

      } catch (error) {

        setOpen(true);
        setAlertServerity('error');
        setResultMSG('Error to Add Island');
        console.error("Error submitting form:", error);
        setOnloading(false);
      }
    }
  };

  // react-dropzone setup for drag and drop 
  const { getRootProps: getThumbnailProps, getInputProps: getThumbnailInputProps } = useDropzone({
    accept: acceptFormats,  // Cast to 'unknown' first and then 'Accept'
    onDrop: (acceptedFiles) => handleFileChange(acceptedFiles, 'thumbnail'),
  });

  const { getRootProps: getVirtualTourProps, getInputProps: getVirtualTourInputProps } = useDropzone({
    accept: acceptFormats, // Can be 'undefined' to allow all files
    maxFiles: 5,
    onDrop: (acceptedFiles) => handleFileChange(acceptedFiles, "virtual_tour"),
  });

  const handleChipDelete = (event: React.MouseEvent, value: string, field: "categories" | "tags") => {
    event.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] ? prev[field].filter((item) => item !== value) : [],
    }));

  };

  useEffect(() => {
    // console.log(virtualTour);
  }, [virtualTour]);
  useEffect(() => {
    setVirtualTour(formData.virtual_tour || null);  
  }, [formData.virtual_tour]);


  useEffect(() => { 
    setThumbnail(formData.thumbnail || null); 
  }, [formData.thumbnail]);

  const openExternalPage = ({ val, targ }: { val: string, targ: '_blank' | '_self' }) => {
    window.open(val, targ); // Open in new tab
  };

  return (
    <Box component="form" onSubmit={handleSubmit} method="post" sx={{ width: '90% ', mx: "auto",  pb: 2, boxShadow: 3, borderRadius: 2, bgcolor: 'rgba(255, 255, 255,1)', mt: 7 }}>

      <Typography variant="h3" sx={{ pt: 3 }}>Content Management System</Typography>
      <Grid2 container spacing={3} sx={{px:3}}>
        <Grid2 size={4}>
          {formData?.id && <TextField
            label="Destination ID"
            name="destinationID"
            value={formData?.id}
            onChange={handleChange}
            hidden
            disabled
            fullWidth
            margin="normal"
          />}
          <TextField
            label="Destination Name"
            name="name"
            value={formData?.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={onLoading}
          />

          <TextField
            label="Description"
            name="description"
            value={formData?.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            required
            disabled={onLoading}
          />

          {/* Category Select (Multiple) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              multiple
              value={formData?.categories}
              onChange={(e) => handleSelectChange(e, "categories")}
              input={<OutlinedInput label="Category" />}
              disabled={onLoading}
            >
              {categoriesOptions?.map((category) => {
                // console.log(category, formData?.categories.includes(category));
                return (
                  <MenuItem key={category} value={category}
                    sx={{
                      display: formData?.categories.includes(category) ? 'none' : 'block'
                    }}
                  >
                    {category}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {formData?.categories.map((value) => (
              <Chip key={value} label={value} disabled={onLoading} color="primary" variant="outlined" onDelete={(e) => { handleChipDelete(e, value, 'categories') }} />
            ))}
          </Box>



          <FormControl fullWidth margin="normal">
            <InputLabel>Tags</InputLabel>
            <Select
              disabled={onLoading}
              multiple
              value={formData?.tags}
              onChange={(e) => handleSelectChange(e, "tags")}
              input={<OutlinedInput label="Tags" />}

            >

              {tagsOptions?.map((tag) => {
                return (
                  <MenuItem key={tag} value={tag}
                    sx={{
                      bgcolor: formData?.tags.includes(tag) ? 'rgba(0,0,0,0.2)' : 'rgba(255, 255, 255, 1)',
                      display: formData?.tags.includes(tag) ? 'none' : 'block'
                    }}  >
                    {tag}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {formData?.tags.map((value) => (
              <Chip key={value} label={value} color="secondary" variant="outlined" disabled={onLoading} onDelete={(e) => { handleChipDelete(e, value, 'tags') }} />
            ))}
          </Box>
          <TextField
            label="Complete Address"
            name="address"
            value={formData?.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={onLoading}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={onLoading}>
            Submit
          </Button>
          <Button type="button" variant="outlined" color="primary" fullWidth sx={{ mt: 2 }} disabled={onLoading} onClick={() => {
            setSelectedItem({
              id: "",
              name: "",
              description: "",
              categories: [],
              tags: [],
              address: '',
              thumbnail: '',
              virtual_tour: []
            });
            openExternalPage({ val: '/dashboard', targ: '_self' });
          }} startIcon={<ArrowBackIcon></ArrowBackIcon>}>
            Back
          </Button>
        </Grid2>
        <Grid2 size={4} sx={{ height: '100%' }}>

          <Box
            sx={{
              mt: 2,
              p: 3,
              border: "2px dashed #1976d2",
              borderRadius: 1,
              textAlign: "center",
              cursor: "pointer",
              height: '100%'
            }}
            {...getThumbnailProps()}
          >
            <input {...getThumbnailInputProps()} />
            <Typography variant="body1" color="textSecondary">
              Drag & Drop Thumbnail image here, or click to select
            </Typography>

          </Box>
          {thumbnail && (
            <Box sx={{
              mt: 2, textAlign: "center",
              p: 1,
              border: "2px dashed #1976d2",
            }}>
              <Typography variant="body2">Preview of Thumbnail</Typography>
              
                  {loading ?

                    <Skeleton animation="wave"
                      width={450}
                      height={300} 
                      
                    sx={{maxWidth: "100%",width:'100%'}}/>
                    :
                    ''}

                  <Image
                    src={thumbnail as string}
                    width={450}
                    height={loading ? 0 : 300}
                    onLoadingComplete={() => setLoading(false)}
                    alt={thumbnail as string}
                    style={{ maxWidth: "100%", width: '100%', minHeight: loading ? 0 : 300, objectFit: "cover" }}
                  /> 

            </Box>
          )}
        </Grid2>
        <Grid2 size={4}>

          {/* File Upload for Virtual Tour */}
          <Box
            sx={{
              mt: 2,
              p: 3,
              border: "2px dashed #1976d2",
              borderRadius: 1,
              textAlign: "center",
              cursor: "pointer",
            }}
            {...getVirtualTourProps()}
          >
            <input {...getVirtualTourInputProps()} />
            <Typography variant="body1" color="textSecondary">
              Drag & Drop Virtual Tour  (360) image here, or click to select
            </Typography>


          </Box>
          {(virtualTour && virtualTour.length > 0) && (
            <Box sx={{
              mt: 2, textAlign: "center",
              p: 1,
              border: "2px dashed #1976d2",
              maxHeight: '45vh', overflowY: 'auto'
            }}>
              <Typography variant="body2">Preview of Virtual Tour</Typography>
              <List >
                {Array.isArray(virtualTour) ? virtualTour.map((item, index) =>

                  <CustomVirtualTour index={index} key={index} deleteSelectedVtour={deleteSelectedVtour} fileImage={item.path} titleHostpot={virtualTour ? virtualTour[index].title : ''} setTitleHostpot={(val) => {
                    setVirtualTour(prev => {
                      const updatedVirtualTour = (prev ?? []).map((vt, i) =>
                        i === index ? { ...vt, title: val } : vt
                      );

                      return updatedVirtualTour.length > 0 ? updatedVirtualTour : null; // Return array or null
                    });


                  }}></CustomVirtualTour>
                )
                  : ''
                }
              </List>

            </Box>
          )}
        </Grid2>

      </Grid2>
      {onLoading && <LinearProgress sx={{ mt: 2 }} />}


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
    </Box>
  );
}
