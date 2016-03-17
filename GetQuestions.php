<?php

	$quizID = $_POST["quizID"];

	require "CheckLogin.php";


	/* 	===============================================================
		Get mongo object - quizzes (collection)
		=============================================================== */
	$mongo = new MongoClient(); 
	$db = $mongo->selectDB("capstone");
	$cursor = $db->quizzes->find(array("quizID" => $quizID));


	/* 	===============================================================
		Create quiz object
			<list> 		question
			<list> 		numSubmission
			<int> 		timeAllowed
			<string> 	quizName
			<list> 		beginTime
			<list> 		beginDate
			<list> 		endTime
			<list>		endDate
			<list> 		sectionNumber
			<int>		retake
			<string> 	language
		=============================================================== */
	$quiz = array(); // OBJECT
	$numSubmission = array();
	$beginDate = array();
	$beginTime = array();
	$endDate = array();
	$endTime = array();
	$sectionNumber = array();
	$lateDate = array();
	$lateTime = array();
	$question = array();


	/* 	===============================================================
		Get quiz object - using quizID
			Check if it there is a quiz
		=============================================================== */
	$found = false;
	foreach ($cursor as $document) {
		$numSubmission = $document["numSubmission"];
		$question = $document["question"];
		$quizName = $document["quizName"];
		$timeAllowed = $document["timeAllowed"];
		$retake = $document["retake"];
		$beginTime = $document["beginTime"];
		$beginDate = $document["beginDate"];
		$lateTime = $document["lateTime"];
		$lateDate = $document["lateDate"];
		$endTime = $document["endTime"];
		$endDate = $document["endDate"];
		$sectionNumber = $document["sectionNumber"];
		$language = $document["language"];
		$found = true;
	}

	$size = count($question);
	$currDate = date("Y-m-d");
	$yerDate = date("Y-m-d", time() - 60*60*24);
	$currTime = date("h:i");
	if (is_array($sectionNumber)) {
		$index = array_search($MysectionNumber, $sectionNumber);

		$MybeginDate = $beginDate[$index];
		$MybeginTime = $beginTime[$index];
		$MyendDate = $endDate[$index];
		$MyendTime = $endTime[$index];
	}
	else {
		$MybeginDate = $beginDate;
		$MybeginTime = $beginTime;
		$MyendDate = $endDate;
		$MyendTime = $endTime;
	}


	/* 	===============================================================
		Check if the student can take the quiz
		=============================================================== */

	if ($found) {
		// CHECK DATE

		$allowed = false;
		if ($MybeginDate < $currDate && $currDate < $MyendDate){
			$allowed = true;
		}
		else if ($MybeginDate == $currDate) {
			if ($MybeginTime <= $currTime) {
				$allowed = true;
			}
			else {
				$quiz["message"] = "Can't take the quiz yet";	
			}
		}
		else if ($currDate == $MyendDate) {
			if ($MyendTime > $currTime) {
				$allowed = true;
			}
			else {
				$quiz["message"] = "Too late to take the quiz";	
			}
		}
		else {
			if ($MybeginDate > $currDate) {
				$quiz["message"] = "Can't take the quiz yet";	
			}
			else {
				$quiz["message"] = "Too late to take the quiz";
			}	
		}
		
		if ($allowed) {

			$cursor = $db->quizSubmission->find(array("studentID" => $studentID,
					"quizID" => $quizID));
			$taken = $cursor->count();

			// End earlier quizzes
			if ($taken > 0) {
				$cursor = $db->quizSubmission->find(array(
					"studentID" => $studentID,
					"quizID" => $quizID,
					"try" => $taken));
				foreach ($cursor as $document) {
					$finished = $document["finished"];
					$startTime = $document["startTime"];
					$startDate = $document["startDate"];
				}
				if (!$finished) {
					// LOAD OLD

					$code = array();
					$feedback = array();
					for ($i = 0; $i < $size; $i++) {
						$cursor = $db->submission->find(array(
							"studentID" => $studentID,
							"quizID" => $quizID,
							"questionNumber" => $i
							));
						$cursor->sort(array(
							"_id" => 1));
						$tempCode = "";
						$tempResult = "";
						if ($cursor->count() > 0) {
							foreach($cursor as $document) {
								$tempCode = $document["code"];
								$tempResult = $document["result"];
							}
						}
						$code[] = $tempCode;
						$feedback[] = $tempResult;
					}

					$quiz["success"] = true;
					$quiz["message"] = "Success";
					$quiz["continue"] = true;
					$quiz["numSubmission"] = $numSubmission; // list
					$quiz["question"] = $question; // list
					$quiz["quizName"] = $quizName;
					$quiz["timeAllowed"] = $timeAllowed * $extraTime;
					$quiz["retake"] = $retake; // number of retakes allowed
					$quiz["language"] = $language;
					$quiz["try"] = $taken + 1; // how many times have they taken
					$quiz["currTime"] = $currTime; // current time of server
					$quiz["currDate"] = $currDate;
					$quiz["code"] = $code;
					$quiz["feedback"] = $feedback;
					$quiz["startTime"] = $startTime;
					$quiz["startDate"] = $startDate;
					$quiz["timeLeft"] = strtotime($currDate) - strtotime($startDate) + strtotime($currTime) - strtotime($startTime);

					echo json_encode($quiz);
					exit;
				}
			}

			//TAKE NEW
			if ($taken < $retake || $retakeAllowed == "true") {

				$db->quizSubmission->insert(array(
					"studentID" => $studentID,
					"quizID" => $quizID,
					"startDate" => $currDate,
					"startTime" => $currTime,
					"try" => $taken + 1,
					"finished" => false
					));

				$quiz["success"] = true;
				$quiz["continue"] = false;
				$quiz["message"] = "Success";
				$quiz["numSubmission"] = $numSubmission; // list
				$quiz["question"] = $question; // list
				$quiz["quizName"] = $quizName;
				$quiz["timeAllowed"] = $timeAllowed * $extraTime;
				$quiz["retake"] = $retake; // number of retakes allowed
				$quiz["language"] = $language;
				$quiz["try"] = $taken + 1; // how many times have they taken
				$quiz["currTime"] = $currTime;
				$quiz["currDate"] = $currDate;
			}
			else {
				$quiz["success"] = false;
				$quiz["message"] = "Exceeded number of quizzes you can take";
			}
			
		}
		else {
			$quiz["success"] = false;
		}

	}
	else {
		$quiz["success"] = false;
		$quiz["message"] = "Did not find the quiz item";

	}
	/* 	===============================================================
		Send (quiz) object
			<list> 		question
			<list> 		numSubmission
			<int> 		timeAllowed
			<string> 	quizName
			<list> 		beginTime
			<list> 		beginDate
			<list> 		endTime
			<list>		endDate
			<list> 		sectionNumber
			<int>		retake
			<bool> success: True if successful, false if unsuccessful
			<string> message: Message of what happened.
		=============================================================== */
	echo json_encode($quiz);



	/* SUMMARY DASH VIEW FOR TA + EXCEPTIONS */
	/* SOME COURSE INFO */
	

?>