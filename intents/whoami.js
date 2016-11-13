exports.intent_name = 'whoami'

exports.respond = function(bot, message, db, entities) {
  db.collection('people').find({slack_username: message.user}).toArray(function(err, docs) {
    if (docs.length > 0) {
      bot.reply(message, 'You are <@' + message.user + '>. You are ' + docs[0].firstname + ' ' + docs[0].lastname + ' in my database.');
    } else {
      bot.reply(message, 'You are <@' + message.user + '>, but you are not in my database.');
    }
  });
}
