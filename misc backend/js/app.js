var mainApp = angular.module("mainApp", ['ngRoute']);
         
mainApp.controller("HelloController", function($scope) {
	$scope.helloTo = {};
	$scope.helloTo.title = "traveler";
	$scope.formData = [];

	$scope.add = function () {
	  $scope.formData.push({ 
		number: $scope.formData.length + 1,
		question: "",
		questionPlaceholder: "eg. write a function that adds two numbers",
	  });
	};
	
	$scope.remove = function() {
		$scope.formData.pop();
	}
	
    $scope.createTest = function() {
		if (!$scope.testCreationForm.$valid) {
			alert("you have empty questions!!");
		} else {
			$http.post('url', $scope.formData)
				.success(function(data) { // data consists of json data returned from server side
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.questions = data;
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		}
    };

});
