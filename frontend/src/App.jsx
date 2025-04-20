import { fetchSettings, fetchRawData, updateInterval, updateThreshold, updateAllowedEmotes, } from "./api/dbUtils";

import React, {useState, useEffect} from "react";

function App() {
  const [interval, setIntervalValue] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [allowedEmotes, setAllowedEmotes] = useState([]);
  const [message, setMessage] = useState(null);
  const [rawMessages, setRawMessages] = useState([]);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await fetchSettings();
      setIntervalValue(settings.interval);
      setThreshold(settings.threshold);
      setAllowedEmotes(settings.allowedEmotes);
    };
    loadSettings();

    const socket = new WebSocket("ws://localhost:8082");
    socket.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      setMessage(msg);
      console.log("This is aggregated data from server_a", msg);
    });
  
    const rawDataInterval = setInterval(async () => {
      const data = await fetchRawData();
      setRawMessages(data);
    }, 3000);
  
    return () => {
      console.log("cleanup function");
      socket.removeEventListener("message", () => {});
      clearInterval(rawDataInterval);
    };
  }, []);
  

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
        <button onClick={async () => {
          const res = await updateInterval(interval);
          console.log(res.ok ? "Interval updated" : "Failed to update");
        }}>
          Update Interval
        </button>
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
        <button onClick={async () => {
          const res = await updateThreshold(threshold);
          console.log(res.ok ? "Threshold updated" : "Failed to update");
        }}>
          Update Threshold
        </button>
        
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
        <button onClick={async () => {
          const res = await updateAllowedEmotes(allowedEmotes);
          console.log(res.ok ? "Emotes updated" : "Failed to update");
        }}>
          Update Emotes
        </button>
      </div>

      <div>
        <h1>Significant moment</h1>
        {message ? <pre>{JSON.stringify(message, null, 2)}</pre> : <p>No message yet</p>}
      </div>

      <div>
        <h1>Raw Data</h1>
        {rawMessages.length > 0 ? (
          <ul>
            {rawMessages.map((msg, idx) => (
              <li key={idx}>
                <pre>{JSON.stringify(msg, null, 2)}</pre>
              </li>
            ))}
          </ul>
        ) : (
          <p>No raw data</p>
        )}
      </div>
    </div>
  );
}

export default App;
