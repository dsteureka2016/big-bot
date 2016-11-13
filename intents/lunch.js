var menus = require('../data/menus');

exports.respond = function(bot, message, db, entities) {
              bot.reply(message, menus.givemefood());
      }
