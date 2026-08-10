import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AntigravityBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c16, 0.015); // Dark, deep anti-gravity space vibe

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.3 : 2));
    container.appendChild(renderer.domElement);

    // --- Antigravity Nodes Setup ---
    const NODE_COUNT = isMobile ? 60 : 130;
    const SPREAD_X = isMobile ? 35 : 50;
    const SPREAD_Y = 40;
    const SPREAD_Z = 30;

    const nodes = [];
    const nodeGeom = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(NODE_COUNT * 3);
    const nodeColors = new Float32Array(NODE_COUNT * 3);

    const colorPrimary = new THREE.Color(0x00f2fe); // Electric Cyan
    const colorSecondary = new THREE.Color(0x4facfe); // Soft Blue
    const colorAccent = new THREE.Color(0x7f00ff); // Neon Purple/Violet

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() - 0.5) * SPREAD_X * 2;
      const y = (Math.random() - 0.5) * SPREAD_Y * 2;
      const z = (Math.random() - 0.5) * SPREAD_Z;

      // Antigravity properties
      nodes.push({
        baseX: x,
        baseY: y,
        baseZ: z,
        x: x,
        y: y,
        z: z,
        vx: 0,
        vy: Math.random() * 0.02 + 0.01, // Continuous upward float force
        vz: 0,
        mass: Math.random() * 0.5 + 0.8,
        floatOffset: Math.random() * Math.PI * 2,
      });

      nodePositions[i * 3] = x;
      nodePositions[i * 3 + 1] = y;
      nodePositions[i * 3 + 2] = z;

      // Pick dynamic color based on height/index
      const mixRatio = Math.random();
      const c = mixRatio > 0.6 ? colorPrimary : mixRatio > 0.3 ? colorSecondary : colorAccent;
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }

    nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeom.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    // Particle Glow Texture Creation
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(0, 242, 254, 0.8)');
    grad.addColorStop(0.8, 'rgba(127, 0, 255, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const nodeMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(nodeGeom, nodeMaterial);
    scene.add(particleSystem);

    // --- Floating Antigravity Gyro Rings ---
    const ringGroup = new THREE.Group();

    const outerRingGeo = new THREE.TorusGeometry(12, 0.15, 16, 100);
    const innerRingGeo = new THREE.TorusGeometry(8, 0.1, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });

    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);

    ringGroup.add(outerRing);
    ringGroup.add(innerRing);
    ringGroup.position.set(15, 0, -10);
    scene.add(ringGroup);

    // --- Mouse & Raycasting Forces ---
    const mouse = new THREE.Vector2(-999, -999);
    const targetMouse = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouseWorldPos = new THREE.Vector3();

    // FIX: previously targetMouse only left (-999,-999) once the user's
    // FIRST real mousemove fired — so the "reveal" only started whenever
    // that happened to occur, and the slow 0.05/0.03 lerp rates below took
    // ~2-3s on top of that just to converge. That's why total time felt
    // inconsistent and closer to 3-4s. Kicking targetMouse to (0,0) here,
    // immediately on mount, makes the reveal start the instant the scene
    // loads rather than waiting on the user — same visual effect (camera
    // swings in from off-screen), now deterministic.
    targetMouse.set(0, 0);

    const handleMouseMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Mouse Interpolation
      // FIX: 0.05 -> 0.16. At 0.05/frame, converging from -999 toward 0
      // takes ~130+ frames (~2.2s+ at 60fps) before it's even close. At
      // 0.16/frame it converges to a negligible offset within ~35 frames
      // (well under 1s), then real mouse movement takes over normally.
      mouse.x += (targetMouse.x - mouse.x) * 0.16;
      mouse.y += (targetMouse.y - mouse.y) * 0.16;

      // Project mouse into 3D Space
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouseWorldPos);

      // Camera parallax
      // FIX: 0.03 -> 0.14, so the camera itself doesn't add its own extra
      // multi-second lag on top of the mouse convergence above.
      camera.position.x += (mouse.x * 3 - camera.position.x) * 0.14;
      camera.position.y += (mouse.y * 3 - camera.position.y) * 0.14;
      camera.lookAt(scene.position);

      // Physics Update for Antigravity Nodes
      const posAttr = nodeGeom.attributes.position;

      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];

        // 1. Antigravity Upward Drift
        n.y += n.vy;

        // Reset if float out of upper boundary
        if (n.y > SPREAD_Y) {
          n.y = -SPREAD_Y;
          n.x = (Math.random() - 0.5) * SPREAD_X * 2;
        }

        // 2. Harmonic Horizontal Wiggle (Zero-G drift)
        const waveX = Math.sin(elapsedTime * 0.8 + n.floatOffset) * 0.03;
        const waveZ = Math.cos(elapsedTime * 0.6 + n.floatOffset) * 0.02;

        // 3. Mouse Repulsion Force Field
        const dx = n.x - mouseWorldPos.x;
        const dy = n.y - mouseWorldPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const forceRadius = 15;

        if (dist < forceRadius) {
          const force = (1 - dist / forceRadius) * 0.8;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }

        // Apply velocities with damping/friction
        n.vx *= 0.92;
        n.x += n.vx + waveX;
        n.z += waveZ;

        posAttr.setXYZ(i, n.x, n.y, n.z);
      }

      posAttr.needsUpdate = true;

      // Antigravity Gyro Rings Rotation
      outerRing.rotation.x = elapsedTime * 0.2;
      outerRing.rotation.y = elapsedTime * 0.3;
      innerRing.rotation.x = -elapsedTime * 0.4;
      innerRing.rotation.z = elapsedTime * 0.2;

      // Vertical Floating Bob
      ringGroup.position.y = Math.sin(elapsedTime * 0.7) * 3;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      nodeGeom.dispose();
      outerRingGeo.dispose();
      innerRingGeo.dispose();
      nodeMaterial.dispose();
      ringMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="three-bg-canvas" style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }} />;
}
