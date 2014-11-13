"use strict";
/*
    app.js, main Angular application script
    define your module and controllers here
*/

var reviewUrl = 'https://api.parse.com/1/classes/reviews'

angular.module('RatingApp', ['ui.bootstrap'])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'pcmpF6Z96vo6cmdacQNVDYog38VQP8baYOIMLjPF';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'SXOU8BCJX6VClPmO3tXrceClE4T70nI8fpAtWf0y';
    })

    .controller('RatingsController', function($scope, $http){
        $scope.refreshReviews = function (order) {
            $http.get(reviewUrl + order)
                .success(function (data) {
                    $scope.reviews = data.results
                });
        };

        $scope.refreshReviews('?order=-score');
        $scope.newReview = {
            rating: 0,
            name: null,
            title: null,
            body: null,
            score: 0

        };

        $scope.addReview = function(){
            $scope.inserting = true;
            $scope.showForm();
            var review = $scope.newReview = {
                rating: $scope.rate,
                name: document.getElementById('reviewer-name').value,
                title: document.getElementById('review-title').value,
                body: document.getElementById('review').value,
                score: 0
            };
            $http.post(reviewUrl, review)
                .success(function(responseData){
                    $scope.newReview.objectId = responseData.objectId;
                    $scope.reviews.push($scope.newReview);
                })
                .finally(function(){
                    $scope.inserting = false;
                    document.getElementById('reviewer-name').value = null;
                    document.getElementById('review-title').value = null;
                    document.getElementById('review').value = null;
                    $scope.rate = 0;
                });
        };

        $scope.deleteComment = function(review) {
            $http.delete(reviewUrl + "/" + review.objectId, review)
                .success(function(){
                    $scope.refreshReviews('');
                });
        };


        $scope.vote = function(review, vote){
            if(vote == 1){
                $http.put(reviewUrl + "/" + review.objectId, {"score":{"__op":"Increment","amount":1}})
                    .success(function(){
                        $scope.refreshReviews('');
                    });

            } else if(review.score > 0){
                $http.put(reviewUrl + "/" + review.objectId, {"score":{"__op":"Increment","amount":-1}})
                    .success(function(){
                        $scope.refreshReviews('');
                    });
            }
        };

        $scope.rate = 0;
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        document.getElementById('add-comment').style.display = 'none';
        $scope.showForm = function(){
            if(document.getElementById('add-comment').style.display == 'block') {
                document.getElementById('add-comment').style.display = 'none';
            } else {
                document.getElementById('add-comment').style.display = 'block';
            }
        }
    });