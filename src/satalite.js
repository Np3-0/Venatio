import * as THREE from "three";

export default function satalite(data){
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