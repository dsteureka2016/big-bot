exports.intent_name = 'phone'

exports.respond = function(bot, message, db, entities) {
  var searchName = entities.name[0].value;
  console.log('Searching for ' + searchName);

  db.collection('people').find({ phone: { $exists: true }, $or: [{ nickname: searchName }, { firstname: searchName }, { lastname: searchName }] }).toArray(function(err, docs) {
    if (err) {
      console.log(err);
      bot.reply(message, 'My brain has dry ice.')
    } else if (docs.length == 1) {
      bot.reply(message, 'Someone told me that ' + docs[0].nickname + '\'s phone number is ' + docs[0].phone);
    } else if (docs.length > 0) {
      var response;
      response = "I've found " + docs.length + " people matching your query:";
      docs.forEach(function(doc) {
        response += "\n " + doc.nickname + " (" + doc.firstname + ")'s phone number is " + doc.phone;
      })
      bot.reply(message, response);
    } else {
      bot.reply(message, "I'm sorry I don't know.");
    }
  });
}
