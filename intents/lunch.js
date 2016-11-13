var menus = require('../data/menus');

exports.intent_name = 'lunch'
exports.respond = function(bot, message, db, entities) {
              bot.reply(message, menus.givemefood());
      }
