var app = angular.module('app' , []);

//create game functionality
app.controller('createGameController' , function($scope , $http){
	$scope.game = {participants : [{id : 1 , email : ''}]};
	$scope.station_admins = [];
    $scope.authenticated_user = {};
	$http.get('/auth/me').then(function(response){
        if(response && response.data){
            $scope.authenticated_user = response.data;
        }  
    });

	$scope.create = function(){
		var participants = $scope.game.participants.map(function(participant) { return participant.email; });
		$scope.game.participants = participants;
		$http.post('/game' , $scope.game , {headers : {Authorization : 'Bearer ' + $scope.authenticated_user.accessToken}}).then(function(response){
			window.location.href = '/gameroom';
		} , function(error){
			$scope.error = error.data.message;
		});
	}

	$scope.addParticipant = function(count){
		$scope.game.participants.push({id : count + 1 , email : ''});
	}
});

//game play functionality
app.controller('playGameController' , function($scope , $http , $interval){
	$scope.game = {};
    $scope.authenticated_user = {};
    $scope.players  = [];
    $scope.stats = [];
    var id = window.location.href.split('/').pop();
    $scope.time = 1000;
    $scope.loadCurrentGame = function(){
    	$http.get('/game/' + id , {headers : {Authorization : 'Bearer ' + $scope.authenticated_user.accessToken}}).then(function(response){
	        if(response && response.data){
	            $scope.game = response.data;

	            $scope.join();
	        }  
	    });
    }

	$scope.join = function(){
		$scope.socket = io.connect('http://localhost:8080');
		console.log($scope.game.participants.length);
		$scope.socket.emit('join' , {game_id : $scope.game.id , total_participants : $scope.game.participants.length + 1, user_email : $scope.authenticated_user.email});

		$scope.socket.on('user-joined' , function(data){
			$scope.$apply(function(){
				$scope.players.push(data.user_email);
				$scope.stats.push({email : data.user_email , clicks : 0});
			})
		});

		$scope.socket.on('welcome' , function(data){
			$scope.$apply(function(){
				$scope.players = data.participants;
				for (var i = $scope.players.length - 1; i >= 0; i--) {
					$scope.stats.push({email : $scope.players[i] , clicks : 0});
				}
			})
		})

		$scope.socket.on('update' , function(data){
			$scope.$apply(function(){
				$scope.start = true;
				$scope.time = data.time;
			})
		})

		$scope.socket.on('finish' , function(data){
			$scope.$apply(function(){
				$scope.start = false;
				$scope.winner = data;
			})
		});

		$scope.socket.on('clicked' , function(data){
			$scope.$apply(function(){
				var player = _.findWhere($scope.stats , {email : data.user_email});
				if(player){
					player.clicks++;
				}
			})	
		})
	}

	$scope.click = function(){
		$scope.socket.emit('click' , {game_id : $scope.game.id , user_email : $scope.authenticated_user.email});
	}

	$http.get('/auth/me').then(function(response){
        if(response && response.data){
            $scope.authenticated_user = response.data;

            $scope.loadCurrentGame();
        }  
    });
});
