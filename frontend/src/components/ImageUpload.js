import React, { useState } from "react";
import { predictLandmark } from "../api";

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handlePredict = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const res = await predictLandmark(image);
      setResult(res);
    } catch (err) {
      alert("Prediction failed");
    }

    setLoading(false);
  };

  return (
    <div className="card">
      <h2>Landmark Detection</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && <img src={preview} alt="preview" className="preview" />}

      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Detecting..." : "Detect Landmark"}
      </button>

      {result && (
        <div className="result">
          <p><strong>Landmark:</strong> {result.landmark}</p>
          <p><strong>Confidence:</strong> {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
