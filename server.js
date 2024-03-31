require('dotenv').config({ override: true });

const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.post('/generate-questions', async (req, res) => {
    const { jobTitle, jobDescription } = req.body;
    const context = `Generate interview questions for the job title: ${jobTitle}. Description: ${jobDescription}`;

    try {
        const response = await fetch(process.env.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY}`
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: context,
                temperature: 0.5,
                max_tokens: 100,
                n: 1,
                stop: ["\n", " Human:"],
            })
        });

        const data = await response.json();
        res.json({ questions: data.choices[0].text.trim().split('\n') });
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).send("Error generating questions");
    }
});

console.log(`Attempting to listen on port ${PORT}`);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
