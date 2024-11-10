//TO DO:
// - We still need to work on a way to add blender objects in here
// - Does the earth look a little.. cartoony? Maybe make it a little darker? Mano and I were looking at it and it looks blown out.
// - Finish rotation maybe, depends on how the data works.

// 10/15/2024 - I JUST ADDED 16K tEXTURES!! but sadly we cant use it because iphones are so shitty that they cant render it lol. 
// - The textures will still remain in assets though, maybe we can use it one day.
// 11/3/24 - WEBSITE LOADS ON 4GB IMAC!!!! IS THIS A WEBKIT ISSUE OR A IPHONE ISSUE???? GET RYAN ON HERE!!!!
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import starBackground from "./src/starBackground";
import flightPathClass from "./data/flightpathdata";
import satellite from "./src/satellite";
import createEarth from "./src/earth/createEarth";
import createMoon from "./src/createMoon";
import createRocket from "./src/createRocket";

let rocketSpeedMultiplier = 1;

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const flightPathObject = new flightPathClass();

//parameters are: fov, aspect, near, and far
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 10, -1);
camera.position.x = 12500; //camera defaults to looking down -z axis and y axis up

//scene graph (where we draw stuff)
const scene = new THREE.Scene();

const earthRadius = 6378.137;
const lightDirection = new THREE.Vector3(-1000000, 0, 0).normalize();

//creating this group prevents clipping between the two textures for day/night cycle
const earthGrouping = new THREE.Group();
scene.add(earthGrouping);
earthGrouping.rotateZ(-23.4 * Math.PI / 180);

//moved the entire damn earth to a function, be grateful
//THIS IS A GROUP, NOT A MESH. earth.children[0] is the earth, earth.children[1] is the clouds, and earth.children[2] is the atmosphere
const earth = createEarth(earthRadius, lightDirection, camera);
earthGrouping.add(earth);

//adds stars to sky
const stars = starBackground({ starNums: 10000 });
scene.add(stars);

//sunlight, hopefully works better now
const sunlight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(sunlight);

//MOON TiME!!!!
//AND I DID IT FOR THE MOON TOO!!!!
const moon = createMoon(lightDirection);
scene.add(moon);

//satellite 
const baseSatellite = new THREE.SphereGeometry(100, 96, 240);
const baseSatelliteMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const satelliteCoords = satellite();

for (let i = 0; i < satelliteCoords.length; i++) {
	const satellite = new THREE.Mesh(baseSatellite, baseSatelliteMaterial);
	satellite.position.set(satelliteCoords[i][0], satelliteCoords[i][1], satelliteCoords[i][2]);
	earthGrouping.add(satellite);
}

//rocket time yayayay yasyayayay yay
const rocket = createRocket();
scene.add(rocket);

const flightPath = flightPathObject.promise.finally(async () => { 
	scene.add(flightPathObject.points);
});

// Add OrbitControls
const controls = new OrbitControls(camera, canvas);
//added zoom params, but better.
controls.minDistance = 10000;
controls.maxDistance = 500000;

//turns out we have to make our own panning!!!!!!
const panningLimit = 500000;
//catches any change
controls.addEventListener("change", () => {
	//gets camera pos
	const cameraOffset = controls.target.clone().sub(camera.position);
	//clamps x/y pan to the negative and pos versions of the limit
	controls.target.clampScalar(-panningLimit, panningLimit);
	//sets the camera position to the target minus the offset
	camera.position.copy(controls.target).sub(cameraOffset);
});
controls.update();

//render function without rotation
const startTime = Date.now();
function render() {
	let rocketData = flightPathObject.dataWeightedAverage((Date.now() - startTime) * rocketSpeedMultiplier/100);
	rocket.position.set(rocketData[1], rocketData[2], rocketData[3]);
	earthGrouping.position.set(rocketData[8], rocketData[9], rocketData[10]);
	moon.position.set(rocketData[14], rocketData[15], rocketData[16]);
	rocket.quaternion.setFromUnitVectors(new THREE.Vector3(rocketData[4], rocketData[5], rocketData[6]), new THREE.Vector3(0,0,0));
	//this number gives a decent constant rotate, I dont know why. Maybe add a way to disable this in app?
	// its time we make the rotation a FLOAT!!!! that way we dont need to change like 15 values
	let earthRotation = 7.29 * Math.pow(10, -5);
	let cloudRotation = 1.5 * earthRotation;
	//earthGrouping.rotateY(earthRotation);
	//since we return a group, the second child is the clouds
	//earth.children[1].rotateY(cloudRotation);

	moon.updateMatrixWorld();

	const needResize = canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight;
	if (needResize) {
		renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
		camera.aspect = canvas.clientWidth / canvas.clientHeight;
		camera.updateProjectionMatrix();
	}
	controls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
requestAnimationFrame(render);

//gets the button being clicked and sets the camera/target better than doing this crap 4 times
const buttonInfo = {
	earthButton: {
		cameraPos: [0, 0, 12500],
		targetPos: [0, 0, 0],
	},
	moonButton: {
		cameraPos: [-377000, -129000, -62500],
		targetPos: [-377000, -129000, -62500],
	},
}

document.querySelectorAll(".button-container button").forEach(button => button.addEventListener("click", (e) => {
	const { cameraPos, targetPos } = buttonInfo[button.id];
	camera.position.set(...cameraPos);
	controls.target.set(...targetPos); // Reset the target of the controls
	controls.update();
}));
//THIS DOES NOT WORK AT ALL AND I CANT FIX IT CURRENTLY SOMEONE TAKE A GUN AND SHOOT Me
document.querySelector("#rocketInput").addEventListener("change", (e) => {
	rocketSpeedMultiplier = e.target.value/10;
	console.log(rocketSpeedMultiplier);
});