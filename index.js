
//=========================================================
// Matobot Main file
//=========================================================

//Load prerequisites
var restify = require('restify');
var builder = require('botbuilder');
var ejs = require('ejs');
var fs = require('fs');
var https = require('https');

//custom module
var quiz = require('./quiz_generation');

// Setup Restify Server
var server = restify.createServer();

//Listen on predefined port
server.listen(process.env.port || process.env.PORT || 9876, function () {
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
server.get('/', function indexHTML(req, res, next) {
    
    //TODO: Redirect all requests to https version
    /*
    if (req.headers['x-forwarded-proto'] != 'https') {           
        return res.redirect('https://' + req.headers.host + req.url);    
    }
    */
     
    //TODO:
    //Prevent page being loaded on external sites.
    
    //get template file for the home page
    fs.readFile(__dirname + '/index.html', 'utf-8', function (err, data) {
        if (err) {
            next(err);
            return;
        }

        //options for the request to acquire auth bot token
        //TODO: Urls/path in config?        
        var options = {
            host: 'webchat.botframework.com',
            path: '/api/tokens',
            port: 443,
            method: 'GET',
            headers: {
                'Authorization': 'BotConnector ' + process.env.BotSecretKey
            }
        };

        //receive unique token for the current session 
        https.get(options, (resp) => {        
            resp.on('data', (token) => {

                    //replace trailing "s 
                    token = token.toString().replace(/\"/g, '');

                    //rendr HTML code and add the acquired token
                    //TODO: Is that really needed? Can it be done with a replace?
                    var renderedHtml = ejs.render(data, {token: token}); 

                    //return response as the generated html page
                    res.setHeader('Content-Type', 'text/html');
                    res.writeHead(200);
                    res.end(renderedHtml);
                    next();
                });
        });

    });
});

//Initiate bot
var bot = new builder.UniversalBot(connector);

//do not await user interaction and automatically begin the conversation 
bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                //TODO: Redirect to "/" root dialog, it does not work as a web chat, while works in the emulator.
                bot.beginDialog(message.address, 'defaultMenu'); 
            }
        });
    }
});

//default entry point for the bot conversation
bot.dialog('/', function (session) {
    session.beginDialog('defaultMenu');  
});

//Bot Dialogs
//Default dialog to be displayed 
bot.dialog('defaultMenu', [
    function (session) {
        session.send("Hiya I am *matobot*");
        session.send("Here we go... ");
        
        session.replaceDialog('mainMenu');
    }
]);

//Bot Dialogs
//Collect required params to generate the quiz
bot.dialog('mainMenu', [
    function (session) {
        builder.Prompts.choice(session, "Please choose a quiz level", quiz.levels);
    },
    function (session, results) {
        session.dialogData.level =  results.response;
        
        builder.Prompts.number(session, "Please select number of questions");
    },    
    function (session, results) {
        session.dialogData.count =  results.response;
        builder.Prompts.number(session, "Please select the biggest number in this quiz (1 to ...)");
    },
    function (session, results) {
        session.dialogData.limit =  results.response;
        
        //create a random list of maths quesitons and coresponding answers
        session.dialogData.quiz = quiz.create(session.dialogData.level, session.dialogData.limit, session.dialogData.count);

        session.replaceDialog('quizDialog', session.dialogData);
    },
    function (session) {
        // Reload menu
        session.send("Here we go again ... ");        
        session.replaceDialog('mainMenu');
    }
]);


// Loop throug all generated questions and evaluate each answer.
bot.dialog('quizDialog', [
    function (session, args) {

        // Save previous state (create on first call)
        session.dialogData.index = args.index ? args.index : 0;
        session.dialogData.quiz = args.quiz;

        // Prompt user for next field only if there is a valid quiz
        if(typeof session.dialogData.quiz[session.dialogData.index] !== 'undefined') {
          builder.Prompts.number(session, session.dialogData.quiz[session.dialogData.index].question);
        }
        else{
            session.replaceDialog('mainMenu');
        }
    },
    function (session, results) {
        //Evaluate the result.
        var res = session.dialogData.quiz[session.dialogData.index].answer;

        //TODO: may be useful later
        //var rand_emoticon = "&#" + Math.floor(math.random(9728, 9983)) + ";";

        if (results.response === res)
          session.send("&#9786; That is the correct answer");
        else
          session.send("&#9785; Sorry, the correct answer is *"+ res + "*");

        session.dialogData.index++;

        // Check for end of form
        if (session.dialogData.index >= session.dialogData.quiz.length) {
            //Finalize and get back to main menu
            session.send("You have now completed this maths quiz.");
            session.send("Here we go again ... ");     

            session.replaceDialog('mainMenu');

            //TODO: Use timeout before reloading root menu?
            /*
            setTimeout(function() {
                session.send("Let's start again... ");
                session.replaceDialog('mainMenu');
            }, 5000);
            */
        } else {
            // Next fields
            session.replaceDialog('quizDialog', session.dialogData);
        }
    }
]);

