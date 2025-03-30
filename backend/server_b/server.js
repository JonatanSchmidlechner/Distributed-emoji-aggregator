import app from "./app.js";
import "./src/messageHandler.js"
console.log("Server starting...")

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})