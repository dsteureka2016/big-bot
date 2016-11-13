exports.intent_name = 'password_hint'

exports.respond = function(bot, message, db, entities) {
        var searchSystem = entities.system[0].value.trim();
        if(searchSystem)
        {
            console.log(' ' + searchSystem);
            if (searchSystem === "AWD")
            {
                bot.reply(message, {
                    attachments:[
                        {
                            title: 'Which version of AWD that you are using ?',
                            callback_id: '123',
                            attachment_type: 'default',
                            actions: [
                                {
                                    "name":"AWD10SP6",
                                    "text": "AWD10 SP6 or above",
                                    "value": "AWD10SP6",
                                    "type": "button",
                                },
                                {
                                    "name":"AWD10SP5",
                                    "text": "AWD10SP5 or below",
                                    "value": "AWD10SP5",
                                    "type": "button",
                                }
                            ]
                        }
                    ]
                });
            }
            else
            {
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
}
