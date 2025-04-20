const BASE_URL = "http://localhost:8080/settings";

export const fetchSettings = async () => {
  const settings = {
    interval: 0,
    threshold: 0,
    allowedEmotes: [],
  };

  try {
    const intervalRes = await fetch(`${BASE_URL}/interval`);
    const intervalData = await intervalRes.json();
    settings.interval = intervalData.value;

    const thresholdRes = await fetch(`${BASE_URL}/threshold`);
    const thresholdData = await thresholdRes.json();
    settings.threshold = thresholdData.value;

    const emotesRes = await fetch(`${BASE_URL}/allowed-emotes`);
    const emotesData = await emotesRes.json();
    settings.allowedEmotes = emotesData.value;

    return settings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return settings;
  }
};

export const fetchRawData = async () => {
  try {
    const res = await fetch("http://localhost:8080/rawData");
    const data = await res.json();
    if (Array.isArray(data.value)) {
      return data.value;
    } else {
      console.warn("Expected array but got:", data.value);
      return [];
    }
  } catch (err) {
    console.error("Failed to fetch raw data", err);
    return [];
  }
};

export const updateInterval = async (interval) => {
  return await fetch(`${BASE_URL}/interval`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ interval }),
  });
};

export const updateThreshold = async (threshold) => {
  return await fetch(`${BASE_URL}/threshold`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ threshold }),
  });
};

export const updateAllowedEmotes = async (allowedEmotes) => {
  return await fetch(`${BASE_URL}/allowed-emotes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ allowedEmotes }),
  });
};
