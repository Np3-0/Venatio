import * as THREE from "three";

export default function createRocket() {
    const rocketGeometry = new THREE.ConeGeometry(300, 1000, 32);
    const rocketMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);

    return rocket;
}