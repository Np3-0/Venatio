//varying means the value is passed in the both the vertex and fragment shader, so a vector3 is passed to the fragment shader
export default `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
        //basically prevents the model from being distorted, when orbitControls are used
        vNormal = normalize(normalMatrix * normal);

        //position of the vertex in the world space (where the earth is)
        vPosition = vec3(modelViewMatrix * vec4(position.xyz, 1.0));
        vUv = uv;
        //gets the final position for the rendering
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
    }
`;