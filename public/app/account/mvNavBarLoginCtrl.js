angular.module('app').factory('Page', function() {
    var title = '';
    return {
        title: function() { return title; },
        setTitle: function(newTitle) { title = newTitle }
    };
});

angular.module('app').config([
    '$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix('!');
    }
]);

angular.module('app').controller('mvNavBarLoginCtrl',function($scope,$window, $http, mvNotifier, mvAuth,$location,mvRating,mvMessage,mvIdentity,Page){
    $scope.identity=mvIdentity;

    $scope.messages=mvIdentity.messages;

    $scope.Page = Page;

   // console.log("identiti "+JSON.stringify(mvIdentity));
    Page.setTitle(  '');

    $scope.signin=function(username,password) {
        mvAuth.authenticateUser(username, password).then(function(success){
            if(success){
                mvNotifier.notify('Sisselogimine õnnestus!');

                $location.path('/');
            }else
            {
                mvNotifier.error('Sisselogimine ebaõnnestus!');
            }
        });
    }
    $scope.signout=function(){
        mvAuth.logoutUser().then(function(){
            $scope.username="";
            $scope.password="";
            mvNotifier.notify('Logisite välja!');
            $location.path('/');
        })
    }


});