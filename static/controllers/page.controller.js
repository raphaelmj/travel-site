var app = angular.module('app', ['ngTouch', 'ngCookies'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
})

app.factory('AppService', function ($location, $document) {
    return {
        showHideSmallFilters: function (scrollTop) {
            // console.log(scrollTop)
        },
        url: $location.protocol() + '://' + $location.host() + ":3000",
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

    $document.on('scroll', function () {
        // console.log($document.scrollTop())
    })

})

app.controller('EventSezonController', function ($scope, $cookies, AppService, $q, $http) {

    $scope.priceShadow = angular.element(document.getElementById('priceShadow'))

    $scope.showPopUpPrice = function (id) {
        $scope.priceC = null
        $scope.priceConfigGroup = []
        $scope.getPriceConfig(id)
            .then(
                function (r) {
                    $scope.priceC = r
                    $scope.prepareData($scope.priceC)
                    $scope.priceShadow.addClass('visible')
                    // console.log($scope.priceConfigGroup)
                },
                function (err) {
                    console.log(err)
                })
    }

    $scope.closePopUp = function () {
        $scope.priceC = null
        $scope.priceConfigGroup = []
        $scope.priceShadow.removeClass('visible')
    }

    $scope.getPriceConfig = function (id) {
        var d = $q.defer()
        $http.get(AppService.url + '/api/get/event/' + id)
            .then(function (r) {
                d.resolve(r.data.priceConfig)
            })
            .catch(function (e) {
                d.reject(e)
            })
        return d.promise
    }

    $scope.prepareData = function (pConfig) {

        if (pConfig.length) {
            pConfig.map(pc => {
                var days = this.findDays(pc.prices)
                var daysGroups = []
                days.map(d => {
                    daysGroups.push({ days: d, data: this.findDayData(d, pc.prices) })
                })
                $scope.priceConfigGroup.push({
                    groupName: pc.groupName,
                    groupDesc: pc.groupDesc,
                    daysGroups
                })
            })
        }
    }

    $scope.findDays = function (nodes) {
        var days = []
        nodes.map(el => {

            var bool = true;

            days.map(d => {
                if (d == el.days) {
                    bool = false;
                }
            })

            if (bool)
                days.push(el.days)

        })

        return days
    }

    $scope.findDayData = function (d, nodes) {
        var data = []
        nodes.map(el => {
            if (el.days == d) {
                data.push({
                    from: el.from,
                    to: el.to,
                    price: el.price
                })
            }
        })
        return data;
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