//force full screen
function requestFullScreen(element) {
	getQuestions();
	if (checkVar == 1) {
		document.getElementById("problemNum").innerHTML = "Problem #" + questions[qIndex].number;
		document.getElementById("description").innerHTML = questions[qIndex].description;
		quizID = document.getElementById("quizIDInput").value;
		enteredTest = 1;
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
	else {
		alert("Entered the wrong quiz ID");
	}
}

//save the current code and feedback
function saveText() {
	currentCode[qIndex] = editor.getValue();
	currentFeedback[qIndex] = document.getElementById("result").innerHTML;
}

//if coming back to test, retrieve code previously saved and display
function loadText() {	
	if (currentCode[qIndex] != null) {
		editor.setValue(currentCode[qIndex], 1);
	}

	if (currentFeedback[qIndex] != null) {
		document.getElementById("result").innerHTML = currentFeedback[qIndex];
	}
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
	finished = 1;

	document.getElementById("bottom").style.display = "none";
	document.getElementById("problemNum").style.display = "none";
	document.getElementById("description").innerHTML = "You are now finished. You may close the window."
	document.getElementById('countdown').style.display = "none";

	document.removeEventListener('webkitfullscreenchange', exitTest, false);
    document.removeEventListener('mozfullscreenchange', exitTest, false);
    document.removeEventListener('fullscreenchange', exitTest, false);
    document.removeEventListener('MSFullscreenChange', exitTest, false);

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
}

//resume test after student comes back
function resumeTest() {
	document.getElementById("test").style.display = "block";
	document.getElementById("resumeTesting").style.display = "none";
	var date = new Date().getTime();
	clearInterval(myInterval);
	timerTime =  date + (timeAllowed * 1000);
	myInterval = setInterval(myTimer, 1000);
	//qIndex = 0;
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