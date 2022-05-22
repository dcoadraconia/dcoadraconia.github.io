// Timothy Ross
game = {
	magic: 0, // raw magic
	magicT: 0, // total raw magic
	fe: 0, // fae energy
	feT: 0, // fae energy total
	fs1: 0, // fae primary spell
	fs1c: 10, // cost to cast spell
	timePlayed: 0, // time played
	unlockedElems: [],
	autoSaveInterval: 10,
	tickInterval: 50,
}
var saveTimer = 0;
var lastTime = 0; // time difference
var gameLoopInterval;
var eTab = "fae";
var currTab = "Elements";

var rMagicGain = 0;
var faeEGain = 0;

function genFE() { 
  game.fe += 1;
  game.feT += 1;
  updateDisplays();
}

function castFS1() { 
  // costs energy
  if(game.fe >= game.fs1c) { // if you have enough fe
	game.fe -= game.fs1c; // pay cost
	game.fs1 += 1; // cast spell
	updateCosts();
	updateDisplays();
  }
}

function updateCosts() {
	game.fs1c = 10*Math.pow(1.2,game.fs1); // cost scaling
}

function updateDisplays() {
	document.getElementById('magic').innerHTML = nFormat(game.magic);
	document.getElementById('mps').innerHTML = nFormat(rMagicGain);
	document.getElementById('e11s').innerHTML = nFormat(faeEGain);
	document.getElementById('fe').innerHTML = nFormat(game.fe);
	document.getElementById('fs1').innerHTML = nFormat(game.fs1);
	document.getElementById('fs1c').innerHTML = nFormat(game.fs1c);
	if(currTab == "world") {
		document.getElementById('total').innerHTML = nFormat(getPotential());
		document.getElementById('total0').innerHTML = nFormat(game.magicT);
		document.getElementById('total11').innerHTML = nFormat(game.feT);
		document.getElementById('ptime').innerHTML = nFormat(game.timePlayed);
	}
}

function getMagicGain() { // raw magic gain / s
	ret = 1;
	if(game.fe >= 1) {
		ret *= Math.sqrt(game.fe)
	}
	return ret;
}

function getFaeEGain() { // fae energy gain / s
	ret = Math.pow(game.fs1,1+(Math.log10(1+game.magic)/10)); // gain equals primary spells ^ number based on raw magic log
	return ret;
}

function getPotential() { // total energy potential
	ret = 1;
	if(game.magicT > 1){
		ret *= game.magicT;
	}
	if(game.feT > 1){
		ret *= game.feT;
	}
	return ret;
}

// update game functions
function update() {
	var time = new Date().getTime();
	var timePassed = (time-lastTime)/1000;
	lastTime = time;
	rMagicGain = getMagicGain();
	game.magic += rMagicGain*timePassed;
	game.magicT += rMagicGain*timePassed;
	faeEGain = getFaeEGain();
	game.fe += faeEGain*timePassed;
	game.feT += faeEGain*timePassed;
	game.timePlayed += timePassed;

	updateCosts();
	
	saveTimer += timePassed;
	if(saveTimer > game.autoSaveInterval) {
		saveTimer = 0;
		saveGame();
	}
	
	updateDisplays();
}

// formatting for numbers
function nFormat(num) {
	if(num > 1000) {
		return nRound(num/Math.pow(10,Math.floor(Math.log10(num))),2).toFixed(2)+"e"+Math.floor(Math.log10(num))
	}
	else if(num > 100) {
		return nRound(num,2)
	}
	else if(num > 1) {
		return nRound(num,2)
	}	
	else {
		return nRound(num,4);
	}
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
		game=saveFile; // load save
		console.log('Game has been loaded');
	}
	catch(error) {
		console.log("Load failed");
		console.error(error);
	}
	startLoop();
}

function manualSave() {
	saveTimer = 0;
	saveGame();
}

function exportSave() {
	exportString = btoa(JSON.stringify(game))
	document.getElementById("exportString").style.display="block"
	document.getElementById("exportText").value=exportString
}

function importSave() {
	var save=prompt("Paste your exported save data here and then press enter.")
	loadGame(save);
	// refresh
	saveTimer = 0;
	lastTime = new Date().getTime();
	updateTickInterval();
	updateAutoInterval();	
}

function hardReset() {
	if(confirm("Really reset everything and start over?"))
	{
		stopLoop()
		document.getElementById("exportString").style.display="none";
		game.magic= 0, // raw magic energy
		game.magicT= 0, // raw magic energy total
		game.fe= 0, // fae energy
		game.feT= 0, // fae energy total
		game.fs1= 0, // fae primary spell
		game.fs1c= 10, // cost to cast spell
		game.timePlayed= 0, // time played
		game.unlockedElems= [],
		saveTimer = 0;
		game.autoSaveInterval = 10;
		game.tickInterval = 50;
		lastTime = 0; // time difference
		eTab = "fae";
		initialOpen();
		startLoop();
	}
}

function setTickInterval() {
	stopLoop();
	
	if(game.tickInterval == 50) {
		game.tickInterval = 100;
	}
	else if(game.tickInterval == 100) {
		game.tickInterval = 200;
	}
	else if(game.tickInterval == 200) {
		game.tickInterval = 500;
	}
	else if(game.tickInterval == 500) {
		game.tickInterval = 10;
	}
	else if(game.tickInterval == 10) {
		game.tickInterval = 20;
	}
	else if(game.tickInterval == 20) {
		game.tickInterval = 33;
	}
	else if(game.tickInterval == 33) {
		game.tickInterval = 50;
	}
	
	startLoop();
	
	updateTickInterval();
}
function setAutoInterval() {
	saveTimer = 0;
	if(game.autoSaveInterval == 10) {
		game.autoSaveInterval = 20;
	}
	else if(game.autoSaveInterval == 20) {
		game.autoSaveInterval = 30;
	}
	else if(game.autoSaveInterval == 30) {
		game.autoSaveInterval = 40;
	}
	else if(game.autoSaveInterval == 40) {
		game.autoSaveInterval = 50;
	}
	else if(game.autoSaveInterval == 50) {
		game.autoSaveInterval = 60;
	}
	else if(game.autoSaveInterval == 60) {
		game.autoSaveInterval = 1000000000;
	}
	else if(game.autoSaveInterval == 1000000000) {
		game.autoSaveInterval = 5;
	}
	else if(game.autoSaveInterval == 5) {
		game.autoSaveInterval = 10;
	}	

	updateAutoInterval();
}

function updateTickInterval() {
	document.getElementById('tickI').innerHTML = "every "+game.tickInterval+"ms";
}
function updateAutoInterval() {
	if(game.autoSaveInterval == 1000000000) {
	document.getElementById('autoI').innerHTML = "N/A (autosave disabled) ";
	}
	else {
	document.getElementById('autoI').innerHTML = "every "+game.autoSaveInterval+"s";		
	}	
}

function goTab(tabName) { // Main tab
	currTab = tabName;
	document.getElementById("elements").style.display = "none";	
	document.getElementById("options").style.display = "none";	
	document.getElementById("world").style.display = "none";	
	document.getElementById(tabName).style.display = "inline-block";
	if(tabName == "elements") {
		goETab(eTab);
		document.getElementById("elemB1").style.display = "none";
		document.getElementById("elemB2").style.display = "none";
		document.getElementById("elemB3").style.display = "none";
		document.getElementById("elemB4").style.display = "none";
		document.getElementById("elemB5").style.display = "none";
		document.getElementById("elemB6").style.display = "none";
		document.getElementById("elemB7").style.display = "none";
		document.getElementById("elemB8").style.display = "none";
		document.getElementById("elemB9").style.display = "none";
		document.getElementById("elemB10").style.display = "none";
		document.getElementById("elemB11").style.display = "none";
		document.getElementById("elemB12").style.display = "none";
		if(game.unlockedElems.includes(1)) {
			document.getElementById("elemB1").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(2)) {
			document.getElementById("elemB2").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(3)) {
			document.getElementById("elemB3").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(4)) {
			document.getElementById("elemB4").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(5)) {
			document.getElementById("elemB5").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(6)) {
			document.getElementById("elemB6").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(7)) {
			document.getElementById("elemB7").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(8)) {
			document.getElementById("elemB8").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(9)) {
			document.getElementById("elemB9").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(10)) {
			document.getElementById("elemB10").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(11)) {
			document.getElementById("elemB11").style.display = "inline-block";
		}
		if(game.unlockedElems.includes(12)) {
			document.getElementById("elemB12").style.display = "inline-block";
		}
	}
	else {
		goETab("none");
	}
	updateDisplays();	
}

function goETab(tabName) { // Element tab
	if(tabName != "none") {
		eTab = tabName;
	}
	document.getElementById("fire").style.display = "none";
	document.getElementById("water").style.display = "none";
	document.getElementById("ice").style.display = "none";
	document.getElementById("sky").style.display = "none";
	document.getElementById("nature").style.display = "none";
	document.getElementById("poison").style.display = "none";
	document.getElementById("metal").style.display = "none";
	document.getElementById("earth").style.display = "none";
	document.getElementById("light").style.display = "none";
	document.getElementById("dark").style.display = "none";
	document.getElementById("fae").style.display = "none";
	document.getElementById("anti").style.display = "none";
	document.getElementById(tabName).style.display = "block";	
}


// do
var saveFile = localStorage.getItem("FAEsave") // get save from storage
loadGame(saveFile); // load save
initialOpen() // 1 - load save

function initialOpen() {
	rMagicGain = getMagicGain();
	faeEGain = getFaeEGain();
	updateDisplays();
	if(!(game.unlockedElems.includes(11))) {
		game.unlockedElems.push(11)
	}
	lastTime = new Date().getTime() // initial time
	goTab("elements")
	updateTickInterval();
	updateAutoInterval();
}
// update game functions, run every interval
function gameLoop() {
	update();
}
function startLoop() { // start the game loop
	gameLoopInterval=setInterval(function(){gameLoop()},game.tickInterval) // runs every (some number of ms)
}
function stopLoop() { // stop the game loop
	gameLoopInterval=clearInterval(gameLoopInterval)
}