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
import atmosphericGlow from "./src/atmosphereGlow";
import flightPathClass from "./data/flightpathdata";

let camera;
let earthGrouping;
let controls;
let rocketSpeedMultiplier = 1;

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const flightPathObject = new flightPathClass();

//Set strings for day and night
const dayTimeTexture = '/assets/dayTimeEarth.jpg';
const nightTimeTexture = '/assets/nightTimeEarth.jpg';

//parameters are: fov, aspect, near, and far
camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 10, -1);
camera.position.x = 12500; //camera defaults to looking down -z axis and y axis up

//scene graph (where we draw stuff)
const scene = new THREE.Scene();
const earthRadius = 6371.0088;
//sets the 3d space of the sphere
const geometry = new THREE.SphereGeometry(earthRadius, 96, 240);

var material = new THREE.MeshPhongMaterial({
	map: new THREE.TextureLoader().load(dayTimeTexture),
});

//creating this group prevents clipping between the two textures for day/night cycle
earthGrouping = new THREE.Group();
// earthGrouping.rotateZ(-24.4 * Math.PI/180);
scene.add(earthGrouping);

//const sphere = new THREE.Mesh(geometry, material);
//sphere.position.set(0, 0, 0);

const lightDirection = new THREE.Vector3(-1000000, 0, 0).normalize();

//add parts of the sphere to the earth group, instead of the scene
//earthGrouping.add(sphere);

// vec3(directionofcamera-directionoflight)

//values needed for the shading: texture and where the light is from
const dayTexture = new THREE.TextureLoader().load(dayTimeTexture);
const nightTexture = new THREE.TextureLoader().load(nightTimeTexture);
const earthLightDirection = lightDirection.clone().applyQuaternion(camera.quaternion.clone().invert()).normalize();
//changed to shaderMaterial for the shading
const nightShader = new THREE.ShaderMaterial({
	//uniforms are just the data that the shader uses we defined earlier
	uniforms: {
		dayTexture: { value: dayTexture },
		nightTexture: { value: nightTexture },
		lightDirection: { value: earthLightDirection },
		resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
	},
	vertexShader: document.getElementById("earthVertexShader").textContent,
	fragmentShader: document.getElementById("earthFragmentShader").textContent,
	//transparent: true,
	blending: THREE.NormalBlending,
});

const lightMesh = new THREE.Mesh(geometry, nightShader);
earthGrouping.add(lightMesh);

//i like clouds :)
const cloudsMat = new THREE.MeshStandardMaterial({
	//add the texture (Loader.load did NOT work)
	map: new THREE.TextureLoader().load("/assets/clouds.jpg"),
	//below is your brightness. i dunno why 3js makes it color
	color: new THREE.Color(0.1, 0.1, 0.1),
	// TRANSPARENCY BREAKS CLOUDS!!! DONT ENABLE
	// transparent: true,
	// opacity: 0.8,
	blending: THREE.AdditiveBlending,
});

//add that into the earth group for easy rotation
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGrouping.add(cloudsMesh);

//adds stars to sky
const stars = starBackground({ starNums: 10000 });
scene.add(stars);



//atmospheric glow
const atmoSphereMaterial = atmosphericGlow();
const atmoSphere = new THREE.Mesh(geometry, atmoSphereMaterial);
earthGrouping.add(atmoSphere);
atmoSphere.scale.setScalar(1.01);

//sunlight, hopefully works better now
const sunlight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(sunlight);
//MOON TiME!!!!

//texture
const moonTexture = "./assets/moonTexture.jpg";
const moonGeometry = new THREE.SphereGeometry(1737.4, 96, 240);
const moonMaterial = new THREE.ShaderMaterial({
	uniforms: {
		moonTexture: { value: new THREE.TextureLoader().load(moonTexture) },
		lightDirection: { value: new THREE.Vector3(-1, 0, 0).normalize() },
	},
	vertexShader: document.getElementById("moonVertexShader").textContent,
	fragmentShader: document.getElementById("moonFragmentShader").textContent,
})

const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);
moon.rotateZ(1.5 * Math.PI / 180);
moon.position.set(-377000, -129000, -62500);

const sataliteGeometry = new THREE.SphereGeometry(100, 96, 240);
const sataliteMat = new THREE.MeshBasicMaterial({
	color: 0x00FF00,
});

const satalite = new THREE.Mesh(sataliteGeometry, sataliteMat);
scene.add(satalite);
earthGrouping.add(satalite);
satalite.position.x = earthRadius + 50;
//satalite.rotateZ(-23.4 * Math.PI/180);

//rocket time yayayay yasyayayay yay
const rocketGeometry = new THREE.ConeGeometry(300, 1000, 32);
const rocketMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);
scene.add(rocket);


const flightPath = flightPathObject.promise.finally(async () => { 
	scene.add(flightPathObject.points);
	console.log(flightPathObject.arr);
});



// Add OrbitControls
controls = new OrbitControls(camera, canvas);
//added zoom params, but better.
controls.minDistance = 10000;
controls.maxDistance = 500000;


//turns out we have to make our own panning!!!!!!
const panningLimit = 50000;
//catches any change
controls.addEventListener("change", () => {
	//gets camera pos
	const cameraOffset = controls.target.clone().sub(camera.position);
	//clamps x/y pan to the negative and pos versions of the limit
	//controls.target.clampScalar(-panningLimit, panningLimit);
	//sets the camera position to the target minus the offset
	camera.position.copy(controls.target).sub(cameraOffset);
});
controls.update();

//render function without rotation
const startTime = Date.now();
function render() {
	
	let rocketData = flightPathObject.dataWeightedAverage((Date.now() - startTime) * rocketSpeedMultiplier/100);
	rocket.position.set(rocketData[1], rocketData[2], rocketData[3]);
	rocket.quaternion.setFromUnitVectors(new THREE.Vector3(rocketData[4], rocketData[5], rocketData[6]), new THREE.Vector3(0,0,0));
	//console.log(rocketData);
	//this number gives a decent constant rotate, I dont know why. Maybe add a way to disable this in app?
	// its time we make the rotation a FLOAT!!!! that way we dont need to change like 15 values
	let earthRotation = 7.29 * Math.pow(10, -5);
	let cloudRotation = 1.5 * (7.29 * Math.pow(10, -5));
	// earthGrouping.rotateY(earthRotation);
	// sphere.rotateY(earthRotation); //approx 0.05 degrees
	// lightMesh.rotateY(earthRotation);
	// atmoSphere.rotateY(earthRotation);
	// cloudsMesh.rotateY(cloudRotation);


	const worldLightDir = new THREE.Vector3(-1, 0, 0);
	moon.updateMatrixWorld();
	moonMaterial.uniforms.lightDirection.value.set(-1, 0, 0).normalize();

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
//object with name of button as object, and camerapos and targetpos as arrays
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

document.querySelector("#rocketInput").addEventListener("change", (e) => {
	rocketSpeedMultiplier = e.target.value/10;
	console.log(rocketSpeedMultiplier);
});
