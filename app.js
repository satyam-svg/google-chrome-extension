const express = require('express');
const bodyParser = require('body-parser');
const robot = require('robotjs');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/send-message1', async (req, res) => {
    const { contactName, message } = req.body;

    try {
        // Step 1: Open WhatsApp Desktop App
        exec('start whatsapp:', (err) => {
            if (err) {
                console.error("Error opening WhatsApp Desktop:", err);
                res.status(500).json({ status: 'Error opening WhatsApp Desktop', error: err.message });
                return;
            }

            // Step 2: Wait for WhatsApp to open
            setTimeout(() => {
                // Step 3: Focus the search bar (Ctrl + F)
                robot.keyTap('f', ['control']);

                // Step 4: Type the contact name
                robot.typeString(contactName);

                // Step 5: Wait for search results to appear
                setTimeout(() => {
                    // Step 6: Get the current mouse position for adjustments (for debugging)
                    const pos = robot.getMousePos();
                    console.log(`Current Mouse Position: x=${pos.x}, y=${pos.y}`);

                    // Step 7: Move mouse to the contact (Adjust based on your screen resolution)
                    // Example coordinates: x = 500, y = 220
                    // Adjust this based on the position of the search result on your screen
                    robot.moveMouse(300, 220);
                    robot.mouseClick();

                    // Step 8: Wait for the chat to load
                    setTimeout(() => {
                        // Step 9: Type the message
                        robot.typeString(message);

                        // Step 10: Press 'Enter' to send the message
                        robot.keyTap('enter');

                        // Step 11: Respond back to the client
                        res.json({ status: 'Message sent successfully!' });
                    }, 1000); // Adjust delay for chat to load
                }, 1000); // Adjust delay for search results to appear
            }, 2000); // Adjust delay for WhatsApp to load
        });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ status: 'Error sending message', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
