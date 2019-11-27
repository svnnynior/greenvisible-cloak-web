import React, { forwardRef, useRef, useCallback, useEffect } from "react";
import { FaCamera, FaArrowLeft } from "react-icons/fa";
import { IconContext } from "react-icons";
import "./VideoCapture.scss";
import { rgb2hsv } from "../utils/Color";

const light_r = 59,
  light_g = 50,
  light_b = 255,
  dark_r = 0,
  dark_g = 0,
  dark_b = 120;

const tolerance = 0.08;

const calculateDistance = (c: number, min: number, max: number) => {
  if (c < min) return min - c;
  if (c > max) return c - max;

  return 0;
};

const isInRange = (value: number, min: number, max: number) => {
  return min <= value && value <= max;
};

const REF_HSV_BLUE = {
  min: {
    h: 210,
    s: 50,
    v: 50,
  },
  max: {
    h: 270,
    s: 100,
    v: 100,
  },
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
        if (currentStep === 2) {
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
            // let frameHSV = rgb2hsv(r, g, b);
            // console.log(frameHSV);

            // if (
            //   isInRange(frameHSV.h, REF_HSV_BLUE.min.h, REF_HSV_BLUE.max.h) &&
            //   isInRange(frameHSV.s, REF_HSV_BLUE.min.s, REF_HSV_BLUE.max.s) &&
            //   isInRange(frameHSV.v, REF_HSV_BLUE.min.v, REF_HSV_BLUE.max.v)
            // ) {
            //   frame.data[i * 4 + 3] = 0;
            // }
            let difference =
              calculateDistance(r, dark_r, light_r) +
              calculateDistance(g, dark_g, light_g) +
              calculateDistance(b, dark_b, light_b);
            difference /= 255 * 3; // convert to percent
            if (difference < tolerance) {
              frame.data[i * 4 + 3] = 0;
            }
          }
          outputContext.putImageData(frame, 0, 0);
        }
      }
    }, [video, currentStep]);

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
