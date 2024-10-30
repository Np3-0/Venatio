import * as THREE from 'three';

export default function flightPathData(){
    const flightData = [
        {
            x: 3690,
            y: 4220,
            z: 3030,
        },
        {
            x: 2320,
            y: 4870,
            z: 3700,
        },
        {
            x: 1400,
            y: 5070,
            z: 4010,
        },
        {
            x: 932,
            y: 5140,
            z: 4130,
        },
        {
            x: 457,
            y: 5180,
            z: 4240,
        },
        {
            x: -20,
            y: 5200,
            z: 4320,
        },
        {
            x: -497,
            y: 5190,
            z: 4380,
        },
        {
            x: -972,
            y: 5160,
            z: 4430,
        },
        {
            x: -1440,
            y: 5100,
            z: 4450,
        },
        {
            x: -1910,
            y: 5030,
            z: 4460,
        },
    ]
    
    const coords = [];
    for (let i = 0; i < flightData.length; i++){
        coords.push(flightData[i].x, flightData[i].y, flightData[i].z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));
    const material = new THREE.PointsMaterial({ 
        color: 0x00FF00,
        size: 100,
    });
    const points = new THREE.Points(geometry, material);
    
    return points;
}