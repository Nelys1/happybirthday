import React, { useRef, useEffect } from "react";
import { Fireworks } from "fireworks-js";

type Point = { x: number; y: number };

class Firework {
  dead: boolean;
  offsprings: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  shade: number;
  history: Point[];
  madeChilds?: boolean;

  constructor(
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    shade: number,
    offsprings: number
  ) {
    this.dead = false;
    this.offsprings = offsprings;
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.shade = shade;
    this.history = [];
  }

  update(ctx: CanvasRenderingContext2D, fireworks: Firework[], delta: number) {
    if (this.dead) return;

    const PI2 = Math.PI * 2;
    const xDiff = this.targetX - this.x;
    const yDiff = this.targetY - this.y;

    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) {
      this.x += xDiff * 2 * delta;
      this.y += yDiff * 2 * delta;

      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > 20) this.history.shift();
    } else {
      if (this.offsprings && !this.madeChilds) {
        const babies = this.offsprings / 2;
        for (let i = 0; i < babies; i++) {
          const targetX =
            (this.x + this.offsprings * Math.cos((PI2 * i) / babies)) | 0;
          const targetY =
            (this.y + this.offsprings * Math.sin((PI2 * i) / babies)) | 0;
          fireworks.push(
            new Firework(this.x, this.y, targetX, targetY, this.shade, 0)
          );
        }
      }
      this.madeChilds = true;
      this.history.shift();
    }

    if (this.history.length === 0) this.dead = true;
    else if (this.offsprings) {
      this.history.forEach((point, i) => {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${this.shade},100%,${i}%)`;
        ctx.arc(point.x, point.y, 1, 0, PI2);
        ctx.fill();
      });
    } else {
      ctx.beginPath();
      ctx.fillStyle = `hsl(${this.shade},100%,50%)`;
      ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

class Birthday {
  width: number = 0;
  height: number = 0;
  spawnA: number = 0;
  spawnB: number = 0;
  spawnC: number = 0;
  spawnD: number = 0;
  fireworks: Firework[] = [];
  counter: number = 0;

  resize(canvas: HTMLCanvasElement) {
    this.width = canvas.width = window.innerWidth;
    const center = (this.width / 2) | 0;
    this.spawnA = (center - center / 4) | 0;
    this.spawnB = (center + center / 4) | 0;

    this.height = canvas.height = window.innerHeight;
    this.spawnC = this.height * 0.1;
    this.spawnD = this.height * 0.5;
  }

  onClick(evt: MouseEvent | TouchEvent, fireworks: Firework[]) {
    let x: number;
    let y: number;

    if ("clientX" in evt) {
      x = evt.clientX;
      y = evt.clientY;
    } else if (evt.touches?.[0]) {
      x = evt.touches[0].pageX;
      y = evt.touches[0].pageY;
    } else return;

    const random = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1) + min);
    const count = random(3, 5);

    for (let i = 0; i < count; i++) {
      fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          x,
          y,
          random(0, 260),
          random(30, 110)
        )
      );
    }
    this.counter = -1;
  }

  update(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.globalCompositeOperation = "hard-light";
    ctx.fillStyle = `rgba(20,20,20,${7 * delta})`;
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.globalCompositeOperation = "lighter";
    this.fireworks.forEach((fw) => fw.update(ctx, this.fireworks, delta));

    this.counter += delta * 3;
    const random = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1) + min);
    if (this.counter >= 1) {
      this.fireworks.push(
        new Firework(
          random(this.spawnA, this.spawnB),
          this.height,
          random(0, this.width),
          random(this.spawnC, this.spawnD),
          random(0, 360),
          random(30, 110)
        )
      );
      this.counter = 0;
    }

    if (this.fireworks.length > 1000) {
      this.fireworks = this.fireworks.filter((fw) => !fw.dead);
    }
  }
}

const FireworksCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fireworksRef = useRef<Fireworks | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Configure the fireworks
      const options = {
        rocketsPoint: { min: 50, max: 50 }, // Center rockets
        hue: { min: 0, max: 360 }, // Random colors
        delay: { min: 60, max: 120 }, // Slower launch frequency
        speed: 1, // Slower rocket speed
        acceleration: 1.01, // Gentle acceleration
        friction: 0.96, // More drag for smoother effect
        gravity: 0.5, // Softer fall
        particles: 25, // Fewer sparks per explosion
        traceLength: 2, // Shorter trails
        explosion: 3, // Smaller explosions
      };

      const fireworks = new Fireworks(containerRef.current, options);
      fireworks.start();

      fireworksRef.current = fireworks;

      return () => {
        fireworks.stop(); // cleanup when unmounting
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id="fireworks-container"
      className="absolute inset-0 pointer-events-none"
    />
  );
};
export default FireworksCanvas;
