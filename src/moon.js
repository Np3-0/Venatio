import * as THREE from "three";

export default function moon() {
    const moonTexture = "./assets/moonTexture.jpg";
    const moonGeometry = new THREE.SphereGeometry(1737.4, 96, 240);
    const moonMaterial = new THREE.ShaderMaterial({
        uniforms: {
            moonTexture: { value: new THREE.TextureLoader().load(moonTexture) },
            lightDirection: { value: new THREE.Vector3(-1, 0, 0).normalize() },
        },
        vertexShader: document.getElementById("moonVertexShader").textContent,
        fragmentShader: document.getElementById("moonFragmentShader").textContent,
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    moon.rotateZ(1.5 * Math.PI / 180);
    moon.position.set(-377000, -129000, -62500);
    return moon;
}