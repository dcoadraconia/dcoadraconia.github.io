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
	dreamAmts: [],
	dreamAmtsBought: [],
	dreamCosts: [],
	dreamMults: [],
	dreamShifts: 99,
	dreamShiftMax: 99,	
	
	ne: 99, // nature energy
	neT: 99, // nature energy total
	ns1: 99, // nature primary spell
	ns1c: 99, // cost to cast spell
	nPlots: 99, // nature plots owned
	seedsUnlocked: 99, // seeds unlocked
	plants: [],
	plantPowers: [],
	plantGrowths: [],
	
	timePlayed: 99, // time played
	unlockedElems: [],
	autoSaveInterval: 99,
	tickInterval: 99,

	upgrades: [],

} // these initial values don't matter and will immediately be replaced
var unlockReqs = [Math.pow(10,1),Math.pow(10,10),Math.pow(10,30),Math.pow(10,50),Math.pow(10,75)]
// elem unlock reqs

var saveTimer;
var lastTime; // time difference
var gameLoopInterval;
var currTab;
var eTab;
var rMagicGain = 0;
var faeEGain = 0;
var natEGain = 0;
var needUnlockFS2;
var maxPlots = 36; // the absolute maximum that can be bought (this may change later)
var maxSeeds = 5; // amt seeds (will change later)
var selectedSeed = 0; // 0 no seed selected
var selectedPlant = 0; // 0 no plant selected

var dreamCostBases = [(12**0)*12**(2**0),(12**2)*12**(2**1),(12**4)*12**(2**2),(12**6)*12**(2**3),(12**8)*12**(2**4),0,0,0,0,0,0,0]
var dreamCostExps = [2.4,6,15,40,69,69,69,69,69,69,69,69]

seedUnlockCosts = [1.6*10**2,10**4,10**6,10**69,10**100,10**100]
seedGrowthDividers = [60,120,600,300,1800,9999]

loadNewStart(); // init vars
function loadNewStart() {
	game.magic = 0 // raw magic energy
	game.magicT = 0 // raw magic energy total
	game.fe = 0 // fae energy
	game.feT = 0 // fae energy total
	game.fs1 = 0; // fae primary spell
	game.fs1c = 100; // cost to cast spell
	game.fs2 = 0; // fae secondary spell
	game.fs2c = 10**4 // cost to cast spell
	
	game.ne = 0 // nature energy
	game.neT = 0 // nature energy total
	game.ns1 = 0; // nature primary spell
	game.ns1c = 100; // cost to cast spell
	game.nPlots = 0 // nature plots owned
	game.seedsUnlocked = 2 // start with first 2 seeds
	game.plants = []
	game.plantPowers = []
	game.plantGrowths = []
	
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
	lockFS2();
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
	updateFSDisps();
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
	updateFSDisps();
	updateDisplays();
  }
}

function updateFSDisps() {
	document.getElementById('fs1').innerHTML = nFormat(game.fs1);
	document.getElementById('fs1c').innerHTML = nFormat(game.fs1c);	
	document.getElementById('fs2').innerHTML = nFormat(game.fs2);
	document.getElementById('fs2c').innerHTML = nFormat(game.fs2c);
}
function updateDSDisp() {
	document.getElementById('dreamshifts').innerHTML = "Dreamshift ("+(game.dreamShifts-1)+"): requires "+getDreamShiftReq()+" of "+ordN(getMaxDream())+"-layer Dreams"
}

function updateCosts() {
	game.fs1c = 100*(10**game.fs1); // cost scaling
	game.fs2c = (10**4)*(10**(game.fs2*(game.fs2+1)/2))*(10**game.fs2) // quadratic cost scaling
	for (let i = 1; i <= game.dreamCosts.length; i++) {
		game.dreamCosts[i-1] = nRound(dreamCostBases[i-1]*(dreamCostExps[i-1]**game.dreamAmtsBought[i-1]))
	}
	game.ns1c = 100*(10**game.ns1); // cost scaling
}

function updateMults() {
	for (let i = 1; i <= game.dreamMults.length; i++) {
		game.dreamMults[i-1] = 1*(1.1**game.dreamAmtsBought[i-1])*(2**(game.dreamShifts-i))*getPlantDreamMult()
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
		lockFS2();
		updateFSDisps();
		updateDSDisp();
		showDreams(getMaxDream());
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

function lockFS2() {
	needUnlockFS2 = true
	document.getElementById("fs2s").style.display = "none";
	document.getElementById("fs2s2").style.display = "none";	
}

function getMaxDream() {
	return Math.min(game.dreamShifts,game.dreamShiftMax)
}

function updateDreamDisplays() {
	for (let i = 1; i <= getMaxDream(); i++) { // there are up to 12 dream layers but most shouldn't be unlocked
		document.getElementById("dream"+i).innerHTML = "<b>"+ordN(i)+"-layer Dreams</b> ("+nFormat(game.dreamMults[i-1])+"x): "+nFormat(game.dreamAmts[i-1])+" ("+nFormat(getDreamsPS(i))+"/s), "+game.dreamAmtsBought[i-1]+" bought";
		document.getElementById("bD"+i).innerHTML = getDreamBuyDesc(i-1);
	}
}
function hideDreams() {
	for (let i = 1; i <= 12; i++) {
		document.getElementById("dream"+i).style.display = "none";
		document.getElementById("bD"+i).style.display = "none";
		document.getElementById("dreamNL"+i).style.display = "none";
	}
}
function showDreams(num) { // show dreams up to num
	for (let i = 1; i <= num; i++) {
		document.getElementById("dream"+i).style.display = "inline-block";
		document.getElementById("bD"+i).style.display = "inline-block";
		document.getElementById("dreamNL"+i).innerHTML = "<br>";
		document.getElementById("dreamNL"+i).style.display = "inline";
	}
}

function costOutlines() { // some buttons change outline color if affordable
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
	if(num == getMaxDream()) return 0;
	if(num == 0) return game.dreamAmts[num]*game.dreamMults[num];
	return game.dreamAmts[num]*game.dreamMults[num]/10;
}

function canBuyDream(num) {
	if(num > getMaxDream()) return false;
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
	if(game.ne >= 1) {
		if(game.ne < 10**20)			
			ret *= Math.sqrt(game.ne)
		else
			ret *= (10**10)*((game.ne/10**20)**0.1) // softcap after 10^20 nat energy
	}
	ret *= getPlantRawMult(); // multiplier based on plants
	return ret;
}

function getFaeEGain() { // fae energy gain / s
	if(!game.upgrades.includes("f0")) return 0;
	ret = 1;
	ret += getDreamsPS(0);
	
	ret *= 2**game.fs1 // multiplier based on primary spells
	
	if(game.magic >= 10)
		ret *= Math.log10(game.magic)**game.fs2 // multiplier based on current raw magic per secondary spell
	
	ret *= getPlantFaeMult(); // multiplier based on plants
	
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
	if(game.neT > 1){
		ret *= game.neT;
	}
	return ret;
}

function unlockElem(){
	if(!game.unlockedElems.includes(11) && game.magic >= unlockReqs[0]) {
		game.unlockedElems.push(11)
		goTab("elements")
		updateUnlockButton()
	}
	else if(!game.unlockedElems.includes(5) && game.magic >= unlockReqs[1]) {
		game.unlockedElems.push(5)
		goTab("elements")
		updateUnlockButton()
	}
	else if(!game.unlockedElems.includes(3) && game.magic >= unlockReqs[2]) {
		game.unlockedElems.push(3)
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
	if(game.unlockedElems.length == 3) {
		document.getElementById('bReq').innerHTML = "Unlock Poison<br>(Requires 1e50 raw magic energy)"
	}
}


function resizeGarden() { // resize and redraw
	for (let i = 1; i <= game.nPlots; i++) {
		document.getElementById("plot"+i).style.display = "inline-block";	
	}	
	// hide all above game.nPlots
	for (let i = game.nPlots+1; i <= maxPlots; i++) {
		document.getElementById("plot"+i).style.display = "none";	
	}
	// show next plot
	//if (game.nPlots < maxPlots) {
	//	document.getElementById("plot"+(game.nPlots+1)).style.display = "inline-block";
	//}
}

function plotClick(num) {
	plantSelectedSeed(num);
}

function updateBPText() {
	if(game.nPlots == 0) { // initially
		document.getElementById('buyPlot').innerHTML = "<b>Begin the Nature Garden</b><br>Use Fae energy to bend space and<br>create a pocket dimension for a garden<br>Cost: 1e20 Fae Energy";
	}
	else {
		document.getElementById('buyPlot').innerHTML = "<b>Expand the Nature Garden</b><br>Use Fae energy to expand the space,<br>granting another garden plot<br>Cost: "+nFormat(getPlotCost())+" Fae Energy";
	}
}

function buyPlot() {
	if(canAffordPlot()) {
		game.fe -= getPlotCost(); // take cost
		game.nPlots++; // give plot
		game.plants.push(0) // 0 no plant
		game.plantPowers.push(0) // 0 power
		game.plantGrowths.push(0) // 0 growth
		resizeGarden();
		updateBPText();
		if(game.nPlots==1) goTab("elements"); // first time buying, refresh
	}
}

function canAffordPlot() {
	return (game.fe >= getPlotCost())
}

function getPlotCost() { // in fae energy
	ret = (10**20)*((10**10)**game.nPlots)
	if(game.nPlots >= 6) ret*=((10**10)**(game.nPlots-4))
	return ret
}

function reDispSeeds() {
	for (let i = 1; i <= game.seedsUnlocked; i++) {
		document.getElementById("seed"+i).removeAttribute("hidden");	
	}	
	// hide all above game.seedsUnlocked
	for (let i = game.seedsUnlocked+1; i <= maxSeeds; i++) {
		document.getElementById("seed"+i).setAttribute("hidden", "hidden");	
	}
	document.getElementById('ulSC').innerHTML = nFormat(getSeedUnlockCost());
}

function getSeedUnlockCost() {
	return seedUnlockCosts[game.seedsUnlocked-2]
}

function unlockNextSeed() {
	if(game.ne >= getSeedUnlockCost()) { // if can afford
		game.ne -= getSeedUnlockCost() // subtract cost
		game.seedsUnlocked++; // add seed
		
		if(game.seedsUnlocked==3) checkGUpgsUnlocked(); // unlock the upgrades if this is the third seed
		
		reDispSeeds()
	}
}

function getSeedInput(num) {
	try {
		ret = Math.floor(readNFormat(document.getElementById("seed"+num+"Inp").value))
		return ret
	}
	catch(error) {
		return -1
	}
}

function calcSeedPower(num) {
	inputNum = getSeedInput(num) // the amount of raw magic/nature that the user is putting in the seed
	if(inputNum == -1) return 0; // -1 is invalid number
	if(inputNum == Infinity) return 0; // also invalid
	if(num==1) {
		if(inputNum < 10**10) return 0;
		return (Math.log10(inputNum)) // log10 of given energy
	}
	if(num==2) {
		if(inputNum < 10**1) return 0;
		return (inputNum**0.25)*(10**0.75); // 4th root of given energy
	}
	if(num==3) {
		if(inputNum < 10**2) return 0;
		return (inputNum**0.35)*(100**0.65)/10; // formula
	}
	if(num==4) {
		if(inputNum < 10**3) return 0;
		return (inputNum**0.27)*((10**3)**0.73)/(10**2);
	}	
	if(num==5) {
		if(inputNum < 10**5) return 0;
		return (inputNum**(1/3))*((10**5)**(2/3))/(10**4);
	}
	
	return 0;
}

function pickSeed(num) {
	selectPlant(0); // deselect plant when picking seed
	if(selectedSeed==num) // already selected, deselect
		selectedSeed = 0; // 0 == no seed selected
	else
		selectedSeed = num;
	seedSelectionDisplay();
}

function seedSelectionDisplay() {
	for (let i = 1; i <= maxSeeds; i++) {
		if (i == selectedSeed) {
			document.getElementById("seed"+i+"Btn").style.border = "4px solid yellow";
		}
		else {
			document.getElementById("seed"+i+"Btn").style.border = "0px solid black";
		}
	}	
}

function plantSelectedSeed(num) {
	if (selectedPlant == num) { // if there is plant and it is selected deselect it
		selectPlant(0);
		return;
	}
	if (selectedSeed == 0) { // if no plant is selected then view plant instead
		selectPlant(num);
		return;
	}
	if (game.plants[num-1] != 0) { // if there is already a plant
		pickSeed(0); // deselect current seed
		selectPlant(num);
		return; // return if there is already a plant
	}
	plantCost = getSeedInput(selectedSeed)
	plantPower = calcSeedPower(selectedSeed)
	if(plantPower == 0) {
		pickSeed(0);
		// console.log("no power")
	}
	else if(selectedSeed == 1 && plantCost <= game.magic) { // 1st seed uses raw magic energy
		// pay cost
		game.magic -= plantCost;
		
		// plant seed
		game.plants[num-1] = selectedSeed;
		game.plantPowers[num-1] = plantPower;
		game.plantGrowths[num-1] = 0;
		
		// select planted seed
		pickSeed(0);
		selectPlant(num);
	}
	else if (selectedSeed != 1 && plantCost <= game.ne) { // other seeds use nature energy
		// pay cost
		game.ne -= plantCost;
		
		// plant seed
		game.plants[num-1] = selectedSeed;
		game.plantPowers[num-1] = plantPower;
		game.plantGrowths[num-1] = 0;
		
		// select planted seed
		pickSeed(0);
		selectPlant(num);
	}
	else {
		pickSeed(0);
		// console.log("too expensive")
	}
}

function drainSelectedPlant() { // drain plant and destroy it
	if (selectedPlant == 0) return; // nothing selected to drain
	game.ne += getDrainValue(selectedPlant) // add drain value to nature energy
	game.neT += getDrainValue(selectedPlant)
	
	game.plants[selectedPlant-1] = 0;
	game.plantPowers[selectedPlant-1] = 0;
	game.plantGrowths[selectedPlant-1] = 0;	
	
	checkNS1Unlocked(); // check if this drain unlocks the nature spell
	
	selectPlant(0);
}

function getDrainValue(num) {
	if (game.plantGrowths[num-1] < 1) return 0; // not fully grown
	if (game.plants[num-1] == 1)
		return Math.floor(getNatureEMult()*game.plantPowers[num-1]**0.5) // floor(square root of power)
	if (game.plants[num-1] == 2)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.25)/1.1855)
	if (game.plants[num-1] == 3)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.6)*2.51188644)	
	if (game.plants[num-1] == 4)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.3)*12)
	if (game.plants[num-1] == 5)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.5)*100)
	return 0; // unknown
}

function selectPlant(num) {
	if(selectedPlant==num) // already selected, deselect
		selectedPlant = 0; // 0 == no plant selected
	else
		selectedPlant = num;
	plantSelectionDisplay()
}

function plantSelectionDisplay() {
	for (let i = 1; i <= game.nPlots; i++) {
		if (i == selectedPlant) {
			document.getElementById("plot"+i).style.border = "4px solid yellow";
		}
		else {
			document.getElementById("plot"+i).style.border = "0px solid black";
		}
	}
	if (selectedPlant > 0) {
		// console.log(game.plants[selectedPlant-1]+" "+game.plantPowers[selectedPlant-1]+" "+game.plantGrowths[selectedPlant-1]) 
		document.getElementById("pViewBtn").style.display = "inline-block";
		if (game.plants[selectedPlant-1] > 0) // there is a plant here
			document.getElementById("pDrainBtn").style.display = "inline-block";
		else
			document.getElementById("pDrainBtn").style.display = "none";
		updateDisplays();
	}
	else {
		document.getElementById("pViewBtn").style.display = "none";
		document.getElementById("pDrainBtn").style.display = "none";
	}
}

function selectedPlantText() {
	ret = "<b>Selected Plant Info (Plot "+selectedPlant+")</b>"
	if (game.plants[selectedPlant-1] == 0) ret += "<br>Nothing is planted in this plot."
	else ret += "<br>"+plantNames(game.plants[selectedPlant-1])+" plant, power "+nFormat(game.plantPowers[selectedPlant-1])+"<br>Growth percentage: "+nFormat(game.plantGrowths[selectedPlant-1]*100)+"%"
	if (game.plantGrowths[selectedPlant-1] == 1) ret += "<br><i>Plant is fully grown and gives these buffs:</i><br>"+selectedPlantBuffText()
	// if (game.plants[selectedPlant-1] != 0) ret += "<br>Draining this plant will give "+nFormat(getDrainValue(selectedPlant))+" Nature Energy."
	
	return ret;
}
function selectedPlantBuffText() {
	if(game.plants[selectedPlant-1] == 1) {
		return "- "+nFormat(getBasicPMult(game.plantPowers[selectedPlant-1]))+"x raw magic gain"
	}
	if(game.plants[selectedPlant-1] == 2) {
		return "- "+nFormat(getFairyPMult(game.plantPowers[selectedPlant-1]))+"x fae energy gain"
	}
	if(game.plants[selectedPlant-1] == 3) {
		return "- Nothing (draining is the only benefit)"
	}
	if(game.plants[selectedPlant-1] == 4) {
		return "- "+nFormat(getDreamPMult(game.plantPowers[selectedPlant-1]))+"x all dream layer mults"
	}
	if(game.plants[selectedPlant-1] == 5) {
		return "- Generates "+nFormat(getChloroPrd(game.plantPowers[selectedPlant-1]))+" Nature Energy every second."
	}
	else return "- Plant buff not found";
}
function getBasicPMult(power) {
	if(power <= 18) ret = 1.5**(power/10);
	else ret = 1.5**((18+(power-18)**0.64)/10); // softcap
	ret *= buffFromGUpg3()
	return ret;
}

function getFairyPMult(power) {
	return 0.3763*Math.log2(power)*buffFromGUpg3();
}

function getDreamPMult(power) {
	return 0.7*(Math.log10((power**0.8)*12))*buffFromGUpg6();
}

function getChloroPrd(power) { // nature energy generation over time, applies nature e mult
	ret = getNatureEMult()*(power**(2**0.5))*1.21;
	if(game.upgrades.includes("gUpg6")) ret *= 4;
	return ret;
}

function getPlantRawMult() { // multiplier to raw magic gain from plants
	ret = 1
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 1 && game.plantGrowths[i-1] == 1.0) // if a fully grown basic plant
			ret *= getBasicPMult(game.plantPowers[i-1]);
	}	
	return ret
}
function getPlantFaeMult() { // multiplier to fae energy gain from plants
	ret = 1
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 2 && game.plantGrowths[i-1] == 1.0) // if a fully grown fairy plant
			ret *= getFairyPMult(game.plantPowers[i-1]);
	}		
	return ret	
}

function getPlantDreamMult() { // multiplier to all dreams from plants
	ret = 1
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 4 && game.plantGrowths[i-1] == 1.0) // if a fully grown somnis plant
			ret *= getDreamPMult(game.plantPowers[i-1]);
	}		
	return ret
}

function getPlantNatPrd() { // passive NE production from plants per second
	ret = 0
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 5 && game.plantGrowths[i-1] == 1.0) // if a fully grown chloro plant
			ret += getChloroPrd(game.plantPowers[i-1]);
	}		
	return ret
}

function getNatEGain() {
	ret = getPlantNatPrd()
	return ret
}

function plantNames(num) {
	if(num == 1) return "Basic";
	if(num == 2) return "Fairy";
	if(num == 3) return "Energy";
	if(num == 4) return "Somnis";
	if(num == 5) return "Chloro";
	if(num == 6) return "Growth";	
	return "Unknown";
}

function growPlants(timePassed) {
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] != 0 && game.plantGrowths[i-1] < 1.0) {
			game.plantGrowths[i-1] += growthSpeedMult(i)*timePassed/seedGrowthDividers[game.plants[i-1]-1]
			if (game.plantGrowths[i-1] > 1) game.plantGrowths[i-1] = 1; // no going above 1
		}
	}	
}
function growthSpeedMult(num) {
	ret = 1;
	if(game.upgrades.includes("gUpg1")) ret *= getGUpgMult(1);
	if(game.upgrades.includes("gUpg2") && selectedPlant==num) ret *= 3;
	if(game.upgrades.includes("gUpg4")) ret *= getGUpgMult(4);
	return ret;
}

function getNatureEMult() {
	ret = 1;
	
	ret *= (2**game.ns1)
	
	if(game.upgrades.includes("gUpg5")) ret *= getGUpgMult(5); // multiplier to NE gain from GU5
	
	return ret;
}

function canBuyNS1() {
	return (game.ne >= game.ns1c)
}

function castNS1() { 
  // costs energy
  if(canBuyNS1()) { // if you have enough ne
	game.ne -= game.ns1c; // pay cost
	game.ns1 += 1; // cast spell
	updateCosts();
	updateNSDisps();
	updateDisplays();
  }
}

function updateNSDisps() {
	document.getElementById('ns1').innerHTML = nFormat(game.ns1);
	document.getElementById('ns1c').innerHTML = nFormat(game.ns1c);		
}

function checkNS1Unlocked() {
	if(document.getElementById("ns1s").style.display == "none" && game.neT >= 10) { 
		// unlocks if you have 10+ nature energy and it is currently locked
		document.getElementById("ns1s").style.display = "inline-block";
		document.getElementById("ns1s2").style.display = "inline-block";
		
	}
	else if (game.neT < 10) {
		document.getElementById("ns1s").style.display = "none";
		document.getElementById("ns1s2").style.display = "none";
	}	
}

function checkGUpgsUnlocked() {
	if(document.getElementById("natT2").style.display == "none" && game.seedsUnlocked >= 3) { 
		// unlocks if you have 3 unlocked seeds and it is currently locked
		document.getElementById("natT2").style.display = "inline-block";
		
	}
	else if (game.seedsUnlocked < 3) {
		document.getElementById("natT2").style.display = "none";
	}			
}

function dispGUpgrades() {
	for (let i = 1; i <= 6; i++) {
		document.getElementById("gUpg"+i).className = (game.upgrades.includes("gUpg"+i)) ? "upgBtnNOwn" : "upgBtn"
	}
}

function buyGUpgrade(num) {
	gUpgCosts = [0,1000,500,2000,10**4,4*10**6,10**10]
	if (game.ne >= gUpgCosts[num]) { 
		game.ne -= gUpgCosts[num];
		game.upgrades.push("gUpg"+num);
		dispGUpgrades();
	}
}

function getGUpgMult(num) {
	if(num == 1) return nRound(Math.max(1,1.25+Math.log(0.12+game.ns1)),2) 
	if(num == 2) return 3; // not used
	if(num == 3) return 1+(Math.log10(game.neT)/12)**0.77;
	if(num == 4) return nRound(Math.max(1,(4.5+game.dreamShifts)/5.5),2);
	if(num == 5) return (1.212)**(2*game.seedsUnlocked-3);
	if(num == 6) return getGUpgMult(3)**0.45;	
	return 1;
}

function buffFromGUpg3() { // only returns it if you have upgrade 3
	if(game.upgrades.includes("gUpg3")) return getGUpgMult(3);
	return 1;
}
function buffFromGUpg6() { // only returns it if you have upgrade 6
	if(game.upgrades.includes("gUpg6")) return getGUpgMult(6);
	return 1;
}


function updateDisplays() {
	document.getElementById('magic').innerHTML = nFormat(game.magic);
	document.getElementById('mps').innerHTML = nFormat(rMagicGain);
	// costOutlines();
	updateUnlockButton()
	if(currTab == "world") {
		document.getElementById('total').innerHTML = nFormat(getPotential());
		document.getElementById('total0').innerHTML = nFormat(game.magicT);
		document.getElementById('total5').innerHTML = nFormat(game.neT);
		document.getElementById('total11').innerHTML = nFormat(game.feT);
		document.getElementById('ptime').innerHTML = nFormat(game.timePlayed);
	}
	if(eTab == "fae") {
		document.getElementById('e11s').innerHTML = nFormat(faeEGain);
		document.getElementById('fe').innerHTML = nFormat(game.fe);
		if(needUnlockFS2 && game.fs1 > 1) {
			needUnlockFS2 = false
			document.getElementById("fs2s").style.display = "inline-block";
			document.getElementById("fs2s2").style.display = "inline-block";
		}
		updateDreamDisplays()
	}
	if(eTab == "nature") {
		natureProdDisp()
		document.getElementById('ne').innerHTML = nFormat(game.ne);
		for (let i = 1; i <= game.seedsUnlocked; i++) {
			document.getElementById('sPow'+i).innerHTML = nFormat(calcSeedPower(i));
		}	
		if(selectedPlant != 0) {
			document.getElementById('pViewBtn').innerHTML = selectedPlantText();
			document.getElementById('pDrainBtn').innerHTML = "Drain this plant<br>and destroy it:"+"<br>Will yield "+nFormat(getDrainValue(selectedPlant))+"<br>Nature Energy"
		}
		plotDisplays()
	}
	if(eTab == "nature2") {
		document.getElementById('ne2').innerHTML = nFormat(game.ne);
		document.getElementById('gUpg1Val').innerHTML = nFormat(getGUpgMult(1));
		// document.getElementById('gUpg2Val').innerHTML = nFormat(getGUpgMult(2));
		document.getElementById('gUpg3Val').innerHTML = nFormat(getGUpgMult(3));
		document.getElementById('gUpg4Val').innerHTML = nFormat(getGUpgMult(4));
		document.getElementById('gUpg5Val').innerHTML = nFormat(getGUpgMult(5));
		document.getElementById('gUpg6Val').innerHTML = nFormat(getGUpgMult(6));
	}
}

function natureProdDisp() {
	if(natEGain==0) document.getElementById('e5s').innerHTML = ""; // hide if no gain
	else document.getElementById('e5s').innerHTML = "(<co class = 'colE5'>"+nFormat(natEGain)+"</co> is being generated per second)";
}

function plotDisplays() {
	for (let i = 1; i <= game.nPlots; i++) {
		if(game.plants[i-1] == 0) document.getElementById("plot"+i).style.backgroundColor = "#512C0C";
		else if(game.plantGrowths[i-1] < 1) document.getElementById("plot"+i).style.backgroundColor = "#494F19";
		else if(game.plants[i-1] == 1) document.getElementById("plot"+i).style.backgroundColor = "#AAAAAA";
		else if(game.plants[i-1] == 2) document.getElementById("plot"+i).style.backgroundColor = "#CE2890";
		else if(game.plants[i-1] == 3) document.getElementById("plot"+i).style.backgroundColor = "#44A53D";
		else if(game.plants[i-1] == 4) document.getElementById("plot"+i).style.backgroundColor = "#EF99D7";
		else if(game.plants[i-1] == 5) document.getElementById("plot"+i).style.backgroundColor = "#00723F";
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

	natEGain = getNatEGain();
	game.ne += natEGain*timePassed;
	game.neT += natEGain*timePassed;

	updateMults()
	for (let i = 0; i < game.dreamMults.length-1; i++)
	{
		game.dreamAmts[i] += getDreamsPS(i+1)*timePassed;
	}
	
	growPlants(timePassed)
	
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

function readNFormat(str) { // no negative allowed (for this purpose)
	if(!isNaN(str)) return Number(str); // if already number just return it
	split = str.split("e")
	if(split.length != 2) return -1 // there should be 1 e with something before and something after
	if(isNaN(split[0])) return -1 // must have a number before the e
	if(isNaN(split[1])) return -1 // must have a number after the e
	num1 = Number(split[0])
	num2 = Number(split[1])
	if(num1 < 0) return -1 // must be positive
	if(num2 < 0) return -1 // must be positive
	if(!Number.isInteger(num2)) return -1 // num2 must be an integer
	return num1*(10**num2);
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

	resizeGarden();
	reDispSeeds();
	updateBPText();
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
			if(game.nPlots > 0) {
				document.getElementById("gardenTable").style.display = "inline-block";
				document.getElementById("seedsText").style.display = "inline-block";
			}
			else {
				document.getElementById("gardenTable").style.display = "none";				
				document.getElementById("seedsText").style.display = "none";
			}
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
			if(game.dreamShiftMax > 3 || game.dreamShifts > 2) {
				document.getElementById("faeT2").style.display = "inline-block";
			}
			else {
				document.getElementById("faeT2").style.display = "none";
			}
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
	document.getElementById("fireTabs").style.display = "none";
	document.getElementById("fire").style.display = "none";
	document.getElementById("waterTabs").style.display = "none";
	document.getElementById("water").style.display = "none";
	document.getElementById("iceTabs").style.display = "none";
	document.getElementById("ice").style.display = "none";
	document.getElementById("skyTabs").style.display = "none";
	document.getElementById("sky").style.display = "none";
	document.getElementById("natureTabs").style.display = "none";
	document.getElementById("nature").style.display = "none";
	document.getElementById("nature2").style.display = "none";
	document.getElementById("natureInfo").style.display = "none";
	document.getElementById("poisonTabs").style.display = "none";
	document.getElementById("poison").style.display = "none";
	document.getElementById("metalTabs").style.display = "none";
	document.getElementById("metal").style.display = "none";
	document.getElementById("earthTabs").style.display = "none";
	document.getElementById("earth").style.display = "none";
	document.getElementById("lightTabs").style.display = "none";
	document.getElementById("light").style.display = "none";
	document.getElementById("darkTabs").style.display = "none";
	document.getElementById("dark").style.display = "none";
	document.getElementById("faeTabs").style.display = "none";
	document.getElementById("fae").style.display = "none";
	document.getElementById("fae2").style.display = "none";
	document.getElementById("faeInfo").style.display = "none";
	document.getElementById("antiTabs").style.display = "none";
	document.getElementById("anti").style.display = "none";

	document.getElementById(tabName).style.display = "block";
	
	
	
	if(["nature","nature2","natureInfo"].includes(tabName)) 
		document.getElementById("natureTabs").style.display = "block";
	if(["fae","fae2","faeInfo"].includes(tabName)) 
		document.getElementById("faeTabs").style.display = "block";
	if(["ice","ice2","iceInfo"].includes(tabName)) 
		document.getElementById("iceTabs").style.display = "block";	

	updateDisplays()
	
	pickSeed(0);
	selectPlant(0);
}


// do
var saveFile = localStorage.getItem("FAEsave") // get save from storage
loadGame(saveFile); // load save
initialOpen() // 1 - load save

function initialOpen() {
	rMagicGain = getMagicGain();
	faeEGain = getFaeEGain();
	updateDisplays();
	updateFSDisps();
	updateDSDisp();
	hideDreams();
	showDreams(getMaxDream());
	updateCosts();

	lastTime = new Date().getTime() // initial time
	goTab("elements")
	updateTickInterval();
	updateAutoInterval();
	
	resizeGarden();
	reDispSeeds();
	updateBPText();
	updateNSDisps();
	checkNS1Unlocked();
	checkGUpgsUnlocked();
	dispGUpgrades();
	
	// i may eventually add a nature secondary spell? then change this
	document.getElementById("ns2s").style.display = "none";
	document.getElementById("ns2s2").style.display = "none";
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