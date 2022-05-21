// Timothy Ross
game = {
	fe: 0, // fae energy
	fs1: 0, // fae primary spell
}
function genFE() { 
  game.fe = game.fe + game.fs1;
  update();
}

function castFS1() { 
  game.fs1 = game.fs1 + 1;
  update();
}

function update() {
	document.getElementById('fe').innerHTML = game.fe;
	document.getElementById('fs1').innerHTML = game.fs1;
}