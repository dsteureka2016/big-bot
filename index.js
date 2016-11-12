var Botkit = require('botkit')
var Witbot = require('witbot')

var slackToken = process.env.SLACK_TOKEN
var witToken = process.env.WIT_TOKEN


if(!slackToken)
    slackToken = "xoxb-103863860821-tkJS2LSdXq27KK1sksyMx4NQ"
if(!witToken)
    witToken = "6YPHITMEAR4CSR3SBXPONGUYD22HVQYY"

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
  var wit = witbot.process(message.text, bot, message)

  wit.hears('hello', 0.53, function (bot, message, outcome) {
    bot.startConversation(message, function (_, convo) {
      convo.say('Hello!')
      convo.ask('How are you?', function (response, convo) {
        witbot.process(response.text)
          .hears('good', 0.5, function (outcome) {
            convo.say('I am so glad to hear it!')
            convo.next()
          })
          .hears('bad', 0.5, function (outcome) {
            convo.say('I\'m sorry, that is terrible')
            convo.next()
          })
          .otherwise(function (outcome) {
            convo.say('I\'m cofused')
            convo.repeat()
            convo.next()
          })
      })
    })
  })

  wit.otherwise(function (bot, message) {
    bot.reply(message, 'ฉันไม่เข้าใจ นี่มุขหรือเปลือกหอย')
  })
})
