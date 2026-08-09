import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf3f4f7, 0.011);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 42;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Cap pixel ratio harder on mobile — full retina density on a live
    // particle graph is a real battery/heat cost for little visible gain
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.3 : 2));
    container.appendChild(renderer.domElement);

    // ------------------------------------------------------------------
    // PARTICLE NETWORK — nodes + dynamically drawn connecting lines.
    // This is the signature element: a live data-graph rather than
    // floating decorative shapes, which reads as literally "tech/AI"
    // instead of jewelry. Node count and link search are both trimmed
    // on mobile since the O(n^2) proximity check runs every frame.
    // ------------------------------------------------------------------
    const NODE_COUNT = isMobile ? 40 : 90;
    const SPREAD = isMobile ? 30 : 46;
    const LINK_DIST = isMobile ? 11 : 13;

    const nodeColor = new THREE.Color(0x3a5cff);
    const nodeColorAlt = new THREE.Color(0x7c3aed);
    const nodeColorTeal = new THREE.Color(0x00c2a8);

    const nodes = [];
    const nodeGeom = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(NODE_COUNT * 3);
    const nodeColors = new Float32Array(NODE_COUNT * 3);

    for (let i = 0; i < NODE_COUNT; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * SPREAD * 2,
        (Math.random() - 0.5) * SPREAD * 1.3,
        (Math.random() - 0.5) * 40 - 10
      );
      const drift = new THREE.Vector3(
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.003
      );
      nodes.push({ pos, drift, phase: Math.random() * Math.PI * 2 });

      nodePositions[i * 3] = pos.x;
      nodePositions[i * 3 + 1] = pos.y;
      nodePositions[i * 3 + 2] = pos.z;

      const c = [nodeColor, nodeColorAlt, nodeColorTeal][i % 3];
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }

    nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeom.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    // Sharp-edged dot sprite (small solid core, thin falloff) — reads as
    // a precise data point rather than a soft bokeh blob
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 32;
    dotCanvas.height = 32;
    const dctx = dotCanvas.getContext('2d');
    const dgrad = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    dgrad.addColorStop(0, 'rgba(255,255,255,1)');
    dgrad.addColorStop(0.55, 'rgba(255,255,255,0.9)');
    dgrad.addColorStop(1, 'rgba(255,255,255,0)');
    dctx.fillStyle = dgrad;
    dctx.fillRect(0, 0, 32, 32);
    const dotTexture = new THREE.CanvasTexture(dotCanvas);

    const nodeMaterial = new THREE.PointsMaterial({
      size: 2.6,
      vertexColors: true,
      map: dotTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const nodePoints = new THREE.Points(nodeGeom, nodeMaterial);
    scene.add(nodePoints);

    // Connecting lines, rebuilt each frame based on proximity
    const MAX_LINES = NODE_COUNT * 6;
    const linePositions = new Float32Array(MAX_LINES * 2 * 3);
    const lineColors = new Float32Array(MAX_LINES * 2 * 3);
    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeom.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeom.setDrawRange(0, 0);

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.NormalBlending,
    });

    const lineSegments = new THREE.LineSegments(lineGeom, lineMaterial);
    scene.add(lineSegments);

    const lineColor = new THREE.Color(0x3a5cff);

    // ------------------------------------------------------------------
    // A single wireframe grid-sphere ("data globe") as the one signature
    // 3D object — angular, technical, orbit-like rather than organic
    // ------------------------------------------------------------------
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x3a5cff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const globeGeo = new THREE.IcosahedronGeometry(9, isMobile ? 1 : 2);
    const globe = new THREE.Mesh(globeGeo, globeMaterial);
    globe.position.set(26, 6, -20);
    scene.add(globe);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00c2a8,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const ringGeo = new THREE.TorusGeometry(7, 0.4, 8, 40);
    const ring = new THREE.Mesh(ringGeo, ringMaterial);
    ring.position.set(-30, -10, -18);
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    // Mouse tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      camera.position.x = currentMouseX * 6;
      camera.position.y = -currentMouseY * 4;
      camera.lookAt(scene.position);

      // Drift nodes gently, keep them within bounds
      const posAttr = nodeGeom.attributes.position;
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = nodes[i];
        n.pos.x += n.drift.x + Math.sin(elapsedTime * 0.3 + n.phase) * 0.01;
        n.pos.y += n.drift.y + Math.cos(elapsedTime * 0.25 + n.phase) * 0.01;
        n.pos.z += n.drift.z;

        if (Math.abs(n.pos.x) > SPREAD) n.drift.x *= -1;
        if (Math.abs(n.pos.y) > SPREAD * 0.7) n.drift.y *= -1;
        if (Math.abs(n.pos.z) > 30) n.drift.z *= -1;

        posAttr.setXYZ(i, n.pos.x, n.pos.y, n.pos.z);
      }
      posAttr.needsUpdate = true;
      nodePoints.rotation.y = currentMouseX * 0.08;

      // Rebuild connecting lines based on current proximity
      let lineIdx = 0;
      const linePosAttr = lineGeom.attributes.position;
      const lineColAttr = lineGeom.attributes.color;
      for (let i = 0; i < NODE_COUNT && lineIdx < MAX_LINES; i++) {
        for (let j = i + 1; j < NODE_COUNT && lineIdx < MAX_LINES; j++) {
          const dx = nodes[i].pos.x - nodes[j].pos.x;
          const dy = nodes[i].pos.y - nodes[j].pos.y;
          const dz = nodes[i].pos.z - nodes[j].pos.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < LINK_DIST * LINK_DIST) {
            const base = lineIdx * 6;
            linePosAttr.array[base] = nodes[i].pos.x;
            linePosAttr.array[base + 1] = nodes[i].pos.y;
            linePosAttr.array[base + 2] = nodes[i].pos.z;
            linePosAttr.array[base + 3] = nodes[j].pos.x;
            linePosAttr.array[base + 4] = nodes[j].pos.y;
            linePosAttr.array[base + 5] = nodes[j].pos.z;

            lineColAttr.array[base] = lineColor.r;
            lineColAttr.array[base + 1] = lineColor.g;
            lineColAttr.array[base + 2] = lineColor.b;
            lineColAttr.array[base + 3] = lineColor.r;
            lineColAttr.array[base + 4] = lineColor.g;
            lineColAttr.array[base + 5] = lineColor.b;

            lineIdx++;
          }
        }
      }
      lineGeom.setDrawRange(0, lineIdx * 2);
      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      // Slow rotation on the two signature wireframe forms
      globe.rotation.y += 0.0015;
      globe.rotation.x += 0.0006;
      ring.rotation.z += 0.002;
      ring.position.y = -10 + Math.sin(elapsedTime * 0.6) * 2;
      globe.position.y = 6 + Math.sin(elapsedTime * 0.5 + 2) * 2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      nodeGeom.dispose();
      lineGeom.dispose();
      globeGeo.dispose();
      ringGeo.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      globeMaterial.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="three-bg-canvas" />;
}