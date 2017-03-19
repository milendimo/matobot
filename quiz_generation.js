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

//variable, containing all generated math questions
exports.levels = [ "Addition 1 to 100", "Substraction 1 to 100", "Multiply 1 to 12", "Division up to 144", "Squares up to 12", "Square root up to 144"]

//Create question in a random fashion, based on the selected math level.
exports.create = function (level, count) {

//based on user selection generate corresponding questions/answers
    switch (level.index) {
            case 0:
                return generateAddition(count);
                break;          
            case 1:
                return generateSubstraction(count);
                break;                      
            case 2:
                return generateMultiplication(count);
                break;
            case 3:
                return generateDivision(count);
                break;
            case 4:
                return generateSquares(count);
                break;                
            case 5:
                return generateSquareroots(count);
                break;                                                                      
        }
}

generateAddition = function(count){
    var quiz = [];

    for (i=0; i<=count-1; i++)
    {
      var a = Math.floor(math.random(1, 100));
      var b = Math.floor(math.random(1, 100));

//easy as that
      var res = a + b;

//store question and answer in a single object       
      quiz.push(new qna( a + " + " + b + " = " , res));
    }

    return quiz;      
}

generateSubstraction = function(count){
    var quiz = [];

    for (i=0; i<=count-1; i++)
    {
      var a = Math.floor(math.random(1, 100));

      //should not be higher than a 
      var b = Math.floor(math.random(1, a));

      var res = a - b;

      //store question and answer in a single object 
      quiz.push(new qna( a + " - " + b + " = " , res));
    }
    
    return quiz;      
}

generateDivision = function(count){
    var quiz = [];

    for (i=0; i<=count-1; i++)
    {
      var a = Math.floor(math.random(2, 12));
      var b = Math.floor(math.random(2, 12));

      //result is a randomly generated, whle question is: a*b/b
      var res = a;

      //store question and answer in a single object 
      quiz.push(new qna( (a*b) + " / " + b + " = " , res));
    }
    
    return quiz;      
}

generateMultiplication = function(count){
    var quiz = [];

    for (i=0; i<=count-1; i++)
    {
      var a = Math.floor(math.random(2, 12));
      var b = Math.floor(math.random(2, 12));

//simple as that
      var res = a * b;

      //store question and answer in a single object 
      quiz.push(new qna( a + " * " + b + " = " , res));
    }
    
    return quiz;      
}

generateSquares  = function(count){
    var quiz = [];

    for (i=0; i<=count-1; i++)
    {
      var a = Math.floor(math.random(2, 12));

      //simple as that
      var res = a*a;

      //store question and answer in a single object 
      quiz.push(new qna( a + " ^2  = " , res));
    }
    
    return quiz;      
}


generateSquareroots  = function(count){
    var quiz = [];

    for (i=0; i<=count-1; i++)
    {
      var a = Math.floor(math.random(2, 12));

      //result is a, question is square root of sqaure(a).
      var res = a;

      //store question and answer in a single object 
      quiz.push(new qna("&Sqrt;" + math.square(a) + " = " , res));
    }
    
    return quiz;      
}
