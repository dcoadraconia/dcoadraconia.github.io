// Timothy Ross
game = {
	magic: 99, // raw magic
	magicT: 99, // total raw magic
	fe: 99, // fae energy
	feT: 99, // fae energy total
	fs1: 99, // fae primary spell
	fs1c: 99, // cost to cast spell
	fs2: 99, // fae secondary spell
	fs2c: 99, // cost to cast spell	
	timePlayed: 99, // time played
	unlockedElems: [],
	autoSaveInterval: 99,
	tickInterval: 99,
	upgrades: [],
	dreamAmts: [],
	dreamAmtsBought: [],
	dreamCosts: [],
	dreamMults: [],
	dreamShifts: 99,
	dreamShiftMax: 99,
} // these initial values don't matter and will immediately be replaced
var unlockReqs = [Math.pow(10,1),Math.pow(10,10),Math.pow(10,30),Math.pow(10,100)]

var saveTimer;
var lastTime; // time difference
var gameLoopInterval;
var eTab;
var currTab;
var rMagicGain = 0;
var faeEGain = 0;

var dreamCostBases = [(12**0)*12**(2**0),(12**2)*12**(2**1),(12**4)*12**(2**2),(12**6)*12**(2**3),(12**8)*12**(2**4),0,0,0,0,0,0,0]
var dreamCostExps = [2.4,6,15,40,69,69,69,69,69,69,69,69]

loadNewStart(); // init vars
function loadNewStart() {
	game.magic = 0 // raw magic energy
	game.magicT = 0 // raw magic energy total
	game.fe = 0 // fae energy
	game.feT = 0 // fae energy total
	game.fs1 = 0; // fae primary spell
	game.fs1c = 10; // cost to cast spell
	game.fs2 = 0; // fae secondary spell
	game.fs2c = 10**4 // cost to cast spell
	game.timePlayed = 0; // time played
	game.unlockedElems= [];
	game.autoSaveInterval = 10;
	game.tickInterval = 50;
	game.upgrades = []
	game.dreamAmts = []
	game.dreamAmtsBought = []
	game.dreamCosts = []
	game.dreamMults = []
	game.dreamShifts = 0;
	game.dreamShiftMax = 3;
	dreamResetShift();
	saveTimer = 0;
	lastTime = 0; // time difference
	eTab = "none";
	currTab = "elements"
}

function genFE() { 
  game.upgrades.push("f0")
  goTab("elements")
  updateDisplays()
}

function canBuyFS1() {
	return (game.fe >= game.fs1c)
}

function castFS1() { 
  // costs energy
  if(canBuyFS1()) { // if you have enough fe
	game.fe -= game.fs1c; // pay cost
	game.fs1 += 1; // cast spell
	updateCosts();
	updateDisplays();
  }
}

function canBuyFS2() {
	if(game.fs1 <= 1) return false
	return (game.fe >= game.fs2c)
}

function castFS2() { 
  // costs energy
  if(canBuyFS2()) { // if you have enough fe
	game.fe -= game.fs2c; // pay cost
	game.fs2 += 1; // cast spell
	updateCosts();
	updateDisplays();
  }
}

function updateCosts() {
	game.fs1c = 100*(10**game.fs1); // cost scaling
	game.fs2c = (10**4)*(10**(game.fs2*(game.fs2+1)/2))*(10**game.fs2) // quadratic cost scaling
	for (let i = 1; i <= game.dreamCosts.length; i++) {
		game.dreamCosts[i-1] = nRound(dreamCostBases[i-1]*(dreamCostExps[i-1]**game.dreamAmtsBought[i-1]))
	}
}

function updateMults() {
	for (let i = 1; i <= game.dreamMults.length; i++) {
		game.dreamMults[i-1] = 1*(1.1**game.dreamAmtsBought[i-1])*(2**(game.dreamShifts-i))
	}
}

function getDreamShiftReq() {
	ret = 12;
	if (game.dreamShifts >= game.dreamShiftMax) {
		ret += 6*(game.dreamShifts-game.dreamShiftMax);
	}
	return ret;
}

function dreamReset() {
	if(game.dreamAmtsBought[game.dreamAmtsBought.length-1] >= getDreamShiftReq()) {
	game.fe = 0
		game.fs1 = 0; // fae primary spell
		game.fs1c = 10; // cost to cast spell
		game.fs2 = 0; // fae secondary spell
		game.fs2c = 10**4 // cost to cast spell
		for (let i = 1; i <= game.dreamAmts.length; i++) {
			game.dreamAmts[i-1] = 0
			game.dreamAmtsBought[i-1] = 0
		}
		
		dreamResetShift()
		updateCosts();
		updateDisplays();
	}
}
function dreamResetShift() {
	if(game.dreamShifts < game.dreamShiftMax) {
		game.dreamAmts.push(0)
		game.dreamAmtsBought.push(0)
		game.dreamMults.push(1)
		game.dreamCosts.push(dreamCostBases[game.dreamShifts])
	}
	game.dreamShifts++
}

function updateDisplays() {
	document.getElementById('magic').innerHTML = nFormat(game.magic);
	document.getElementById('mps').innerHTML = nFormat(rMagicGain);
	costOutlines();
	updateUnlockButton()
	if(currTab == "world") {
		document.getElementById('total').innerHTML = nFormat(getPotential());
		document.getElementById('total0').innerHTML = nFormat(game.magicT);
		document.getElementById('total11').innerHTML = nFormat(game.feT);
		document.getElementById('ptime').innerHTML = nFormat(game.timePlayed);
	}
	if(eTab == "fae") {
		document.getElementById('e11s').innerHTML = nFormat(faeEGain);
		document.getElementById('fe').innerHTML = nFormat(game.fe);
		document.getElementById('fs1').innerHTML = nFormat(game.fs1);
		document.getElementById('fs1c').innerHTML = nFormat(game.fs1c);
		if(game.fs1 > 1) {
			document.getElementById('fs2').innerHTML = nFormat(game.fs2);
			document.getElementById('fs2c').innerHTML = nFormat(game.fs2c);
			document.getElementById("fs2s").style.display = "inline-block";
			document.getElementById("fs2s2").style.display = "inline-block";
		}
		else {
			document.getElementById("fs2s").style.display = "none";
			document.getElementById("fs2s2").style.display = "none";
		}
		document.getElementById('dreamReq').innerHTML = getDreamShiftReq()+" of "
		+ordN(Math.min(game.dreamShifts,game.dreamShiftMax))+"-layer";
		updateDreamDisplays()
	}
}
function updateDreamDisplays() {
	for (let i = 1; i <= 12; i++) { // there are up to 12 dream layers but most shouldn't be unlocked
		document.getElementById("dream"+i).style.display = "none";
		document.getElementById("bD"+i).style.display = "none";
		document.getElementById("dreamNL"+i).style.display = "none";
		if(Math.min(game.dreamShifts,game.dreamShiftMax) > i-1) {
			document.getElementById("dream"+i).innerHTML = "<b>"+ordN(i)+"-layer Dreams</b> ("+nFormat(game.dreamMults[i-1])+"x): "+nFormat(game.dreamAmts[i-1])+" ("+nFormat(getDreamsPS(i))+"/s), "+game.dreamAmtsBought[i-1]+" bought";
			document.getElementById("dream"+i).style.display = "inline-block";
			document.getElementById("bD"+i).innerHTML = getDreamBuyDesc(i-1);
			document.getElementById("bD"+i).style.display = "inline-block";
			document.getElementById("dreamNL"+i).innerHTML = "<br>";
			document.getElementById("dreamNL"+i).style.display = "inline";
		}
	}
}

function costOutlines() {
	document.getElementById("bReq").parentElement.className = (game.magic >= unlockReqs[game.unlockedElems.length]) ? "bReqA" : "bReqU"
}

function getDreamBuyDesc(num) {
	cost = game.dreamCosts[num]
	if(cost <= 12)
		return "Buy (Cost: "+nFormat(cost)+" FE)";
	if(cost <= 1000)
		return "Cost: "+nFormat(cost)+" FE";
	return "Cost: "+nFormat(cost);
}

function getDreamsPS(num) {
	if(num == Math.min(game.dreamShifts,game.dreamShiftMax)) return 0;
	if(num == 0) return game.dreamAmts[num]*game.dreamMults[num];
	return game.dreamAmts[num]*game.dreamMults[num]/10;
}

function canBuyDream(num) {
	if(num > Math.min(game.dreamShifts,game.dreamShiftMax)) return false;
	return (game.fe >= game.dreamCosts[num-1])
}

function buyDream(num) {
  if(canBuyDream(num)) { // if you have enough fe
	game.fe -= game.dreamCosts[num-1]; // pay cost
	game.dreamAmts[num-1] += 1; // get dream
	game.dreamAmtsBought[num-1] += 1; // get dream
	updateCosts();
	updateMults();
	updateDisplays();
  }	
}

function maxAllDream() {
	maxFSpells()
	for (let i = 1; i <= game.dreamCosts.length; i++) {
		while(canBuyDream(i)) {
			buyDream(i)
		}
	}
}
function maxFSpells() {
	// primary spell
	while(canBuyFS1()) {
		castFS1()
	}
	// secondary spell
	while(canBuyFS2()) {
		castFS2()
	}	
}


function ordN(num) { // ordinal numbers
	switch(num) {
		case 1:
			return "1st"
		case 2:
			return "2nd"		
		case 3:
			return "3rd"		
		case 4:
			return "4th"		
		case 5:
			return "5th"		
		case 6:
			return "6th"		
		case 7:
			return "7th"		
		case 8:
			return "8th"		
		case 9:
			return "9th"		
		case 10:
			return "10th"
		case 11:
			return "11th"			
		case 12:
			return "12th"
		default:
			return "N-th"
	}
}

function getMagicGain() { // raw magic gain / s
	ret = 1;
	if(game.fe >= 1) {
		if(game.fe < 10**20)			
			ret *= Math.sqrt(game.fe)
		else
			ret *= (10**10)*((game.fe/10**20)**0.1) // softcap after 10^20 fae energy
	}
	return ret;
}

function getFaeEGain() { // fae energy gain / s
	if(!game.upgrades.includes("f0")) return 0;
	ret = 1;
	ret += getDreamsPS(0);
	
	ret *= 2**game.fs1 // multiplier based on primary spells
	
	if(game.magic >= 10)
		ret *= Math.log10(game.magic)**game.fs2 // multiplier based on current raw magic per secondary spell
	
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

function unlockElem(){
	if(!game.unlockedElems.includes(11) && game.magic >= 10) {
		game.unlockedElems.push(11)
		goTab("elements")
		updateUnlockButton()
	}
	else if(!game.unlockedElems.includes(5) && game.magic >= Math.pow(10,10)) {
		game.unlockedElems.push(5)
		goTab("elements")
		updateUnlockButton()
	}
}

function updateUnlockButton() {
	if(game.unlockedElems.length == 0) {
		document.getElementById('bReq').innerHTML = "Unlock Fae<br>(Requires 10 raw magic energy)"
	}
	if(game.unlockedElems.length == 1) {
		document.getElementById('bReq').innerHTML = "Unlock Nature<br>(Requires 1e10 raw magic energy)"		
	}
	if(game.unlockedElems.length == 2) {
		document.getElementById('bReq').innerHTML = "Unlock Ice<br>(Requires 1e30 raw magic energy)"
	}
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

	updateMults()
	for (let i = 0; i < game.dreamMults.length-1; i++)
	{
		game.dreamAmts[i] += getDreamsPS(i+1)*timePassed;
	}
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
	if(num >= 1000) {
		return nRound(num/Math.pow(10,Math.floor(Math.log10(num))),2).toFixed(2)+"e"+Math.floor(Math.log10(num))
	}
	else if(num >= 100) {
		return nRound(num,2)
	}
	else if(num >= 1) {
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
		
		loadNewStart(); // set vars to new start

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

		if(game.upgrades.includes("f0")) {
			document.getElementById("f0").style.display = "none";
		}
		else {
			document.getElementById("f0").style.display = "inline-block";
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
	updateDisplays()
}


// do
var saveFile = localStorage.getItem("FAEsave") // get save from storage
loadGame(saveFile); // load save
initialOpen() // 1 - load save

function initialOpen() {
	rMagicGain = getMagicGain();
	faeEGain = getFaeEGain();
	updateDisplays();

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