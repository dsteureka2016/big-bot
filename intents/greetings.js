exports.intent_name = 'greetings'

exports.respond = function (bot, message, db, entities) {
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
}
