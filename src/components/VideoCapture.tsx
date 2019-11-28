import React, { forwardRef, useRef, useCallback, useEffect } from "react";
import { FaCamera, FaArrowLeft } from "react-icons/fa";
import { IconContext } from "react-icons";
import "./VideoCapture.scss";
import { calculateAlphaByHSV, ColorRangeHSV } from "../utils/chromakey";

interface Props {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  selectedChromaColor: ColorRangeHSV;
  handleBack: () => void;
  videoProps: {
    video: HTMLVideoElement | null;
  };
}
const VideoCapture = forwardRef<HTMLVideoElement, Props>(
  (
    {
      currentStep,
      setCurrentStep,
      selectedChromaColor,
      handleBack,
      videoProps: { video },
    },
    videoElementRef,
  ) => {
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);

    const computeFrame = useCallback(() => {
      if (backgroundCanvasRef.current && outputCanvasRef.current && video) {
        outputCanvasRef.current.width = video.videoWidth;
        outputCanvasRef.current.height = video.videoHeight;
        backgroundCanvasRef.current.width = video.videoWidth;
        backgroundCanvasRef.current.height = video.videoHeight;
      }

      const outputContext = outputCanvasRef.current?.getContext("2d");
      if (video && outputContext) {
        outputContext.drawImage(
          video,
          0,
          0,
          video.videoWidth,
          video.videoHeight,
        );
        if (currentStep === 3) {
          let frame = outputContext.getImageData(
            0,
            0,
            video.videoWidth,
            video.videoHeight,
          );
          let length = frame.data.length / 4;

          for (let i = 0; i < length; i++) {
            let r = frame.data[i * 4 + 0];
            let g = frame.data[i * 4 + 1];
            let b = frame.data[i * 4 + 2];

            const alpha = calculateAlphaByHSV(r, g, b, selectedChromaColor);
            frame.data[i * 4 + 3] = alpha;
          }
          outputContext.putImageData(frame, 0, 0);
        }
      }
    }, [video, currentStep, selectedChromaColor]);

    const updateFrame = useCallback(() => {
      try {
        computeFrame();
      } catch (err) {
        console.log(err);
      }
      const requestId = window.requestAnimationFrame(updateFrame);
      return () => {
        window.cancelAnimationFrame(requestId);
      };
    }, [computeFrame]);

    useEffect(() => {
      updateFrame();
    }, [updateFrame, video]);

    const captureBackground = useCallback(() => {
      if (backgroundCanvasRef.current && outputCanvasRef.current && video) {
        const backgroundContext = backgroundCanvasRef.current.getContext("2d");
        if (backgroundContext) {
          backgroundContext.drawImage(video, 0, 0);
          outputCanvasRef.current.setAttribute(
            "style",
            `background-image:url(${backgroundCanvasRef.current.toDataURL(
              "image/webp",
            )});`,
          );
        }
      }
    }, [video]);

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
          <video
            autoPlay
            ref={videoElementRef}
            className="video-container"
            style={{ display: "none" }}
          ></video>
          {currentStep === 1 && (
            <button
              className="capture-button"
              onClick={() => {
                setCurrentStep(2);
                captureBackground();
              }}
            >
              <FaCamera />
            </button>
          )}
          <div style={{ display: "block" }}>
            <canvas className="video-canvas" ref={outputCanvasRef}></canvas>
          </div>
          <div style={{ display: "none" }}>
            <canvas className="video-canvas" ref={backgroundCanvasRef}></canvas>
          </div>
        </div>
      </IconContext.Provider>
    );
  },
);

export default VideoCapture;
