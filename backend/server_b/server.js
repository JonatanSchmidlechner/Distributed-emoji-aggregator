import app from "./app.js";
import "./src/messageHandler.js"

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})