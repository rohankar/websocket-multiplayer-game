module.exports = function(req, res, next) {

  if (req.user && req.user.email) {
  	Game.find({id : req.params.id , or : [{creator : req.user.id} , {participants : req.user.email}]} , function(err , game){
  		if(err || !game || !game.length) return res.forbidden('You are not permitted to perform this action.');
  		else return next();
  	})
    
  }
  else{
  	  return res.forbidden('You are not permitted to perform this action.');
  }
};
