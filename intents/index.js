var temp = [];
var intents = {};
temp.push(require('./phone.js'));
temp.push(require('./call.js'));
temp.push(require('./lunch.js'));
temp.push(require('./passwordHint.js'));
temp.push(require('./swear.js'));
temp.push(require('./whoami.js'));

for(var i=0; i<temp.length; i++)
{
  var intent = temp[i];
  intents[intent.intent_name] = intent;
}
exports.intents = intents;