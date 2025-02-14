'use client';
import { useEffect, useRef } from "react";
import { Viewer } from "@photo-sphere-viewer/core"; 
import loading1 from "../../../Images/simala 1 (2).png";
import "@photo-sphere-viewer/core/index.css";

const Image360Viewer = ({ imageUrl }: { imageUrl: string }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewerRef.current) {
      new Viewer({
        container: viewerRef.current,
        panorama: imageUrl,
        loadingImg: loading1.src,
        touchmoveTwoFingers: true,
        mousewheelCtrlKey: true,
        navbar: false,
      });
    }
  }, [imageUrl]); // Re-run if the image URL changes

  return (
    <div ref={viewerRef} style={{ width: "100%", height: "100%" }}></div>
  );
};

export default Image360Viewer;
