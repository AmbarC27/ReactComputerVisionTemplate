import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";

function App() {
  const webcamRef = useRef(null);
  const [predictions, setPredictions] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [model, setModel] = useState(null); // State to hold the loaded model
  const textareaRef = useRef(null); // Ref for the textarea to adjust its height


  // Function to load the TensorFlow model
  const loadModel = async () => {
    const modelPath = 'model_json/model.json'; // Update this path as necessary
    try {
      const loadedModel = await tf.loadLayersModel(modelPath);
      setModel(loadedModel);
    } catch (error) {
      console.error("Failed to load the model", error);
    }
  };

  // Your existing detect function with minor adjustments for integration
  const detect = async () => {
    if (
      model &&
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 &&
      isPredicting // Ensure detection only runs when predicting
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [240, 240]);
      const casted = resized.cast('int32');
      const expanded = casted.expandDims(0);
      const obj = await model.predict(expanded);
      const pred_arr = obj.dataSync();

      const maxValue = Math.max(...pred_arr);
      const predLabel = pred_arr.indexOf(maxValue);

      // Update predictions state
      setPredictions(prev => prev + labelToString(predLabel));

      tf.dispose([img, resized, casted, expanded, obj]);
    }
  };

  // Convert label index to string (ensure this matches your model's labels)
  const labelToString = (labelIndex) => {
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return labels[labelIndex] || '';
  };

  useEffect(() => {
    loadModel();
  }, []); // Load the model when the component mounts

  useEffect(() => {
    let intervalId;

    if (model && isPredicting) {
      intervalId = setInterval(() => {
        detect(); // Call detect function periodically
      }, 1000 / 1); // Adjust timing as needed
    }

    return () => clearInterval(intervalId); // Cleanup on stop or unmount
  }, [model, isPredicting]); // Rerun effect if model or isPredicting changes

  useEffect(() => {
    // Automatically adjust the height of the textarea to fit the content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit'; // Reset to default
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [predictions]); // Adjust height every time predictions update

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef} style={{ width: 640, height: 480, borderRadius: '10px', objectFit: 'cover' }} />
        <button onClick={() => setIsPredicting(!isPredicting)} style={{ marginTop: '20px', padding: '10px 20px',
         fontSize: '16px', color: '#FFFFFF', backgroundColor: '#007BFF', border: 'none', borderRadius: '5px',
          cursor: 'pointer', outline: 'none' }}>
          {isPredicting ? 'Stop' : 'Start'}
        </button>
        <textarea ref={textareaRef} value={predictions} readOnly style={{ marginTop: '20px', padding: '10px', width: '640px', minHeight: '50px', fontSize: '16px', border: '1px solid #D3D3D3', borderRadius: '5px', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', resize: 'none', overflow: 'hidden' }} />
      </header>
    </div>
  );
}

export default App;
