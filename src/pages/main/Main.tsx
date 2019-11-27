import React, { useState, useEffect, useRef } from "react";

import "./Main.scss";
import VideoCapture from "../../components/VideoCapture";
import Instruction from "../../components/Instruction";

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

const Main = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const webcamAvailable = hasGetUserMedia();
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [isWebcamBlocked, setIsWebcamBlocked] = useState(false);
  const [showInstructionIndex, setShowInstructionIndex] = useState(0);

  if (!webcamAvailable) {
    alert(
      "This browser does not support webcam, Please use other browsers instead (Chrome, Firefox, etc.)",
    );
  }

  const closeInstruction = () => {
    setShowInstructionIndex(0);
  };

  const handleStart = () => {
    setCurrentStep(1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep => (currentStep - 1 < 0 ? 0 : currentStep - 1));
  };

  useEffect(() => {
    if (currentStep === 1) {
      setShowInstructionIndex(1);
      const constraints = {
        video: {
          width: { min: 640, ideal: 1280 },
          height: { min: 480, ideal: 720 },
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          if (videoElementRef.current) {
            videoElementRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          alert(
            `Your webcam does not meet the minimum requirements. \n${err.name}: ${err.constraint}`,
          );
          setIsWebcamBlocked(true);
        });
    } else if (currentStep === 2) {
      setShowInstructionIndex(2);
    }
  }, [currentStep]);

  return (
    <>
      {currentStep === 0 && (
        <div className="main-container">
          <h3 className="first-label">First, you have to open your webcam.</h3>
          <button
            disabled={!webcamAvailable}
            className="open-button"
            onClick={handleStart}
          >
            Open
          </button>
        </div>
      )}
      {isWebcamBlocked && (
        <div className="main-container">
          <h1 className="first-label">
            Please allow webcam access to use this application
          </h1>
        </div>
      )}
      {!isWebcamBlocked && (
        <div>
          {showInstructionIndex === 1 && (
            <Instruction
              handleBack={handleBack}
              closeInstruction={closeInstruction}
            >
              1. Capture the background scene <br />
              (Don't move the camera after the image is captured)
            </Instruction>
          )}
          {/* {showInstructionIndex === 2 && (
            <Instruction
              handleBack={handleBack}
              closeInstruction={closeInstruction}
            >
              2. Find the cloak that is in GREEN () color to use as your
              invisible cloak !
            </Instruction>
          )} */}
          {currentStep !== 0 && (
            <VideoCapture
              handleBack={handleBack}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              videoProps={{
                video: videoElementRef.current,
              }}
              ref={videoElementRef}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Main;
