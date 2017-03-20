//TODO: 
// Tests

var math = require('mathjs');

//Questions and Answers class type
class qna{
  constructor(q, a) {
    this.question = q;
    this.answer = a;
  }
}

//global variable with user selections 
var _limit = 0;
var _count = 0;

//variable, containing all generated math questions
exports.levels = [ "Additions", "Substractions", "Multiplication", "Divisions", "Squares", "Square roots"]

//Create question in a random fashion, based on the selected math level.
exports.create = function (level, limit, count) {

_limit = limit;
_count = count;

//based on user selection generate corresponding questions/answers
    switch (level.index) {
            case 0:
                return generateAddition();
                break;          
            case 1:
                return generateSubstraction();
                break;                      
            case 2:
                return generateMultiplication();
                break;
            case 3:
                return generateDivision();
                break;
            case 4:
                return generateSquares();
                break;                
            case 5:
                return generateSquareroots();
                break;                                                                      
        }
}


generateAddition = function(){
    var quiz = [];

    for (i=0; i<=_count-1; i++)
    {        
      //get random numbers up to the selected limit  
      var a = Math.floor(math.random(1, _limit));
      var b = Math.floor(math.random(1, _limit));

      //easy as that
      var res = a + b;

      //store question and answer in a single object       
      quiz.push(new qna( a + " + " + b + " = " , res));
    }

    return quiz;      
}

generateSubstraction = function(){
    var quiz = [];

    for (i=0; i<=_count-1; i++)
    {

      //get number up to selected limit
      var a = Math.floor(math.random(1, _limit));

      //should not be higher than a 
      var b = Math.floor(math.random(1, a));

      var res = a - b;

      //store question and answer in a single object 
      quiz.push(new qna( a + " - " + b + " = " , res));
    }
    
    return quiz;      
}

generateDivision = function(){
    var quiz = [];

    for (i=0; i<=_count-1; i++)
    {

      //get random numbers from 2 up to the selected limit  
      var a = Math.floor(math.random(2, _limit));
      var b = Math.floor(math.random(2, _limit));

      //result is a randomly generated, while question is: a*b/b
      var res = a;

      //store question and answer in a single object 
      quiz.push(new qna( (a*b) + " / " + b + " = ", res));
    }
    
    return quiz;      
}

generateMultiplication = function(){
    var quiz = [];

    for (i=0; i<=_count-1; i++)
    {
      //get random numbers from 2 up to the selected limit    
      var a = Math.floor(math.random(2, _limit));
      var b = Math.floor(math.random(2, _limit));

      //simple as that
      var res = a * b;

      //store question and answer in a single object 
      quiz.push(new qna( a + " * " + b + " = " , res));
    }
    
    return quiz;      
}

generateSquares  = function(){
    var quiz = [];

    for (i=0; i<=_count-1; i++)
    {
      //get random number from 2 up to the selected limit    
      var a = Math.floor(math.random(2, _limit));

      //simple as that
      var res = a*a;

      //store question and answer in a single object 
      quiz.push(new qna( a + " ^2  = " , res));
    }
    
    return quiz;      
}

generateSquareroots  = function(){
    var quiz = [];

    for (i=0; i<=_count-1; i++)
    {
      //get random number from 2 up to the selected limit  
      var a = Math.floor(math.random(2, _limit));

      //result is a, question is square root of square(a).
      var res = a;

      //store question and answer in a single object 
      quiz.push(new qna("&Sqrt;" + math.square(a) + " = " , res));
    }
    
    return quiz;      
}
