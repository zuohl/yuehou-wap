/**
 * Created by zuohl on 2016/2/23.
 */
var app = angular.module('hotCityApp', []);
app.controller('hotCityCtrl', function($scope,$http) {
    $http.get(urls.hotCity).success(function(response) {
            $scope.hotCity = response.data;
        });
});

/*
function selectCity(value) {
	setValue("cityName",value.innerText);
    window.location = "main.html";
}*/
/*$(".switchCity").on("tap",function(){
    setValue("cityName",$(this).text());
    window.location = "main.html";
});*/
$(document).on("tap","#hotCityList .switchCity",function(){
    setValue("cityName", $.trim($(this).text()));
   // window.location = "main.html";
    self.location='main.html';
    //window.location.replace("main.html");
});
