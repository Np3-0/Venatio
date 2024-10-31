import * as THREE from 'three';

export default function flightPathClass() {
	this.binarySearchFloor = function(el, compare_fn) {
		let m = 0;
		let n = this.arr.length - 1;
		while (m <= n) {
			let k = (n + m) >> 1;
			let cmp = compare_fn(el, arr[k]);
			if (cmp > 0) {
				m = k + 1;
			} else if (cmp < 0) {
				n = k - 1;
			} else {
				return k;
			}
		}
		return m-1;
	}
	
	this.compareNumber = function(a, b) { return a - b; }
	
	this.dataWeightedAverage = function(time) { return -1; }
	
	this.dataWeightedAverageLoaded = function(time) {
		var lowerTimeIndex = this.binarySearchFloor(this.arr[0], time, compareNumber);
		var upperTimeIndex = lowerTimeIndex + 1;
	
		if (upperTimeIndex == this.arr[0].length || lowerTimeIndex < 0) {
			return -1;
		}
	
		var lowerTime = this.arr[0][lowerTimeIndex];
		var upperTime = this.arr[0][upperTimeIndex];
	
		var clampTimeDelta = upperTime - lowerTime;
		var realTimeDelta = time - lowerTime;
	
		var weight = realTimeDelta / clampTimeDelta;
	
		var output = [];
		for (let i = 0; i < this.arr.length; i++) {
			output.push(this.arr[i][lowerTimeIndex] * (1 - weight) + this.arr[i][upperTimeIndex] * weight);
		}
	
		return output;
	}
	
	this.flightPathData = function() {
		const coords = [];
		for (let i = 0; i < this.arr.length; i++){
		    coords.push(this.arr[1][i], this.arr[2][i], this.arr[3][i]);
		}
		
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));
		const material = new THREE.PointsMaterial({ 
		    color: 0x00FF00,
		    size: 100,
		});
		const points = new THREE.Points(geometry, material);
	
		return points;
	}

	this.arr, this.key, this.points, this.geometry, this.material;
	this.promise = fetch('data/flightpath.csv').then(response => {
		return response.text(); // Extract the text from the response
	}).then(text => {
		let data = text.split("\n");
		this.coords = [];
		this.key = data[0].split(",");
		this.arr = [...Array(this.key.length)].map(e => []);
		for (let i = 1; i < data.length-1; i++) {
			let line = data[i].split(",");
			for (let j = 0; j < this.key.length; j++) {
				this.arr[j].push(parseFloat(line[j]));
			}
			this.coords.push(line[1], line[2], line[3]);
		}
		this.geometry = new THREE.BufferGeometry();
		console.log(this.coords);
		this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.coords, 3));
		this.material = new THREE.PointsMaterial({ 
			color: 0x00FF00,
			size: 100,
		});
		this.points = new THREE.Points(this.geometry, this.material);
		this.dataWeightedAverage = this.dataWeightedAverageLoaded;
	});
}
