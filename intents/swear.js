exports.intent_name = 'swear'

exports.respond = function(bot, message, db, entities) {

        bot.reply(message, message.text + " too");                    
      }
