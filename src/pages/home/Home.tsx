import React, { useEffect, useCallback, useRef } from "react";

import "./Home.scss";
import { Link } from "react-router-dom";

import * as THREE from "three";

const PARTICLE_COUNT = 1000;

class THREEParticle extends THREE.Vector3 {
  velocity: THREE.Vector3;

  constructor(pX: number, pY: number, pZ: number, velocity: THREE.Vector3) {
    super(pX, pY, pZ);
    this.velocity = velocity;
  }
}

const Home = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene>();
  const camera = useRef<THREE.PerspectiveCamera>();
  const renderer = useRef<THREE.WebGLRenderer>();
  const requestId = useRef<number>();
  const particleSystem = useRef<THREE.Points>();
  const particles = useRef<THREE.Geometry>();

  const sceneSetup = useCallback(() => {
    const width = elementRef.current?.clientWidth || 0;
    const height = elementRef.current?.clientHeight || 0;

    scene.current = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(
      75, // fov = field of view
      width / height, // aspect ratio
      0.1, // near plane
      1000, // far plane
    );

    camera.current.position.z = 5;

    renderer.current = new THREE.WebGLRenderer();
    renderer.current.setSize(width, height);
    if (elementRef.current) {
      elementRef.current.appendChild(renderer.current.domElement);
    }
  }, []);

  const addCustomObjects = useCallback(() => {
    particles.current = new THREE.Geometry();
    const pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3,
      map: new THREE.TextureLoader().load("./images/glow-particle-1.png"),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
    });

    for (let p = 0; p < PARTICLE_COUNT; p++) {
      const pX = Math.random() * 500 - 250;
      const pY = Math.random() * 500 - 250;
      const pZ = Math.random() * 500 - 250;

      const particle = new THREEParticle(
        pX,
        pY,
        pZ,
        new THREE.Vector3(
          Math.random() * 0.1 - 0.05,
          Math.random() * 0.1 - 0.05,
          Math.random() * 0.1 - 0.05,
        ),
      );

      particles.current.vertices.push(particle);
    }

    particleSystem.current = new THREE.Points(particles.current, pMaterial);

    if (scene.current) {
      scene.current.add(particleSystem.current);
    }
  }, []);

  const startAnimationLoop = useCallback(() => {
    const width = elementRef.current?.clientWidth || 0;
    const height = elementRef.current?.clientHeight || 0;

    if (particleSystem.current && particles.current) {
      // particleSystem.current.rotation.y += 0.0005;
      let pCount = PARTICLE_COUNT;
      while (pCount--) {
        const particle = particles.current?.vertices[pCount];

        if (particle) {
          if (particle.x <= 0)
            (particle as THREEParticle).velocity.x =
              -1 * (particle as THREEParticle).velocity.x;
          if (particle.y <= 0)
            (particle as THREEParticle).velocity.y =
              -1 * (particle as THREEParticle).velocity.y;
          if (particle.z <= -200)
            (particle as THREEParticle).velocity.z =
              -1 * (particle as THREEParticle).velocity.z;
          if (particle.x >= width)
            (particle as THREEParticle).velocity.x =
              -1 * (particle as THREEParticle).velocity.x;
          if (particle.y >= height)
            (particle as THREEParticle).velocity.y =
              -1 * (particle as THREEParticle).velocity.y;
          if (particle.z >= 200)
            (particle as THREEParticle).velocity.z =
              -1 * (particle as THREEParticle).velocity.z;

          particle.x += (particle as THREEParticle).velocity.x;
          particle.y += (particle as THREEParticle).velocity.y;
          particle.z += (particle as THREEParticle).velocity.z;
        }
      }
      particles.current.verticesNeedUpdate = true;
    }

    if (renderer.current) {
      renderer.current.render(scene.current!, camera.current!);
    }
    requestId.current = window.requestAnimationFrame(startAnimationLoop);
  }, []);

  const handleWindowResize = useCallback(() => {
    const width = elementRef.current?.clientWidth || 0;
    const height = elementRef.current?.clientHeight || 0;

    if (renderer.current) {
      renderer.current.setSize(width, height);
    }
    if (camera.current) {
      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
    }
  }, []);

  useEffect(() => {
    sceneSetup();
    addCustomObjects();
    startAnimationLoop();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      if (requestId.current) {
        window.cancelAnimationFrame(requestId.current);
      }
    };
  }, [addCustomObjects, sceneSetup, startAnimationLoop, handleWindowResize]);

  return (
    <div ref={elementRef} className="container">
      <div className="title-container">
        <h1 className="title">
          Harry Potter's <br />
          The Invisible Cloak
        </h1>
      </div>
      <Link to="/app" style={{ textDecoration: "none" }}>
        <h3 className="animated-try">Try it</h3>
      </Link>
    </div>
  );
};

export default Home;
