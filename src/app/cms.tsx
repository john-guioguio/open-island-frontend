

import React, { useEffect, useState } from "react";
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Chip, OutlinedInput, Box, Typography, SelectChangeEvent, Grid2, Snackbar, Alert, Fade, LinearProgress,  List } from "@mui/material";
import { useDropzone, Accept } from "react-dropzone"; // Import react-dropzone
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AlertSeverity, DataItem, VirtualTour_OBJ, categoriesOptions, tagsOptions } from "./components/type";
import axios from "@/lib/axiosClient";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
const acceptFormats: Accept = {
  "image/jpeg": [],
  "image/png": [],
  "image/webp": [],
};
const CustomVirtualTour = ({ fileImage, titleHostpot, setTitleHostpot, key }: { key: string, fileImage: string, titleHostpot: string, setTitleHostpot: (val: string) => void }) => {
  return (
    <Grid2 container key={key}>
      <Grid2 size={4}>
        <Image
          src={fileImage}
          alt={fileImage}
          style={{ maxWidth: "100%", minHeight: 300, objectFit: "cover" }}
        />
      </Grid2>
      <Grid2 size={8}>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" value={titleHostpot} onChange={(e) => setTitleHostpot(e.target.value)} />
      </Grid2>
    </Grid2>
  )
}
// type TabType = "SignUp" | "Login" | "Dashboard" | "CMS" | "Destination" | "ForgotPassword"; // ✅ Define the type
export default function ContentManagementSystem({ dataItem, setSelectedItem }: { dataItem: DataItem; setSelectedItem: (val: DataItem) => void }) {

  const [open, setOpen] = useState<boolean>(false);
  const [onLoading, setOnloading] = useState<boolean>(false);

  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [previewVirtualTour, setPreviewVirtualTour] = useState<VirtualTour_OBJ[]>([]);
  const [resultMSG, setResultMSG] = useState<string>('');
  const [alertServerity, setAlertServerity] = useState<AlertSeverity>('warning');
  const [stateTrans] = useState<{
    open: boolean;
    Transition: React.ComponentType<TransitionProps & { children: React.ReactElement }>;
  }>({
    open: false,
    Transition: Fade,  // Ensure `Fade` is a valid transition component
  });

  const [formData, setFormData] = useState<DataItem>(dataItem);
  useEffect(() => {
    if (dataItem.thumbnail) setPreviewThumbnail((process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000") + `/storage/${dataItem.thumbnail}`);

    if (dataItem.virtual_tour) setPreviewVirtualTour(dataItem.virtual_tour);

  }, [dataItem]);

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
    const files = acceptedFiles;


    if (files) {
      if (imageType === "thumbnail") {
        setPreviewThumbnail(URL.createObjectURL(files[0]));
        setFormData((prev) => ({
          ...prev,
          thumbnail: files[0],
        }));
      } else if (imageType === "virtual_tour") {
        const newVirtualTours = acceptedFiles.map((file) => ({
          title: "",
          path: URL.createObjectURL(file),
          file, // Store the original File object
        }));
        files.map((file) => {

          setPreviewVirtualTour([...previewVirtualTour, { title: "", path: URL.createObjectURL(file), file: file }]);
        })
        setFormData((prev) => ({
          ...prev,
          virtual_tour: [...(prev.virtual_tour || []), ...newVirtualTours], // Ensure an array
        }));
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnloading(true);
    console.log("Form Submitted", formData);
    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("categories", JSON.stringify(formData.categories));
    formDataToSend.append("tags", JSON.stringify(formData.tags));
    if (formData.thumbnail instanceof File) {
      formDataToSend.append("thumbnail", formData.thumbnail); // Append file
    } else {
      console.error("No Thumbnail");
    }

    if (formData.virtual_tour instanceof File) {
      formDataToSend.append("virtual_tour", formData.virtual_tour); // Append file
    } else {
      console.error("No virtual_tour");
    }


    if (formData.id) {
      try {

        formDataToSend.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
        const response = await axios.post(
          `/api/destinations/${formData.id}`,
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
    onDrop: (acceptedFiles) => handleFileChange(acceptedFiles, "virtual_tour"),
  });

  const handleChipDelete = (event: React.MouseEvent, value: string, field: "categories" | "tags") => {
    event.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] ? prev[field].filter((item) => item !== value) : [],
    }));

  };


  const openExternalPage = ({ val, targ }: { val: string, targ: '_blank' | '_self' }) => {
    window.open(val, targ); // Open in new tab
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '90% ', mx: "auto", px: 6, pb: 2, boxShadow: 3, borderRadius: 2, bgcolor: 'rgba(255, 255, 255,1)', mt: 7 }}>

      <Typography variant="h3" sx={{ pt: 3 }}>Content Management System</Typography>
      <Grid2 container spacing={3}>
        <Grid2 size={4}>
          {formData.id && <TextField
            label="Destination ID"
            name="destinationID"
            value={formData.id}
            onChange={handleChange}
            hidden
            disabled
            fullWidth
            margin="normal"
          />}
          <TextField
            label="Destination Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={onLoading}
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
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
              value={formData.categories}
              onChange={(e) => handleSelectChange(e, "categories")}
              input={<OutlinedInput label="Category" />}
              disabled={onLoading}
            >
              {categoriesOptions.map((category) => {
                // console.log(category, formData.categories.includes(category));
                return (
                  <MenuItem key={category} value={category}
                    sx={{
                      display: formData.categories.includes(category) ? 'none' : 'block'
                    }}
                  >
                    {category}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {formData.categories.map((value) => (
              <Chip key={value} label={value} disabled={onLoading} color="primary" variant="outlined" onDelete={(e) => { handleChipDelete(e, value, 'categories') }} />
            ))}
          </Box>



          {/* <TextField
            label="Complete Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          /> */}


          {/* Tags Select (Multiple) */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Tags</InputLabel>
            <Select
              disabled={onLoading}
              multiple
              value={formData.tags}
              onChange={(e) => handleSelectChange(e, "tags")}
              input={<OutlinedInput label="Tags" />}

            >

              {tagsOptions.map((tag) => {
                return (
                  <MenuItem key={tag} value={tag}
                    sx={{
                      bgcolor: formData.tags.includes(tag) ? 'rgba(0,0,0,0.2)' : 'rgba(255, 255, 255, 1)',
                      display: formData.tags.includes(tag) ? 'none' : 'block'
                    }}  >
                    {tag}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {formData.tags.map((value) => (
              <Chip key={value} label={value} color="secondary" variant="outlined" disabled={onLoading} onDelete={(e) => { handleChipDelete(e, value, 'tags') }} />
            ))}
          </Box>
          <TextField
            label="Complete Address"
            name="address"
            value={formData.address}
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
              virtual_tour: null,
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
            {previewThumbnail && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2">Preview of Thumbnail</Typography>
                <Image
                  src={previewThumbnail}
                  alt={previewThumbnail}
                  style={{ maxWidth: "100%", minHeight: 300, objectFit: "cover" }}
                />
              </Box>
            )}
          </Box>
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
            {previewVirtualTour && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2">Preview of Virtual Tour</Typography>
                <List  >
                  {previewVirtualTour.map((item, index) =>

                    <CustomVirtualTour key={item.title} fileImage={item.path} titleHostpot={formData.virtual_tour ? formData.virtual_tour[index].title : ''} setTitleHostpot={(val) => {
                      setFormData(prev => ({
                        ...prev,
                        virtual_tour: prev.virtual_tour?.map((vt, i) =>
                          i === index ? { ...vt, title: val } : vt
                        ) || []
                      }));
                    }}></CustomVirtualTour>
                  )}
                </List>

              </Box>
            )}

          </Box>
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
