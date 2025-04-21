import React, {useState, useEffect} from "react";
import { fetchSettings, fetchRawData, updateInterval, updateThreshold, updateAllowedEmotes, } from "./api/dbUtils";
import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField, Button, Paper } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

function App() {
  const [interval, setIntervalValue] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [allowedEmotes, setAllowedEmotes] = useState([]);
  const [message, setMessage] = useState([]);
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
    });
  
    const rawDataInterval = setInterval(async () => {
      const data = await fetchRawData();
      setRawMessages(data);
    }, 300);
  
    return () => {
      socket.removeEventListener("message", () => {});
      clearInterval(rawDataInterval);
    };
  }, []);

  return (
    <>
      <ToastContainer />

      <Grid container size={12}
        sx={{
          justifyContent: "space-between"
        }}
      >

        <Grid item size={3} spacing={3}
          container 
          direction="column" 
          sx={{
            justifyContent: "flex-start", 
            alignItems: "flex-start" 
          }}
        >
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="h5" gutterBottom>
              Settings
            </Typography>
          </Grid>

          <Grid item>
            <TextField
              label="Interval"
              type="number"
              value={interval}
              onChange={(e) => setIntervalValue(Number(e.target.value))}
            />
            <Button
              sx={{ ml: 1, mt: 1 }}
              variant="contained"
              onClick={async () => {
                const res = await updateInterval(interval);
                res.ok ? toast.success('Interval updated') : toast.error('Failed to update');
              }}
            >
              Update Interval
            </Button>
          </Grid>
          <Grid item>
            <TextField
              label="Threshold"
              type="number"
              inputProps={{ step: 0.01, min: 0, max: 1 }}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            />
            <Button
              sx={{ ml: 1, mt: 1 }}
              variant="contained"
              onClick={async () => {
                const res = await updateThreshold(threshold);
                res.ok ? toast.success('Threshold updated') : toast.error('Failed to update');
              }}
            >
              Update Threshold
            </Button>
          </Grid>
          <Grid item>
            <TextField
              label="Allowed Emotes (comma separated)"
              type="text"
              value={allowedEmotes.join(',')}
              onChange={(e) =>
                setAllowedEmotes(e.target.value.split(',').map((emote) => emote.trim()))
              }
            />
            <Button
              sx={{ ml: 1, mt: 1 }}
              variant="contained"
              onClick={async () => {
                const res = await updateAllowedEmotes(allowedEmotes);
                res.ok ? toast.success('Emotes updated') : toast.error('Failed to update');
              }}
            >
              Update Emotes
            </Button>
          </Grid>
        </Grid>

        <Grid item size={6} spacing={3}
          sx={{
            justifyContent: "center", 
            alignItems: "stretch" 
          }}
        >
          <Typography variant="h5" gutterBottom>
            Significant moments
          </Typography>
          <Typography variant="body2" gutterBottom>
            Latest 50
          </Typography>
          {message.length > 0 ? (
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Emote</TableCell>
                    <TableCell>Count</TableCell>
                    <TableCell>Total emotes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {message.map((msg, index) => (
                    <TableRow key={index}>
                      <TableCell>{msg.timestamp}</TableCell>
                      <TableCell>{msg.emote}</TableCell>
                      <TableCell>{msg.count}</TableCell>
                      <TableCell>{msg.totalEmotes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No significant moments</Typography>
          )}
        </Grid>

        <Grid item size={2} spacing={3}
          sx={{
            justifyContent: "flex-end", 
            alignItems: "stretch" 
          }}
        >
          <Typography variant="h5" gutterBottom>
            Latest emotes
          </Typography>
          <Typography variant="body2" gutterBottom>
            Latest 50
          </Typography>
          {rawMessages.length > 0 ? (
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Emote</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rawMessages.map((msg, index) => (
                    <TableRow key={index}>
                      <TableCell>{msg.timestamp}</TableCell>
                      <TableCell>{msg.emote}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No raw data</Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default App;
