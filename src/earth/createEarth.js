import * as THREE from "three";
import clouds from "./clouds";
import nightTimeEarth from "./nightTimeEarth";
import atmosphericGlow from "./atmosphereGlow";

export default function createEarth(earthRadius, lightDirection, camera){
    const dayTimeTexture = '/assets/dayTimeEarth.jpg';
    const nightTimeTexture = '/assets/nightTimeEarth.jpg';
    const earthGrouping = new THREE.Group();

    const geometry = new THREE.SphereGeometry(earthRadius, 96, 240);

    const nightEarth = nightTimeEarth(geometry, dayTimeTexture, nightTimeTexture, camera, lightDirection);
    earthGrouping.add(nightEarth);

    const cloudsMesh = clouds(geometry);
    earthGrouping.add(cloudsMesh);

    //atmospheric glow
    const atmoSphereMaterial = atmosphericGlow();
    const atmoSphere = new THREE.Mesh(geometry, atmoSphereMaterial);
    earthGrouping.add(atmoSphere);
    atmoSphere.scale.setScalar(1.01);

    return earthGrouping;
}