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
	//
	becameDreamMage: false,
	dreamMagicStudyAmt: 99,
	dmSpellsUnlocked: 99,
	dreamSpellsEquipped: [],
	
	ne: 99, // nature energy
	neT: 99, // nature energy total
	ns1: 99, // nature primary spell
	ns1c: 99, // cost to cast spell
	nPlots: 99, // nature plots owned
	seedsUnlocked: 99, // seeds unlocked
	plants: [],
	plantPowers: [],
	plantGrowths: [],
	
	ie: 99, // ice energy
	ieT: 99, // ice energy total
	is1: 99, // ice primary spell
	is1c: 99, // cost to cast spell
	inIceTrial: false, // ice challenge
	iceTrialTimeLeft: 99, // time remaining
	iceTrialTime: 99, // time spent
	iceTrialFreezeTime: 99, // how long timer is frozen for
	iceTrialBuyableAmts: [], // repeatable upgrades in the ice trial
	iUpgsBought: 99, // for an upgrade
	
	trialScore: 99, // degree of success in Trial of Ice
	bestTrialScore: 99, // best score
	bestIceEn: 99, // best ie from trial
	bestIceEnPS: 99, // best ie divided by time taken in trial
	iceCrystals: 99, // currency in Trial of Ice
	
	bestBasicMult: 99,
	bestGemstoneMult: 99,
	gUpg11Active: false,
	ignoreTrialConfirmations: false,
	
	timePlayed: 99, // time played
	unlockedElems: [],
	autoSaveInterval: 99,
	tickInterval: 99,

	upgrades: [],

} // these initial values don't matter and will immediately be replaced
var unlockReqs = [Math.pow(10,1),Math.pow(10,10),Math.pow(10,30),Math.pow(10,72),Math.pow(10,300)]
// elem unlock reqs

var devGameSpeed = 1; // for testing

var saveTimer;
var lastTime; // time difference
var gameLoopInterval;
var currTab;
var eTab;
var rMagicGain = 0;
var faeEGain = 0;
var natEGain = 0;
var iceEGain = 0;
var iceCGain = 0; // ice crystal gain
var needUnlockFS2;
var maxPlots = 36; // the absolute maximum that can be bought (this may change later)
var maxSeeds = 9; // amt seeds (will change later)
var selectedSeed = 0; // 0 no seed selected
var selectedPlant = 0; // 0 no plant selected

var freeNS1 = 0; // free nature primary spells
var freeFS2 = 0; // free fae secondary spells

var selectedDMDream = 0; // for dream magic
var selectedDMSpell = 0; // for dream magic
var numDMSpells = 12; // how many dream magic spells are in the game (will probably change later)

var dreamCostBases = [(12**0)*12**(2**0),(12**2)*12**(2**1),(12**4)*12**(2**2),(12**6)*12**(2**3),(12**8)*12**(2**4),0,0,0,0,0,0,0]
var dreamCostExps = [2.4,6,15,40,69,69,69,69,69,69,69,69]

seedUnlockCosts = [1.6*10**2,10**4,10**6,10**15,10**20,10**25,10**30,12**100]
seedGrowthDividers = [60,120,600,300,1800,2500,3600,7200,10800,99999]

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
	//
	game.becameDreamMage = false; // becomes true when player gets become dream mage upgrade
	game.dreamMagicStudyAmt = 0; // times studied dream magic
	game.dmSpellsUnlocked = 0; // spells unlocked
	game.dreamSpellsEquipped = [0,0,0,0,0,0,0,0,0,0,0,0]; 
	// number is the id of the spell equipped to dream at []index; 0 is no spell
	
	game.ne = 0 // nature energy
	game.neT = 0 // nature energy total
	game.ns1 = 0; // nature primary spell
	game.ns1c = 100; // cost to cast spell
	game.nPlots = 0 // nature plots owned
	game.seedsUnlocked = 2 // start with first 2 seeds
	game.plants = []
	game.plantPowers = []
	game.plantGrowths = []
	
	game.ie = 0 // ice energy
	game.ieT = 0 // ice energy total
	game.is1 = 0; // ice primary spell
	game.is1c = 100; // cost to cast spell
	game.inIceTrial = false; // ice challenge
	game.iceTrialTimeLeft = 0; // time remaining
	game.iceTrialTime = 0; // time spent
	game.iceTrialFreezeTime = 0; // how long timer is frozen for
	game.trialScore = 0;
	game.bestTrialScore = 0;
	game.bestIceEn = 0;
	game.bestIceEnPS = 0;
	game.iceCrystals = 0;
	game.iceTrialBuyableAmts=[0,0,0,0,0];
	game.iUpgsBought = 0;
	game.bestBasicMult = 1;
	game.bestGemstoneMult = 1;
	game.gUpg11Active = false;
	game.ignoreTrialConfirmations = false;
	
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
	// if(game.fs1 > 98) game.fs1c *= 10**game.fs1-98// softcap
	game.fs2c = (10**4)*(10**(game.fs2*(game.fs2+1)/2))*(10**game.fs2) // quadratic cost scaling
	// if(game.fs2 > 10) game.fs2c *= 10**((game.fs2-10)*(game.fs2-9))// softcap
	for (let i = 1; i <= game.dreamCosts.length; i++) {
		game.dreamCosts[i-1] = nRound(dreamCostBases[i-1]*(dreamCostExps[i-1]**game.dreamAmtsBought[i-1]))
	}
	game.ns1c = 100*(10**game.ns1); // cost scaling
	if(game.ns1 >= 29) game.ns1c *= 10**9; // cost jump that may or may not be temporary
	game.is1c = 100*(10**game.is1); // cost scaling
	
	// scaling after 1e100
	/*if(game.fs1c > 10**100) game.fs1c = 10**200
	if(game.fs2c > 10**100) game.fs2c = 10**200
	for (let i = 1; i <= game.dreamCosts.length; i++) {
		if(game.dreamCosts[i-1] > 10**100) game.dreamCosts[i-1] = 10**200
	}*/
}

function updateMults() {
	for (let i = 1; i <= game.dreamMults.length; i++) {
		game.dreamMults[i-1] = dreamMultBase(i); // mults from dream-magic are external
		
		// apply this dream's dream-magic buff
		game.dreamMults[i-1] *= getDMSpellMult(game.dreamSpellsEquipped[i-1],i);
	}
}
function dreamMultBase(num) { // no include dream-magic boosts
	ret = 1;
	
		ret *= (1.1**game.dreamAmtsBought[num-1])*(2**(game.dreamShifts-num))
		
		// only apply these mults if external dream mults are enabled
		if(!exDreamMultsDisabled()) {
			ret *= getPlantDreamMult() // plants boost dreams
			ret *= ((game.upgrades.includes("iUpg4")) ? getIUpgMult(4) : 1) // iu4 boost all dreams			
		}	
	
	return ret;
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
	if(game.ie >= 1) {
		if(game.ie < 10**20)			
			ret *= Math.sqrt(game.ie)
		else
			ret *= (10**10)*((game.ie/10**20)**0.1) // softcap after 10^20 ice energy
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
		ret *= Math.log10(game.magic)**(game.fs2+freeFS2) // multiplier based on current raw magic per secondary spell

	// only apply these mults if external dream mults are enabled
	if(!exDreamMultsDisabled()) {
		ret *= getPlantFaeMult(); // multiplier based on plants
	}
	
	if(ret > 10**120) {
		ret = ((ret/10**120)**(0.5))*10**120
	}
	
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
	if(game.ieT > 1){
		ret *= game.ieT;
	}
	return ret;
}

function refreshDreamMagicDisp() {
	if(!game.becameDreamMage) {
		document.getElementById("dreamMageU").style.display = "block";
		hideElem("studyDreamMagicBtn");
		hideElem("dreamMagicSpells");
	}
	else {
		hideElem("dreamMageU");
		document.getElementById("studyDreamMagicBtn").style.display = "block";
		document.getElementById("dreamMagicSpells").style.display = "block";
		updateDMTable();
	}
}

function studyDreamMagic() {
	if(canAffordStudyDM()) {
		game.fe -= getStudyDMCost();
		game.dreamMagicStudyAmt++
		updateDisplays();
	}
}
function canAffordStudyDM() {
	return (game.fe >= getStudyDMCost())
}
function getStudyDMCost() {
	return 10**((game.dreamMagicStudyAmt+1)**(1+1/(1+getPlantStudyReduce())))
}
function getStudySpellPower() {
	return 0.1*game.dreamMagicStudyAmt
}

function becomeDreamMage() {
	if(confirm("Are you ready to become a Dream Mage?\nYou will lose all Dreamshifts and temporarily lose access to any dream multipliers outside of the Fae element, but you will unlock Dream-Magic and the ability to reach a fourth dream layer."))
	{		
		game.becameDreamMage = true;
		game.dmSpellsUnlocked = 6; // start with 6 spells to choose from

		// reset dream resources and do a dream reset
		game.dreamAmts = []
		game.dreamAmtsBought = []
		game.dreamCosts = []
		game.dreamMults = []
		game.dreamShifts = 0;
		game.dreamShiftMax = 4; // now 4

		game.fe = 0 
		game.fs1 = 0; 
		game.fs1c = 100; 
		game.fs2 = 0; 
		game.fs2c = 10**4

		dreamResetShift();
		
		updateCosts();
		lockFS2();
		updateFSDisps();
		updateDSDisp();
		hideDreams();
		showDreams(getMaxDream());
		updateDisplays();
		
		goETab("fae")
		
	}
	lastTime = new Date().getTime(); // screen freezes up when waiting for confirmation
}
function exDreamMultsDisabled() {
	// disable external dream mults if you have not yet shifted with the highest unlocked dream layer
	return (game.dreamShifts <= game.dreamShiftMax);
}

function updateDMTable() {
	for (let i = 1; i <= 12; i++) {
		hideElem("dmDreamBtn"+i);
	}
	for (let i = 1; i <= numDMSpells; i++) {
		hideElem("dmSpellBtn"+i);
	}
	
	for (let i = 1; i <= getMaxDream(); i++) {
		document.getElementById("dmDreamBtn"+i).style.display = "inline-block";
	}
	for (let i = 1; i <= game.dmSpellsUnlocked; i++) {
		document.getElementById("dmSpellBtn"+i).style.display = "inline-block";
	}

	
}

dmSpellUnlockCosts = [0,0,0,0,0,0,10**120,10**130,10**140,10**150,10**160,10**170,10**300]
function unlockNewDMSpell() {
	if(game.fe >= dmSpellUnlockCosts[game.dmSpellsUnlocked]) {
		game.fe -= dmSpellUnlockCosts[game.dmSpellsUnlocked];
		game.dmSpellsUnlocked++
		goETab("fae2");
	}	
}


function getDMSpellName(num) {
	if(num == 0) return "No spell attached";
	if(num == 1) return "Sylvan Spell"; // based on Nature Energy
	if(num == 2) return "Flurry Spell"; // based on Ice Energy
	if(num == 3) return "Quality Spell"; // based on the dream's multiplier
	if(num == 4) return "Quantity Spell"; // based on amount of this dream
	if(num == 5) return "Dream Nihil-Spell"; // based on Raw Magic Energy
	if(num == 6) return "Dream Omni-Spell"; // based on all other DM Spell multipliers
	if(num == 7) return "Creation Spell"; // based on Fae Energy after 10^100
	if(num == 8) return "Attainment Spell"; // based on best trial score
	if(num == 9) return "Harvest Spell"; // based on plant growth speed
	if(num == 10) return "Depth Spell"; // based on dreamshift amount
	if(num == 11) return "Infinity Spell"; // based on total energy potential
	if(num == 12) return "Eternity Spell"; // based on total time played
	return "Unknown Spell";	
}
function getDMSpellDesc(num) {
	if(num == 0) return "WHAT<br>HOW";
	if(num == 1) return "Boosts attached dream<br>based on Nature Energy"; // based on Nature Energy
	if(num == 2) return "Boosts attached dream<br>based on Ice Energy"; // based on Ice Energy
	if(num == 3) return "Boosts attached dream<br>based on its multiplier"; // based on the dream's multiplier
	if(num == 4) return "Boosts attached dream<br>based on its amount"; // based on amount of this dream
	if(num == 5) return "Boosts attached dream<br>based on Raw Magic Energy"; // based on Raw Magic Energy
	if(num == 6) return "Boosts attached dream<br>based on all other Dream-Magic Spell multipliers"; // based on all other DM Spell multipliers
	if(num == 7) return "Boosts attached dream<br>based on Fae Energy after 1e120"; // based on Fae Energy after 10^120
	if(num == 8) return "Boosts attached dream<br>based on best trial score"; // based on best trial score
	if(num == 9) return "Boosts attached dream<br>based on plant growth speed"; // based on plant growth speed
	if(num == 10) return "Boosts attached dream<br>based on dreamshift amount"; // based on dreamshift amount
	if(num == 11) return "Boosts attached dream<br>based on total energy potential"; // based on total energy potential
	if(num == 12) return "Boosts attached dream<br>based on total time played"; // based on total time played
	return "Unknown Spell";	
}


function getDMSpellMult(num,dreamAppliedTo=0) { // most mults don't use dreamAppliedTo
	if(num == 1) return (1+0.066*Math.log(Math.max(1,game.ne/10**5))**1.55)**getStudySpellPower();
	if(num == 2) return (1+0.12*Math.log(Math.max(1,game.ie))**1.65)**getStudySpellPower();
	if(num == 3 && dreamAppliedTo == 0) return "(depends on the dream)"
	if(num == 3) return (1+0.225*Math.log(1+dreamMultBase(dreamAppliedTo)))**getStudySpellPower();
	if(num == 4 && dreamAppliedTo == 0) return "(depends on the dream)"
	if(num == 4) return (1+0.11*Math.log(1+game.dreamAmts[dreamAppliedTo-1]))**getStudySpellPower();
	if(num == 5) return (1+0.08*Math.log(Math.max(1,game.magic/10**12))**1.2)**getStudySpellPower();
	if(num == 6) return (getDOmSMult()); // doesn't use study spell power here
	if(num == 7) return (1+(66**0.1)*Math.log(Math.max(1,game.fe/10**120))**0.55)**getStudySpellPower();
	if(num == 8) return (0.3*(1+Math.log(1+game.bestTrialScore)**1.1))**getStudySpellPower();
	if(num == 9) return (1.2*(growthSpeedMult(-1))**1.05)**getStudySpellPower(); // -1 so selection effect doesn't apply
	if(num == 10) return (1.5**(Math.max((getDMScaledDreamshifts())**0.85,1)))**getStudySpellPower();
	if(num == 11) return (1+Math.log(Math.min(10**200,Math.max(getPotential()/10**100,1)))**0.64)**getStudySpellPower();
	if(num == 12) return (1.2*Math.max((game.timePlayed/3600)**(0.66),1))**getStudySpellPower();
	return 1;
}
function getDMScaledDreamshifts() {
	if(game.dreamShifts > 19) return 14+(game.dreamShifts-19)**0.3;
	else return game.dreamShifts-5;
}
function getDOmSMult() { // get dream omni magic spell
	// will use a more accurate formula later
	// What i need to do is do this in a better way, calculate each mult once every update instead of having to do them multiple times in one update, then this will be more feasible
	ret = 1;
	if(game.dmSpellsUnlocked < 6) return ret;
	ret *= (getDMSpellMult(1)*getDMSpellMult(2)*getDMSpellMult(3,1)*getDMSpellMult(4,1)*getDMSpellMult(5))**0.2; // gets spell 3,4 mults given first layer dream
	if(game.dmSpellsUnlocked < 7) return ret;
	ret = ret**(9/10);
	ret *= (getDMSpellMult(7)**0.1)
	if(game.dmSpellsUnlocked < 8) return ret;
	ret = ret**(10/11);
	ret *= (getDMSpellMult(8)**0.1)
	if(game.dmSpellsUnlocked < 9) return ret;
	ret = ret**(11/12);
	ret *= (getDMSpellMult(9)**0.1)
	if(game.dmSpellsUnlocked < 10) return ret;
	ret = ret**(12/13);
	ret *= (getDMSpellMult(10)**0.1)
	if(game.dmSpellsUnlocked < 11) return ret;
	ret = ret**(13/14);
	ret *= (getDMSpellMult(11)**0.1)
	if(game.dmSpellsUnlocked < 12) return ret;
	ret = ret**(14/15);
	ret *= (getDMSpellMult(12)**0.1)
	return ret;
}

function getDmDreamInfo(num) {
	return "<b>"+ordN(num)+"-Layer Dream</b><br>Current attached spell:<br>"+getDMSpellName(game.dreamSpellsEquipped[num-1])+",<br>providing a "+nFormat(getDMSpellMult(game.dreamSpellsEquipped[num-1],num))+"x boost<br>to this dream's multiplier"
}
function getDmSpellInfo(num) {
	return "<b>"+getDMSpellName(num)+"</b><br>"+getDMSpellDesc(num)+"<br>Current multiplier effect:<br>"+checkUnknown(getDMSpellMult(num))+"x";
}
function checkUnknown(value) {
	if(isNaN(value)) return value;
	else return nFormat(value);
}

function updateDmTableDisps() {
	for (let i = 1; i <= getMaxDream(); i++) {
		document.getElementById("dmDreamBtn"+i).innerHTML = getDmDreamInfo(i);
		if (i == selectedDMDream) {
			document.getElementById("dmDreamBtn"+i).style.border = "8px solid yellow";
		}
		else {
			document.getElementById("dmDreamBtn"+i).style.border = "0px solid #CE2890";
		}
	}
	for (let i = 1; i <= game.dmSpellsUnlocked; i++) {
		document.getElementById("dmSpellBtn"+i).innerHTML = getDmSpellInfo(i);
		if (i == selectedDMSpell) {
			document.getElementById("dmSpellBtn"+i).style.border = "8px solid yellow";
		}
		else {
			document.getElementById("dmSpellBtn"+i).style.border = "0px solid #CE2890";
		}
	}	
}

function dmSelDream(num) {
	if(selectedDMSpell == 0 && selectedDMDream != num) {
		selectedDMDream = num;
	}
	else if(selectedDMDream == num) {
		selectedDMDream = 0;
	}
	else if(selectedDMSpell != 0) {
		selectedDMDream = num;
		pairDandS(selectedDMDream,selectedDMSpell)
		selectedDMDream = 0;
		selectedDMSpell = 0;
	}

}
function dmSelSpell(num) {
	if(selectedDMDream == 0 && selectedDMSpell != num) {
		selectedDMSpell = num;
	}	
	else if(selectedDMSpell == num) {
		selectedDMSpell = 0;
	}
	else if(selectedDMDream != 0) {
		selectedDMSpell = num;
		pairDandS(selectedDMDream,selectedDMSpell)
		selectedDMDream = 0;
		selectedDMSpell = 0;
	}

}
function pairDandS(dreamNum,spellNum) {
	// first remove the spell from any other dream it is on
	for (let i = 1; i <= getMaxDream(); i++) {
		if(game.dreamSpellsEquipped[i-1] == spellNum) game.dreamSpellsEquipped[i-1] = 0
	}
	game.dreamSpellsEquipped[dreamNum-1] = spellNum;
	// console.log(dreamNum+" "+spellNum);
	updateDisplays();
}

function detachDreamMagics() { // remove all dream magic from dreams
	for (let i = 1; i <= getMaxDream(); i++) {
		game.dreamSpellsEquipped[i-1] = 0;
	}	
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
	else if(!game.unlockedElems.includes(6) && game.magic >= unlockReqs[3]) {
		game.unlockedElems.push(6)
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
		document.getElementById('bReq').innerHTML = "Unlock Poison<br>(Requires 1e72 raw magic energy)"
	}
	if(game.unlockedElems.length == 4) {
		document.getElementById('bReq').innerHTML = "Unlock Fire<br>(Requires a morbillion raw magic energy)"
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
	if(game.nPlots >= 12) ret *= (10**20)**(game.nPlots-11)
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
	if(game.ne >= getSeedUnlockCost() && game.seedsUnlocked < maxSeeds) { // if can afford
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
	if(num==6) {
		if(inputNum < 10**10) return 0;
		return (inputNum**(0.2))*((10**10)**(0.8))/(10**9);
	}
	if(num==7) {
		if(inputNum < 10**20) return 0;
		return Math.log10(inputNum/10**19)*(inputNum**(0.1))*((10**20)**(0.9))/(10**19);
	}
	if(num==8) {
		if(inputNum < 10**24) return 0;
		return (inputNum**(0.3))*((10**24)**(0.7))/(10**23);
	}
	if(num==9) {
		if(inputNum < 10**30) return 0;
		return (inputNum**(0.24))*((10**30)**(0.76))/(10**29);		
	}
	
	return 0;
}

function pickSeed(num) {
	selectPlant(0); // deselect plant when picking seed
	if(selectedSeed==num) // already selected, deselect
		selectedSeed = 0; // 0 == no seed selected
	else
		selectedSeed = num;
	if(selectedSeed != 0 && game.nPlots > 3) { // unlocks with the 4th plot
		document.getElementById("bulkPlantBtn").style.display = "block";
	}
	else {
		hideElem("bulkPlantBtn")
	}
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

function bulkPlant() { // bulk plant the selected seed in all open plots
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 0) { // if the plot is currently empty
			plantCost = getSeedInput(selectedSeed)
			plantPower = calcSeedPower(selectedSeed)
			if(plantPower == 0) {
				// console.log("no power")
			}
			else if(selectedSeed == 1 && plantCost <= game.magic) { // 1st seed uses raw magic energy
				// pay cost
				game.magic -= plantCost;
				
				// plant seed
				game.plants[i-1] = selectedSeed;
				game.plantPowers[i-1] = plantPower;
				game.plantGrowths[i-1] = 0;

			}
			else if (selectedSeed != 1 && plantCost <= game.ne) { // other seeds use nature energy
				// pay cost
				game.ne -= plantCost;
				
				// plant seed
				game.plants[i-1] = selectedSeed;
				game.plantPowers[i-1] = plantPower;
				game.plantGrowths[i-1] = 0;

			}
			else {
				// console.log("too expensive")
			}
		}			
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

function bulkDrain() { // bulk drain all fully grown plants
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] != 0 && game.plantGrowths[i-1] == 1) { // if the plot is not empty and the plant in it is fully grown
		
		game.ne += getDrainValue(i) // add drain value to nature energy
		game.neT += getDrainValue(i)
		
		game.plants[i-1] = 0;
		game.plantPowers[i-1] = 0;
		game.plantGrowths[i-1] = 0;			
		
		}			
	}
	
	// refresh select	
	sel = selectedPlant;
	selectPlant(0);
	selectPlant(sel);	
}


function getDrainValue(num) {
	if (game.plantGrowths[num-1] < 1) return 0; // not fully grown
	if (game.plants[num-1] == 1)
		return Math.floor(getNatureEMult()*game.plantPowers[num-1]**0.5) // floor(square root of power)
	if (game.plants[num-1] == 2)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.25)/1.1855)
	if (game.plants[num-1] == 3)
		return (game.plantPowers[num-1] > 10**6) ? Math.floor(getNatureEMult()*(((10**6)**1.6)*(game.plantPowers[num-1]/10**6)**1.4)*2.51188644) : Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.6)*2.51188644)
		// reduced energy yield after a point
	if (game.plants[num-1] == 4)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.3)*12)
	if (game.plants[num-1] == 5)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.44)*100)
	if (game.plants[num-1] == 6)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.4)*10**6)
	if (game.plants[num-1] == 7)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**3)*10**8)
	if (game.plants[num-1] == 8)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.28)*10**12)
	if (game.plants[num-1] == 9)
		return Math.floor(getNatureEMult()*(game.plantPowers[num-1]**1.75)*66*10**15)
	return 0; // unknown
}

function selectPlant(num) {
	if(selectedPlant==num) // already selected, deselect
		selectedPlant = 0; // 0 == no plant selected
	else
		selectedPlant = num;
	
	if(selectedPlant != 0 && game.nPlots > 3) { // unlocks with the 4th plot
		document.getElementById("bulkDrainBtn").style.display = "block";
	}
	else {
		hideElem("bulkDrainBtn")
	}
	
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
	else ret += "<br>"+plantNames(game.plants[selectedPlant-1])+" plant, power "+nFormat(game.plantPowers[selectedPlant-1])+"<br>Growth percentage: "+growthShow(game.plantGrowths[selectedPlant-1]*100)+"%"
	if (game.plantGrowths[selectedPlant-1] == 1) ret += "<br><i>Plant is fully grown and gives these buffs:</i><br>"+selectedPlantBuffText()
	// if (game.plants[selectedPlant-1] != 0) ret += "<br>Draining this plant will give "+nFormat(getDrainValue(selectedPlant))+" Nature Energy."
	
	return ret;
}
function growthShow(num) { // show 2 decimal places unless number is 100
	return (num != 100) ? num.toFixed(2) : num
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
	if(game.plants[selectedPlant-1] == 6) {
		return "- "+nFormat(getICryPMult(game.plantPowers[selectedPlant-1]))+"x Ice Crystal gain"
	}
	if(game.plants[selectedPlant-1] == 7) {
		return "- "+nFormat(getSupportPMult(game.plantPowers[selectedPlant-1]))+"x boost (additive) to all other plant<br>passive effects, based on raw magic energy"
	}	
	if(game.plants[selectedPlant-1] == 8) {
		return "- "+nFormat(100*getStudyPReduce(game.plantPowers[selectedPlant-1]))+"% weaker Dream-Magic Study cost scaling"
	}	
	if(game.plants[selectedPlant-1] == 9) {
		return "- "+nFormat(getArcticPMult(game.plantPowers[selectedPlant-1]))+"x ice energy gain"
	}		
	else return "- Plant buff not found";
}

function getPlantOverviewText() {
	if(getPlantRawMult() > 1 || getPlantFaeMult() > 1 || getPlantDreamMult() > 1 || getPlantNatPrd() > 0 || getPlantICryMult() > 0 || getPlantsSBoostMult() > 1 || getPlantStudyReduce() > 0 || getPlantIceMult() > 1) {
		oText = "<br>Since you came all the way here, I will give you an overview of your plant passive effects.<br>(I'll probably move this somewhere else later)<br>"
		if(getPlantRawMult() > 1) oText += "<br> Multiplier to raw magic gain: "
		+nFormat(getPlantRawMult())+"x"
		if(getPlantFaeMult() > 1) oText += "<br> Multiplier to fae energy gain: "
		+nFormat(getPlantFaeMult())+"x"
		if(getPlantDreamMult() > 1) oText += "<br> Multiplier to all dream layer mults: "
		+nFormat(getPlantDreamMult())+"x"
		if(getPlantNatPrd() > 0) oText += "<br> NE generation per second: "
		+nFormat(getPlantNatPrd())+"/s"
		if(getPlantICryMult() > 1) oText += "<br> Multiplier to Ice Crystal gain: "
		+nFormat(getPlantICryMult())+"x"
		if(getPlantsSBoostMult() > 1) oText += "<br> Boost to all other plant passive effects: "
		+nFormat(getPlantsSBoostMult())+"x";
		if(getPlantStudyReduce() > 0) oText += "<br> Reduction to Dream-Magic Study cost scaling: "
		+nFormat(100*getPlantStudyReduce())+"%";	
		if(getPlantIceMult() > 1) oText += "<br> Multiplier to ice energy gain: "
		+nFormat(getPlantIceMult())+"x"
		return oText;
	}
	else return ""
}



function getBasicPMult(power) {
	if(power <= 19) ret = 1.5**(power/10);
	else ret = 1.5**((18+(power-18)**0.64)/10); // softcap
	ret *= buffFromGUpg3()
	ret = ret**getPlantPoweredUp(); // power boost by strength bonus
	if(game.gUpg11Active) ret = ret ** 1.1; // boost when upg11 active
	return ret;
}

function getFairyPMult(power) {
	ret = 0.3763*Math.log2(power)
	if(ret > 5) ret = (4+(ret-4)**0.4) // softcap
	ret *= buffFromGUpg3();
	ret = ret**getPlantPoweredUp(); // power boost by strength bonus
	if(game.gUpg11Active) ret = ret ** 1.1; // boost when upg11 active
	return ret;
}

function getDreamPMult(power) {
	ret = 0.7*(Math.log10((power**0.8)*12));
	if(ret > 3) ret = (2+(ret-2)**0.5) // softcap
	ret *= buffFromGUpg6();
	ret = ret**getPlantPoweredUp(); // power boost by strength bonus
	if(game.gUpg11Active) ret = ret ** 1.1; // boost when upg11 active
	return ret;
}

function getChloroPrd(power) { // nature energy generation over time, applies nature e mult
	ret = getNatureEMult()*(power**(2**0.5))*1.21;
	if(game.upgrades.includes("gUpg6")) ret *= 4;
	if(game.upgrades.includes("gUpg12")) ret *= getGUpgMult(12);
	ret = ret*getPlantPoweredUp(); // multiply boost by strength bonus (this is additive so not power)
	if(game.gUpg11Active) ret = ret * 10; // boost when upg11 active
	return ret;
}

function getICryPMult(power) {
	ret = 1+(Math.log10(power)/12**(1.012));
	if(ret > 1.3) ret = (0.3+(ret-0.3)**0.21) // softcap
	ret = ret**getPlantPoweredUp(); // power boost by strength bonus
	if(game.gUpg11Active) ret = ret ** 1.1; // boost when upg11 active
	return ret;
}

function getSupportPMult(power) {
	return 1+(0.066*(Math.log10(power)**0.66*Math.log10(Math.max(10,getEffMagSupport()))**0.25))*(game.gUpg11Active ? 1.1 : 1);
	// plant power up obviously doesn't affect this plant
}
function getEffMagSupport() { // softcap
	return (game.magic > 10**50) ? 10**10*(game.magic/10**50)**0.1 : game.magic/10**40;
}


function getStudyPReduce(power) {
	ret= 0.012*(6*Math.log10(power))**0.415;
	
	if(ret > 0.035) ret = (2.5+(ret*100-2.5)**0.42)/100
	
	ret = ret*getPlantPoweredUp(); // multiply boost by strength bonus (additive)
	if(game.gUpg11Active) ret = ret * 1.1; // boost when upg11 active
	return ret;
}

function getArcticPMult(power) {
	ret = 1+4.5*Math.log2(1+power)/66
	
	ret = ret**getPlantPoweredUp(); // power boost by strength bonus
	if(game.gUpg11Active) ret = ret ** 1.1; // boost when upg11 active
	return ret;
}


function getPlantRawMult() { // multiplier to raw magic gain from plants
	ret = 1
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 1 && game.plantGrowths[i-1] == 1.0) // if a fully grown basic plant
			ret *= getBasicPMult(game.plantPowers[i-1]);
	}
	if(ret > game.bestBasicMult) game.bestBasicMult = ret; // best should always be best
	if(game.upgrades.includes("gUpg7")) ret = game.bestBasicMult;
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

function getPlantICryMult() { // multiplier to ice crystals from plants
	ret = 1
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 6 && game.plantGrowths[i-1] == 1.0) // if a fully grown gemstone plant
			ret *= getICryPMult(game.plantPowers[i-1]);
	}
	if(ret > game.bestGemstoneMult) game.bestGemstoneMult = ret; // best should always be best
	if(game.upgrades.includes("gUpg10") && !game.plants.includes(9)) ret = game.bestGemstoneMult;
	return ret
}
function getPlantsSBoostMult() { // multiplier to other plant power from plants
	ret = 1
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 7 && game.plantGrowths[i-1] == 1.0) // if a fully grown helper plant
			ret += (getSupportPMult(game.plantPowers[i-1])-1); // additive
	}
	return ret
}

function getPlantPoweredUp() { // powered up amount to all plants passive bonuses
	ret = 1;
	ret *= getPlantsSBoostMult();
	return ret;
}

function getPlantStudyReduce() { // reduction to dream study cost scaling
	ret = 0
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 8 && game.plantGrowths[i-1] == 1.0) // if a fully grown focus plant
			ret += (getStudyPReduce(game.plantPowers[i-1])); // additive
	}
	return ret
}

function getPlantIceMult() { // multiplier to ice energy gain from plants
	ret = 1
	for (let i = 1; i <= game.nPlots; i++) {
		if (game.plants[i-1] == 9 && game.plantGrowths[i-1] == 1.0) // if a fully grown arctic plant
			ret *= getArcticPMult(game.plantPowers[i-1]);
	}
	return ret		
}


function plantNames(num) {
	if(num == 1) return "Basic";
	if(num == 2) return "Fairy";
	if(num == 3) return "Energy";
	if(num == 4) return "Somnis";
	if(num == 5) return "Chloro";
	if(num == 6) return "Gemstone";
	if(num == 7) return "Helper";
	if(num == 8) return "Focus";
	if(num == 9) return "Arctic";
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
	if(game.upgrades.includes("gUpg8")) ret *= getGUpgMult(8);
	if(game.gUpg11Active && num != -1) ret *= (1/60) // doesn't affect when num=-1 because that means we want to see base grow speed
	return ret;
}

function getNatureEMult() {
	ret = 1;
	
	ret *= (2**(game.ns1+freeNS1))
	
	if(game.upgrades.includes("gUpg5")) ret *= getGUpgMult(5); // multiplier to NE gain from GU5
	
	ret *= ((game.upgrades.includes("iUpg2")) ? getIUpgMult(2) : 1) // i upgrade 2 boost NE gain
	
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
	for (let i = 1; i <= 12; i++) {
		document.getElementById("gUpg"+i).className = (game.upgrades.includes("gUpg"+i)) ? "upgBtnNOwn" : "upgBtn"
		if(i==11) document.getElementById("gUpg11").style.cursor = "pointer" // this one always has a pointer
	}
}

function buyGUpgrade(num) {
	gUpgCosts = [0,1000,500,2000,10**4,4*10**6,10**10,10**15,10**20,10**25,10**30,10**35,10**30]
	if (game.ne >= gUpgCosts[num]) { 
		game.ne -= gUpgCosts[num];
		game.upgrades.push("gUpg"+num);
		dispGUpgrades();
	}
	if(num == 11 && game.upgrades.includes("gUpg11")) {
		for (let i = 1; i <= game.nPlots; i++) { // drain all
			if (game.plants[i-1] != 0) {
			
			game.ne += getDrainValue(i)
			game.neT += getDrainValue(i)
			
			game.plants[i-1] = 0;
			game.plantPowers[i-1] = 0;
			game.plantGrowths[i-1] = 0;			
		
			}			
		}
		game.gUpg11Active = !game.gUpg11Active;
	}
}

function getGUpgMult(num) {
	if(num == 1) return nRound(Math.max(1,1.25+Math.log(0.12+game.ns1)),2) 
	if(num == 2) return 3; // not used
	if(num == 3) return 1+(Math.log10(game.neT)/12)**0.77;
	if(num == 4) return nRound(Math.max(1,(4.5+game.dreamShifts)/5.5),2);
	if(num == 5) return (1.212)**(2*game.seedsUnlocked-3);
	if(num == 6) return getGUpgMult(3)**0.45;
	if(num == 7) return game.bestBasicMult;
	if(num == 8) return (Math.max(1,game.iUpgsBought-6))**0.41;
	if(num == 9) return 1; // not used
	if(num == 10) return game.bestGemstoneMult;
	if(num == 11) return 10; // not used
	if(num == 12) return growthSpeedMult(-1); // multiply by growth speed
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




function canBuyIS1() {
	return (game.ie >= game.is1c)
}

function castIS1() { 
  // costs energy
  if(canBuyIS1()) { // if you have enough ie
	game.ie -= game.is1c; // pay cost
	game.is1 += 1; // cast spell

	if(game.upgrades.includes("iUpg6")) {
		freeNS1 = getIUpgMult(6);
		freeFS2 = getIUpgMult(6);
	}

	updateCosts();
	updateISDisps();
	updateDisplays();

  }
}

function updateISDisps() {
	document.getElementById('is1').innerHTML = nFormat(game.is1);
	document.getElementById('is1c').innerHTML = nFormat(game.is1c);
	// buying primary spells can give free levels to others
	document.getElementById('ns1F').innerHTML = (freeNS1 > 0) ? "+<co class = 'colE5'>"+nFormat(freeNS1)+"</co>" : "";
	document.getElementById('fs2F').innerHTML = (freeFS2 > 0) ? "+<co class = 'colE11'>"+nFormat(freeFS2)+"</co>" : "";
	
}

function checkIS1Unlocked() {
	if(document.getElementById("is1s").style.display == "none" && game.ieT >= 10) { 
		// unlocks if you have 10+ ice energy and it is currently locked
		document.getElementById("is1s").style.display = "inline-block";
		document.getElementById("is1s2").style.display = "inline-block";
		
	}
}

function getIceEMult() {
	ret = 1;
	
	ret *= (2**game.is1)
	
	ret *= ((game.upgrades.includes("iUpg2")) ? getIUpgMult(2) : 1) // i upgrade 2 boost ie gain
		
	ret *= getPlantIceMult(); // mult to ice e gain from plants
	
	return ret;
}

iceTrialMusic = document.getElementById("iceTrialMusic") // testing feature
iceTrialMusic.volume = 0.3;

function startIceTrial() {
	if(game.ignoreTrialConfirmations || confirm("Do you want to enter the Trial of Ice?\nWhile in the Trial, you will lose access to all your other elements, and they will \"freeze\" and stop updating until you are no longer in the Trial.\nYou can exit the Trial at any time, and you will gain Ice Energy based on trial score upon exiting."))
	{	
	
		game.inIceTrial = true;
		
		iceTrialMusic.play(); // silly music feature very dumb
		
		game.iceTrialTimeLeft = getITStartTimeLeft();
		resetTrialVars();
		
		game.iceCrystals += ((game.upgrades.includes("iUpg11")) ? getIUpgMult(11) : 0)
		
		game.iceTrialFreezeTime += ((game.upgrades.includes("iUpg3")) ? 10 : 0) // i upgrade 3 gives 10 seconds of starting time stop
		
		iceTrialDispRefresh();
	
	
	}
	lastTime = new Date().getTime(); // screen freezes up when waiting for confirmation
}

function stopIceTrial() {
	if(game.ignoreTrialConfirmations || confirm("Do you want to exit the Trial of Ice early?\nYou will gain Ice Energy based on your current trial score. "))
	{		
	
		trialStop();
	
	}
	lastTime = new Date().getTime(); // screen freezes up when waiting for confirmation	
}

function trialStop() {
	game.inIceTrial = false;
	
	iceTrialMusic.pause(); // silly music feature
	iceTrialMusic.currentTime = 0; // very dumb
	
	// you get ice energy
	ieReward = getTEIEGain();
	game.ie += ieReward;
	game.ieT += ieReward;
	
	if(game.bestIceEn < ieReward) game.bestIceEn = ieReward;
	iePS = (ieReward / game.iceTrialTime); // effective ice energy per second
	if(game.bestIceEnPS < iePS) game.bestIceEnPS = iePS;
	
	game.iceTrialTimeLeft = 0;
	resetTrialVars();
	
	checkIS1Unlocked()
	iceTrialDispRefresh();
}

function resetTrialVars() {
	game.iceTrialTime = 0;
	game.iceTrialFreezeTime = 0;
	game.trialScore = 0;
	game.iceCrystals = 0;
	game.iceTrialBuyableAmts=[0,0,0,0,0];
}

function iceTrialDispRefresh() {
	if(game.inIceTrial) {
		goETab("ice")
		document.getElementById("hideDuringIceTrial").style.display = "none";
		document.getElementById("startIceTrial").style.display = "none";
		document.getElementById("stopIceTrial").style.display = "inline-block";
		document.body.style.animation = "backicetrial 12s infinite"; 
		document.getElementById("title").style.color = "#00B0F0"
		
		document.getElementById("iceTrialStuff").style.display = "inline-block";
		document.getElementById("iceTrialSpells").style.display = "block";
		document.getElementById("iceESpells").style.display = "none";
		document.getElementById("notTrialStuff").style.display = "none";
		
		updateTrialCostDisplays(); // button displayed costs
	}
	else {
		document.getElementById("hideDuringIceTrial").style.display = "inline-block";
		document.getElementById("startIceTrial").style.display = "inline-block";
		document.getElementById("stopIceTrial").style.display = "none";
		document.body.style.animation = "backdefault";
		document.getElementById("title").style.color = "white"
		
		document.getElementById("iceTrialStuff").style.display = "none";
		document.getElementById("iceTrialSpells").style.display = "none";
		document.getElementById("iceESpells").style.display = "table";
		document.getElementById("notTrialStuff").style.display = "inline-block";
		document.getElementById('enterTrialFText').innerHTML = (game.bestTrialScore > 0) ? ("Best score: "+nFormat(game.bestTrialScore)) : ("");
		document.getElementById('iUpgsTableReq').innerHTML = getIUpgsReqText();
		
		updateTrialUpgradesTable();
	}
}

function updateTrialVars(timePassed) {
	
	timeSub = 0;
	game.iceTrialFreezeTime -= timePassed;
	if(game.iceTrialFreezeTime < 0) {
		timeSub -= game.iceTrialFreezeTime;
		game.iceTrialFreezeTime = 0;
	}
	
	game.iceTrialTimeLeft -= timeSub*getTrialTimespeedMult();
	
	// check if there is time left and if not, force stop
	if(game.iceTrialTimeLeft <= 0) {
		trialStop()
		return;
	}
	
	// now that we know that there is time left, update everything else
	game.iceTrialTime += timePassed;
	game.iceCrystals += timePassed*getIceCrystalGain()
	game.trialScore += timePassed*getTrialScoreGain()
	
	// update best if needed
	if(game.trialScore > game.bestTrialScore) game.bestTrialScore = game.trialScore;

}

function getTimeBasedCMult() {
	ret = 1;
	
	ret *= (game.iceTrialTime)**(2+(0.1*game.iceTrialBuyableAmts[2])) // boosted for each level
	
	return ret;	
}

function getIceCrystalGain() {
	ret = 1;
	
	ret *= 2**game.iceTrialBuyableAmts[1] // each level double ic gain
	
	ret *= getPlantICryMult(); // plant bonus to ice crystal gain
	
	ret *= ((game.upgrades.includes("iUpg1")) ? getIUpgMult(1) : 1) // i upgrade 1 boost ic gain
	ret *= ((game.upgrades.includes("iUpg7")) ? getIUpgMult(7) : 1) // i upgrade 7 boost ic gain
	
	ret *= getTimeBasedCMult();
	
	return ret;
}

function getTrialScoreGain() {
	ret = 1;
	
	ret *= 2**game.iceTrialBuyableAmts[3] // each level double ts gain
	
	ret *= ((game.upgrades.includes("iUpg5")) ? getIUpgMult(5) : 1) // i upgrade 5 boost ts gain
	
	ret *= game.iceCrystals;
	
	return ret;
}

function getTrialTimespeedMult() {
	ret = 1;
	
	ret *= 0.9**game.iceTrialBuyableAmts[4]
	
	return ret;
}

function getITStartTimeLeft() { // get Ice Trial start time left
	ret = 60; // 60 by default
	
	ret += ((game.upgrades.includes("iUpg3")) ? getIUpgMult(3) : 0) // i upgrade 3 boost trial starting time
	
	return ret;
}


function getTEIEGain() { // get trial exit ice energy gain (formula)
	if(game.trialScore < 10**3) return 0; 
	return Math.floor(getIceEMult()*trialConvertExponent());
}
function trialConvertExponent() {
	if(game.upgrades.includes("iUpg8")) return ((game.trialScore/(10**3))**(0.4)); // upgrade 8 improves the formula
	return ((game.trialScore/(10**3))**(1/3));
}

function getTrialSpellCost(num) {
	if(num==1) return ((10**3)/trialSpellCostDivider())*(10**(game.iceTrialBuyableAmts[0]**1.02));
	if(num==2) return ((10**3)/trialSpellCostDivider())*(10**(game.iceTrialBuyableAmts[1]**1.09));
	if(num==3) return ((10**3)/trialSpellCostDivider())*(10**(game.iceTrialBuyableAmts[2]**1.11));
	if(num==4) return ((10**3)/trialSpellCostDivider())*(10**(game.iceTrialBuyableAmts[3]**1.06));
	if(num==5) return ((10**3)/trialSpellCostDivider())*(10**(game.iceTrialBuyableAmts[4]**1.08))*(12**(Math.max(0,game.iceTrialBuyableAmts[4]-12)**2)); // softcap because slowing time is op
	return 1;
}
function trialSpellCostDivider() {
	if(game.upgrades.includes("iUpg9")) return 10; // ice upgrade 9 divides trial spell costs
	else return 1;
}

function updateTrialCostDisplays() {
	document.getElementById('freezeTCost').innerHTML = nFormat(getTrialSpellCost(1));
	document.getElementById('iTSpell1C').innerHTML = nFormat(getTrialSpellCost(2));
	document.getElementById('iTSpell2C').innerHTML = nFormat(getTrialSpellCost(3));
	document.getElementById('iTSpell3C').innerHTML = nFormat(getTrialSpellCost(4));
	document.getElementById('iTSpell4C').innerHTML = nFormat(getTrialSpellCost(5));
}

function castTSpell(num) {
	if (game.iceCrystals >= getTrialSpellCost(num)) {
		game.iceCrystals -= getTrialSpellCost(num);
		
		game.iceTrialBuyableAmts[num-1] += 1;
		
		updateDisplays();
		updateTrialCostDisplays();
	}
}

function freezeTCountdown() {
	if (game.iceCrystals >= getTrialSpellCost(1)) {
		castTSpell(1);
		// apply the cooldown freeze (does not stack)
		if(game.iceTrialFreezeTime < 10) game.iceTrialFreezeTime = 10;
	}
}

trialUpgradeScoreReqs = [0,10**10,10**12,10**13,10**15,10**17,10**20,10**22,10**24,10**26,10**300]

function getIUpgsReqText() {
	if(game.bestTrialScore <= trialUpgradeScoreReqs[0]) return ""
	if(game.bestTrialScore < trialUpgradeScoreReqs[1]) return "Reach a best score of 1e10 to unlock Trial of Ice Upgrades!"
	else {
		for (let i = 2; i < trialUpgradeScoreReqs.length; i++) {
			if(game.bestTrialScore < trialUpgradeScoreReqs[i]) return "Reach a best score of "+nFormat(trialUpgradeScoreReqs[i])+" to unlock the next upgrade!"		
		}
	}
}


iUpgCosts = [10**3,10**3,5*10**3,1.5*10**4,1.2*10**6,3*10**7,2.5*10**8,10**10,10**12,2*10**13,10**15,5*10**19,10**69]

function updateTrialUpgradesTable() {
	hideElem("iUpgsTable")
	if(game.bestTrialScore >= trialUpgradeScoreReqs[1]) {
		tUpgsVisible = 4;
		for (let i = 2; i <= 12; i++) {
			if(game.bestTrialScore >= trialUpgradeScoreReqs[i]) tUpgsVisible += 1;		
		}
		document.getElementById("iUpgsTable").style.display = "inline-block";
		for (let i = 1; i <= 12; i++) { // 12 temp
			hideElem("iUpg"+i)
		}
		for (let i = 1; i <= tUpgsVisible; i++) {
			document.getElementById("iUpg"+i).style.display = "inline-block";
			document.getElementById("iUpg"+i+"Cost").innerHTML = nFormat(iUpgCosts[i-1]);
		}
	}
}

function dispIUpgrades() {
	for (let i = 1; i <= 12; i++) {
		document.getElementById("iUpg"+i).className = (game.upgrades.includes("iUpg"+i)) ? "upgBtnIOwn" : "upgBtn"
	}
}

function buyIUpgrade(num) {
	if (!(game.upgrades.includes("iUpg"+num)) && game.ie >= iUpgCosts[num-1]) { 
		game.ie -= iUpgCosts[num-1];
		game.upgrades.push("iUpg"+num);
		game.iUpgsBought++; // for an upgrade
		dispIUpgrades();
		if(num == 6) {
			freeNS1 = getIUpgMult(6);
			freeFS2 = getIUpgMult(6);
			updateISDisps();
		}
	}
}

function getIUpgMult(num) {
	if(num == 1) return ((1+game.is1/3)**0.9)+Math.log2(1+game.is1)**1.2;
	if(num == 2) return ((1+game.bestTrialScore/10**10)**0.066)+(0.22516*Math.log2((Math.max(1,game.bestTrialScore/10**10))));
	if(num == 3) return Math.floor(game.seedsUnlocked+(game.dreamShifts/2)**0.768);
	if(num == 4) return ((1+game.ie)**0.12)+0.5*Math.log(Math.max(1,0.12*game.ie/66))**1.8;
	if(num == 5) return (1+game.magic/(10**30))**0.04+(Math.log10(1+(game.magic/(10**30))**0.8))/2.51683;
	if(num == 6) return Math.floor(game.is1/2);
	if(num == 7) return (game.dreamAmts[3] > 50) ? ((game.dreamAmts[3] > 150) ? (10+Math.log(1.72+(game.dreamAmts[3]-50)/100)**0.85) : ((game.dreamAmts[3]-50)**0.5)) : 1;
	if(num == 8) return 1; // unused
	if(num == 9) return 1; // unused
	if(num == 10) return (Math.max(1,game.iUpgsBought-6))**0.41; // unused
	if(num == 11) return Math.min(game.ie,10**15*(game.ie/10**15)**0.5);
	if(num == 12) return (0.25*game.bestIceEnPS);
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
		document.getElementById('total3').innerHTML = nFormat(game.ieT);
		document.getElementById('total5').innerHTML = nFormat(game.neT);
		document.getElementById('total11').innerHTML = nFormat(game.feT);
		document.getElementById('ptime').innerHTML = nFormat(game.timePlayed);
	}
	if(currTab == "options") {
		document.getElementById("ignoreTrialConfBtn").style.display = ((game.bestTrialScore > 0) ? "inline-block" : "none");
		document.getElementById("ignoreTC").style.display = ((game.bestTrialScore > 0) ? "inline-block" : "none")
		document.getElementById('ignoreTC').innerHTML = (game.ignoreTrialConfirmations ? "Currently: true" : "Currently: false");
		
	}
	if(eTab == "fae") {
		document.getElementById('fe').innerHTML = nFormat(game.fe);
		document.getElementById('e11s').innerHTML = nFormat(faeEGain);
		if(needUnlockFS2 && game.fs1 > 1) {
			needUnlockFS2 = false
			document.getElementById("fs2s").style.display = "inline-block";
			document.getElementById("fs2s2").style.display = "inline-block";
		}
		updateDreamDisplays()
		
		if(getFaeEGain() > 10**120) {
			document.getElementById("e120Notice").style.display = "block";
		}
		else {
			hideElem("e120Notice")
		}
	}	
	if(eTab == "fae2") {
		document.getElementById('fe2').innerHTML = nFormat(game.fe);		
		document.getElementById('e11s2').innerHTML = nFormat(faeEGain);
		document.getElementById('dmPower').innerHTML = getStudySpellPower().toFixed(2)
		document.getElementById('sDMc').innerHTML = nFormat(getStudyDMCost())
		document.getElementById('nDMc').innerHTML = nFormat(dmSpellUnlockCosts[game.dmSpellsUnlocked])
		updateDmTableDisps()
		// .
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
		document.getElementById('gUpg7Val').innerHTML = nFormat(getGUpgMult(7));
		document.getElementById('gUpg8Val').innerHTML = nFormat(getGUpgMult(8));
		// document.getElementById('gUpg9Val').innerHTML = nFormat(getGUpgMult(9));
		document.getElementById('gUpg10Val').innerHTML = (!game.plants.includes(9) ? nFormat(getGUpgMult(10)) : 1);
		document.getElementById('gUpg11Val').innerHTML = (game.gUpg11Active ? "active" : "inactive");
		document.getElementById('gUpg12Val').innerHTML = nFormat(getGUpgMult(12));
	}
	if(eTab == "natureInfo") {
		document.getElementById('plantOverview').innerHTML = getPlantOverviewText();
	}
	if(eTab == "ice") {
		iceProdDisp()
		document.getElementById('ie').innerHTML = nFormat(game.ie);
		if(game.inIceTrial) {
			document.getElementById('iceTrialTimeLeft').innerHTML = nFormat(game.iceTrialTimeLeft,1);
			document.getElementById('iceTrialTime').innerHTML = nFormat(game.iceTrialTime);
			document.getElementById('timeBasedCMult').innerHTML = nFormat(getTimeBasedCMult());
			document.getElementById('trialScore').innerHTML = nFormat(game.trialScore);
			document.getElementById('ieGainOnExit').innerHTML = nFormat(getTEIEGain());
			document.getElementById('iceCrystals').innerHTML = nFormat(game.iceCrystals);
			
			document.getElementById('iceCrystalsPS').innerHTML = nFormat(getIceCrystalGain());
			document.getElementById('trialScorePS').innerHTML = nFormat(getTrialScoreGain());
			
			document.getElementById('freezeTimeLeft').innerHTML = ((game.iceTrialFreezeTime > 0) ? (game.iceTrialFreezeTime.toFixed(2)+"s freeze effect") : "");
			document.getElementById('trialTimespeedMult').innerHTML = ((getTrialTimespeedMult() != 1) ? ("Trial countdown speed multiplier: "+nFormat(getTrialTimespeedMult())+"x") : "");
			
			document.getElementById('bestScore').innerHTML = nFormat(game.bestTrialScore);
			
		}
		else {
			for (let i = 1; i <= 12; i++) {
				try {
					document.getElementById('iUpg'+i+'Val').innerHTML = nFormat(getIUpgMult(i));
				}
				catch(error) {
					// ignore, some upgrades don't have display values
				}
			}
		}
	}
}

function hideElem(id) { // hide the element with this id
	document.getElementById(id).style.display = "none";
}

function natureProdDisp() {
	if(natEGain==0) document.getElementById('e5s').innerHTML = ""; // hide if no gain
	else document.getElementById('e5s').innerHTML = "(<co class = 'colE5'>"+nFormat(natEGain)+"</co> is being generated per second)";
}

function plotDisplays() {
	// set plant colors and check extra text
	document.getElementById('dPlantBoost').innerHTML = (getPlantPoweredUp() > 1) ? "<br>All plant passive effects are powered up by "+nFormat(getPlantPoweredUp())+"x" : ""
	document.getElementById('gUpg11Active').innerHTML = (game.gUpg11Active ? "<br> All plants are growing at 1/60 speed but their passive effects are stronger." : "")
	for (let i = 1; i <= game.nPlots; i++) {
		if(game.plants[i-1] == 0) document.getElementById("plot"+i).style.backgroundColor = "#512C0C";
		else if(game.plantGrowths[i-1] < 1) document.getElementById("plot"+i).style.backgroundColor = "#494F19";
		else if(game.plants[i-1] == 1) document.getElementById("plot"+i).style.backgroundColor = "#AAAAAA";
		else if(game.plants[i-1] == 2) document.getElementById("plot"+i).style.backgroundColor = "#CE2890";
		else if(game.plants[i-1] == 3) document.getElementById("plot"+i).style.backgroundColor = "#44A53D";
		else if(game.plants[i-1] == 4) document.getElementById("plot"+i).style.backgroundColor = "#EF99D7";
		else if(game.plants[i-1] == 5) document.getElementById("plot"+i).style.backgroundColor = "#00723F";
		else if(game.plants[i-1] == 6) document.getElementById("plot"+i).style.backgroundColor = "#70F5FF";
		else if(game.plants[i-1] == 7) document.getElementById("plot"+i).style.backgroundColor = "#727057";
		else if(game.plants[i-1] == 8) document.getElementById("plot"+i).style.backgroundColor = "#991248";
		else if(game.plants[i-1] == 9) document.getElementById("plot"+i).style.backgroundColor = "#BFD9FF";
		else document.getElementById("plot"+i).style.backgroundColor = "black" // unknown seed
	}	
}

function iceProdDisp() {
	if(iceEGain==0) document.getElementById('e3s').innerHTML = ""; // hide if no gain
	else document.getElementById('e3s').innerHTML = "(<co class = 'colE3'>"+nFormat(iceEGain)+"</co> is being generated per second)";
}

// update game functions
function update() {
	var time = new Date().getTime();
	var timePassed = devGameSpeed*(time-lastTime)/1000;
	lastTime = time;
	
	
	if(game.inIceTrial) { // most things pause in the ice trial
		// this only happens in the ice trial
		updateTrialVars(timePassed);
		
		if(game.upgrades.includes("gUpg9")) growPlants(timePassed) // happens with gupg 9
		if(game.upgrades.includes("gUpg12")) { // happens with gupg 12

		natEGain = getPlantNatPrd(); // chloro plant working in trial
		game.ne += natEGain*timePassed;
		game.neT += natEGain*timePassed;
		
		}
		
	}
	else {
		// none of this happens in the ice trial
		
		rMagicGain = getMagicGain();
		game.magic += rMagicGain*timePassed;
		game.magicT += rMagicGain*timePassed;
		faeEGain = getFaeEGain();
		game.fe += faeEGain*timePassed;
		game.feT += faeEGain*timePassed;
		
		natEGain = getNatEGain();
		game.ne += natEGain*timePassed;
		game.neT += natEGain*timePassed;
		
		updateMults()
		for (let i = 0; i < game.dreamMults.length-1; i++)
		{
			game.dreamAmts[i] += getDreamsPS(i+1)*timePassed;
		}		

		growPlants(timePassed)

	}
	
	if(game.upgrades.includes("iUpg12")) { // this is outside of the trial because trial doesn't freeze its own layer
		iceEGain = getIUpgMult(12);
		game.ie += iceEGain*timePassed;
		game.ieT += iceEGain*timePassed;
	}

	game.timePlayed += timePassed;
	
	saveTimer += timePassed;
	if(saveTimer > game.autoSaveInterval) {
		saveTimer = 0;
		saveGame();
	}
	
	updateDisplays();
}

// formatting for numbers
function nFormat(num, digits=2) {
	if(num == Infinity) return "Infinite"
	if(num >= 1000) {
		return nRound(num/Math.pow(10,Math.floor(Math.log10(num))),digits).toFixed(digits)+"e"+Math.floor(Math.log10(num))
	}
	/*else if(num >= 100) {
		return nRound(num,digits)
	}
	else if(num >= 1) {
		return nRound(num,digits)
	}	*/
	else {
		return nRound(num,digits);
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
	
	if(game.upgrades.includes("iUpg6")) {
		freeNS1 = getIUpgMult(6);
		freeFS2 = getIUpgMult(6);
	}	
	refreshDispStuff();

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

function ignoreTrialConfBtn() {
	game.ignoreTrialConfirmations = !game.ignoreTrialConfirmations;
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
	document.getElementById("iceInfo").style.display = "none";
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
	
	if(tabName == "fae2") {
		if(game.feT >= 10**100) {
			document.getElementById("drMUnlockText").style.display = "none";
			document.getElementById("dreamMagic").style.display = "block";
			refreshDreamMagicDisp()
		}
		else {
			document.getElementById("drMUnlockText").style.display = "block";
			document.getElementById("dreamMagic").style.display = "none";
		}
	}
	
	if(tabName == "nature2") {
		if(game.upgrades.includes("iUpg10")) {
			document.getElementById("gardenUpgs2").style.display = "table-row";
			document.getElementById("gardenUpgs2b").style.display = "table-row";
		}
		else {
			document.getElementById("gardenUpgs2").style.display = "none";
			document.getElementById("gardenUpgs2b").style.display = "none";
		}		
	}
	
	if(["nature","nature2","natureInfo"].includes(tabName)) 
		document.getElementById("natureTabs").style.display = "block";
	if(["fae","fae2","faeInfo"].includes(tabName)) 
		document.getElementById("faeTabs").style.display = "block";
	if(["ice","ice2","iceInfo"].includes(tabName)) 
		document.getElementById("iceTabs").style.display = "block";	


	



	updateDisplays()
	
	// nature deselect
	pickSeed(0);
	selectPlant(0);
	
	// dream deselect
	selectedDMDream = 0;
	selectedDMSpell = 0;
}


// do
var saveFile = localStorage.getItem("FAEsave") // get save from storage
loadGame(saveFile); // load save
initialOpen() // 1 - load save

function refreshDispStuff() {
	updateFSDisps();
	updateDSDisp();
	hideDreams();
	showDreams(getMaxDream());
	updateCosts();

	resizeGarden();
	reDispSeeds();
	updateBPText();
	updateNSDisps();
	
	document.getElementById("ns1s").style.display = "none";
	document.getElementById("ns1s2").style.display = "none";
	checkNS1Unlocked();
	
	checkGUpgsUnlocked();
	dispGUpgrades();
	
	dispIUpgrades();

	updateISDisps();
	
	document.getElementById("is1s").style.display = "none";
	document.getElementById("is1s2").style.display = "none";
	checkIS1Unlocked();
	
	iceTrialDispRefresh();
}

function initialOpen() {
	rMagicGain = getMagicGain();
	faeEGain = getFaeEGain();
	updateDisplays();


	lastTime = new Date().getTime() // initial time
	goTab("elements")
	updateTickInterval();
	updateAutoInterval();


	if(game.upgrades.includes("iUpg6")) {
		freeNS1 = getIUpgMult(6);
		freeFS2 = getIUpgMult(6);
	}	
	refreshDispStuff();
	
	// i may eventually add a nature secondary spell? then change this
	document.getElementById("ns2s").style.display = "none";
	document.getElementById("ns2s2").style.display = "none";

	// i may eventually add an ice secondary spell? then change this
	document.getElementById("is2s").style.display = "none";
	document.getElementById("is2s2").style.display = "none";
	

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