var app = angular.module('app', ['ngTouch', 'ngCookies'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});
app.config(function ($locationProvider) {

    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: true
    });
});

app.factory('AppService', function ($location, $document) {
    return {
        showHideSmallFilters: function (scrollTop) {
            // console.log(scrollTop)
        },
        url: $location.protocol() + '://' + $location.host(),
        host: $location.host()
    }
})

app.controller('BodyController', function ($scope, $document, $rootScope) {



})

app.controller('CookieController', function ($scope, $cookies, AppService) {

    // console.log($cookies.get('rConfirm'));

    $scope.hideCookieCloud = function () {
        var date = new Date();
        var nDate = new Date(date.getTime() + 24 * 60 * 60000 * 14);
        // var nDate = new Date(date.getTime() + 3*60000);
        document.getElementById("cookie-beam").style.display = 'none';
        $cookies.put('rConfirm', 'accept', { expires: nDate, domain: AppService.host, path: '/' });
    }

});