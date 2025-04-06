var n_right = 0, n_wrong = 0;
var cquestions;
var questions;
var currentQuestionIndex = 0;

$(document).ready(function () {
    // $("#test").text("Hello, World!");

    function showQuestion() {
        if (questions && questions[currentQuestionIndex]) {
            var question = questions[currentQuestionIndex];
            console.log(question);
            $("#questiontext").text(question.question);
            $("#checkButton").removeClass("d-none");
            $("#nextButton").addClass("d-none");
            $("#feedback").addClass("d-none");

            var answersContainer = $("#answersContainer");
            answersContainer.empty(); // Clear previous answers

            question.options.forEach(function (answer, index) {
                var answerHtml = `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="answer${index}" name="answers" value="${index}">
                        <label class="form-check-label fs-6 text" for="answer${index}" id="answerLabel${index}">
                            ${answer}
                        </label>
                    </div>
                `;
                answersContainer.append(answerHtml);
            });
        }
    }

    $("#submitButton").click(function () {
        questions = [];
        cquestions = $("#cquestions").val();
        n_right = 0;
        n_wrong = 0;
        console.log("start quiz with " + cquestions + " questions");
        
        $.getJSON("https://raw.githubusercontent.com/Manuel0815/Alpakademie/main/data/jrk-questions.json", function (data) {
            if (data && Array.isArray(data)) {
                var randomQuestions = [];
                while (randomQuestions.length < cquestions && data.length > 0) {
                    var randomIndex = Math.floor(Math.random() * data.length);
                    randomQuestions.push(data.splice(randomIndex, 1)[0]);
                }
                console.log(randomQuestions); // Do something with the random questions
                questions = randomQuestions;
                currentQuestionIndex = 0;
                $("#quizStartContainer").addClass("d-none");
                $("#quizContainer").removeClass("d-none");
                $("#questiontitle").text("Frage 1 von " + cquestions);
                showQuestion();
            } else {
                console.error("Invalid data format in questions.json");
            }
        });

    });

    $("#checkButton").click(function () {
        console.log("Check");
        if (questions && questions[currentQuestionIndex]) {
            var question = questions[currentQuestionIndex];
            console.log("reset rightAnswers");
            var rightAnswers = 0;
            for (var i = 0; i < question.options.length; i++) {
                var answer = question.options[i];
                var isChecked = $("#answer" + i).is(":checked");
                console.log("Answer" + answer + " isChecked: " + isChecked + ". Option is correct: " + question.correctAnswers.includes(answer));
                if (question.correctAnswers.includes(answer)) {
                    $("#answerLabel" + i).addClass("text-success fw-bolder");
                }

                if (isChecked && question.correctAnswers.includes(answer) || !isChecked && !question.correctAnswers.includes(answer)) {
                    console.log("Answer is correct");
                    rightAnswers++;
                } else {
                    console.log("Answer is wrong");
                }
            }
            $("#feedback").removeClass("d-none");
            $("#checkButton").addClass("d-none");
            $("#nextButton").removeClass("d-none");

            if (rightAnswers === question.options.length) {
                n_right++;
                $("#feedback").text(" Richtig!").removeClass("text-danger").removeClass("bi bi-x-circle-fill").addClass("text-success").addClass("bi bi-check-circle-fill");
            } else {
                n_wrong++;
                $("#feedback").text(" Falsch!").removeClass("text-success").removeClass("bi bi-check-circle-fill").addClass("text-danger").addClass("bi bi-x-circle-fill");
            }
        }
    });

    $("#nextButton").click(function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            $("#feedback").addClass("d-none");
            $("#checkButton").removeClass("d-none");
            $("#nextButton").addClass("d-none");
            $("#questiontitle").text("Frage " + (currentQuestionIndex + 1) + " von " + cquestions);
            showQuestion();
        } else {
            $("#quizContainer").addClass("d-none");
            $("#resultsContainer").removeClass("d-none");
            $("#resultsTitle").text(((n_right / questions.length) * 100).toFixed(2) + "%");
            $("#resultsText").text("Du hast " + n_right + " von " + questions.length + " Fragen richtig beantwortet.");
        }
    });

    $("#resetButton").click(function () {
        $("#quizStartContainer").removeClass("d-none");
        $("#quizContainer").addClass("d-none");
        $("#resultsContainer").addClass("d-none");
    });

});