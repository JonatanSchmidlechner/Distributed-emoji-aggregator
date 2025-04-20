import express from "express";
import {getInterval, updateInterval, getThreshold, updateThreshold, getAllowedEmotes, updateAllowedEmotes} from "../controllers/settingsController.js"
import { getMoments } from "../messageHandler.js"

const router = express.Router();

router.get("/settings/interval", getInterval)
router.put("/settings/interval", updateInterval)
router.get("/settings/threshold", getThreshold)
router.put("/settings/threshold", updateThreshold)
router.get("/settings/allowed-emotes", getAllowedEmotes)
router.put("/settings/allowed-emotes", updateAllowedEmotes)

router.get("/rawData", getMoments)

export default router;