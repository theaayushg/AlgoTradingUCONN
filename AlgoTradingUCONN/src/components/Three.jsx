import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Graph from './Graph';
import user from "../App"
import './Three.css'

const xbound = 100;
const ybound = 100;

const ThreeScene = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(50);

    const keyboardState = {}; // Manage keyboard state outside the function

    const pointlight = new THREE.PointLight(0xffffff,200);
    const moonlight = new THREE.PointLight(0xffffff,100);
    moonlight.position.set(20,10,10);
    pointlight.castShadow=true;

    scene.add(pointlight,moonlight);

    const lighthelper= new THREE.PointLightHelper(pointlight);
    scene.add(lighthelper);

    const planeheight=-10;
    const planeGeometry = new THREE.PlaneGeometry(100, 100); // Adjust size as needed
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown color
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to be horizontal
    plane.position.setY(-10);
    scene.add(plane);

    const boxheight=3;
    const rectGeometry = new THREE.BoxGeometry(3,boxheight, 5); // Adjust size as needed
    const rectMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Adjust material as needed
    const rect = new THREE.Mesh(rectGeometry, rectMaterial);
    const rectpos=planeheight+(boxheight/2);
    rect.position.setY(rectpos);
    scene.add(rect);

    const controls= new OrbitControls(camera,renderer.domElement)

    function addStar() {
      const geometry= new THREE.SphereGeometry(0.25,24,24);
      const material= new THREE.MeshStandardMaterial({color:0xffffff});
      const star=new THREE.Mesh(geometry,material);

      const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

      star.position.set(x,y,z);
      scene.add(star);
    }
    Array(200).fill().forEach(addStar);

    let ringsize=3;
    let rotatespeed=0.01;
    let arr=[];

    async function addRings(ringsize,rotatespeed){
      const geometry= new THREE.TorusGeometry(ringsize,0.5,25,35);
      const material =new THREE.MeshStandardMaterial({color: 0xFF6347});
      const torus= new THREE.Mesh(geometry,material);
      torus.rotationspeed = rotatespeed - 0.001*arr.length;
      torus.receiveShadow=true;
      arr.push(torus);
      scene.add(torus);
    }

    async function initializeRings() {
      for(let i=0; i<10; i++) {
        await addRings(ringsize, rotatespeed);
        ringsize+=1;
      }
      animate();
    }

    initializeRings();

    async function rotateRings(arr){
      arr.forEach(ring => {
        ring.rotation.x += ring.rotationspeed;
        ring.rotation.y += ring.rotationspeed / 2;
        ring.rotation.z += ring.rotationspeed;
      });
    }

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(3,12,12),
      new THREE.MeshStandardMaterial()
    );

    moon.position.set(10,10,10);
    scene.add(moon);

    function moveCamera() {
      const t=document.body.getBoundingClientRect().top;
      moon.rotation.y += 0.5;
      moon.rotation.x += 0.5;
      moon.rotation.z += 0.5;

      camera.position.z = t* -0.01;
      camera.position.x = t* -0.0002;
      camera.position.y = t* -0.0002;
    }

    document.body.addEventListener('keydown', function(event) {
      keyboardState[event.code] = true;
    });

    document.body.addEventListener('keyup', function(event) {
      keyboardState[event.code] = false;
    });

    let velocity = new THREE.Vector3(); // Define velocity outside the function
    let targetVelocity = new THREE.Vector3(); // Define target velocity outside the function
    const acceleration = 0.05;
    const friction = 0.02;

    async function updateRectanglePosition() {
      if (keyboardState['ArrowUp']) {
        targetVelocity.z = -1; // Set target velocity when arrow up is pressed
      } else if (keyboardState['ArrowDown']) {
        targetVelocity.z = 1; // Set target velocity when arrow down is pressed
      } else {
        targetVelocity.z = 0; // Reset target velocity when no arrow keys are pressed
      }
      
      if (keyboardState['ArrowLeft']) {
        targetVelocity.x = -1; // Set target velocity when arrow left is pressed
      } else if (keyboardState['ArrowRight']) {
        targetVelocity.x = 1; // Set target velocity when arrow right is pressed
      } else {
        targetVelocity.x = 0; // Reset target velocity when no arrow keys are pressed
      }

      velocity.lerp(targetVelocity, acceleration);

      // Apply friction
      velocity.multiplyScalar(1 - friction);

      // Update position based on velocity
      rect.position.add(velocity);

      // Keep rectangle within bounds
      if (rect.position.x < -xbound / 2) {
        rect.position.x = -xbound / 2;
        velocity.x = Math.max(0, velocity.x);
      } else if (rect.position.x > xbound / 2) {
        rect.position.x = xbound / 2;
        velocity.x = Math.min(0, velocity.x);
      }

      if (rect.position.z < -ybound / 2) {
        rect.position.z = -ybound / 2;
        velocity.z = Math.max(0, velocity.z);
      } else if (rect.position.z > ybound / 2) {
        rect.position.z = ybound / 2;
        velocity.z = Math.min(0, velocity.z);
      }
    }

    function updateCameraPosition() {
      camera.position.x += (rect.position.x - camera.position.x) * 0.1;
      camera.position.z += (rect.position.z - camera.position.z + 20) * 0.1;
      camera.lookAt(rect.position);
      controls.target.copy(rect.position);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      rotateRings(arr);

      updateRectanglePosition();
      updateCameraPosition();

      controls.update();
      renderer.render(scene,camera);
    };
  
    // Clean up function
    return () => {
      // Clean up Three.js objects, event listeners, etc.
    };
  }, []);
  
  return (
    <div className='container'>
      <Graph/>
      <div className='bg_container'>
        <canvas id="bg" className='background'/>
      </div>
    </div>
  );
};

export default ThreeScene;
