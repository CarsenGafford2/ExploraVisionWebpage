import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2);
scene.background = new THREE.Color("#121212");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(1000, 500);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

let model = null;

const loader = new GLTFLoader();
loader.load('model/brainModel.glb', function (gltf) {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, -1, 0);
    model.rotation.set(0, -89, 0);
    scene.add(model);
}, undefined, function (error) {
    console.error(error);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;

controls.minDistance = 2.6;
controls.maxDistance = 2.6;

controls.enablePan = false;

let isUserInteracting = false;

// Event listeners for user interaction
controls.addEventListener('start', () => {
    isUserInteracting = true;
});
controls.addEventListener('end', () => {
    isUserInteracting = false;
});

function animate() {
    if (model && !isUserInteracting) {
        model.rotation.y += 0.001; // Adjust rotation speed here
    }

    controls.update();
    renderer.render(scene, camera);
}