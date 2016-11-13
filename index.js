var Botkit = require('botkit')
var Witbot = require('witbot')
var MongoClient = require('mongodb').MongoClient
var _ = require('underscore')
var intents = require('./intents')
var msgUtil = require('./message.js')


var slackToken = process.env.SLACK_TOKEN
var witToken = process.env.WIT_TOKEN
var mongoUrl = process.env.MONGO_URL
var _debug = process.env.DEBUG

var witbot = Witbot(process.env.WIT_TOKEN)
var controller = Botkit.slackbot({ debug: false })
if (_debug) {
  console.log("SlackToken:" + slackToken)
  console.log("WitToken:" + witToken)
}

var db;

MongoClient.connect(mongoUrl, function (err, dbConn) {
  if (err) throw new Error('Error connecting to MongoDB: ', err)
  console.log("Connected successfully to MongoDB");
  db = dbConn;

  controller.spawn({ token: slackToken }).startRTM(function (err, bot, payload) {
    if (err) throw new Error('Error connecting to Slack: ', err)
    console.log('Connected to Slack')
  })
});

// wire up DMs and direct mentions to wit.ai
controller.hears('.*', 'direct_message,direct_mention,mention', function (bot, message) {
  console.log("message:" + JSON.stringify(message));
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
    
    if (_debug) {
      bot.reply(message, 'Debug: ' + data);
    }

    try {
      var intent = (outcome.entities.intent == null) ? '' : outcome.entities.intent[0].value;
      if (intent && intents.intents[intent]) {
        intents.intents[intent].respond(bot, message, db, outcome.entities);
      } else if (intent == 'greetings') {
        var greetingPhrase = "Hello";
        if (message.ts) {
          var date = new Date(message.ts * 1000);
          var time = (date.getHours() + 7) % 24;
          if (time >= 0 && time <= 12) {
            greetingPhrase = "Good morning";
          } else if (time >= 12 && time <= 16) {
            greetingPhrase = "Good afternoon";
          } else if (time >= 16 && time <= 21) {
            greetingPhrase = "Good evening";
          } else if (time >= 21 && time <= 24) {
            greetingPhrase = "Good night";
          }
        }
        if (message.user) {
          bot.reply(message, greetingPhrase + " <@" + message.user + ">.");
        } else {
          bot.reply(message, greetingPhrase + " user.");  
        }
      } else {
        bot.reply(message, msgUtil.idontunderstand());
      }
    }
    catch (e) {
      bot.reply(message, "Error " + e);
    }

  });
})
