exports.intent_name = 'phone'
exports.respond = function(bot, message, db, entities) {
        var searchName = entities.name[0].value;
        console.log('Searching for ' + searchName);

        db.collection('phone').find({ $or: [{ nickname: searchName }, { firstname: searchName }, { lastname: searchName }] }).toArray(function(err, docs) {
                if (err) {
                    console.log(err);
                    bot.reply(message, 'My brain has dry ice.')
                } else if (docs.length > 0) {
                    for (var i = 0; i < docs.length; i++) {
                        bot.reply(message, 'Someone told me that ' + docs[i].nickname + '\'s phone number is ' + docs[i].phone);
                    }
                } else {
                    bot.reply(message, 'Ask ' + searchName + ' himself!');
                }
            }
        )
      }
