import * as THREE from "three";

export default function clouds(geometry){
    const cloudsMat = new THREE.MeshStandardMaterial({
        //add the texture (Loader.load did NOT work)
        map: new THREE.TextureLoader().load("/assets/clouds.jpg"),
        color: new THREE.Color(0.1, 0.1, 0.1),
        blending: THREE.AdditiveBlending,
    });
    
    //add that into the earth group for easy rotation
    const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.003);

    return cloudsMesh;
}