import * as THREE from "three";

export default function satalite(){
    const data = [
        [35.3399, -116.875, 0.951499],
        [-35.3985, 148.982, 0.69202],
        [40.4256, -4.2541, 0.837051],
        [37.9273, -75.475, -0.019736]
    ];
    
    let coords = [];
    const earthRadius = 6378.137;

    for (let i = 0; i < data.length; i++){
        let totalRadius = earthRadius + data[i][2];
        let radLat = data[i][0] * (Math.PI / 180);
        let radLon = data[i][1] * (Math.PI / 180);

        let x = totalRadius * Math.cos(radLat) * Math.cos(radLon);
        let y = totalRadius * Math.cos(radLat) * Math.sin(radLon);
        let z = totalRadius * Math.sin(radLat);
        coords.push([x, y, z]);
    }
    return coords;
}