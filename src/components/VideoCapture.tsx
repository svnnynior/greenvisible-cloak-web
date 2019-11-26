import React, { forwardRef } from "react";
import { FaCamera, FaArrowLeft } from "react-icons/fa";
import { IconContext } from "react-icons";
import "./VideoCapture.scss";

interface Props {
  currentStep: number;
  handleBack: () => void;
}
const VideoCapture = forwardRef<HTMLVideoElement, Props>(
  ({ currentStep, handleBack }, ref) => {
    return (
      <IconContext.Provider
        value={{
          style: { verticalAlign: "middle" },
          size: "1.3rem",
        }}
      >
        <div>
          <button className="back-button" onClick={handleBack}>
            <FaArrowLeft />
          </button>
          <video autoPlay ref={ref} className="video-container"></video>
          <button className="capture-button">
            <FaCamera />
          </button>
        </div>
      </IconContext.Provider>
    );
  },
);

export default VideoCapture;
