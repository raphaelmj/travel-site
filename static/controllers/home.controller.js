var app = angular.module('app', ['ngTouch', 'ngCookies'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
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

app.run(function ($rootScope, $document, AppService) {

    AppService.showHideSmallFilters($document.scrollTop())

    $document.on('scroll', function () {
        AppService.showHideSmallFilters($document.scrollTop())
    })
})

app.config(function ($locationProvider) {

    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode({
        enabled: false,
        requireBase: true
    });
});

app.controller('BodyController', function ($scope, $document, $rootScope) {



})

app.controller('FrontRotorController', function ($scope, $interval, $timeout) {

    $scope.initRotor = function () {


        angular.element(document.querySelector('.rotor-cits .cit-elem-0')).addClass('active');
        angular.element(document.querySelector('.rotor-cits .btn-0')).addClass('active');

        $scope.rdata.lastkey = $scope.rdata.how_many - 1;


        $interval(function () {

            $scope.rdata.stop--;

            if ($scope.rdata.stop > 0)
                return;

            angular.element(document.querySelector('header.rotor .slide-' + $scope.rdata.now)).removeClass('active');
            angular.element(document.querySelector('header.rotor .slide-' + $scope.rdata.next)).addClass('active');

            angular.element(document.querySelector('header.rotor .title-big-' + $scope.rdata.now)).removeClass('active');
            angular.element(document.querySelector('header.rotor .title-big-' + $scope.rdata.next)).addClass('active');

            angular.element(document.querySelector('header.rotor .title-small-' + $scope.rdata.now)).removeClass('active');
            angular.element(document.querySelector('header.rotor .title-small-' + $scope.rdata.next)).addClass('active');

            angular.element(document.querySelector('header.rotor .btn-link-' + $scope.rdata.now)).removeClass('active');
            angular.element(document.querySelector('header.rotor .btn-link-' + $scope.rdata.next)).addClass('active');


            angular.element(document.querySelector('header.rotor .r-bt-' + $scope.rdata.now)).removeClass('active');
            angular.element(document.querySelector('header.rotor .r-bt-' + $scope.rdata.next)).addClass('active');




            if ($scope.rdata.lastkey == $scope.rdata.next) {
                $scope.rdata.now++;
                $scope.rdata.next = 0;
            } else if ($scope.rdata.lastkey == $scope.rdata.now) {
                $scope.rdata.now = 0;
                $scope.rdata.next++;
            } else {
                $scope.rdata.now++;
                $scope.rdata.next++;
            }


        }, 4000);

    }


    $scope.changeSlideByButton = function (k) {

        $scope.rdata.stop = 4;


        // angular.element(document.querySelector('.rotor-cits .cit-elem.active')).removeClass('active');
        // angular.element(document.querySelector('.rotor-cits .cit-elem-' + k)).addClass('active');

        // angular.element(document.querySelector('.rotor-cits .btn.active')).removeClass('active');
        // angular.element(document.querySelector('.rotor-cits .btn-' + k)).addClass('active');

        angular.element(document.querySelector('header.rotor .slide.active')).removeClass('active');
        angular.element(document.querySelector('header.rotor .slide-' + k)).addClass('active');

        angular.element(document.querySelector('header.rotor .title-big.active')).removeClass('active');
        angular.element(document.querySelector('header.rotor .title-big-' + k)).addClass('active');

        angular.element(document.querySelector('header.rotor .title-small.active')).removeClass('active');
        angular.element(document.querySelector('header.rotor .title-small-' + k)).addClass('active');

        angular.element(document.querySelector('header.rotor .btn-link.active')).removeClass('active');
        angular.element(document.querySelector('header.rotor .btn-link-' + k)).addClass('active')

        angular.element(document.querySelector('header.rotor .r-bt.active')).removeClass('active');
        angular.element(document.querySelector('header.rotor .r-bt-' + k)).addClass('active');


        if ($scope.rdata.lastkey == k) {
            $scope.rdata.now = k;
            $scope.rdata.next = 0;
        } else {
            $scope.rdata.now = k;
            $scope.rdata.next = ++k;
        }


    }

    $scope.changeSlideByButtonSwipe = function (action) {
        // switch (action) {
        //     case 'minus':

        //         if ($scope.rdata.next == 0) {
        //             $scope.rdata.now--;
        //             $scope.rdata.next = $scope.rdata.lastkey;
        //         } else if ($scope.rdata.next == $scope.rdata.lastkey) {
        //             $scope.rdata.now--;
        //             $scope.rdata.next = 0;
        //         } else {
        //             $scope.rdata.now--;
        //             $scope.rdata.next--;
        //         }

        //         break;

        //     case 'plus':

        //         if ($scope.rdata.lastkey == $scope.rdata.next) {
        //             $scope.rdata.now++;
        //             $scope.rdata.next = 0;
        //         } else if ($scope.rdata.lastkey == $scope.rdata.now) {
        //             $scope.rdata.now = 0;
        //             $scope.rdata.next++;
        //         } else {
        //             $scope.rdata.now++;
        //             $scope.rdata.next++;
        //         }


        //         break;
        // }


        // angular.element(document.querySelector('.rotor-cits .cit-elem.active')).removeClass('active');
        // angular.element(document.querySelector('.rotor-cits .cit-elem-' + $scope.rdata.next)).addClass('active');

        // angular.element(document.querySelector('.rotor-cits .btn.active')).removeClass('active');
        // angular.element(document.querySelector('.rotor-cits .btn-' + $scope.rdata.next)).addClass('active');

    }

});


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