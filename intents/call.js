exports.intent_name = 'call'
exports.respond = function(bot, message, db, entities) {
              bot.reply(message, "I'm not a phone!");
      }