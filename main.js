import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import starBackground from "./src/starBackground";
import atmosphericGlow from "./src/atmosphereGlow";

function main(){
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    //Set strings for day and night
    const dayTimeTexture = '/assets/dayTimeEarth.jpg';
    const nightTimeTexture = '/assets/nightTimeEarth.jpg';

    //parameters are: fov, aspect, near, and far
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 10, -1);
    camera.position.z = 12500; //camera defaults to looking down -z axis and y axis up

    //scene graph (where we draw stuff)
    const scene = new THREE.Scene();

    //sets the 3d space of the sphere
    const geometry = new THREE.SphereGeometry(6371.0088, 96, 240);
    
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(dayTimeTexture), 
    });

    //creating this group prevents clipping between the two textures for day/night cycle
    const earthGrouping = new THREE.Group();
    earthGrouping.rotateZ(-23.4 * Math.PI/180);
    scene.add(earthGrouping);

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 0;

    //add parts of the sphere to the earth group, instead of the scene
    earthGrouping.add(sphere);
    
    //blending lets the night texture transition to/from day, without clipping
    const lightsMat = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(nightTimeTexture),
        blending: THREE.AdditiveBlending,
    });
    
    const lightMesh = new THREE.Mesh(geometry, lightsMat)
    earthGrouping.add(lightMesh);

    //adds stars to sky
    const stars = starBackground({starNums: 20000});
    scene.add(stars);

    //atmospheric glow
    const atmoSphereMaterial = atmosphericGlow();
    const atmoSphere = new THREE.Mesh(geometry, atmoSphereMaterial);
    earthGrouping.add(atmoSphere);
    atmoSphere.scale.setScalar(1.02);

    //sunlight, hopefully works better now
    const sunlight = new THREE.DirectionalLight(0xFFFFFF);
    scene.add(sunlight);
    sunlight.position.set(-3.5,0.5,1.5)

    // Add OrbitControls
    const controls = new OrbitControls(camera, canvas);
    //added zoom params, but better.
    controls.minDistance = 7500;
    controls.maxDistance = 250000;
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
        sphere.rotateY(0.001); //approx 0.05 degrees
        lightMesh.rotateY(0.001);
        atmoSphere.rotateY(0.001);
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    //rerenders
    requestAnimationFrame(render);
}

main();
