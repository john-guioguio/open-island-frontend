import { Box, ImageList, ImageListItem } from "@mui/material";
import React, { useRef, useState } from "react";
import PanoViewer from "./components/360Viewr";
import pano1 from '../../Images/pano/8 Panorama (2).jpg';
import Card from './components/card';

type itemDataType = {
  img: string;
  title: string;
  author: string;
}

export default function Viewer() {
  const [itemData] = useState<itemDataType[]>([
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
      author: '@bkristastucchio',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
      author: '@rollelflex_graphy726',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
      author: '@helloimnik',
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      title: 'Coffee',
      author: '@nolanissac',
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      title: 'Hats',
      author: '@hjrc33',
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      title: 'Honey',
      author: '@arwinneil',
    },
    {
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
      author: '@tjdragotta',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
      author: '@katie_wasserman',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
      author: '@silverdalex',
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
      author: '@shelleypauls',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
      author: '@peterlaster',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
      author: '@southside_customs',
    },
  ]);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll horizontally when scrolling vertically
  const handleScroll = (event: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      event.preventDefault();
      scrollContainerRef.current.scrollLeft += event.deltaY; // Scroll left or right based on scroll direction
    }
  };
  return (
    <>
      <Box sx={{ bgcolor: "white", width: '100%', height: '100%' }}>
        <PanoViewer imageUrl={pano1.src}></PanoViewer>

        <Box sx={{ position: 'fixed', bgcolor: 'rgba(0,0,0,0.5)', width: '100%', height: '20%', bottom: 0, left: 0, zIndex: 999 }}>
          <Box sx={{
            overflowX: 'auto', // Enables horizontal scrolling
            display: 'flex', // Layout items horizontally in a row
            gap: 2, // Spacing between items
            padding: 2, // Optional padding around the content
            maxHeight: '100%' // Ensure items do not overflow vertically
          }}

            ref={scrollContainerRef}
            onWheel={handleScroll}
          >
            {/* Render ImageListItem in a horizontal row */}
            {itemData.map((item: itemDataType) => (
              <ImageListItem key={item.title} sx={{ flexShrink: 0 }}>
                <Card item={item}></Card> {/* Use your Card component here */}
              </ImageListItem>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
