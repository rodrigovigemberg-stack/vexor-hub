// ==========================================
// VEXOR HUB - Interactive Custom Cursor & Particle Glow System
// ==========================================

class VexorCursor {
  constructor() {
    // Only activate on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    this.follower = document.createElement('div');
    this.follower.className = 'custom-cursor-follower';

    document.body.appendChild(this.cursor);
    document.body.appendChild(this.follower);

    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouse = { x: this.pos.x, y: this.pos.y };
    this.speed = 0.16;

    this.initEvents();
    this.render();
  }

  initEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.cursor.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
    });

    // Hover interactions for clickable elements
    const interactiveElements = 'a, button, input, .card-tilt, .tier-preset-btn, .faq-item, .nav-link';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveElements)) {
        this.follower.classList.add('cursor-active');
        this.cursor.classList.add('cursor-dot-active');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveElements)) {
        this.follower.classList.remove('cursor-active');
        this.cursor.classList.remove('cursor-dot-active');
      }
    });

    // Click particle burst
    window.addEventListener('click', (e) => {
      this.createClickSparks(e.clientX, e.clientY);
    });
  }

  createClickSparks(x, y) {
    for (let i = 0; i < 8; i++) {
      const spark = document.createElement('div');
      spark.className = 'click-spark';
      document.body.appendChild(spark);

      const angle = (Math.PI * 2 * i) / 8;
      const distance = 30 + Math.random() * 25;
      const destX = x + Math.cos(angle) * distance;
      const destY = y + Math.sin(angle) * distance;

      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;

      requestAnimationFrame(() => {
        spark.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`;
        spark.style.opacity = '0';
      });

      setTimeout(() => spark.remove(), 600);
    }
  }

  render() {
    this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
    this.pos.y += (this.mouse.y - this.pos.y) * this.speed;
    this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
    requestAnimationFrame(() => this.render());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.vexorCursor = new VexorCursor();
});
