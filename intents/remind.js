exports.intent_name = 'remind'

exports.respond = function(bot, message, db, entities) {
  var memberName = entities.members[0].value;
  var className = entities.class[0].value;
  var dueDate = entities.duedate[0].value;
  console.log('Searching for ' + memberName);

  bot.reply(message, memberName + " will do " + className +"by "+ dueDate);    
}
