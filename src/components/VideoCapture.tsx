import React, { forwardRef, useRef, useCallback } from "react";
import { FaCamera, FaArrowLeft } from "react-icons/fa";
import { IconContext } from "react-icons";
import "./VideoCapture.scss";

const l_r = 158,
  l_g = 183,
  l_b = 131,
  d_r = 113,
  d_g = 138,
  d_b = 77;

const tolerance = 0.05;

const calculateDistance = (c: number, min: number, max: number) => {
  if (c < min) return min - c;
  if (c > max) return c - max;

  return 0;
};

interface Props {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleBack: () => void;
  videoProps: {
    video: HTMLVideoElement | null;
  };
}
const VideoCapture = forwardRef<HTMLVideoElement, Props>(
  (
    { currentStep, setCurrentStep, handleBack, videoProps: { video } },
    videoElementRef,
  ) => {
    const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);

    const computeFrame = useCallback(() => {
      const outputContext = outputCanvasRef.current?.getContext("2d");
      if (video && outputContext) {
        outputContext.drawImage(
          video,
          0,
          0,
          video.videoWidth,
          video.videoHeight,
        );
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

          let difference =
            calculateDistance(r, d_r, l_r) +
            calculateDistance(g, d_g, l_g) +
            calculateDistance(b, d_b, l_b);
          difference /= 255 * 3; // convert to percent
          if (difference < tolerance) {
            frame.data[i * 4 + 3] = 0;
          }
        }
        outputContext.putImageData(frame, 0, 0);
      }
    }, [video]);

    const updateFrame = useCallback(() => {
      try {
        computeFrame();
      } catch (err) {
        console.log(err);
      }
      const timeout = setTimeout(() => {
        updateFrame();
      }, 0);
      return () => {
        clearTimeout(timeout);
      };
    }, [computeFrame]);

    const captureBackground = useCallback(() => {
      if (backgroundCanvasRef.current && outputCanvasRef.current && video) {
        outputCanvasRef.current.width = video.videoWidth;
        outputCanvasRef.current.height = video.videoHeight;
        backgroundCanvasRef.current.width = video.videoWidth;
        backgroundCanvasRef.current.height = video.videoHeight;

        const context2D = backgroundCanvasRef.current.getContext("2d");
        if (context2D) {
          context2D.drawImage(video, 0, 0);
          outputCanvasRef.current.setAttribute(
            "style",
            `background-image:url(${backgroundCanvasRef.current.toDataURL(
              "image/webp",
            )});background-size: cover;`,
          );
          updateFrame();
        }
      }
    }, [updateFrame, video]);

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
            style={{ display: currentStep === 2 ? "none" : "block" }}
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
          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <canvas ref={outputCanvasRef}></canvas>
          </div>
          <div style={{ display: "none" }}>
            <canvas ref={backgroundCanvasRef}></canvas>
          </div>
        </div>
      </IconContext.Provider>
    );
  },
);

export default VideoCapture;
