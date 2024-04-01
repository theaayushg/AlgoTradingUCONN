import React, { useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(5);

    const clouds = [];

    const addCloud = () => {
      const cloudSize = Math.random() * 2 + 1; // Random cloud size
      const cloudGeometry = new THREE.BoxGeometry(cloudSize, cloudSize / 2, cloudSize); // Box geometry for cloud
      const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.8, transparent: true });
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

      // Randomize cloud position
      cloud.position.set(
        Math.random() * 100 - 50,
        Math.random() * 20 + 10,
        Math.random() * 100 - 50
      );

      // Add cloud to scene
      scene.add(cloud);
      clouds.push(cloud);
    };

    // Add initial clouds
    for (let i = 0; i < 50; i++) {
      addCloud();
    }

    const animate = () => {
      requestAnimationFrame(animate);

      // Move clouds
      clouds.forEach(cloud => {
        cloud.position.x += 0.01; // Move clouds to the right
        if (cloud.position.x > 50) { // If cloud moves out of view
          cloud.position.x = -50; // Move cloud to the left side
        }
      });

      renderer.render(scene, camera);
    };

    // Add new clouds every second
    setInterval(() => {
      addCloud();
    }, 1000);

    animate();

    // Clean up function
    return () => {
      // Clean up Three.js objects, event listeners, etc.
    };
  }, []);

  return (
    <div className='bg_container'>
      <canvas id="bg" className='background'/>
    </div>
  );
};

export default ThreeScene;
