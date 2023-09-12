//imports
const express = require('express')
const server = express ()
const fs = require('fs')
var XMLHttpRequest = require('xhr2');


//global vars
const port = 3000
var jsonFinalReturnData = ``
var requestInProgress = false
var allJokes = []
var allInsults = []

//server use
server.use(express.static('Website'))
server.use(express.json())
server.use(express.urlencoded({extended:true}))

//server start
server.listen(port, () => {
    console.log('listening at 3000')
    iterateThroughJokeFile()
    iterateThroughInsultFile()
})

function iterateThroughJokeFile() {
    fs.readFile('dad jokes.txt', function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {
            allJokes.push(array[i]);
        }
    });
}

function iterateThroughInsultFile() {
    fs.readFile('insults.txt', function(err, data) {
        if(err) throw err;
        var array = data.toString().split("\n");
        for(i in array) {
            allInsults.push(array[i]);
        }
    });
}

//app html serve
server.get("/", (req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'})
    fs.readFile('index.html', function(error, data){
        if(error) {
            res.writeHead(404);
            res.write('Error: File Not Found')
        }
        else {
            res.write(data)
        }
        res.end()
    })
})

//app listener
server.get("/grabData", (req, res) => {
    res.send(jsonFinalReturnData)
})

//locks the thread calls the relevant api and then sends the data
function lockThreadGetData (callback, res) {
    if(requestInProgress == false) {
        requestInProgress = true
        callback()
        res.sendStatus(200)
    }
    else {
        res.sendStatus(500)
    }
}

//server listeners
server.post("/joke", (req, res) => {
    lockThreadGetData(joke, res)
})

server.post("/insult", (req, res) => {
    lockThreadGetData(insult, res)
})

server.post("/conversation", (req, res) => {
    lockThreadGetData(conversation, res)
})

server.post("/trivia", (req, res) => {
    lockThreadGetData(trivia, res)
})

server.post("/clear", (req, res) => {
    jsonFinalReturnData = ''
})

function joke () {
    console.log("grabbing joke");

    jokeRender(allJokes[Math.floor(Math.random()*allJokes.length)])
}

function insult () {
    console.log("grabbing insult");

    insultRender(allInsults[Math.floor(Math.random()*allInsults.length)])
}

function conversation () {
    console.log("grabbing conversation");

    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.addEventListener("load", function() {
        console.log(xmlHttp.responseText);
        jsonData = JSON.parse(xmlHttp.responseText)
        conversationRender(jsonData)
    }, false);

    xmlHttp.open("GET", "https://uselessfacts.jsph.pl/random.json?language=en")
    xmlHttp.send(null)
}

function trivia () {
    console.log("grabbing trivia");

    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.addEventListener("load", function() {
        console.log(xmlHttp.responseText);
        jsonData = JSON.parse(xmlHttp.responseText)
        triviaRender(jsonData)
    }, false);

    xmlHttp.open("GET", "https://the-trivia-api.com/api/questions?limit=1")
    xmlHttp.send(null)
}

function jokeRender (jsonData) {
    console.log(jsonData)
    
    returnData = '<h1>Joke</h1>'
    returnData = returnData + '<p>'+jsonData+'</p>'

    jsonFinalReturnData = returnData;
    requestInProgress = false;
}

function insultRender (jsonData) {
    console.log(jsonData)
    
    returnData = '<h1>Insult</h1><p>'+jsonData+'</p>'

    jsonFinalReturnData = returnData;
    requestInProgress = false;
}

function conversationRender (jsonData) {
    returnData = '<h1>Random Fact</h1><p>'+jsonData.text+'</p>'

    jsonFinalReturnData = returnData;
    requestInProgress = false;
}

function triviaRender (jsonData) {
    category = '<h1>'+jsonData[0].category+' Trivia</h1>'
    question = '<h3>Question</h3><h4>'+jsonData[0].question+'</h4>'

    jsonData[0].incorrectAnswers.push(jsonData[0].correctAnswer)
    choicesData = shuffle(jsonData[0].incorrectAnswers)

    choices = '<h3>Choices</h3>'
    choicesData.forEach(function (choice, index) {
        choices = choices + '<h4>'+(index+1)+'. '+choice+'</h4>'
    });

    answerHeader = '<h3>Correct Answer</h3>'
    answer = answerHeader + '<h4>'+jsonData[0].correctAnswer+'</h4>'
    returnData = category + question + choices+ answer

    jsonFinalReturnData = returnData
    requestInProgress = false
}

//shuffle array
function shuffle(array) {

    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}