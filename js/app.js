document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Telegram Web App
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user;

    // Приветствие пользователя
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <h1>Здравствуйте, ${user.first_name}!</h1>
        <p>Добро пожаловать в тест на определение ваших навыков.</p>
        <button id="startTest">Начать тест</button>
    `;

    document.getElementById('startTest').addEventListener('click', startTest);

    // Инициализация переменных
    let currentQuestion = 0;
    let userScores = {};

    // Вопросы теста
    const questions = [/* Ваши вопросы здесь */];

    function startTest() {
        showQuestion();
    }

    function showQuestion() {
        if (currentQuestion < questions.length) {
            const q = questions[currentQuestion];
            let answersHtml = '';

            q.answers.forEach((answer, index) => {
                answersHtml += `<button class="answerButton" data-index="${index}">${answer}</button><br>`;
            });

            appDiv.innerHTML = `
                <h2>Вопрос ${currentQuestion + 1} из ${questions.length}</h2>
                ${q.image ? `<img src="${q.image}" alt="Изображение вопроса">` : ''}
                <p>${q.question}</p>
                ${answersHtml}
            `;

            document.querySelectorAll('.answerButton').forEach(button => {
                button.addEventListener('click', selectAnswer);
            });
        } else {
            showResults();
        }
    }

    function selectAnswer(event) {
        const selectedOption = parseInt(event.target.getAttribute('data-index'));
        const q = questions[currentQuestion];

        // Обновление баллов
        for (let [quality, scores] of Object.entries(q.scores)) {
            const score = scores[selectedOption];
            userScores[quality] = (userScores[quality] || 0) + score;
        }

        currentQuestion++;
        showQuestion();
    }

    function showResults() {
        let resultsHtml = '<h2>Ваши результаты:</h2>';

        for (let [quality, score] of Object.entries(userScores)) {
            resultsHtml += `<p><strong>${quality}</strong>: ${score} / 10</p>`;
        }

        appDiv.innerHTML = resultsHtml;

        // Отправка результатов боту (опционально)
        // sendResultsToBot();
    }

    // Функция для отправки результатов боту (опционально)
    function sendResultsToBot() {
        tg.sendData(JSON.stringify(userScores));
    }
});
