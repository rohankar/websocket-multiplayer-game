var io = require('socket.io').listen(8080);
var _ = require('underscore');

var games = [];
io.sockets.on('connection' , function(socket){
	
	socket.on('join' , function(data){
		handleJoin(socket , data);
	});

	socket.on('click' , function(data){
		game = _.findWhere(games , {game_id : data.game_id});
		if(game){
			participant = _.findWhere(game.participants , {email : data.user_email});
			if(participant){
				participant.clicks++;
				emitEvent(game , 'clicked' , {user_email : data.user_email});
			}
		}
	});
})

function emitEvent(game , event , data){
	for (var i = game.participants.length - 1; i >= 0; i--) {
		if(game.participants[i].con)
			game.participants[i].con.emit(event , data);
	}
}


function handleJoin(socket , data){
  game = _.findWhere(games , {game_id : data.game_id});
  if(game){
    exists = _.findWhere(game.participants , {email : data.user_email});
    if(exists){
      exists.con = socket;
    }else{
      emitEvent(game , 'user-joined' , {user_email : data.user_email , game_id : data.game_id});
      game.participants.push({email : data.user_email , con : socket , clicks : 0});
    }
    
    socket.emit('welcome' , {'participants' : _.pluck(game.participants , 'email')});

    if(game.participants.length >= game.total_participants && !game.handle ){
      handleFinish(game);
    }

  }else{
    games.push({game_id : data.game_id , total_participants : data.total_participants , participants : [{email : data.user_email , con : socket , clicks : 0} ] , time : 60});
    socket.emit('welcome' , {'participants' : [data.user_email]});
  }
}




function handleFinish(game){
  game.handle = setInterval(function(){
    var time = game.time--;
    var event = 'update';
    data = {time : time};

    if(time <= 0){
      event = 'finish';
      data = _.max(game.participants , function(participant){return participant.clicks});
      data = JSON.parse(JSON.stringify({email : data.email , clicks : data.clicks}));
      delete data.con;
    }

    emitEvent(game , event , data);

    if(time <= 0){
      Game.destroy({id : game.game_id}).exec(function(err){
        clearInterval(game.handle);
        handle = 0;

        games = _.without(games , game);
      });
      
    }
  } , 1000);
}

module.exports = {
	socket : io.sockets
}