import express from "express";
import "dotenv/config"
import settingsRouter from "./src/routes/settings.js"

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8081");
    res.header("Access-Control-Allow-Methods", "GET, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", settingsRouter)
app.use((req, res) => {
    res.status(404).json({
        error: "Not Found",
        message: `The route ${req.originalUrl} does not exist.`,
    });
});

export default app;
