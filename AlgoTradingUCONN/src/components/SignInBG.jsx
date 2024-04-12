import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import "../styles/SignInBG.css";
import cloud from '../assets/cloud.png';

const SignInBG = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer;
    let nebulaParticles = [];

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x00bbff); 
      containerRef.current.appendChild(renderer.domElement);

      // Create Nebula
      const nebulaGeometry = new THREE.BufferGeometry();
      const vertices = [];

      for (let i = 0; i < 1000; i++) { // Limit number of particles to 1000
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        vertices.push(x, y, z);
      }

      nebulaGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

      const smokeTexture = new THREE.TextureLoader().load(cloud);

      const nebulaMaterial = new THREE.PointsMaterial({
        size: Math.random() * 10 + 500, // Vary size of particles
        map: smokeTexture,
        transparent: true,
        opacity: 0.5, // Adjust opacity for a subtle effect
        depthWrite: false, // Disable writing to depth buffer to prevent clipping
        blending: THREE.NormalBlending // Use Normal blending for a subtle hue effect
      });      

      const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
      scene.add(nebula);
      nebulaParticles.push(nebula);

      // Create spotlight in the middle
      const spotLight = new THREE.SpotLight(0xffffff,10);
      spotLight.position.set(0, 0, 0);
      scene.add(spotLight);

      camera.position.z = 5;
      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);
      nebulaParticles.forEach(nebula => {
        nebula.rotation.y += 0.0008;
      });
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    init();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && containerRef.current.firstChild) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className='bg_container'/>
  );
};

export default SignInBG;
