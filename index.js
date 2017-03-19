
//=========================================================
// Matobot Main file
//=========================================================

//Load prerequisites
var restify = require('restify');
var builder = require('botbuilder');

var quiz = require('./quiz_generation');

// Setup Restify Server
var server = restify.createServer();

//Listen on predefined port
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
// Get appid and password from environment variables
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//Set listener for Post requests to go through bot framework
server.post('/api/messages', connector.listen());  

//Serve index home page
server.get('/', restify.serveStatic({
 directory: __dirname,
 default: '/index.html'
}));

//Initiate bot
var bot = new builder.UniversalBot(connector, [
 function (session) {
        session.send("Hiya I am *matobot*");
        session.send("Here we go... ");
        
        //display initial menu dialog
        session.beginDialog('rootMenu');
 }
]);

// Bot Dialogs
//Collect required params to generate the quiz
bot.dialog('rootMenu', [
    function (session) {
        builder.Prompts.choice(session, "Please choose a quiz level", quiz.levels);
    },
    function (session, results) {
        session.dialogData.level =  results.response;
        builder.Prompts.number(session, "Please select number of questions");
    },
    function (session, results) {
        session.dialogData.count =  results.response;
        
        //create a random list of maths quesitons and coresponding answers
        session.dialogData.quiz = quiz.create(session.dialogData.level, session.dialogData.count);

        session.replaceDialog('quizDialog', session.dialogData);
    },
    function (session) {
        // Reload menu
        session.replaceDialog('rootMenu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });


// Loop throug all generated questions and evaluate each answer.
bot.dialog('quizDialog', [
    function (session, args) {

        // Save previous state (create on first call)
        session.dialogData.index = args.index ? args.index : 0;
        session.dialogData.quiz = args.quiz;

        // Prompt user for next field
        builder.Prompts.number(session, session.dialogData.quiz[session.dialogData.index].question);
    },
    function (session, results) {
        //Evaluate the result.
        var res = session.dialogData.quiz[session.dialogData.index].answer;

        //TODO: may be useful later
        //var rand_emoticon = "&#" + Math.floor(math.random(9728, 9983)) + ";";

        if (results.response == res)
          session.send("&#9786; That is the correct answer");
        else
          session.send("&#9785; Sorry, the correct answer is *"+ res + "*");

        session.dialogData.index++;

        // Check for end of form
        if (session.dialogData.index >= session.dialogData.quiz.length) {
            //Finalize and get back to main menu`
            session.send("You have now completed the maths quiz.");
            setTimeout(function() {
                session.send("Let's start again... ");
                session.replaceDialog('rootMenu');
            }, 5000);
        } else {
            // Next fields
            session.replaceDialog('quizDialog', session.dialogData);
        }
    }
]);

