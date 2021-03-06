angular.module('app').controller('mvRatingCtrl', function($scope,mvUserCUD, mvRating,mvTaking,mvIdentity,$location,$routeParams,mvRatingCUD,mvTakingCUD,mvNotifier) {
    console.log('tere');
    var username="";
    var user;
    var passenger;
    if(mvIdentity.currentUser!=null){
        username=mvIdentity.currentUser.username;
    }
    $scope.isOn=false;
//{_id:$routeParams.id, registredPassengers: [{name:$routeParams.name}]} {registredPassengers: [{_id:$routeParams.id}]}

    mvUserCUD.check({username: $routeParams.name}).then(function(response) {

        if(response.data.reason===0){
            console.log("se lits on null")
            $location.path('/');
        }
       // console.log(JSON.stringify(response));
    }, function (reason) {
        mvNotifier.error(reason);

    });


    mvRatingCUD.checkIfRated({username: username,ratedUsername:$routeParams.name, _id:$routeParams.id}).then(function(response) {

        if(response.data.response===1){
            $scope.isOn=true;
            user=true;
            console.log('checkIfRated' +user)
         //   $location.path('/');

        }
        // console.log(JSON.stringify(response));
    }, function (reason) {
        mvNotifier.error(reason);

    });
    mvRatingCUD.checkIfRatedbu({username: $routeParams.name,ratedUsername:username, _id:$routeParams.id}).then(function(response) {

        if(response.data.response===1){
            $scope.isOn=true;
            passenger = true;
            console.log('checkIfRatedbu' + passenger)
            //   $location.path('/');

        }
        // console.log(JSON.stringify(response));
    }, function (reason) {
        mvNotifier.error(reason);

    });

 /*   mvRatingCUD.checkpassenger({username: username,ratedUsername:$routeParams.name}).then(function(response) {

        if(response.data.takings>response.data.ratings){
            $scope.isOn=true;
            //   $location.path('/');

        }
        // console.log(JSON.stringify(response));
    }, function (reason) {
        mvNotifier.error(reason);

    });

*/
    $scope.isOwner=function(){
        if(username===$routeParams.name || username===""){
            return true
        }
        return false
    };

    $scope.taking=mvTaking.query({'registredPassengers._id':$routeParams.id});

    $scope.user=$routeParams.name;
    $scope.role="Tavakasutaja";
    $scope.ratings=mvRating.query({ratedUsername: $routeParams.name});


    $scope.myid=$routeParams.id;
    $scope.checked=function(id){

    }
    $scope.add = function(vars) {

        var rating;

        if(vars==null||vars=='has-success')
            var rating=1;
        if(vars=="has-warning")
            var rating=0;
        if(vars=="has-error")
            var rating=-1;




        var newCommentData = {
            takingRegistredPassengerId:$routeParams.id,
            username:username,
            ratedUsername:$routeParams.name,
            ratedDate:new Date(),
            rating:rating,
            comment:$scope.comment
        };

        var updateTakingData = {
            _id:$routeParams.id
        };
        if(user){
            updateTakingData.rated=true;
        }

        if(passenger){
            updateTakingData.ratedByPassaneger=true;
        }


        mvTakingCUD.setRatedToTrue(updateTakingData).then(function(responsedId) {
            $scope.isOn=false;
        }, function (reason) {
            mvNotifier.error(reason);
        });

        mvRatingCUD.addNewComment(newCommentData).then(function(responsedId) {
            console.log(responsedId);

            var extendId ={

                _id:responsedId
            };
            var clone = angular.copy(newCommentData);
            angular.extend(clone, extendId);

            mvNotifier.notify('Lisatud!');
            $scope.ratings.push(clone);
        }, function (reason) {
            mvNotifier.error(reason);
        });
    }

    $scope.getClass = function (mvRating) {
        if($routeParams.id===mvRating.takingRegistredPassengerId)
        {
            $scope.visor=true
        }

        return {

            "fa fa-smile-o": mvRating.rating == 1,
            "fa fa-frown-o": mvRating.rating == -1,
            "fa fa-meh-o": mvRating.rating == 0
        };
    };
    $scope.getClassLabel = function (mvRating) {
        return {
            "label label-success": mvRating.rating == 1,
            "label label-danger": mvRating.rating == -1,
            "label label-warning": mvRating.rating == 0
        };
    };
    $scope.predicate = '-ratedDate';





});

