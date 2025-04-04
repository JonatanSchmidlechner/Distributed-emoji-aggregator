import React, {useState, useEffect} from "react";

function App() {
  const [interval, setIntervalValue] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [allowedEmotes, setAllowedEmotes] = useState([]);

  const BASE_URL = "http://localhost:8080/settings";

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Get interval
      const intervalRes = await fetch(`${BASE_URL}/interval`);
      const intervalData = await intervalRes.json();
      setIntervalValue(intervalData.value);

      // Get threshold
      const thresholdRes = await fetch(`${BASE_URL}/threshold`);
      const thresholdData = await thresholdRes.json();
      setThreshold(thresholdData.value);

      // Get allowed emotes
      const emotesRes = await fetch(`${BASE_URL}/allowed-emotes`);
      const emotesData = await emotesRes.json();
      setAllowedEmotes(emotesData.value);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const updateInterval = async () => {
    try {
      const response = await fetch(`${BASE_URL}/interval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({interval})
      });
      if (response.ok) {
        console.log("Interval updated");
      } else {
        console.log("Failed to update interval");
      }
    } catch (error) {
      console.error("Error updating interval:", error);
    }
  };

  const updateThreshold = async () => {
    try {
      const response = await fetch(`${BASE_URL}/threshold`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({threshold})
      });
      if (response.ok) {
        console.log("Threshold updated");
      } else {
        console.log("Failed to update threshold");
      }
    } catch (error) {
      console.error("Error updating threshold:", error);
    }
  };

  const updateAllowedEmotes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/allowed-emotes`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({allowedEmotes})
      });
      if (response.ok) {
        console.log("Allowed Emotes updated");
      } else {
        console.log("Failed to update allowed emotes");
      }
    } catch (error) {
      console.error("Error updating allowed emotes: ", error);
    }
  };

  return (
    <div>
      <h1>Settings</h1>

      <div>
        <label>Interval:</label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setIntervalValue(Number(e.target.value))}
        />
        <button onClick={updateInterval}>Update Interval</button>
      </div>

      <div>
        <label>Threshold:</label>
        <input
          type="number"
          value={threshold}
          step="0.01"
          min="0"
          max="1"
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
        <button onClick={updateThreshold}>Update Threshold</button>
      </div>

      <div>
        <label>Allowed Emotes (comma separated):</label>
        <input
          type="text"
          value={allowedEmotes.join(", ")}
          onChange={(e) =>
            setAllowedEmotes(e.target.value.split(",").map(emote => emote.trim()))
          }
        />
        <button onClick={updateAllowedEmotes}>Update Allowed Emotes</button>
      </div>
    </div>
  );
}

export default App;
