document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('jobForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const jobTitle = document.getElementById('jobTitle').value;
        const jobDescription = document.getElementById('jobDescription').value;

        const dataToSend = {
            jobTitle: jobTitle,
            jobDescription: jobDescription
        };

        try {
            const response = await fetch('http://localhost:5500/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) throw new Error('Network response was not ok.');

            const data = await response.json();
            displayQuestions(data.questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    });

    function displayQuestions(questions) {
        const outputElement = document.getElementById('questionsOutput');
        outputElement.innerHTML = '';

        questions.forEach(question => {
            const questionElement = document.createElement('p');
            questionElement.textContent = question;
            outputElement.appendChild(questionElement);
        });
    }
});

