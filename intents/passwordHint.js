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
                                    "name":"AWD10 SP7+",
                                    "text": "AWD10 SP6 or above",
                                    "color": "#00A300",
                                    "value": "AWD10SP6",
                                    "type": "button",
                                },
                                {
                                    "name":"I use older version",
                                    "text": "AWD10SP5 or below",
                                    "color": "#000000",
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
