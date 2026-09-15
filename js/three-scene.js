/**
 * VEXOR HUB - Modern Luxury Ambient 3D Engine (Three.js)
 * Clean, sophisticated atmospheric lighting, depth particles & interactive growth columns.
 */

class Vexor3DWorld {
  constructor() {
    this.container = document.getElementById('webgl-canvas-container');
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();

    this.currentStage = 0;
    this.bokehParticles = null;
    this.simulatorBars = [];
    this.stage2Group = new THREE.Group();

    this.init();
  }

  init() {
    // 1. Scene & Depth Atmosphere
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050807, 0.0018);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    this.camera.position.set(0, 10, 260);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 4. Luxury Ambient Lighting Setup
    this.ambientLight = new THREE.AmbientLight(0x0a1c14, 1.8);
    this.scene.add(this.ambientLight);

    // Directional Key Light (Warm Emerald Highlight)
    this.keyLight = new THREE.DirectionalLight(0x00FF88, 1.4);
    this.keyLight.position.set(120, 160, 100);
    this.scene.add(this.keyLight);

    // Fill Light (Soft Teal Depth)
    this.fillLight = new THREE.DirectionalLight(0x10B981, 1.0);
    this.fillLight.position.set(-120, -100, 80);
    this.scene.add(this.fillLight);

    // Reactive Cursor Lighting (Fluid Luxury Spotlight)
    this.cursorLight = new THREE.PointLight(0x00FF88, 2.0, 450);
    this.cursorLight.position.set(0, 0, 100);
    this.scene.add(this.cursorLight);

    // 5. Atmospheric Luxury Depth Particles (Bokeh / Floating Light Embers)
    this.buildAtmosphericParticles();

    // 6. Clean Growth Chart for Simulator
    this.buildSimulatorGrowthChart();

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate();
  }

  /* ===================================================
     Luxury Atmospheric Particles (Organic, Soft Light)
     =================================================== */
  buildAtmosphericParticles() {
    const particleCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;

      scales[i] = Math.random() * 3.5 + 1.2;
      opacities[i] = Math.random() * 0.4 + 0.15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create custom canvas texture for circular glowing bokeh
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(0, 255, 136, 1)');
    grad.addColorStop(0.3, 'rgba(16, 185, 129, 0.6)');
    grad.addColorStop(0.7, 'rgba(6, 32, 20, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      color: 0x00FF88,
      size: 4.5,
      map: texture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.bokehParticles = new THREE.Points(geometry, material);
    this.scene.add(this.bokehParticles);
  }

  /* ===================================================
     Clean Growth Columns for Simulator (Stage 2)
     =================================================== */
  buildSimulatorGrowthChart() {
    this.stage2Group.position.set(110, -35, -40);
    this.stage2Group.visible = false;
    this.scene.add(this.stage2Group);

    const barCount = 4;
    const barWidth = 14;
    const spacing = 22;

    for (let i = 0; i < barCount; i++) {
      const geo = new THREE.BoxGeometry(barWidth, 80, barWidth);
      geo.translate(0, 40, 0); // Origin at bottom

      const mat = new THREE.MeshStandardMaterial({
        color: 0x0a2418,
        emissive: 0x00FF88,
        emissiveIntensity: 0.25 + i * 0.15,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.65
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = (i - (barCount - 1) / 2) * spacing;
      mesh.position.y = 0;
      mesh.scale.y = 0.3 + i * 0.25;

      this.stage2Group.add(mesh);
      this.simulatorBars.push(mesh);
    }
  }

  updateSimulatorData(budget, leads, qual) {
    if (!this.simulatorBars || this.simulatorBars.length === 0) return;
    const factor = Math.min(2.2, Math.max(0.4, budget / 6000));
    
    this.simulatorBars.forEach((bar, idx) => {
      const targetScale = (0.35 + idx * 0.28) * factor;
      bar.scale.y = targetScale;
      if (bar.material) {
        bar.material.emissiveIntensity = 0.2 + (idx * 0.12) * Math.min(1.5, factor);
      }
    });
  }

  setStage(stageIndex) {
    this.currentStage = stageIndex;
    
    // Toggle simulator bars visibility only on Simulator stage
    if (this.stage2Group) {
      this.stage2Group.visible = stageIndex === 2;
    }

    // Smooth camera adjustments
    if (stageIndex === 2) {
      this.camera.position.x = -15;
    } else {
      this.camera.position.x = 0;
    }
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

    // Organic Camera Floating & Mouse Parallax
    this.camera.position.x += (this.mouse.x * 12 - this.camera.position.x + (this.currentStage === 2 ? -20 : 0)) * 0.03;
    this.camera.position.y += (this.mouse.y * 8 + 10 - this.camera.position.y) * 0.03;
    this.camera.lookAt(0, 5, 0);

    // Update Reactive Cursor Spotlight
    if (this.cursorLight) {
      this.cursorLight.position.x = this.mouse.x * 140;
      this.cursorLight.position.y = this.mouse.y * 90;
    }

    // Soft Float of Bokeh Embers
    if (this.bokehParticles) {
      const positions = this.bokehParticles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsedTime * 0.8 + i) * 0.12;
        positions[i] += Math.cos(elapsedTime * 0.5 + i) * 0.08;
      }
      this.bokehParticles.geometry.attributes.position.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
