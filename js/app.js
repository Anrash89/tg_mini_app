document.addEventListener('DOMContentLoaded', function() {
    let tg = null;
    let user = { first_name: 'Пользователь' };

    if (window.Telegram && window.Telegram.WebApp) {
        tg = window.Telegram.WebApp;
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            user = tg.initDataUnsafe.user;
        }
    } else {
        alert('Это приложение предназначено для запуска внутри Telegram.');
    }

    const appDiv = document.getElementById('app');
    const firstName = user.first_name || 'Пользователь';
    appDiv.innerHTML = `
        <h1>Здравствуйте, ${firstName}!</h1>
        <p>Добро пожаловать в тест на определение ваших навыков.</p>
        <button id="startTest">Начать тест</button>
    `;

    document.getElementById('startTest').addEventListener('click', startTest);

    // Инициализация переменных
    let currentQuestion = 0;
    let userScores = {};

    // Вопросы теста
   const questions = [
        {
            question: 'Вы замечаете, что в группе друзей никто не может принять решение о том, куда пойти. Что вы делаете?',
            answers: [
                'Предлагаю свой вариант и убеждаю остальных согласиться.',
                'Жду, пока кто-нибудь другой примет решение.',
                'Предлагаю несколько вариантов и голосую вместе со всеми.',
                'Мне всё равно, куда идти, поэтому не вмешиваюсь.',
            ],
            scores: {
                'Лидерство': [3, 1, 2, 1]
            },
            image: 'https://sun9-47.userapi.com/impg/RYJQexUDkrOcIfrrMltvoIyh4HHkAIoiKsS5eA/Tl4Nk-hA9N0.jpg?size=1024x1024&quality=95&sign=dc5363070752691ff9747440d55c0f60&type=album'
        },
        {
            question: 'В семье возник спор по поводу планов на выходные. Как вы поступите?',
            answers: [
                'Слушаю мнения всех и помогаю прийти к общему решению.',
                'Отстаиваю своё мнение и настаиваю на своём варианте.',
                'Уступаю желаниям других, чтобы избежать конфликта.',
                'Предлагаю разделиться и заняться разными делами.',
            ],
            scores: {
                'Лидерство': [3, 2, 1, 2]
            },
            image: 'https://sun9-45.userapi.com/impg/TpoKBCOtfnL0--_G1GmhBLUEidnHtrUQuQcdtw/dsMNRPxx2d4.jpg?size=1024x1024&quality=95&sign=cf24cc5e630183c367479853c8c20ed5&type=album'
        },
        {
            question: 'Вам предлагают попробовать новое хобби или занятие. Как вы реагируете?',
            answers: [
                'С радостью соглашаюсь и пробую новое.',
                'Сомневаюсь в своих способностях, но всё же пытаюсь.',
                'Отказываюсь, боясь неудачи.',
                'Соглашаюсь, если кто-то поддержит меня.',
            ],
            scores: {
                'Уверенность в себе': [3, 2, 1, 2]
            },
            image: 'https://sun9-44.userapi.com/impg/D3JL_TvmY4ZPo4wW3OTlEEQKnuYJpLJpjW2_Dg/QWToOhpxFxo.jpg?size=1024x1024&quality=95&sign=3eec6860968c7e52fc0674f385bfa2f0&type=album'
        },
        {
            question: 'Вы получаете комплимент по поводу своего внешнего вида или работы. Как вы реагируете?',
            answers: [
                'Принимаю комплимент и благодарю с улыбкой.',
                'Смущаюсь и не знаю, что сказать.',
                'Отвечаю, что это незначительно или отрицаю заслуги.',
                'Перевожу тему разговора на что-то другое.',
            ],
            scores: {
                'Уверенность в себе': [3, 2, 1, 1]
            },
            image: 'https://sun9-78.userapi.com/impg/edwLaqqaz7_7L6OwQMrhr0ZcKIyc0Ug8IluGVg/g578G7fbqxw.jpg?size=1024x1024&quality=95&sign=8d878da573596c5f61b1ada6d139f65a&type=album'
        },
        {
            question: 'Вы опаздываете на важную встречу из-за пробок. Что вы чувствуете и делаете?',
            answers: [
                'Сохраняю спокойствие и информирую о задержке.',
                'Начинаю нервничать и ругаюсь на ситуацию.',
                'Паникую и не знаю, как поступить.',
                'Расслабляюсь и думаю, что ничего страшного не произошло.',
            ],
            scores: {
                'Стрессоустойчивость': [3, 2, 1, 2]
            },
            image: 'https://sun9-16.userapi.com/impg/mO3RqGd_HfkLwGpsO_WzvS0bZqadrZbFhDN1tg/VQ7gi4pRW1A.jpg?size=1024x1024&quality=95&sign=c08ac2f3184ae5430cf9240714e89119&type=album'
        },
        {
            question: 'У вас дома сломалась бытовая техника. Как вы реагируете?',
            answers: [
                'Спокойно ищу способы решить проблему или вызываю мастера.',
                'Расстраиваюсь и переживаю из-за затрат.',
                'Откладываю решение проблемы на потом.',
                'Сердюсь и вымещаю злость на окружающих.',
            ],
            scores: {
                'Стрессоустойчивость': [3, 2, 1, 1]
            },
            image: 'https://sun9-7.userapi.com/impg/7cV8Ms17V7gMvzyRXmlxkOZJrLK2UyMA67jnCg/GUa7U7FZ6wg.jpg?size=1024x1024&quality=95&sign=001c46e02db02f10deee340d07cf355a&type=album'
        },
        {
            question: 'Вы приходите на вечеринку, где мало знакомых людей. Что вы делаете?',
            answers: [
                'Ищу знакомых и общаюсь только с ними.',
                'Завожу новые знакомства и общаюсь со всеми.',
                'Стою в стороне и жду, пока кто-нибудь подойдёт.',
                'Провожу время в одиночестве или ухожу раньше.',
            ],
            scores: {
                'Коммуникабельность': [2, 3, 1, 1]
            },
            image: 'https://sun9-59.userapi.com/impg/JuR_8o2Y7zX7dNd5X-r2O5uxyl4QH5MPFl2Mgg/pc5du6Qhbsk.jpg?size=1024x1024&quality=95&sign=39900189fc95798be091f646bd30aa7a&type=album'
        },
        {
            question: 'Сосед или соседка по подъезду начинает с вами разговор. Как вы реагируете?',
            answers: [
                'С удовольствием поддерживаю беседу.',
                'Отвечаю коротко из вежливости.',
                'Избегаю общения и стараюсь быстрее уйти.',
                'Начинаю разговор первым(ой).',
            ],
            scores: {
                'Коммуникабельность': [2, 1, 1, 3]
            },
            image: 'https://sun9-48.userapi.com/impg/dxBGCvCuEoGuSRAci8Wav6yXqxquWczDZ30XMA/d3xueSkvS8U.jpg?size=1024x1024&quality=95&sign=960bd51d4f45db2c01abdbbdd73b26c0&type=album'
        },
        {
            question: 'Вы решаете украсить свой дом. Как вы подходите к этому?',
            answers: [
                'Ищу вдохновение и придумываю уникальный дизайн.',
                'Покупаю готовые решения в магазине.',
                'Использую советы друзей и семьи.',
                'Ничего не меняю, меня всё устраивает.',
            ],
            scores: {
                'Креативность и инновационность': [3, 2, 2, 1]
            },
            image: 'https://sun9-46.userapi.com/impg/rd7hQV5RbTaAG_X_lQJSaqB5HQ7bStOZhjrMzw/L2vGv-dHJrk.jpg?size=1024x1024&quality=95&sign=926e95cb7d62fc81aadc9578b127aad9&type=album'
        },
        {
            question: 'Приготовление еды для гостей. Как вы действуете?',
            answers: [
                'Экспериментирую с новыми рецептами и ингредиентами.',
                'Готовлю проверенные блюда по рецептам.',
                'Заказываю еду из ресторана.',
                'Прошу гостей принести что-то с собой.',
            ],
            scores: {
                'Креативность и инновационность': [3, 2, 1, 1]
            },
            image: 'https://sun9-5.userapi.com/impg/crabM8moFYFAHsg2jvhSCrPt9oK3Xb_JmqybDg/9CDyeCoCXZY.jpg?size=1024x1024&quality=95&sign=f6b29a1a135e7bc0b7f7296fbdecaf18&type=album'
        },
        {
            question: 'Вам нужно спланировать семейный отпуск. Как вы это делаете?',
            answers: [
                'Детально планирую маршрут и бронирую всё заранее.',
                'Покупаю тур у оператора и не беспокоюсь о деталях.',
                'Едем спонтанно, решая всё на месте.',
                'Отказываюсь от ответственности и передаю планирование другим.',
            ],
            scores: {
                'Организаторские способности': [3, 2, 2, 1]
            },
            image: 'https://sun9-26.userapi.com/impg/_yBRD5G5wa3a6-b7wel-6_321a9N439HlC7Vjg/stE2cApz4Bc.jpg?size=1024x1024&quality=95&sign=588732876d62b858f68bce2b848165bf&type=album'
        },
        {
            question: 'Как вы управляете домашними делами и обязанностями?',
            answers: [
                'Составляю расписание и список задач для себя и семьи.',
                'Делаю всё по мере необходимости без плана.',
                'Часто забываю о делах и откладываю их.',
                'Делегирую обязанности другим членам семьи.',
            ],
            scores: {
                'Организаторские способности': [3, 2, 1, 2]
            },
            image: 'https://sun9-29.userapi.com/impg/92j0GQ1_O0ER1hKDgbdbbLgxd0K0PZnHslnDRA/3hgGhDBct90.jpg?size=1024x1024&quality=95&sign=562fa17b94b6ca2bc389b3548e290cdd&type=album'
        },
        {
            question: 'Вы решили заняться спортом для улучшения здоровья. Как вы действуете?',
            answers: [
                'Составляю план тренировок и придерживаюсь его.',
                'Занимаюсь, когда есть настроение и время.',
                'Быстро теряю интерес и бросаю занятия.',
                'Ищу партнёра, чтобы было веселее и мотивированнее.',
            ],
            scores: {
                'Настойчивость и целеустремлённость': [3, 2, 1, 2]
            },
            image: 'https://sun9-36.userapi.com/impg/4x758oIGaJ-4x2MtuqeEtWtmsSvfivq0oCjJ6w/0GWZjprS-fg.jpg?size=1024x1024&quality=95&sign=9ebe58b51efdd854a9d560e25985f4f0&type=album'
        },
        {
            question: 'Столкнувшись с трудностями в освоении нового навыка, вы:',
            answers: [
                'Продолжаете упорно тренироваться до достижения результата.',
                'Снижаете интенсивность занятий, но не бросаете.',
                'Отказываетесь от затеи, считая это слишком сложным.',
                'Ищете альтернативные способы обучения.',
            ],
            scores: {
                'Настойчивость и целеустремлённость': [3, 2, 1, 2]
            },
            image: 'https://sun9-16.userapi.com/impg/Y92eJrta_Q-kyjobFudDfEON5Y-GZSnPOpwXDg/QBN3fuNypkc.jpg?size=1024x1024&quality=95&sign=840b1323e9a1aa3dcdfd766824ad419c&type=album'
        },
        {
            question: 'Близкий человек выглядит подавленным. Как вы реагируете?',
            answers: [
                'Спрашиваю, что случилось, и предлагаю поддержку.',
                'Даю ему(ей) пространство и не вмешиваюсь.',
                'Стараюсь развеселить, не углубляясь в проблемы.',
                'Игнорирую, считая, что это не моё дело.',
            ],
            scores: {
                'Эмоциональный интеллект': [3, 2, 2, 1]
            },
            image: 'https://sun9-35.userapi.com/impg/O3gPHEoG_zzSoFhe-dTC7ICEbtd_KlvTSbDF0w/0HtuTLWyJrk.jpg?size=1024x1024&quality=95&sign=5fb1c4bb94613084de0b9c5a6a1ace22&type=album'
        },
        {
            question: 'В конфликтной ситуации с родственником вы:',
            answers: [
                'Стараетесь понять его(её) точку зрения и найти компромисс.',
                'Настаиваете на своём и не уступаете.',
                'Избегаете обсуждения и отходите от разговора.',
                'Уступаете, чтобы сохранить мир, даже если не согласны.',
            ],
            scores: {
                'Эмоциональный интеллект': [3, 2, 1, 2]
            },
            image: 'https://sun9-2.userapi.com/impg/1i1MRkDoGn-kVNxqN8yWaq_ImkUZmX3bXepCEQ/F70BcF-6xsA.jpg?size=1024x1024&quality=95&sign=45e2388095d56d443efaf911abb8dfc2&type=album'
        },
    ];

    function startTest() {
    currentQuestion = 0;      // Сброс индекса текущего вопроса
    userScores = {};          // Сброс результатов
    showQuestion();           // Показ первого вопроса
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
