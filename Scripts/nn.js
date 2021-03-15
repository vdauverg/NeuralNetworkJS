// function	sigDer(f, x) {
// 	return f(x) * (1 - f(x));
// }

// class synapse {
// 	constructor(src, dst) {
// 		this.weight = Math.random();
// 		this.src = src;
// 		this.dst = dst;
// 	}

// 	activate() {
// 		this.dst.value += this.src.value * this.weight;
// 	}
// }

// class Neuron {
// 	constructor(activation) {
// 		this.value = 0;
// 		this.synapses = [];
// 		this.activation = activation;
// 	}

// 	initSynapses(next) {
// 		for (let i = 0; i < next.length; i++)
// 			this.synapses.push(new synapse(this, next[i]));
// 	}

// 	activate(bias) {
// 		this.value = this.activation(this.value + bias);
// 		this.synapses.forEach(s => {
// 			s.activate();
// 		});
// 	}

// 	cost(output) {
// 		return this.value - output;
// 	}
// }

// class Layer {
// 	constructor(width, activation) {
// 		this.width = width;
// 		this.neurons = [];
// 		this.bias = Math.random();
// 		this.next = null;
// 		for (let i = 0; i < width; i++)
// 			this.neurons.push(new Neuron(activation));
// 	}

// 	initSynapses(next) {
// 		this.next = next;
// 		this.neurons.forEach(n => {
// 			n.initSynapses(next.neurons);
// 		});
// 	}

// 	activate() {
// 		this.neurons.forEach(n => {
// 			n.activate(this.bias);
// 		});
// 	}
// }

// class NN {
// 	constructor(input, output, depth, width, activation) {
// 		this.depth = depth;
// 		this.width = width;
// 		this.activation = activation;

// 		this.layers = [];
// 		this.layers.push(new Layer(input, activation));
// 		for (let i = 0; i < depth - 1; i++) {
// 			this.layers.push(new Layer(width, activation));
// 		}
// 		this.layers.push(new Layer(output, activation));

// 		for (let i = 0; i < this.depth; i++)
// 			this.layers[i].initSynapses(this.layers[i + 1]);

// 		this.in = this.layers[0];
// 		this.out = this.layers[this.depth];
// 	}

// 	runEpoch(input) {
// 		for (let i = 0; i < input.length; i++)
// 			this.in.neurons[i].value = input[i];
		
// 		for (let i = 0; i <= this.depth; i++) {
// 			this.layers[i].activate();
// 		}
// 	}

// 	calcCost(output) {
// 		let cost = 0;
// 		for (let i = 0; i < output.length; i++) {
// 			cost += Math.pow((this.out.neurons[i].value - output[i]), 2);
// 		}

// 		return cost / output.length;
// 	}

// 	backPropagate(output) {
// 		let cost = this.calcCost(output);
// 		console.log(cost);
		
// 		for (let i = 0; i < this.out.width; i++) {
// 			this.out.neurons[i].value *= cost * this.out.neurons[i].cost(output[i]) * sigDer(this.activation, output[i]);
// 		}

// 		for (let i = this.depth - 1; i >= 0; i--) {
// 			this.layers[i].neurons.forEach(n => {
// 				console.log(i);
// 				let m = 0;
// 				n.synapses.forEach(s => {
// 					let c = cost * s.src.cost(s.dst.value) * sigDer(this.activation, s.dst.value);
// 					s.weight *= c;
// 					m += c;
// 				})
// 				n.value *= m;
// 			})
// 		}
// 	}
// }

/**** SYNAPSE CLASS ****/
class Synapse {
	// Inout synapse input and output
	constructor(src, dst) {
		this.src = src;
		this.dst = dst;
 
		this.w = Math.random(); // Weight
		this.b = Math.random(); // Bias
	}

	activate(f) {
		this.dst.value = f(this.src.value * this.w + this.b);
	}
}

/**** NEURON CLASS ****/
class Neuron {
	constructor() {
		this.value = 0;
		this.synapses = [];
	}

	makeSynapses(next) { // Connect synapses together with next layer, given next layer {next}
		next.neurons.forEach(n => {
			this.synapses.push(new Synapse(this, n));
		})
	}

	activate(f) { // Activate synapses, given activation function {f}
		this.synapses.forEach(s => {
			s.activate(f);
		});
	}
}

/**** LAYER CLASS ****/
class Layer {
	// Input layer width
	constructor(width) {
		this.width = width;
		this.neurons = [];

		for (let i = 0; i < width; i++) {
			this.neurons.push(new Neuron());
		}
	}

	makeSynapses(next) { // Connect layer's neurons together with next layer, given next layer {next}
		this.neurons.forEach(n => {
			n.makeSynapses(next);
		});
	}

	activate(f) { // Activate neurons, given activation function {f}
		this.neurons.forEach(n => {
			n.activate(f);
		})
	}
}

/**** NEURAL NETWORK CLASS ****/
class NN {
	// Input activation function
	constructor(activation) {
		this.activation = activation;

		this.depth = -1;
		this.layers = [];
		this.in;
		this.out;
	}
	
	addLayer(width) { // Add a layer to the neural network, given it's width {width}
		this.depth += 1;
		this.layers.push(new Layer(width));
	}

	makeSynapses() { // Connect each layer's neurons together with next layer
		this.in = this.layers[0];
		for(let i = 0; i < this.depth; i++) {
			this.layers[i].makeSynapses(this.layers[i + 1]);
		}
		this.out = this.layers[this.depth];
	}

	feedforward(input) { // Activate the neural network, given input {input}
		for (let i = 0; i < this.in.width; i++)
			this.in.neurons[i].value = input[i];

		this.layers.forEach(l => {
			l.activate(this.activation);
		})
	}

	cost(output) { // Calxulate the cost of the output, using output {output}
		let cost = 0;

		for (let i = 0; i < output.length; i++) {
			cost += Math.pow((this.out.neurons[i].value - output[i]), 2);
		}

		return cost / output.length;
	}

	backpropagate(output) { // Backpropagate the output to adjust weights and biases, using output {output}
		let cost = this.cost(output);

		for (let i = this.depth; i >= 0; i--) {
			this.layers[i]
		}
	}
}