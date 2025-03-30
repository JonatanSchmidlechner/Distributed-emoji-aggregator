import express from "express";
import "dotenv/config"
import settingsRouter from "./src/routes/settings.js"

const app = express();
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
