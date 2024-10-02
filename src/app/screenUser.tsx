"use client"

import { useEffect, useRef, useState } from 'react';

const Webcam = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  
  useEffect(() => {
    // Access webcam stream using the API from the browser
    const getWebcamStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: 480,
            height: 270,
          },
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
      }
    };

    getWebcamStream();

    return () => {
      // Stop webcam when component unmounts to prevent the webcam to keep working after no long in use
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start screen recording
  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Request video stream (screen capture)
      });
  
      const recorder = new MediaRecorder(screenStream, {
        mimeType: 'video/webm; codecs=vp9',
      });
  
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
  
      recorder.start();
      setMediaRecorder(recorder);
  
    } catch (err) {
      console.error("Error capturing screen:", err);
    }
  };

  // Stop screen recording and download the video - This will be changed to implement the upload function to the bucket in the AppWrite
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen-recording.webm';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setRecordedChunks([]); // Clear recorded chunks
      setMediaRecorder(null); // Reset media recorder
    }
  };
  return (
    <div className="webcam-container">
      <video
        ref={videoRef}
        autoPlay
        width="480"
        height="270"
      />
      
      <div className="controls">
        <button onClick={startRecording} disabled={!!mediaRecorder}>
          Iniciar Gravação
        </button>
        <button onClick={stopRecording} disabled={!mediaRecorder}>
          Parar Gravação
        </button>
      </div>
    </div>
  );
};

export default Webcam;