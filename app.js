// app.js
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config(); // Make sure to install dotenv: npm install dotenv

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is in your .env file
}));

app.post('/generate-questions', async (req, res) => {
    const { context } = req.body;
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Generate interview questions based on: ${context}`,
            temperature: 0.5,
            max_tokens: 150,
            n: 1,
            stop: ["\n", " Human:"],
        });
        res.json({ questions: completion.data.choices[0].text.trim() });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).send("Error generating questions");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
