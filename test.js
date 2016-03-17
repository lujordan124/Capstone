//save the current code and feedback
function saveText() {
	currentCode[qIndex] = editor.getValue();
	currentFeedback[qIndex] = document.getElementById("result").innerHTML;
}

//if coming back to test, retrieve code previously saved and display
function loadText() {
	editor.setValue(currentCode[qIndex], 1);
	document.getElementById("result").innerHTML = currentFeedback[qIndex];
}

//save code to server (done automatically)
function saveToServer(){
	$.ajax({
		type: "POST",
        url: "Save.php",
        data: {
        	code : currentCode, 
        },
        success: function(data){
     		alert("Code saved.");
        }
	});
}

//when test is finished
function finishTest(element) {
	document.getElementById("bottom").style.disply = "none";
	document.getElementById("problem").text = "hidden";
	document.getElementById('countdown').style.display = "none";
	document.webkitExitFullscreen();
	document.mozCancelFullscreen();
	document.exitFullscreen();
}

//exit test if quiz submitted
function exitTest() {
	saveText();
	if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
		pauseTest();

		$.ajax({
			type: "POST",
	        url: "SubmitQuiz.php",
	        data: {
	        	quizID : quizID, 
	        },
	        success: function(data){
	     		// alert("Code saved.");
	        }
		});

		copied = 0;
	}
}

//pause test if alt-tabbed or exited fullscreen
function pauseTest() {
	document.getElementById("test").style.display = "none";
	document.getElementById("resumeTesting").style.display = "block";
	clearInterval(myInterval);
}

//resume test if returning
function resumeTest() {
	document.getElementById("test").style.display = "block";
	document.getElementById("resumeTesting").style.display = "none";
	var date = new Date().getTime();
	timerTime =  date + (timeAllowed * 60 * 1000);
}

//for the timer
function myTimer() {
	//TIMER FUNCTIONS
	var counterDate = new Date().getTime()
	var countdown = document.getElementById('countdown');
	var secondsLeft = timerTime - counterDate;

	var minutes = Math.floor(secondsLeft/60000);
	var seconds = ((secondsLeft%60000)/1000).toFixed(0);
	
	if (seconds > 10) {
		countdown.innerHTML = '' + minutes + ':' + seconds;
	} else {
		countdown.innerHTML = '' + minutes + ':0' + seconds;
	}
}

//for loading the buttons when question changes
function loadButtons() {
	//next and previous buttons
	if(qIndex <= 0){
		document.getElementById('previous').style.display = 'none';
	} else {
		document.getElementById('previous').style.display = 'inline-block';
	}
	//hide next button on last question
	if(qIndex == questions.length-1 || qIndex == -1){
		document.getElementById('next').style.display = 'none';
	} else {
		document.getElementById('next').style.display = 'inline-block';
	}
}

//retrieve the questions from the server
function getQuestions() {
	$.ajax({
        type: "POST",
        url: "GetQuestions.php",
        data: {quizID: quizID},
        dataType: "JSON",
        success: function(data){
        	//retrieve quiz from database in JSON format
        	//document.getElementById("quizName").innerHTML = data.quizName;
        	if (data.success) {
        		document.getElementById("description").innerHTML = data.question[0];
	        	var i;
	        	for (i = 0; i < data.question.length; i++) {
	        		questions[i] = {description: data.question[i], numSubmissions: data.numSubmission[i], number: i+1};
	        		currentCode[i] = data.codes[i];
	        		currentFeedback[i] = data.feedbacks[i];
	        	}

	        	timeAllowed = data.timeAllowed;
	        	myInterval = setInterval(function() { myTimer() }, 1000);
	        	var quizName = data.quizName;
	        	return 1;
	        } else {
	        	return 0;
	        }
        }
	});
}

//force full screen
function requestFullScreen(element) {
	EnteredTest = 1;
	quizID = document.getElementById("quizIDInput").value;
	// resumeTest();

	if (getQuestions() == 1) {
		resumeTest();
		loadButtons();

		var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
		if (requestMethod) {
			requestMethod.call(element);

			document.getElementById("fullscreen").style.display = "none";
			document.getElementById("quizIDDiv").style.display = "none";
			document.getElementById("countdown").style.display = "block";
			document.getElementById("bottom").style.display = "block";
			document.getElementById("problem").style.display = "block";

		} else if (typeof window.ActiveXObject !== "undefined") {
			var wscript  = new ActiveXObject("WScript.Shell");
			if (wscript != null) {
				wscript.SendKeys("{F11}");
			}
		}
	}
	// else {
		// alert("Entered the wrong quiz ID");
	// }
}