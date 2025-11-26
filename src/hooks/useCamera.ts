
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCameraResult {
  isCameraActive: boolean;
  capturedImageUrl: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => void;
}

/**
 * Small hook that wraps getUserMedia and canvas capture.
 * It does not render any UI; the consumer decides where to place the video element if needed.
 * For this app we keep the video element hidden and only use the captured data URL.
 */
export function useCamera(): UseCameraResult {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Lazily create video/canvas elements when needed
  useEffect(() => {
    if (!videoRef.current) {
      const video = document.createElement("video");
      video.playsInline = true;
      video.muted = true;
      videoRef.current = video;
    }
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        window.alert("La fotocamera non è supportata dal browser.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      setCapturedImageUrl(null);
    } catch (err) {
      console.error("Unable to start camera", err);
      window.alert("Impossibile accedere alla fotocamera.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current) {
      return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImageUrl(dataUrl);
  }, [isCameraActive]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return {
    isCameraActive,
    capturedImageUrl,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}
