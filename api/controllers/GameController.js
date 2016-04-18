/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create : function(req , res , next){
		var game = req.body;
		var creator = req.user.id;
		game.creator = creator;
		if(!game || !game.participants || game.participants.length < 1 || game.participants.length > 3){
			res.status(400).send({message : 'Number of participants must be between 1 and 3'});
			return;
		}
		Game.create(game).exec(function cb(err, created){
		  	if(err) res.send(err);
		  	else res.send(created);
		});
	}
};

