import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function main(){
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    //all passed in to create camera
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 10);
    camera.position.z = 2; //camera defaults to looking down -z axis and y axis up

    //scene graph (where we draw stuff)
    const scene = new THREE.Scene();

    //sets the 3d space of the sphere
    const geometry = new THREE.SphereGeometry(1, 48, 24);
    const material = new THREE.MeshPhongMaterial({color: 0x005477});
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 0;
    scene.add(sphere);

    //sets directional light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
    directionalLight.position.set(-1, 2, 4);
    scene.add(directionalLight);

    //sets ambient light
    const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    // Add OrbitControls
    const controls = new OrbitControls(camera, canvas);
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
        time *= 0.001;
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