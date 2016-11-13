exports.intent_name = 'setuser'

exports.respond = function(bot, message, db, entities) {
  if (!entities.name) {
    bot.reply(message, 'Pardon me?');
  } else {
    var searchName = entities.name[0].value;
    db.collection('people').find({slack_username: message.user}).toArray(function(err, docs) {
      if (docs.length > 0) {
        if (docs[0].firstname != searchName && docs[0].lastname != searchName && docs[0].nickname != searchName) {
          bot.reply(message, "You jest! I know you are " + docs[0].firstname + " " + docs[0].lastname + ".");
        } else {
          bot.reply(message, "Of course you are!");
        }
      } else {
        // Set user
        db.collection('people').find({type: 'person', $or: [{ nickname: searchName }, { firstname: searchName }, { lastname: searchName }] }).toArray(function(err, docs) {
          console.log(docs);
          if (docs.length == 1) {
            if (!docs[0].slack_username) {
              db.collection('people').update({_id:docs[0]._id}, {$set: {slack_username:message.user}}, function (err) {
                if (err) {
                  bot.reply(message, "My brain is fried!");
                } else {
                  bot.reply(message, "Got it!");
                }
              });
            } else {
              bot.reply(message, "You jest! I know " + searchName + " is <@" + docs[0].slack_username + ">.");
            }
          } else if (docs.length > 1) {
            var names = [];
            docs.forEach(function (doc) {
              names.push(doc.firstname + ' ' + doc.lastname);
            });
            bot.reply(message, "Are you " + names.join(' or ') + "?");
          } else {
            bot.reply(message, "I'm sorry, but I can't find " + searchName + " in my database.");
          }
        });
      }
    });
  }
}
