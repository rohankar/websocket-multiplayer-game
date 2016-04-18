/**
 * GameroomController
 *
 * @description :: Server-side logic for managing gamerooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	all : function(req , res){
		Game.find({}).exec(function(err , games){
			if (err) {
			    return res.negotiate(err);
			}
			res.view({user : req.user , games : games});
		})
	},
	create : function(req , res){
		res.view({user : req.user});
	},
	single : function(req , res){
		res.view({user : req.user});
	}
};

