var Botkit = require('botkit')
var Witbot = require('witbot')

var slackToken = process.env.SLACK_TOKEN
var witToken = process.env.WIT_TOKEN


var _debug = process.env.DEBUG
var witbot = Witbot(process.env.WIT_TOKEN)
var controller = Botkit.slackbot({ debug: false })

if(!_debug)
{
    console.log("SlackToken:" + slackToken)
    console.log("WitToken:" + witToken)
}

controller.spawn({ token: slackToken }).startRTM(function (err, bot, payload) {
  if (err) throw new Error('Error connecting to Slack: ', err)
  console.log('Connected to Slack')
})

// wire up DMs and direct mentions to wit.ai
controller.hears('.*', 'direct_message,direct_mention', function (bot, message) {
    console.log("message:" + message.text);
    var wit = witbot.process(message.text, bot, message);

    wit.any(function (bot, message, outcome) {
      console.log(outcome);

      var data = '';
      for (i in outcome.entities) {
        for (j in outcome.entities[i]) {
          data = data + i + '[' + j + '] = ' + outcome.entities[i][j].value + ' (confidence: ' + outcome.entities[i][j].confidence + ')' + '\n';
        }
      }
      console.log(data);
      bot.reply(message, 'Debug: ' + data);

      var intent = (outcome.entities.intent == null) ? '' : outcome.entities.intent[0].value;
      if (intent == 'phone' && outcome.entities.name != null) {
        bot.reply(message, 'Ask ' + outcome.entities.name[0].value + ' himself!');
      } else if (intent == 'call') {
        bot.reply(message, "I'm not a phone!");
      } else {
        bot.reply(message, "I don't understand!");
      }

     });
})
