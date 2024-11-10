import * as THREE from "three";
import moonVertexShader from "./shaders/moon/moonVertexShader";
import moonFragmentShader from "./shaders/moon/moonFragmentShader";

export default function createMoon(lightDirection) {
    const moonTexture = "./assets/moonTexture.jpg";
    const moonGeometry = new THREE.SphereGeometry(1737.4, 96, 240);
    const moonMaterial = new THREE.ShaderMaterial({
        uniforms: {
            moonTexture: { value: new THREE.TextureLoader().load(moonTexture) },
            lightDirection: { value: lightDirection },
        },
        vertexShader: moonVertexShader,
        fragmentShader: moonFragmentShader,
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);

    moon.rotateZ(1.5 * Math.PI / 180);
    return moon;
}