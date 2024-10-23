//TO DO:
// - We still need to work on a way to add blender objects in here
// - Does the earth look a little.. cartoony? Maybe make it a little darker? Mano and I were looking at it and it looks blown out.
// - Finish moon lighting, rotation maybe, depends on how the data works.

// 10/15/2024 - I JUST ADDED 16K tEXTURES!! but sadly we cant use it because iphones are so shitty that they cant render it lol. 
// - The textures will still remain in assets though, maybe we can use it one day.
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import starBackground from "./src/starBackground";
import atmosphericGlow from "./src/atmosphereGlow";

let camera;
let earthGrouping;
let controls;
function main(){
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    //Set strings for day and night
    const dayTimeTexture = '/assets/dayTimeEarth.jpg';
    const nightTimeTexture = '/assets/nightTimeEarth.jpg';

    //parameters are: fov, aspect, near, and far
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 10, -1);
    camera.position.z = 12500; //camera defaults to looking down -z axis and y axis up

    //scene graph (where we draw stuff)
    const scene = new THREE.Scene();

    //sets the 3d space of the sphere
    const geometry = new THREE.SphereGeometry(6371.0088, 96, 240);
    
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(dayTimeTexture),
    });

    //creating this group prevents clipping between the two textures for day/night cycle
    earthGrouping = new THREE.Group();
    earthGrouping.rotateZ(-23.4 * Math.PI/180);
    scene.add(earthGrouping);

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(0, 0, 0);

    //add parts of the sphere to the earth group, instead of the scene
    //earthGrouping.add(sphere);
    
    //values needed for the shading: texture and where the light is from
    const dayTexture = new THREE.TextureLoader().load(dayTimeTexture);
    const nightTexture = new THREE.TextureLoader().load(nightTimeTexture);
    const lightDirection = new THREE.Vector3(-1, 0, 0).normalize();
    //changed to shaderMaterial for the shading
    const nightShader = new THREE.ShaderMaterial({
        //uniforms are just the data that the shader uses we defined earlier
        uniforms: {
            dayTexture: {value: dayTexture},
            nightTexture: {value: nightTexture},
            lightDirection: {value: lightDirection},
            resolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        },
        vertexShader: document.getElementById("vertexShader").textContent,
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
    const stars = starBackground( { starNums: 20000 } );
    scene.add(stars);
    
    //atmospheric glow
    const atmoSphereMaterial = atmosphericGlow();
    const atmoSphere = new THREE.Mesh(geometry, atmoSphereMaterial);
    earthGrouping.add(atmoSphere);
    atmoSphere.scale.setScalar(1.01);

    //sunlight, hopefully works better now
    const sunlight = new THREE.DirectionalLight(0xFFFFFF);
    scene.add(sunlight);
    sunlight.position.set(-3.5,0.5,1.5)

    const sunlight2 = new THREE.DirectionalLight(0xFFFFFF);
    scene.add(sunlight2);
    sunlight2.position.set(3.5,-0.5,-1.5);

    //MOON TiME!!!!

    //texture
    const moonTexture = "./assets/moonTexture.jpg";
    const moonGeometry = new THREE.SphereGeometry(1737.4, 96, 240);
    
    const moonMaterial = new THREE.ShaderMaterial({
        uniforms: {
            moonTexture: { value: new THREE.TextureLoader().load(moonTexture) },
            lightDirection: { value: new THREE.Vector3(-1,0,0).normalize() },
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("moonFragmentShader").textContent,
    })

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);
    moon.rotateZ(1.5 * Math.PI/180);
    moon.position.set(38440, 0, 0);

    //for some reason all these lights are needed to not have random shadows on the moon, this will change when we add dark side of moon.


    // Add OrbitControls
    controls = new OrbitControls(camera, canvas);
    //added zoom params, but better.
    controls.minDistance = 10000;
    controls.maxDistance = 250000;

    //turns out we have to make our own panning!!!!!!
    //our singular panning limit 
    const panningLimit = 50000;
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

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }
    //render function without rotation
    function render(time){
        //time to seconds
        time += 0.001;
                
        //this number gives a decent constant rotate, I dont know why. Maybe add a way to disable this in app?
        //its time we make the rotation a FLOAT!!!! that way we dont need to change like 15 values
        let earthRotation = 0.001;
        let cloudRotation = 0.0015;
        sphere.rotateY(earthRotation); //approx 0.05 degrees
        lightMesh.rotateY(earthRotation);
        atmoSphere.rotateY(earthRotation);
        cloudsMesh.rotateY(cloudRotation);
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();

//gets the button being clicked and sets the camera/target better than doing this crap 4 times
//object with name of button as object, and camerapos and targetpos as arrays
const buttonInfo = {
    earthButton: {
        cameraPos: [0, 0, 12500],
        targetPos: [0, 0, 0],
    },
    moonButton: {
        cameraPos: [38440, 0, 12500],
        targetPos: [38440, 0, 0],
    },
}

document.querySelectorAll(".button-container button").forEach(button => button.addEventListener("click", () => {
    const { cameraPos, targetPos } = buttonInfo[button.id];
    camera.position.set(...cameraPos);
    controls.target.set(...targetPos); // Reset the target of the controls
    controls.update();
}));