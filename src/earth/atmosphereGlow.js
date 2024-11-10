import * as THREE from 'three';

export default function atmosphericGlow({rimHex=0x57a5ff,  faceHex=0x000000} = {}){
    const uniforms = {
        rimColor: {value: new THREE.Color(rimHex)},
        faceColor: {value: new THREE.Color(faceHex)},
        fresnelBias: {value: 0.1},
        fresnelScale: {value: 1.0},
        fresnelPower: {value: 4.0},
    };
    //applies to vertices
    const vs = `
        uniform float fresnelBias;
        uniform float fresnelScale;
        uniform float fresnelPower;

        varying float vReflectivity;

        void main(){
            vec4 myPos = modelViewMatrix * vec4(position, 1.0);
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vec3 normalWorld = normalize( mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);

            vec3 z = worldPos.xyz - cameraPosition;

            vReflectivity = fresnelBias + fresnelScale * pow(1.0 + dot(normalize(z), normalWorld), fresnelPower);

            gl_Position = projectionMatrix * myPos;
        }
    `;
    //applies to fragments/pixels
    const fs = `
        uniform vec3 rimColor;
        uniform vec3 faceColor;

        varying float vReflectivity;

        void main(){
            float f = clamp(vReflectivity, 0.0, 1.0);
            gl_FragColor = vec4(mix(faceColor, rimColor, f), 1.0);
        }
    `;

    const atmoSphereMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vs,
        fragmentShader: fs,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
    });
    return atmoSphereMaterial;
}