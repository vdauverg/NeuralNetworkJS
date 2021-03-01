let disp = document.getElementById("display");

let nn = new NN(9, 7, 2, 16, (a) => {return Math.max(0, a);});

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

function btn_runEpoch() {
	nn.runEpoch(input);
	for (let i = 0; i < nn.depth + 1; i++) {
		for (let j = 0; j < nn.layers[i].neurons.length; j++) {
			disp.childNodes[i].childNodes[j].textContent = nn.layers[i].neurons[j].value.toPrecision(3);
		}
	}
	nn.backPropagate(output);
}