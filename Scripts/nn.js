function	sigDer(f, x) {
	return f(x) * (1 - f(x));
}

class synapse {
	constructor(src, dst) {
		this.weight = Math.random();
		this.src = src;
		this.dst = dst;
	}

	activate() {
		this.dst.value += this.src.value * this.weight;
	}
}

class Neuron {
	constructor(activation) {
		this.value = 0;
		this.synapses = [];
		this.activation = activation;
	}

	initSynapses(next) {
		for (let i = 0; i < next.length; i++)
			this.synapses.push(new synapse(this, next[i]));
	}

	activate(bias) {
		this.value = this.activation(this.value + bias);
		this.synapses.forEach(s => {
			s.activate();
		});
	}

	cost(output) {
		return this.value - output;
	}
}

class Layer {
	constructor(width, activation) {
		this.width = width;
		this.neurons = [];
		this.bias = Math.random();
		this.next = null;
		for (let i = 0; i < width; i++)
			this.neurons.push(new Neuron(activation));
	}

	initSynapses(next) {
		this.next = next;
		this.neurons.forEach(n => {
			n.initSynapses(next);
		});
	}

	activate() {
		this.neurons.forEach(n => {
			n.activate(this.bias);
		});
	}
}

class NN {
	constructor(input, output, depth, width, activation) {
		this.depth = depth;
		this.width = width;
		this.activation = activation;

		this.layers = [];
		this.layers.push(new Layer(input, activation));
		for (let i = 0; i < depth - 1; i++) {
			this.layers.push(new Layer(width, activation));
		}
		this.layers.push(new Layer(output, activation));

		for (let i = 0; i < this.depth; i++)
			this.layers[i].initSynapses(this.layers[i + 1]);

		this.in = this.layers[0];
		this.out = this.layers[this.depth];
	}

	runEpoch(input) {
		for (let i = 0; i < input.length; i++)
			this.in.neurons[i].value = input[i];
		
		for (let i = 0; i <= this.depth; i++) {
			this.layers[i].activate();
		}
	}

	calcCost(output) {
		let cost = 0;
		for (let i = 0; i < output.length; i++) {
			cost += Math.pow((this.out.neurons[i].value - output[i]), 2);
		}

		console.log(cost / output.length);
		return cost / output.length;
	}

	backPropagate(output) {
		let cost = this.calcCost(output);
		
		for (let i = 0; i < this.out.width; i++) {
			this.out.neurons[i].value *= cost * this.out.neurons[i].cost(output[i]) * sigDer(this.activation, output[i]);
		}

		for (let i = this.depth - 2; i >= 0; i--) {
			this.layers[i].neurons.forEach(n => {
				n.value *= n.synapses.forEach(s => {
					let c = cost * s.src.cost(s.dst.value) * sigDer(this.activation, s.dst.value);
					s.weight *= c;
					console.log(c, s.weight);
					return c;
				})
			})
		}
	}
}