import * as fs from "fs";

/**
 * Reads the interval setting from a JSON file and sends it in the response.
 * 
 * The response body contains a JSON object with the interval value as an integer,
 * using the key "value". If the file cannot be read, a 500 error response is sent.
 * 
 * @param {Object} res - Express response object.
 * @returns {void} Sends a JSON response with the interval value or an error message.
 */
export const getInterval = (res) => {
    fs.readFile(process.env.SETTINGSPATH, (error, data) => {
        if (error) {
            res.status(500).json({"error": "Server error: Could not read data"})
            return;
        }
        res.status(200).json({"value": JSON.parse(data).interval});
    })
}
/**
 * Updates the interval value in a JSON file with the provided value from the request.
 * 
 * The new interval value is expected as a query parameter (`?interval=NUMBER`).
 * - If the value is valid (a non-negative number), it updates the setting and sends status 200.
 * - If the value is missing or invalid, it sends a 400 error.
 * - If an internal error occurs during the update, a 500 error may be sent.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Sends a response with status code 200, 400 or 500.
 */
export const updateInterval = async (req, res) => {
    const updatedInterval = Number(req.query.interval);
    if (!isNaN(updatedInterval) && updatedInterval >= 0) {
        updateSetting("interval", updatedInterval);
        return;
    }
    res.status(400).json({"error": "Invalid client side input"});
}

/**
 * Reads the threshold setting from a JSON file and sends it in the response.
 * 
 * The response body contains a JSON object with the threshold value as an integer,
 * using the key "value". If the file cannot be read, a 500 error response is sent.
 * 
 * @param {Object} res - Express response object.
 * @returns {void} Sends a JSON response with the interval value or an error message.
 */
export const getThreshold = (req, res) => {
    fs.readFile(process.env.SETTINGSPATH, (error, data) => {
        if (error) {
            res.status(500).json({"error": "Server error: Could not read data"});
            return;
        }
        res.status(200).json({"value": JSON.parse(data).threshold});
    })
}

/**
 * Updates the threshold value in a JSON file with the provided value from the request.
 * 
 * The new threshold value is expected as a query parameter (`?threshold=NUMBER`).
 * - If the value is valid (a non-negative number), it updates the setting and sends status 200.
 * - If the value is missing or invalid, it sends a 400 error.
 * - If an internal error occurs during the update, a 500 error may be sent.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Sends a response with status code 200, 400 or 500.
 */
export const updateThreshold = (req, res) => {
    const updatedThreshold = Number(req.query.threshold);
    if (!isNaN(updatedThreshold) && updatedThreshold >= 0) {
        updateSetting("threshold", updatedThreshold);
        return;
    }
    res.status(400).json({"error": "Invalid client side input."});
}

/**
 * Reads the allowedEmotes setting from a JSON file and sends it in the response.
 * 
 * The response body contains a JSON object with the allowedEmotes value as an array of strings,
 * using the key "value". If the file cannot be read, a 500 error response is sent.
 * 
 * @param {Object} res - Express response object.
 * @returns {void} Sends a JSON response with the interval value or an error message.
 */
export const getAllowedEmotes = (req, res) => {
    fs.readFile(process.env.SETTINGSPATH, (error, data) => {
        if (error) {
            res.status(500).json({"error": "Server error: Could not read data"});
            return;
        }
        res.status(200).json({"value": JSON.parse(data).allowedEmotes});
    })
}

/**
 * Updates the allowedEmotes value in a JSON file with the provided value from the request.
 * 
 * The new allowedEmotes value is expected as a query parameter (`?allowedEmotes=ARRAY`).
 * - If the value is valid (an array), it updates the setting and sends status 200.
 * - If the value is missing or invalid, it sends a 400 error.
 * - If an internal error occurs during the update, a 500 error may be sent.
 * 
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void} Sends a response with status code 200, 400 or 500.
 */
export const updateAllowedEmotes = (req, res) => {
    const updatedAllowedEmotes = req.query.allowedEmotes;
    if (updatedAllowedEmotes && Array.isArray(updatedAllowedEmotes)) {
        updateSetting("allowedEmotes", updatedAllowedEmotes);
        return;
    }
    res.status(400).json({"error": "Invalid client side input"});
}
/** 
* A function to modify a specific value in a json file.
*
* @param {string} key - The json property name to be updated.
* @param {Number | Array[string]} value - The new value for the json object's property.
* @returns {void} Sends a response with status code 200 or 500
*/
const updateSetting = (key, value) => {
    fs.readFile(process.env.SETTINGSPATH, (error, data) => {
        if (error) {
            res.status(500).json({"error": "Server error: Could not read data"});
            return;
        }
        const settings = JSON.parse(data);
        settings[key] = value;
        fs.writeFile(process.env.SETTINGSPATH, JSON.stringify(settings), (error) => {
            if (error) {
                res.status(500).json({"error": "Server error: Could not write data"})
                return;
            }
            res.status(200).send();
        }) 
    })
}