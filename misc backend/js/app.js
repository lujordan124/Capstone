var mainApp = angular.module("mainApp", []);
         
mainApp.controller("HelloController", function($scope) {
	$scope.quiz = {};
	$scope.quiz.classID = "";
	$scope.quiz.quizName = "";
	$scope.quiz.timeAllowed;
	$scope.quiz.numSubmission = [];
	$scope.quiz.questions = [];
	$scope.quiz.answers = [];
	$scope.quiz.retakes;
	$scope.quiz.language = "";
	$scope.quiz.startTimes = [];
	$scope.quiz.startDates = [];
	$scope.quiz.endTimes = [];
	$scope.quiz.endDates = [];
	$scope.quiz.lateTimes = [];
	$scope.quiz.lateDates = [];
	$scope.quiz.sectionNumbers = [];
	$scope.question = "";
	$scope.answer = "";
	$scope.submissions;
	$scope.part1 = true;
	$scope.startD;
	$scope.endD;
	$scope.lateD;
	$scope.startT;
	$scope.endT;
	$scope.lateT;
	$scope.sectionNum;


	$scope.add = function (q, a, n) {
	  $scope.quiz.questions.push(q);
	  $scope.quiz.answers.push(a);
	  $scope.quiz.numSubmission.push(n);
	  console.log($scope.quiz.questions.length);
	};
	
	$scope.remove = function() {
		$scope.quiz.questions.pop();
		$scope.quiz.answers.pop();
		$scope.quiz.numSubmission.pop();
	};

	$scope.showDetails = function() {
		$scope.part1 = false;
	}

	$scope.showQuestions = function() {
		$scope.part1 = true;
	}
	
  $scope.createTest = function() {
		if (!$scope.testCreationForm.$valid) {
			alert("you have empty questions!!");
		} else {
			$http.post('createQuiz.php', $scope.quiz)
				.success(function(data) { // data consists of json data returned from server side
					$scope.quiz = {}; // clear the form so our user is ready to enter another
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
  };

	$scope.addTime = function (startT, endT, lateT, startD, endD, lateD, sectionNum) {
	  $scope.quiz.startTimes.push(startT);
	  $scope.quiz.endTimes.push(endT);
	  $scope.quiz.lateTimes.push(lateT);
	  $scope.quiz.startDates.push(startD);
	  $scope.quiz.endDates.push(endD);
	  $scope.quiz.lateDates.push(lateD);
	  $scope.quiz.sectionNumbers.push(sectionNum);
	};

	$scope.removeTime = function () {
	  $scope.quiz.startTimes.pop();
	  $scope.quiz.endTimes.pop();
	  $scope.quiz.lateTimes.pop();
	  $scope.quiz.startDates.pop();
	  $scope.quiz.endDates.pop();
	  $scope.quiz.lateDates.pop();
	  $scope.quiz.sectionNumbers.pop();
	}

});
