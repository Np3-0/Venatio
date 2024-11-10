import * as THREE from 'three';
import atmosphereVertexShader from '../shaders/earth/atmosphere/atmosphereVertexShader';
import atmosphereFragmentShader from '../shaders/earth/atmosphere/atmosphereFragmentShader';

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

    const atmoSphereMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
    });
    return atmoSphereMaterial;
}