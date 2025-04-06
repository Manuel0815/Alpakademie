$(document).ready(function () {
    // $("#test").text("Hello, World!");

    $("#submitButton").click(function () {
        var cquestions = $("#cquestions").val();
        
        $.getJSON("data/questions.json", function (data) {
            if (data && Array.isArray(data)) {
                var randomQuestions = [];
                while (randomQuestions.length < 2 && data.length > 0) {
                    var randomIndex = Math.floor(Math.random() * data.length);
                    randomQuestions.push(data.splice(randomIndex, 1)[0]);
                }
                console.log(randomQuestions); // Do something with the random questions
            } else {
                console.error("Invalid data format in questions.json");
            }
        });

    });

});