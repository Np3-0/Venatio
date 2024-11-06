import * as THREE from "three";

//destructured so numStars can be passed if no values is given
export default function starBackground({starNums = 500} = {}){

    const CirclePng = "./assets/circle.png";

    function makeRandomStarPoint(){
        //random value for the radius
        const r = Math.floor(Math.random() * 500000) + 500000 ;
        const randAngleOne = Math.random();

        //gets values for angles of the sphere, and converts to radians
        const theta = 2 * Math.PI * randAngleOne;
        const phi = Math.random() * Math.PI;

        //uses standard formulas to convert from current form (radius, theta, phi) to coords (x, y, z)
        let x = r * Math.sin(phi) * Math.cos(theta);
        let y = r * Math.sin(phi) * Math.sin(theta);
        let z = r * Math.cos(phi);

        //returns position data and radii
        return{
            coords: new THREE.Vector3(x, y, z),
            radius: r,
        }
    }

    //arrays for coords, colors, and other data
    const vertices = [];
    const colors = [];
    const positions = [];

    for (let i = 0; i < starNums; i++){
        //get random point for stars, and destructured data from it
        let point = makeRandomStarPoint();
        const { coords } = point; // destructure coords here
        positions.push(coords);
        const color = new THREE.Color().setHSL(0.6, 0.2, Math.random()); //gets star with random amount of brightness
        //add data to arrays
        vertices.push(coords.x, coords.y, coords.z);
        colors.push(color.r, color.g, color.b);
    }

    //buffer allows data passed in to be stored with a buffer in gpu, to save time
    const geo = new THREE.BufferGeometry();
    //adds all data to the geometry
    geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    //adds texture to stars, with size
    const mat = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        map: new THREE.TextureLoader().load(CirclePng),
    });
    //returns all points
    const points = new THREE.Points(geo, mat);
    return points;
}