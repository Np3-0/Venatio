import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main(){
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    //Set strings for day and night
    const dayTimeTexture = '/assets/dayTimeEarth.jpg';
    const nightTimeTexture = '/assets/nightTimeEarth.jpg';

    //parameters are: fov, aspect, near, and far
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, -1);
    camera.position.z = 10000; //camera defaults to looking down -z axis and y axis up

    //scene graph (where we draw stuff)
    const scene = new THREE.Scene();

    //sets the 3d space of the sphere
    const geometry = new THREE.SphereGeometry(6371.0088, 96, 240);
    
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load(new Date().getHours() >= 6 && new Date().getHours() <= 12 ? dayTimeTexture : nightTimeTexture),
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 0;
    scene.add(sphere);
    sphere.rotateZ(-0.40840704496);

    //sets directional light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
    directionalLight.position.set(-1, 2, 4);
    scene.add(directionalLight);

    //sets ambient light
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    if (new Date().getHours()  >= 6 && new Date().getHours() <= 20){
        scene.add(ambientLight);
    }
    

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

    
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        console.log(controls.minDistance);
        console.log(controls.maxDistance);
        controls.update();
        if (new Date().getHours()  <= 6 || new Date().getHours() >= 20){ 
            directionalLight.position.copy(camera.position);
        }
        //if (camera.position.z < 7737.809374999994) camera.position.z = 7737.809374999994;
        //else if (camera.position.z > 500000) camera.position.z = 500000;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    //rerenders
    requestAnimationFrame(render);
}

main();
