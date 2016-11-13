var menus = require('../data/menus');

var prefixs = ["How about ","Have you try "];

exports.respond = function(bot, message, db, entities) {
			db.collection('menus').find({}).toArray(function(err, docs) {
                if (err) {
                    console.log(err);
                    bot.reply(message, 'Umm...ask your friend');
                } else if (docs.length > 0) {
                    bot.reply(message, prefixs[Math.floor(Math.random()*prefixs.length)] + docs[Math.floor(Math.random()*docs.length)].name + "?");                    
                }
            }
        )         
      }
