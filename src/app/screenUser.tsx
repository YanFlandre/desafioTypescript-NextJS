"use client"

import { useEffect, useRef, useState } from 'react';
import { Client, Storage, ID } from 'appwrite'; // Import Appwrite

const Webcam = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null); // State for upload status
  
   // Appwrite Client Setup
   const client = new Client()
   .setEndpoint('https://cloud.appwrite.io/v1')
   .setProject('66fd40e300241b444c1e'); // Project ID created inside AppWrite

 const storage = new Storage(client);
  
  
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

  // Stop screen recording and upload to Appwrite
  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();

      const blob = new Blob(recordedChunks, { type: 'video/webm' });
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

      setRecordedChunks([]); // Clear recorded chunks
      setMediaRecorder(null); // Reset media recorder
    }
  };


  
  return (
    <div className="webcam-container">
      <div className="overlay">Desafio MedDeck</div>
      <video ref={videoRef} autoPlay width="480" height="270" />
      <div className="controls">
        <button onClick={startRecording} disabled={!!mediaRecorder}>
          Iniciar Gravação
        </button>
        <button onClick={stopRecording} disabled={!mediaRecorder}>
          Finalizar Gravação
        </button>
      </div>
       {/* Upload status message */}
       {uploadStatus && <div className="upload-status">{uploadStatus}</div>}  
    </div>
  );
};

export default Webcam;