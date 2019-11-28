import React, { useState, useEffect, useRef } from "react";

import "./Main.scss";
import VideoCapture from "../../components/VideoCapture";
import Instruction from "../../components/Instruction";
import {
  GREEN_HSV_RANGE,
  BLUE_HSV_RANGE,
  ColorRangeHSV,
} from "../../utils/chromakey";

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

const Main = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const webcamAvailable = hasGetUserMedia();
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [isWebcamBlocked, setIsWebcamBlocked] = useState(false);
  const [showInstructionIndex, setShowInstructionIndex] = useState(0);

  const [selectedChromaColor, setSelectedChromaColor] = useState<ColorRangeHSV>(
    GREEN_HSV_RANGE,
  );

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

  const handleChromaColorSelected = (color: ColorRangeHSV) => () => {
    setSelectedChromaColor(color);
    setCurrentStep(3);
    closeInstruction();
  };

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
            <Instruction>
              <h1 className="text-center">
                1. Capture the background scene <br />
                (Don't move the camera after the image is captured)
              </h1>
              <div style={{ display: "flex" }}>
                <button
                  className="open-button"
                  onClick={() => {
                    handleBack();
                    closeInstruction();
                  }}
                >
                  Back
                </button>
                <button className="open-button" onClick={closeInstruction}>
                  Got It !
                </button>
              </div>
            </Instruction>
          )}
          {showInstructionIndex === 2 && (
            <Instruction>
              <h1 className="text-center">
                2. Choose one of the color to be your invisible cloak color.
              </h1>
              <div style={{ display: "flex" }}>
                <button
                  className="green-color-button"
                  onClick={handleChromaColorSelected(GREEN_HSV_RANGE)}
                >
                  GREEN
                </button>
                <button
                  className="blue-color-button"
                  onClick={handleChromaColorSelected(BLUE_HSV_RANGE)}
                >
                  &nbsp;BLUE&nbsp;
                </button>
              </div>
            </Instruction>
          )}
          {currentStep !== 0 && (
            <VideoCapture
              handleBack={handleBack}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              selectedChromaColor={selectedChromaColor}
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
