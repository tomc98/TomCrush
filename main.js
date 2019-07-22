//---declare variables---\\

//canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var elemLeft = c.offsetLeft;
var elemTop = c.offsetTop;

//sizing
var x_amount = 10;
var y_amount = 10;

//content array 2d
var contents = new Array(x_amount);
for(var i=0; i<x_amount; i++){
    contents[i] = new Array(y_amount)
}

//matched array 2d
var matched = new Array(x_amount);
for(var i=0; i<x_amount; i++){
    matched[i] = new Array(y_amount)
}

//score
var score = 0;
var clicked = {x: 0, y: 0, first: 1};
var moves = 10;


// event listener for click event   adapted code from https://www.tutorialspoint.com/How-do-I-add-a-simple-onClick-event-handler-to-an-HTML5-canvas-element to make eventlistener.
c.addEventListener('click', function(event) {
    var xVal = event.pageX - elemLeft,
    yVal = event.pageY - elemTop;
    //console.log(xVal, yVal);
    findClick(xVal, yVal);
}, false);
 
mainLoop();
//lines();
//---functions---\\

function mainLoop(){
    score = 0;
    randomContents();
    drawItems();
    crush();
    if(score>0){
        mainLoop();
    }
}

function lines(){
    for(var i = 0; i<=x_amount; i++){
        ctx.moveTo(i*((c.width-20)/x_amount)+10, 10);
        ctx.lineTo(i*((c.width-20)/x_amount)+10, c.height-10);
        ctx.stroke();
    }
    for(var i = 0; i<=y_amount; i++){
        ctx.moveTo(10, i*((c.height-20)/y_amount)+10);
        ctx.lineTo(c.width-10, i*((c.height-20)/y_amount)+10);
        ctx.stroke();
    }
}

function clearContents(){
    for(var i = 0; i<x_amount; i++){
        for(var j=0; j<y_amount; j++){
            contents[i][j] = 0;
        }
    }
}

function clearMatched(){
    for(var i = 0; i<x_amount; i++){
        for(var j=0; j<y_amount; j++){
            matched[i][j] = 0;
        }
    }
}

function randomContents(){
    for(var i = 0; i<x_amount; i++){
        for(var j=0; j<y_amount; j++){
            contents[i][j] = Math.floor(Math.random()*6)+1;
        }
    }
}

function drawItems(){
    for(var i = 0; i<x_amount; i++){
        for(var j=0; j<y_amount; j++){
            ctx.fillStyle = setColourForNumber(contents[j][i])
            ctx.beginPath();
            ctx.arc(
                ((i*((c.width-20)/x_amount)+10)+((1+i)*((c.width-20)/x_amount)+10))/2,
                ((j*((c.height-20)/y_amount)+10)+((1+j)*((c.height-20)/y_amount)+10))/2,
                20,
                0,
                2*Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }
}

function setColourForNumber(num){
    switch(num){
        case 1:
            return "#ff0000";
            break;
        case 2:
            return "#cc00cc";
            break;
        case 3:
            return "#0033cc";
            break;
        case 4:
            return "#006600";
            break;
        case 5:
            return "#66ff66";
            break;
        case 6:
            return "#ffff00";
            break;
        default:
            return "#ffffff";
            break;
    }
}

function vertCheck(){
    var curr;
    var times;
    for(var i = 0; i<y_amount; i++){
        curr = 0;
        times = 0;
        for(var j=0; j<x_amount; j++){
            if(contents[j][i] != 0 && contents[j][i] == curr){
                times++;
            }else{
                if(times>=3){
                    score += Math.pow(3,times-2);
                    console.log(times + " " + curr + "'s adding " + Math.pow(3,times-2) + " to the total score of " + score);
                }
                curr = contents[j][i];
                times = 1;
            }
            if(times>=3){
                for(var k=0; k<times; k++){
                    matched[j-k][i] = 1;
                }
            }
        }
        if(times>=3){
            score += Math.pow(3,times-2);
            console.log(times + " " + curr + "'s adding " + Math.pow(3,times-2) + " to the total score of " + score);
        }
    }
}

function horzCheck(){
    var curr;
    var times;
    for(var i = 0; i<x_amount; i++){
        curr = 0;
        times = 0;
        for(var j=0; j<y_amount; j++){
            if(contents[i][j] != 0 && contents[i][j] == curr){
                times++;
            }else{
                if(times>=3){
                    score += Math.pow(3,times-2);
                    console.log(times + " " + curr + "'s adding " + Math.pow(3,times-2) + " to the total score of " + score);
                }
                curr = contents[i][j];
                times = 1;
            }
            if(times>=3){
                for(var k=0; k<times; k++){
                    matched[i][j-k] = 1;
                }
            }
        }
        if(times>=3){
            score += Math.pow(3,times-2);
            console.log(times + " " + curr + "'s adding " + Math.pow(3,times-2) + " to the total score of " + score);
        }
    }
}

function removeMatches(){
    for(var i = 0; i<x_amount; i++){
        for(var j=0; j<y_amount; j++){
            if(matched[i][j] == 1){
                contents[i][j] = 0;
            }
        }
    }
}

function bringDown(){
    for(var i = y_amount - 1; i>0; i--){
        for(var j=0; j<x_amount; j++){
            if(contents[i][j] == 0){
                while(contents[i][j] == 0 && checkAbove(i, j)){
                    for(var k = i; k>0; k--){
                        contents[k][j] = contents[k-1][j];
                        contents[k-1][j] = 0;
                    }
                }
            }
        }
    }
    drawItems();
}

function checkAbove(a, b){
    for(var k = a-1; k>=0; k--){
        if(contents[k][b] != 0){
            return 1;
        }
    }
    return 0;
}

function displayScore(){
    document.getElementById("scoreDisplay").innerHTML = "Score: " + score;
}

function displayMoves(){
    document.getElementById("movesDisplay").innerHTML = "Moves: " + moves;
}

function crush(){
    prevScore = 0;
    checkScore = 0;
    while(prevScore != -2){
        if(score != checkScore){
            prevScore = score;
        }
        checkScore = score;
        clearMatched();
        vertCheck();
        horzCheck();
        displayScore();
        removeMatches();
        drawItems();
        bringDown();
        drawItems();
        if(prevScore == -1){
            prevScore = -2;
        }
        if(prevScore == score){
            prevScore = -1;
        }
    }
}

//this function was sourced from https://www.sitepoint.com/delay-sleep-pause-wait/ 
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function findClick(x, y){
    if(x<10 || x>c.width-10 || y<10 || y>c.width-10){
        return;
    }
    var clickX;
    var clickY;
    //find x
    for(var i = 1; i <= x_amount; i++){
        if((i*((c.width-20)/x_amount)+10) > x && x>10 && x<c.width-10){
            clickX = i-1;
            break;
        }
    }
    //find y
    for(var i = 1; i <= y_amount; i++){
        if((i*((c.height-20)/x_amount)+10) > y && y>10 && y<c.height-10){
            clickY = i-1;
            break;
        }
    }
    console.log(clickX + ", " + clickY);
    swaps(clickX, clickY);
}

function swaps(corX, corY){
    var temp;
    var tempscore = score;
    if(moves > 0){
        if(clicked.first){
            clicked.first = 0;
            clicked.x = corX;
            clicked.y = corY;
        }else{
            if(corX == clicked.x+1 && corY == clicked.y || corX == clicked.x-1 && corY == clicked.y || corY == clicked.y+1 && corX == clicked.x || corY == clicked.y-1 && corX == clicked.x){
                temp = contents[clicked.y][clicked.x];
                contents[clicked.y][clicked.x] = contents[corY][corX];
                contents[corY][corX] = temp;
                drawItems();
                crush();
                if(score==tempscore){
                    temp = contents[clicked.y][clicked.x];
                    contents[clicked.y][clicked.x] = contents[corY][corX];
                    contents[corY][corX] = temp;
                    drawItems();
                }else{
                    moves-=1;
                    displayMoves();
                }
            }
            clicked.first = 1;
        }
    }
}