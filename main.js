import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 2);
scene.background = new THREE.Color("#121212");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1000, 500);
renderer.setAnimationLoop(animate);
renderer.domElement.id = 'ThreeJS';
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

let model = null;
const loader = new GLTFLoader();
loader.load(
    'model/brainModel.glb',
    (gltf) => {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, -1, 0);
        model.rotation.set(0, THREE.MathUtils.degToRad(-89), 0);
        scene.add(model);
    },
    undefined,
    (error) => console.error(error)
);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 2.6;
controls.maxDistance = 2.6;
controls.enablePan = false;

let isUserInteracting = false;
let scrollPercent = 0;

controls.addEventListener('start', () => {
    isUserInteracting = true;
});
controls.addEventListener('end', () => {
    isUserInteracting = false;
});
var temp = true;
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollPercent = scrollTop / scrollHeight;

    if (scrollTop > 50) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.enabled = false;
        temp = false;
        document.getElementById('ThreeJS').style.position = 'fixed';
        document.getElementById('ThreeJS').style.top = '0';
    } else {
        renderer.setSize(1000, 500);
        controls.enabled = false;
        temp = true;
        document.getElementById('ThreeJS').style.position = 'absolute';
        document.getElementById('ThreeJS').style.top = '110px';
    }
});

const label = document.createElement('div');
label.textContent = "- NeuroBalance Brain Chip";
label.style.position = 'fixed';
label.style.top = '40%';
label.style.left = '55%';
label.style.zIndex = '999999999999';
label.style.color = 'white';
label.style.fontSize = '24px';
label.style.fontWeight = 'bold';
label.style.padding = '10px 20px';
label.style.display = 'none';
document.body.appendChild(label);
const txt = document.createElement('div');
txt.textContent = " - Chemical Sensor";
txt.style.position = 'fixed';
txt.style.top = '25%';
txt.style.left = '80%';
txt.style.zIndex = '999999999999';
txt.style.color = 'white';
txt.style.fontSize = '24px';
txt.style.fontWeight = 'bold';
txt.style.padding = '10px 20px';
txt.style.display = 'none';
document.body.appendChild(txt);
const txt2 = document.createElement('div');
txt2.textContent = "Neurobalance consists of two parts. The first one being strips on the brain that serve to monitor the brain's chemical levels. These strips are placed in various locations around the limbic system of the brain to ensure maximum irregularity detection. The second part which takes the data from the strips and determines if there is an irregularity in the chemical levels in the brain. If one is detected, it will determine the correct chemical release and will then interact with the brain's electrical signals to trigger the release of the proper chemicals. This piece is located in the hypothalamus ";
txt2.style.position = 'fixed';
txt2.style.top = '45%';
txt2.style.left = '56%';
txt2.style.zIndex = '999999999999';
txt2.style.color = 'white';
txt2.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
txt2.style.borderRadius = '10px';
txt2.style.fontSize = '16px';
txt2.style.fontWeight = 'bold';
txt2.style.padding = '10px 20px';
txt2.style.display = 'none';
document.body.appendChild(txt2);

function animate() {
    if (model) {
        if (!isUserInteracting && temp) {
            model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, model.rotation.y + 0.001, -90);
        }

        let targetRotationY;
        if (scrollPercent < 0.33) {
            targetRotationY = -0.2;
        } else {
            targetRotationY = model.rotation.y;
        }

        let targetScale;
        let targetPositionY;
        if (scrollPercent < 0.66) {
            targetScale = 0.5 + scrollPercent;
            targetPositionY = -1 - scrollPercent * 2.25;
        } else {
            targetPositionY = model.position.y;
            targetScale = model.scale.x;
        }

        if (scrollPercent >= 0.66) {
            label.style.display = 'block';
            txt.style.display = 'block';
            txt2.style.display = 'block';
        } else {
            label.style.display = 'none';
            txt.style.display = 'none';
            txt2.style.display = 'none';
        }
        
        model.rotation.y = THREE.MathUtils.lerp(model.rotation.y, targetRotationY, 0.1);
        model.position.y = THREE.MathUtils.lerp(model.position.y, targetPositionY, 0.1);
        const scale = THREE.MathUtils.lerp(model.scale.x, targetScale, 0.1);
        model.scale.set(scale, scale, scale);
    }

    controls.update();
    renderer.render(scene, camera);
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});