"use client";

import { useEffect, useRef, useState } from 'react';
import { Client, Storage, ID } from 'appwrite'; // Import Appwrite

// Appwrite Client Setup (outside the component to avoid re-initializing on each render)
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('66fd40e300241b444c1e'); // Project ID created inside AppWrite

const storage = new Storage(client);

const ScreenRecorder = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Replaced useState with useRef for mediaRecorder
  const recordedChunksRef = useRef<Blob[]>([]); // Replaced useState with useRef for recordedChunks
  const [uploadStatus, setUploadStatus] = useState<string | null>(null); // State for upload status
  const [isRecording, setIsRecording] = useState(false); // New state to track recording status

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
      // Stop webcam when component unmounts
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
          recordedChunksRef.current.push(event.data); // Use ref to store chunks
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true); // Update recording state to true
    } catch (err) {
      console.error("Error capturing screen:", err);
    }
  };

  // Stop screen recording and upload to Appwrite
  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const file = new File([blob], 'screen-recording.webm', { type: 'video/webm' });

        // Upload to Appwrite Bucket
        try {
          const response = await storage.createFile(
            '66fd4116001a97224873', // bucket ID
            ID.unique(),
            file
          );
          console.log('File uploaded successfully:', response);
          setUploadStatus('Upload efetuado!'); // Success message
        } catch (error) {
          console.error('Error uploading file to Appwrite:', error);
          setUploadStatus('Upload falhou!'); // Error message
        }

        recordedChunksRef.current = []; // Clear recorded chunks
        mediaRecorderRef.current = null; // Reset media recorder
        setIsRecording(false); // Update recording state to false
      };

      mediaRecorderRef.current.stop(); // Stop the recording
    }
  };

  return (
    <div className="webcam-container">
      <div className="overlay">Desafio MedDeck</div>
      <video ref={videoRef} autoPlay width="480" height="270" />
      <div className="controls">
        <button onClick={startRecording} disabled={isRecording}>
          Iniciar Gravação
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Finalizar Gravação
        </button>
      </div>
      {/* Upload status message */}
      {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
    </div>
  );
};

export default ScreenRecorder;
