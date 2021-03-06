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
      } else {
        bot.reply(message, msgUtil.idontunderstand());
      }
    }
    catch (e) {
      bot.reply(message, "Error " + e);
    }

  });
})

controller.on('interactive_message_callback', function(bot, message) {

    // check message.actions and message.callback_id to see what action to take...
    if(message.callback_id===123)
    {
      if(message.actions=="AWD10SP7")
      {
        bot.replyInteractive(message, "AWD 10SP7 console password is dstsetup:passw0rd" );
      }
      else if(message.actions=="old")
      {
        bot.replyInteractive(message, "The older version of awd console password is dstsetup:dstsetup" );
      }
      else
      {
        bot.replyInteractive(message, "Sorry, I don't get what you are talking about" );
      }
      
    }

});
