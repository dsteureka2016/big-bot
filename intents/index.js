var temp = [];
var intents = {};
temp.push(require('./phone.js'));
temp.push(require('./call.js'));
temp.push(require('./lunch.js'))
for(var i=0; i<temp.length; i++)
{
  var intent = temp[i];
  intents[intent.intent_name] = intent;
}
exports.intents = intents;