let disp = document.getElementById("display");

let nn = new NN(9, 7, 2, 16, (x) => {return Math.E**x / (1 + Math.E**x);});

let input = [1,0,0,1,0,0,1,0,0];
let output = [1,0,0,0,0,0,0];

nn.layers.forEach(l => {
	let layer = document.createElement("div");
	layer.className = "layer";
	console.log(layer);
	disp.appendChild(layer);
	l.neurons.forEach(n => {
		let neuron = document.createElement("div");
		neuron.className = "neuron";
		layer.appendChild(neuron);
	});
})

function display() {
	for (let i = 0; i < nn.depth + 1; i++) {
		for (let j = 0; j < nn.layers[i].neurons.length; j++) {
			disp.childNodes[i].childNodes[j].textContent = nn.layers[i].neurons[j].value.toPrecision(3);
		}
	}
}

display();

function btn_runEpoch() {
	nn.runEpoch(input);
	display();
}

function btn_runBackProp() {
	nn.backPropagate(output);
	display();
}