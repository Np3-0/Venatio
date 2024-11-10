import * as THREE from "three";

export default function nightTimeEarth(geometry, dayTimeTexture, nightTimeTexture, camera, lightDirection) {
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
        blending: THREE.NormalBlending,
    });

    const lightMesh = new THREE.Mesh(geometry, nightShader);
    return lightMesh;
}