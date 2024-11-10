import * as THREE from "three";

export default function moon(lightDirection) {
    const moonTexture = "./assets/moonTexture.jpg";
    const moonGeometry = new THREE.SphereGeometry(1737.4, 96, 240);
    const moonMaterial = new THREE.ShaderMaterial({
        uniforms: {
            moonTexture: { value: new THREE.TextureLoader().load(moonTexture) },
            lightDirection: { value: lightDirection },
        },
        vertexShader: document.getElementById("moonVertexShader").textContent,
        fragmentShader: document.getElementById("moonFragmentShader").textContent,
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    moon.rotateZ(1.5 * Math.PI / 180);
    return moon;
}