// Timothy Ross
game = {
	fe: 10, // fae energy
	fs1: 0, // fae primary spell
	fs1c: 10, // cost to cast spell
	timePlayed: 0, // time played
}
var saveTimer = 0;
var autoSaveInterval = 10;
var lastTime = 0; // time difference
var gameLoopInterval;

function genFE() { 
  game.fe += 1;
}

function castFS1() { 
  // costs energy
  if(game.fe >= game.fs1c) { // if you have enough fe
	game.fe -= game.fs1c; // pay cost
	game.fs1c *= 1.2; // cost scaling
	game.fs1 += 1; // cast spell
  }
}

// update game functions
function update() {
	var time = new Date().getTime();
	var timePassed = (time-lastTime)/1000;
	lastTime = time;
	game.fe += game.fs1*timePassed;
	game.timePlayed += timePassed;
	
	
	saveTimer += timePassed;
	if(saveTimer > autoSaveInterval) {
		saveTimer = 0;
		saveGame();
	}
	
	document.getElementById('fe').innerHTML = nFormat(game.fe);
	document.getElementById('fs1').innerHTML = nFormat(game.fs1);
	document.getElementById('fs1c').innerHTML = nFormat(game.fs1c);
}
// formatting for numbers
function nFormat(num) {
	return nRound(num,2);
}

// round to dPlaces decimal points
function nRound(num,dPlaces = 0) {
	return Math.round(num * Math.pow(10,dPlaces)) / Math.pow(10,dPlaces);
}


// save/load
function saveGame() {
	try {
		localStorage.setItem('FAEsave',btoa(JSON.stringify(game))) // encrypt and store save
		console.log('Game has been saved')
	}
	catch(error) {
		console.log("Save failed");
		console.error(error);
	}
}
function loadGame(save) { // take in an encrypted base64 save
	stopLoop()
	try {
		var saveFile=JSON.parse(atob(save)) // unencrypt save
		game=saveFile // load save
		console.log('Game has been loaded')
	}
	catch(error) {
		console.log("Load failed");
		console.error(error);
	}
	startLoop()
}

var saveFile = localStorage.getItem("FAEsave") // get save from storage
loadGame(saveFile); // load save
lastTime = new Date().getTime() // initial time
startLoop();
// update game functions, run every interval
function gameLoop() {
	update();
}
function startLoop() { // start the game loop
	gameLoopInterval=setInterval(function(){gameLoop()},50) // runs every (some number of ms)
}
function stopLoop() { // stop the game loop
	clearInterval(gameLoopInterval)
}