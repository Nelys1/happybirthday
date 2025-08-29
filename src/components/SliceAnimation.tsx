import React, { useEffect, useMemo, useState } from "react";
import "./SliceAnimation.css";

interface FlashyImageProps {
  src: string;
  width?: string;
  height?: string;
}

const FlashyImage: React.FC<FlashyImageProps> = ({ src, width = "400px", height = "auto" }) => {
  return (
    <div className="flashy-container">
      <img src={src} alt="flashy" className="flashy-image" style={{ width, height }} />
    </div>
  );
};

export default FlashyImage;