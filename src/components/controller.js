
var app = angular.module("myApp", []);
app.controller("studentCtrl", function ($scope) {
    $scope.NameMessage = "";
    $scope.rollMessage = "";

    $scope.showMessage = function () {
        $scope.NameMessage = "Hello " + $scope.studentName + ", Welcome to Khan Mohammed Kaif's Practical!";
        $scope.rollMessage = "Your roll number is "+ $scope.rollno;
    };
});
