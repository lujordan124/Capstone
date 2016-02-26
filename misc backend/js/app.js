var mainApp = angular.module("mainApp", ['ngRoute']);
         
mainApp.controller("HelloController", function($scope) {
	$scope.quiz = {};
	$scope.quiz.classID = "";
	$scope.quiz.quizName = "";
	$scope.quiz.timeAllowed;
	$scope.quiz.numSubmission = [];
	$scope.quiz.questions = [];
	$scope.quiz.answers = [];
	$scope.quiz.retakes;
	$scope.quiz.language = "C";
	$scope.quiz.startTimes = [];
	$scope.quiz.startDates = [];
	$scope.quiz.endTimes = [];
	$scope.quiz.endDates = [];
	$scope.quiz.lateTimes = [];
	$scope.quiz.lateDates = [];
	$scope.quiz.sectionNumber = [];


	$scope.add = function () {
	  $scope.quiz.questions.push("");
	  $scope.quiz.answers.push("");
	  $scope.quiz.numSubmission.push(5);
	};
	
	$scope.remove = function() {
		$scope.quiz.questions.pop();
	}
	
  $scope.createTest = function() {
		if (!$scope.testCreationForm.$valid) {
			alert("you have empty questions!!");
		} else {
			$http.post('url', $scope.quiz)
				.success(function(data) { // data consists of json data returned from server side
					$scope.quiz = {}; // clear the form so our user is ready to enter another
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
  };

	$scope.addStartTime = function () {
	  $scope.quiz.startTimes.push(new Date());
	};

	$scope.addEndTime = function () {
	  $scope.quiz.endTimes.push(new Date());
	};

	$scope.addLateTime = function () {
	  $scope.quiz.lateTimes.push(new Date());
	};

	$scope.addStartDate = function () {
	  $scope.quiz.startDates.push(new Date());
	};

	$scope.addEndDate = function () {
	  $scope.quiz.endDates.push(new Date());
	};

	$scope.addLateDate = function () {
	  $scope.quiz.lateDates.push(new Date());
	};

});
