exports.intent_name = 'password_hint'

exports.respond = function(bot, message, db, entities) {
        var searchSystem = entities.system[0].value.trim();
        if(searchSystem)
        {
            console.log(' ' + searchSystem);

            db.collection('passwordHintSystem').find({ $or: [{ name: searchSystem }] }).toArray(function(err, docs) {
                    if (err) {
                        console.log(err);                    
                        bot.reply(message, 'My brain has dry ice.')
                    } else if (docs.length > 0) {
                        for (var i = 0; i < docs.length; i++) {
                            bot.reply(message, docs[i].hint );
                        }
                    } else {
                        bot.reply(message, 'Sorry, I have no idea about that')
                    }
                }
            )
      }
}
