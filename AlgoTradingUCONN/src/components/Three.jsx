
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function rotateRings(arr){
    arr.forEach(ring => {
      ring.rotation.x += ring.rotationspeed;
      ring.rotation.y += ring.rotationspeed / 2;
      ring.rotation.z += ring.rotationspeed;
    });
  }

const ThreeScene = () => {
  useEffect(() => {
    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    const pointlight = new THREE.PointLight(0xffffff,200);
    //pointlight.position.setZ(5);
    const moonlight =new THREE.PointLight(0xffffff,100);
    moonlight.position.set(20,10,10);
    pointlight.castShadow=true;

    //const ambientlight= new THREE.AmbientLight(0xffffff);

    scene.add(pointlight,moonlight);

    const lighthelper= new THREE.PointLightHelper(pointlight);
    const gridhelper= new THREE.GridHelper(200,50);
    const moonhelper= new THREE.PointLightHelper(moonlight);
    scene.add(lighthelper,gridhelper,moonhelper);

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

    function addRings(ringsize,rotatespeed){
    const geometry= new THREE.TorusGeometry(ringsize,0.5,25,35);
    const material =new THREE.MeshStandardMaterial({color: 0xFF6347});
    const torus= new THREE.Mesh(geometry,material);
    torus.rotationspeed = rotatespeed - 0.001*arr.length;
    torus.receiveShadow=true;
    arr.push(torus);
    scene.add(torus);
    }

    for(let i=0;i<10;i++){
    addRings(ringsize,rotatespeed);
    ringsize+=1;
    }




    //const spacetexture= new THREE.TextureLoader().load('Space.jpg');
    const moontexture= new THREE.TextureLoader().load('moon.jpg');

    //scene.background=spacetexture;

    const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3,12,12),
    new THREE.MeshStandardMaterial( {
        map:moontexture
    })
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

    document.body.onscroll= moveCamera





    const animate = () => {
        requestAnimationFrame(animate);
        rotateRings(arr);

        controls.update();
        renderer.render(scene,camera);
      };
  
      animate();
  
      // Clean up function
      return () => {
        // Clean up Three.js objects, event listeners, etc.
      };
    }, []);
  
    return (
      <canvas id="bg" />
    );
  };
  
  export default ThreeScene;