let score = 0;
let answers = [];

function checkAnswer(selectedAnswer, questionNumber) {
    const correctAnswers = {
        1: "d",
        2: "c",
        3: "b",
        4: "c",
        5: "d",
        6: "a",
        7: "b",
        8: "b",
        9: "a",
        10: "c"
    };


    const buttons = document.querySelectorAll(`.question:nth-child(${questionNumber + 1}) .options button`);

    if (selectedAnswer === correctAnswers[questionNumber] && !answers.includes(questionNumber)) {
        score++;
        answers.push(questionNumber);
        document.getElementById('result').innerHTML = `Bonne réponse ! Score: ${score}/10`;
        buttons.forEach(button => {
            if (button.onclick.toString().includes(selectedAnswer)) {
                button.classList.add('correct');
            }
        });
    } else if (answers.includes(questionNumber)) {
        document.getElementById('result').innerHTML = `Vous avez déjà répondu correctement à cette question ! Score: ${score}/10`;
    } else {
        document.getElementById('result').innerHTML = `Mauvaise réponse. Essayez encore ! Score: ${score}/10`;
        buttons.forEach(button => {
            if (button.onclick.toString().includes(selectedAnswer)) {
                button.classList.add('incorrect');
            }
        });
    }
}