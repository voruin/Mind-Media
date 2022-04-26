// import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
// import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

let camera3D, scene, renderer, cube, ball;
let dir = 0.01;

let directionalLight;

let mixer;

const clock = new THREE.Clock();
var in_front_of_you;
let isWolfExisting = false;

const URL = "https://teachablemachine.withgoogle.com/models/WZo31RBy8/";
let model, webcam, ctx, labelContainer, maxPredictions;


init3D();

async function init3D() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    // Convenience function to setup a webcam
    const size = 200;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);
    await predict();



    scene = new THREE.Scene();
    camera3D = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1200);

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    document.body.appendChild(renderer.domElement);

    var geometryFront = new THREE.BoxGeometry(1, 1, 1);
    var materialFront = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    in_front_of_you = new THREE.Mesh(geometryFront, materialFront);
    camera3D.add(in_front_of_you); // then add in front of the camera so it follow it
    in_front_of_you.position.set(0, 0, -10);

    // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

				const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 200, 0 );
				scene.add( hemiLight );

				const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( 0, 200, 100 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.top = 180;
				dirLight.shadow.camera.bottom = - 100;
				dirLight.shadow.camera.left = - 120;
				dirLight.shadow.camera.right = 120;
				scene.add( dirLight );

//add a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

//

directionalLight = new THREE.DirectionalLight(0xfcfcfc, 2);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

let light = new THREE.PointLight(0xfcfcfc, 1);
light.position.set(0, 300, 500);
scene.add(light)

let light2 = new THREE.PointLight(0xfcfcfc, 1);
light2.position.set(500, 100, 0);
scene.add(light2)

let light3 = new THREE.AmbientLight(0xfcfcfc, 2.5);
light3.position.set(0, -50, 0);
scene.add(light3)

let light4 = new THREE.PointLight(0xfcfcfc, 1);
light4.position.set(100, -100, 0);
scene.add(light4);

// const light = new THREE.AmbientLight( 0x404040 ); // soft white light
// scene.add( light );

   let bgGeometery = new THREE.SphereGeometry(1000, 60, 40);
   // let bgGeometery = new THREE.CylinderGeometry(725, 725, 1000, 10, 10, true)
    bgGeometery.scale(-1, 1, 1);
    // has to be power of 2 like (4096 x 2048) or(8192x4096).  i think it goes upside down because texture is not right size
    let panotexture = new THREE.TextureLoader().load("sky_09.png");
    // var material = new THREE.MeshBasicMaterial({ map: panotexture, transparent: true,   alphaTest: 0.02,opacity: 0.3});
    let backMaterial = new THREE.MeshBasicMaterial({ map: panotexture });

    let back = new THREE.Mesh(bgGeometery, backMaterial);
    scene.add(back);

/////
// const geometry2 = new THREE.SphereGeometry(0.7,40,40);
// let texture= new THREE.TextureLoader().load("TEX01.jpg");
// let tMaterial = new THREE.MeshBasicMaterial({ map: texture });

// ball = new THREE.Mesh(geometry2, tMaterial);

// scene.add(ball);

/////



    moveCameraWithMouse();

    camera3D.position.z = 5;


// ground
// const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
// mesh.rotation.x = - Math.PI / 2;
// mesh.receiveShadow = true;
// scene.add( mesh );

// const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
// grid.material.opacity = 0.2;
// grid.material.transparent = true;
// scene.add( grid );

// const loader = new THREE.GLTFLoader();
// loader.load('rabbit_bashful.glb', function(gltf){
//     // gltf.scene.children[0].position.set(10, 10, 1)
//     // gltf.scale.set(0.07,0.07,0.07);
//     // gltf.position.set(-25, -15, 0)
//     //gltf.rotation.y = Math.PI/2;

//     rabbit = gltf.scene;  // sword 3D object is loaded
//     // rabbit.scale.set(2, 2, 2);
//     rabbit.rotation.y = Math.PI/2;
//     rabbit.position.y = -1;
//     gltf.scene.traverse(c => {
//         c.castShadow=true;
//     })

//     mixer = new THREE.AnimationMixer(gltf.scene)

//     const animationAction = mixer.clipAction( gltf.animations[ 0 ] )
//     //     // animationActions.push(animationAction)
//     //     // animationsFolder.add(animations, 'default')
//     //     // activeAction = animationActions[0]

//         animationAction.play();



//     scene.add(gltf.scene);

//     // gltf.animations; // Array<THREE.AnimationClip>
// 	// 	gltf.scene; // THREE.Group
// 	// 	gltf.scenes; // Array<THREE.Group>
// 	// 	gltf.cameras; // Array<THREE.Camera>
// 	// 	gltf.asset; // Object

// },
// // called while loading is progressing
// function ( xhr ) {

//     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// },
// // called when loading has errors
// function ( error ) {

//     console.log( 'An error happened' );

// }

// );


    // const fbxLoader = new THREE.FBXLoader()
    // fbxLoader.load(
    //     'rabbit.fbx',
    //     (object) => {


    //         mixer = new THREE.AnimationMixer( object );

    //         const action = mixer.clipAction( object.animations[ 0 ] );
    //         action.play();

    //         object.traverse( function ( child ) {

    //             if ( child.isMesh ) {

    //                 child.castShadow = true;
    //                 child.receiveShadow = true;

    //             }

    //         } );
    //         // object.traverse(function (child) {
    //         //     if ((child as THREE.Mesh).isMesh) {
    //         //         // (child as THREE.Mesh).material = material
    //         //         if ((child as THREE.Mesh).material) {
    //         //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
    //         //         }
    //         //     }
    //         // })
    //         // object.scale.set(.01, .01, .01)
    //         object.scale.set(0.07,0.07,0.07);
    //         object.position.set(-25, -15, 0)
    //         // object.rotation.y = Math.PI/2;
    //         scene.add(object)
    //     },
    //     (xhr) => {
    //         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    //     },
    //     (error) => {
    //         console.log(error)
    //     }
    // )


    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.target.set( 0, 100, 0 );
    // controls.update();


    animate();
}

function animate() {
    requestAnimationFrame(animate);
    // cube.scale.x += dir;
    // cube.scale.y += dir;
    // cube.scale.z += dir;
    // if (cube.scale.x > 4 || cube.scale.x < -4) {
    //     dir = -dir;
    // }

    const delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );

    renderer.render(scene, camera3D);
    // stats.update();
}



/////MOUSE STUFF

var onMouseDownMouseX = 0, onMouseDownMouseY = 0;
var onPointerDownPointerX = 0, onPointerDownPointerY = 0;
var lon = -90, onMouseDownLon = 0;
var lat = 0, onMouseDownLat = 0;
var isUserInteracting = false;


function moveCameraWithMouse() {
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('wheel', onDocumentMouseWheel, false);
    window.addEventListener('resize', onWindowResize, false);
    camera3D.target = new THREE.Vector3(0, 0, 0);
}

function onDocumentKeyDown(event) {
    //if (event.key == " ") {
    //in case you want to track key presses
    //}
}

function onDocumentMouseDown(event) {
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
    isUserInteracting = true;
}

function onDocumentMouseMove(event) {
    if (isUserInteracting) {
        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
        computeCameraOrientation();
    }
}

function onDocumentMouseUp(event) {
    isUserInteracting = false;
}

function onDocumentMouseWheel(event) {
    camera3D.fov += event.deltaY * 0.05;
    camera3D.updateProjectionMatrix();
}

function computeCameraOrientation() {
    lat = Math.max(- 30, Math.min(30, lat));  //restrict movement
    let phi = THREE.Math.degToRad(90 - lat);  //restrict movement
    let theta = THREE.Math.degToRad(lon);
    camera3D.target.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera3D.target.y = 100 * Math.cos(phi);
    camera3D.target.z = 100 * Math.sin(phi) * Math.sin(theta);
    camera3D.lookAt(camera3D.target);
}


function onWindowResize() {
    camera3D.aspect = window.innerWidth / window.innerHeight;
    camera3D.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log('Resized');
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    // await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);
    const maxClass = prediction.reduce((prev, current) =>
    prev.probability > current.probability ? prev : current
  );

    if (maxClass.className === "wolf" && maxClass.probability ===1) {
        outByte = 1;

        const loader = new THREE.GLTFLoader();
loader.load('wolf.glb', function(gltf){

    wolf = gltf.scene;  // 3D object is loaded

    let front = getCoordsInFrontOfCamera();
    wolf.position.set(front.x, front.y, front.z);

    wolf.rotation.y = 2*Math.PI/3;
    // rabbit.position.y = -1;
    wolf.traverse(c => {
        c.castShadow=true;
    })

    mixer = new THREE.AnimationMixer(gltf.scene)

    const animationAction = mixer.clipAction( gltf.animations[ 0 ] )
        animationAction.play();
    scene.add(gltf.scene);
},
// called while loading is progressing
function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

},
// called when loading has errors
function ( error ) {

    console.log( 'An error happened' );

}

);

        isWolfExisting = true;
        console.log("wolf");


      } else if (maxClass.className === "rabbit" && maxClass.probability >=0.95) {
        outByte = 2;
        console.log("rabbit");
        let rabbitAnimation;

        const loader = new THREE.GLTFLoader();
        if (isWolfExisting) {
          rabbitAnimation= 'rabbit_run.glb';
        } else {rabbitAnimation= 'rabbit_bashful.glb';}

loader.load(rabbitAnimation, function(gltf){

    rabbit = gltf.scene;  // 3D object is loaded
    //  rabbit.scale.set(2, 2, 2);


    let front = getCoordsInFrontOfCamera();
    rabbit.position.set(front.x, front.y, front.z);

    rabbit.rotation.y = Math.PI/2;
    // rabbit.position.y = -1;
    rabbit.traverse(c => {
        c.castShadow=true;
    })

    mixer = new THREE.AnimationMixer(gltf.scene)

    const animationAction = mixer.clipAction( gltf.animations[ 0 ] )
        animationAction.play();
    scene.add(gltf.scene);
},
// called while loading is progressing
function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

},
// called when loading has errors
function ( error ) {

    console.log( 'An error happened' );

}

);
      } else {
        outByte = 0;
        console.log("what?");
        }

    // finally draw the poses
    // drawPose(pose);
    setTimeout(() => predict(), 3000);
}

//convenience function for getting coordinates
function getCoordsInFrontOfCamera() {
    const posInWorld = new THREE.Vector3();
    in_front_of_you.getWorldPosition(posInWorld);
    return posInWorld;
}