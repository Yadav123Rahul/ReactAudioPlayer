import React, { useState } from "react";
import AudioPlayer from "./components/AudioPlayer";
import "./components/Styles.css";

const initialAudioFiles = JSON.parse(localStorage.getItem("audioList")) || [
  {
    name: "Audio 2",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  // Add more initial audio files as needed
];
const App = () => {
  const [audioUpload, setAudioUpload] = useState("");
  const [audioFiles] = useState(initialAudioFiles);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(
    parseInt(localStorage.getItem("currentAudioIndex")) || 0
  );

  // Post request for uploading audio in cloudinary
  const uploadAudioHandler = () => {
    if (audioUpload === "") return;
    const data = new FormData();
    data.append("file", audioUpload);
    data.append("upload_preset", "ml_default");
    data.append("cloud_name", "djib5oxng");
    data.append("resource_type", "audio");

    // cloudinary setup
    fetch("https://api.cloudinary.com/v1_1/dd9cmhunr/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        initialAudioFiles.push({ name: data.original_filename, url: data.url });
        localStorage.setItem("audioList", JSON.stringify(initialAudioFiles));
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="main">
      <div>
        <input
          type="file"
          onChange={(e) => setAudioUpload(e.target.files[0])}
        />
        <button onClick={uploadAudioHandler}>Upload Audio</button>
      </div>
      <AudioPlayer
        audioFiles={audioFiles}
        currentAudioIndex={currentAudioIndex}
        setCurrentAudioIndex={setCurrentAudioIndex}
      />
      <div>
        <h3>Playlist</h3>
        <ul className="audio-list">
          {audioFiles.map((audio, index) => (
            <li key={index}>
              {audio.name}{" "}
              <button onClick={() => setCurrentAudioIndex(index)}>Play</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
