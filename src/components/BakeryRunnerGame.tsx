import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Trophy } from 'lucide-react';
import { jazzEngine } from '../audio/jazzEngine';

type GamePhase = 'MENU' | 'PLAYING' | 'GAME_OVER';
type ObstacleKind = 'FLOUR_SACK' | 'BREAD_CRATE' | 'HANGING_SIGN';
type CollectibleKind = 'SOMUN' | 'SIMIT';

interface Obstacle {
  id: number;
  lane: number; // 0, 1, 2
  z: number; // 1.0 (horizon) -> 0.0 (player)
  kind: ObstacleKind;
}

interface Collectible {
  id: number;
  lane: number;
  z: number;
  kind: CollectibleKind;
  collected: boolean;
}

const HIGH_SCORE_KEY = 'kodak_firin_runner_best_v1';

export const BakeryRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<GamePhase>('MENU');
  const [score, setScore] = useState(0);
  const [somunCount, setSomunCount] = useState(0);
  const [simitCount, setSimitCount] = useState(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(HIGH_SCORE_KEY) || 0);
    } catch {
      return 0;
    }
  });

  // Mutable game engine state for smooth 60fps loop
  const engineRef = useRef({
    phase: 'MENU' as GamePhase,
    lane: 1,
    visualLane: 1,
    jumpY: 0,
    jumpVel: 0,
    slideTimer: 0,
    speed: 0.48,
    distance: 0,
    score: 0,
    somun: 0,
    simit: 0,
    chaserProximity: 0.35, // 0 = far behind, 1 = caught!
    flashTimer: 0,
    spawnCooldown: 0.4,
    itemCooldown: 0.25,
    nextEntityId: 1,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    touchStartX: 0,
    touchStartY: 0,
  });

  const syncHud = useCallback(() => {
    const st = engineRef.current;
    setScore(Math.floor(st.score));
    setSomunCount(st.somun);
    setSimitCount(st.simit);
  }, []);

  const startGame = useCallback(() => {
    const st = engineRef.current;
    st.phase = 'PLAYING';
    st.lane = 1;
    st.visualLane = 1;
    st.jumpY = 0;
    st.jumpVel = 0;
    st.slideTimer = 0;
    st.speed = 0.5;
    st.distance = 0;
    st.score = 0;
    st.somun = 0;
    st.simit = 0;
    st.chaserProximity = 0.32;
    st.flashTimer = 0;
    st.spawnCooldown = 0.6;
    st.itemCooldown = 0.25;
    st.obstacles = [];
    st.collectibles = [];

    setScore(0);
    setSomunCount(0);
    setSimitCount(0);
    setPhase('PLAYING');
    jazzEngine.playMove();
  }, []);

  const moveLane = useCallback((dir: -1 | 1) => {
    const st = engineRef.current;
    if (st.phase !== 'PLAYING') return;
    const next = Math.max(0, Math.min(2, st.lane + dir));
    if (next !== st.lane) {
      st.lane = next;
      jazzEngine.playMove();
    }
  }, []);

  const triggerJump = useCallback(() => {
    const st = engineRef.current;
    if (st.phase !== 'PLAYING') return;
    if (st.jumpY <= 0.01) {
      st.jumpVel = 3.2;
      st.slideTimer = 0;
      jazzEngine.playMove();
    }
  }, []);

  const triggerSlide = useCallback(() => {
    const st = engineRef.current;
    if (st.phase !== 'PLAYING') return;
    st.slideTimer = 0.65;
    if (st.jumpY > 0) {
      st.jumpVel = -4.0;
    }
    jazzEngine.playMove();
  }, []);

  // Keyboard controls when playing
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (engineRef.current.phase !== 'PLAYING') return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          e.preventDefault();
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLane(-1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveLane(1);
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') triggerJump();
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') triggerSlide();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [moveLane, triggerJump, triggerSlide]);

  // Main Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let lastTime = performance.now();
    let hudTick = 0;

    const project = (lanePos: number, z: number, width: number, height: number) => {
      const horizonY = height * 0.28;
      const groundY = height * 0.89;
      // Non-linear perspective curve so objects accelerate convincingly as they approach
      const depth = 1 - z;
      const scale = 0.24 + Math.pow(depth, 1.45) * 0.92;
      const y = horizonY + Math.pow(depth, 1.35) * (groundY - horizonY);
      const roadHalf = (width * 0.36) * scale;
      const laneOffset = (lanePos - 1) * (roadHalf * 0.66);
      const x = width * 0.5 + laneOffset;
      return { x, y, scale, roadHalf };
    };

    const drawSomun = (x: number, y: number, scale: number, bob: number) => {
      ctx.save();
      ctx.translate(x, y - 18 * scale + bob);
      ctx.scale(scale, scale);

      // Soft warm glow
      ctx.fillStyle = 'rgba(229, 179, 84, 0.22)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 26, 17, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bread loaf crust
      const grad = ctx.createLinearGradient(-18, -10, 18, 10);
      grad.addColorStop(0, '#E8A850');
      grad.addColorStop(0.5, '#C87828');
      grad.addColorStop(1, '#7D4214');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 20, 11, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4A2409';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Classic bread slashes
      ctx.strokeStyle = '#F7D290';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-8, -5);
      ctx.lineTo(-2, 4);
      ctx.moveTo(0, -6);
      ctx.lineTo(6, 3);
      ctx.moveTo(8, -4);
      ctx.lineTo(13, 2);
      ctx.stroke();

      ctx.restore();
    };

    const drawSimit = (x: number, y: number, scale: number, bob: number) => {
      ctx.save();
      ctx.translate(x, y - 22 * scale + bob);
      ctx.scale(scale, scale);

      // Golden aura
      ctx.fillStyle = 'rgba(245, 210, 100, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, 23, 0, Math.PI * 2);
      ctx.fill();

      // Ring
      ctx.strokeStyle = '#D9962B';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#F7D774';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.stroke();

      // Sesame seeds
      ctx.fillStyle = '#FFF5D6';
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(Math.cos(a) * 13, Math.sin(a) * 13, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawObstacle = (obs: Obstacle, width: number, height: number) => {
      const { x, y, scale } = project(obs.lane, obs.z, width, height);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      if (obs.kind === 'FLOUR_SACK') {
        // Stack of two heavy flour sacks ("UN")
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 4, 30, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        const drawSack = (ox: number, oy: number) => {
          ctx.fillStyle = '#DFD4BE';
          ctx.strokeStyle = '#756650';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(ox - 22, oy - 24, 44, 24, 8);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#7C5329';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('UN', ox, oy - 8);
        };
        drawSack(0, 0);
        drawSack(0, -21);
      } else if (obs.kind === 'BREAD_CRATE') {
        // Wooden bakery crate
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.ellipse(0, 4, 32, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#6E4523';
        ctx.strokeStyle = '#2E1B0B';
        ctx.lineWidth = 2;
        ctx.fillRect(-26, -34, 52, 34);
        ctx.strokeRect(-26, -34, 52, 34);

        ctx.strokeStyle = '#9C683B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-24, -22);
        ctx.lineTo(24, -22);
        ctx.moveTo(-24, -11);
        ctx.lineTo(24, -11);
        ctx.stroke();
      } else {
        // HANGING_SIGN: Tall pillars + overhead wooden sign (slide under!)
        ctx.fillStyle = '#4A311B';
        ctx.fillRect(-30, -82, 6, 82);
        ctx.fillRect(24, -82, 6, 82);

        ctx.fillStyle = '#1A130D';
        ctx.strokeStyle = '#C9A84C';
        ctx.lineWidth = 2;
        ctx.fillRect(-34, -82, 68, 36);
        ctx.strokeRect(-34, -82, 68, 36);

        ctx.fillStyle = '#F2D27A';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('EĞİL!', 0, -61);
      }
      ctx.restore();
    };

    const drawStudent = (x: number, y: number, scale: number, timeSec: number, jumpY: number, isSliding: boolean) => {
      ctx.save();
      // Ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(x, y + 5, 22 * scale * (1 - jumpY * 0.3), 7 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      const yOffset = -jumpY * 88 * scale;
      ctx.translate(x, y + yOffset);
      ctx.scale(scale, scale);

      if (isSliding) {
        ctx.rotate(-0.45);
        ctx.translate(0, 14);
      }

      const stride = Math.sin(timeSec * 15) * 9;

      // Legs
      ctx.strokeStyle = '#1D293B';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-6, -24);
      ctx.lineTo(-8, -2 + stride * 0.5);
      ctx.moveTo(6, -24);
      ctx.lineTo(8, -2 - stride * 0.5);
      ctx.stroke();

      // Torso (Dark blazer/hoodie)
      ctx.fillStyle = '#1F2A3C';
      ctx.beginPath();
      ctx.roundRect(-14, -56, 28, 34, 7);
      ctx.fill();

      // Backpack (School bag!)
      ctx.fillStyle = '#A8482B';
      ctx.strokeStyle = '#5E2414';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-17, -54, 34, 28, 6);
      ctx.fill();
      ctx.stroke();

      // Backpack flap & gold buckle
      ctx.fillStyle = '#8C3820';
      ctx.beginPath();
      ctx.roundRect(-16, -54, 32, 13, 5);
      ctx.fill();
      ctx.fillStyle = '#E6C265';
      ctx.fillRect(-3, -43, 6, 4);

      // Head
      ctx.fillStyle = '#E8BE9E';
      ctx.beginPath();
      ctx.arc(0, -68, 11, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = '#1B1613';
      ctx.beginPath();
      ctx.arc(0, -72, 11, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawMasterBaker = (x: number, y: number, scale: number, timeSec: number) => {
      ctx.save();
      const wobble = Math.sin(timeSec * 13) * 4;

      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.ellipse(x, y + 6, 26 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.translate(x, y);
      ctx.scale(scale, scale);

      // Baker legs
      ctx.strokeStyle = '#2A231E';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-7, -22);
      ctx.lineTo(-9, 0 + wobble * 0.5);
      ctx.moveTo(7, -22);
      ctx.lineTo(9, 0 - wobble * 0.5);
      ctx.stroke();

      // Apron & shirt
      ctx.fillStyle = '#EFE9DD';
      ctx.strokeStyle = '#B8AD99';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-17, -60, 34, 40, 8);
      ctx.fill();
      ctx.stroke();

      // Wooden bread peel (ekmek küreği) raised on right hand
      ctx.save();
      ctx.translate(22, -46 + wobble * 0.6);
      ctx.rotate(0.28);
      ctx.fillStyle = '#9C683B';
      ctx.fillRect(-2, -14, 4, 42);
      ctx.beginPath();
      ctx.roundRect(-9, -30, 18, 18, 4);
      ctx.fill();
      ctx.restore();

      // Head + Mustache
      ctx.fillStyle = '#E4B490';
      ctx.beginPath();
      ctx.arc(0, -72, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2B221D';
      ctx.fillRect(-7, -70, 14, 3.5);

      // Tall white baker's hat (Fırıncı şapkası)
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#D8CFC0';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-11, -92, 22, 13);
      ctx.beginPath();
      ctx.arc(-6, -94, 7, 0, Math.PI * 2);
      ctx.arc(0, -96, 8, 0, Math.PI * 2);
      ctx.arc(6, -94, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const timeSec = now / 1000;
      const st = engineRef.current;

      const width = canvas.width;
      const height = canvas.height;
      const horizonY = height * 0.28;
      const groundY = height * 0.89;

      // Update game simulation
      if (st.phase === 'PLAYING') {
        st.speed = Math.min(1.05, st.speed + dt * 0.012);
        st.distance += st.speed * dt * 28;
        st.score += st.speed * dt * 14;
        st.visualLane += (st.lane - st.visualLane) * Math.min(1, dt * 15);
        st.chaserProximity = Math.max(0.18, st.chaserProximity - dt * 0.018);
        if (st.flashTimer > 0) st.flashTimer = Math.max(0, st.flashTimer - dt);

        if (st.jumpY > 0 || st.jumpVel !== 0) {
          st.jumpY += st.jumpVel * dt;
          st.jumpVel -= 9.5 * dt;
          if (st.jumpY <= 0) {
            st.jumpY = 0;
            st.jumpVel = 0;
          }
        }
        if (st.slideTimer > 0) {
          st.slideTimer = Math.max(0, st.slideTimer - dt);
        }

        // Spawn obstacles
        st.spawnCooldown -= dt;
        if (st.spawnCooldown <= 0) {
          const lane = Math.floor(Math.random() * 3);
          const kinds: ObstacleKind[] = ['FLOUR_SACK', 'BREAD_CRATE', 'HANGING_SIGN'];
          const kind = kinds[Math.floor(Math.random() * kinds.length)];
          st.obstacles.push({
            id: st.nextEntityId++,
            lane,
            z: 1.0,
            kind,
          });
          st.spawnCooldown = Math.max(0.55, 1.32 - st.speed * 0.55 + Math.random() * 0.35);
        }

        // Spawn somun & simit
        st.itemCooldown -= dt;
        if (st.itemCooldown <= 0) {
          const lane = Math.floor(Math.random() * 3);
          const kind: CollectibleKind = Math.random() < 0.26 ? 'SIMIT' : 'SOMUN';
          st.collectibles.push({
            id: st.nextEntityId++,
            lane,
            z: 1.0,
            kind,
            collected: false,
          });
          st.itemCooldown = 0.36 + Math.random() * 0.22;
        }

        // Move collectibles & check pickup
        const playerZ = 0.09;
        for (const item of st.collectibles) {
          item.z -= st.speed * dt;
          if (
            !item.collected &&
            Math.abs(item.z - playerZ) < 0.06 &&
            Math.abs(item.lane - st.visualLane) < 0.52
          ) {
            item.collected = true;
            if (item.kind === 'SIMIT') {
              st.simit += 1;
              st.score += 50;
              st.flashTimer = 0.25;
              jazzEngine.playPickup('simit');
            } else {
              st.somun += 1;
              st.score += 10;
              jazzEngine.playPickup('somun');
            }
          }
        }
        st.collectibles = st.collectibles.filter((c) => c.z > -0.1 && !c.collected);

        // Move obstacles & check collision
        let caught = false;
        for (const obs of st.obstacles) {
          obs.z -= st.speed * dt;
          if (Math.abs(obs.z - playerZ) < 0.045 && Math.abs(obs.lane - st.visualLane) < 0.44) {
            const jumpedOver = obs.kind !== 'HANGING_SIGN' && st.jumpY > 0.34;
            const slidUnder = obs.kind === 'HANGING_SIGN' && st.slideTimer > 0.05;
            if (!jumpedOver && !slidUnder) {
              caught = true;
              break;
            }
          }
        }
        st.obstacles = st.obstacles.filter((o) => o.z > -0.1);

        if (caught) {
          st.phase = 'GAME_OVER';
          st.chaserProximity = 0.92;
          const finalScore = Math.floor(st.score);
          setPhase('GAME_OVER');
          syncHud();
          setBestScore((prev) => {
            const updated = Math.max(prev, finalScore);
            try {
              localStorage.setItem(HIGH_SCORE_KEY, String(updated));
            } catch {
              // ignore storage errors
            }
            return updated;
          });
          jazzEngine.playCaught();
        } else {
          hudTick += dt;
          if (hudTick >= 0.08) {
            hudTick = 0;
            syncHud();
          }
        }
      }

      // Draw Sky / Warm Bakery Interior Backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#090706');
      bgGrad.addColorStop(0.28, '#1B140E');
      bgGrad.addColorStop(1, '#0E0B09');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Warm Oven Horizon Glow
      const ovenGlow = ctx.createRadialGradient(
        width * 0.5,
        horizonY,
        12,
        width * 0.5,
        horizonY,
        width * 0.45
      );
      ovenGlow.addColorStop(0, 'rgba(218, 152, 58, 0.38)');
      ovenGlow.addColorStop(1, 'rgba(15, 11, 8, 0)');
      ctx.fillStyle = ovenGlow;
      ctx.fillRect(0, 0, width, horizonY + 80);

      // Side Bakery Shelves Perspective
      ctx.fillStyle = '#15100B';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width * 0.5 - width * 0.36 * 0.24, horizonY);
      ctx.lineTo(width * 0.5 - width * 0.36 * 1.16, groundY);
      ctx.lineTo(0, groundY);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(width, horizonY);
      ctx.lineTo(width * 0.5 + width * 0.36 * 0.24, horizonY);
      ctx.lineTo(width * 0.5 + width * 0.36 * 1.16, groundY);
      ctx.lineTo(width, groundY);
      ctx.closePath();
      ctx.fill();

      // Road Surface
      const roadLeftTop = width * 0.5 - width * 0.36 * 0.24;
      const roadRightTop = width * 0.5 + width * 0.36 * 0.24;
      const roadLeftBot = width * 0.5 - width * 0.36 * 1.16;
      const roadRightBot = width * 0.5 + width * 0.36 * 1.16;

      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, groundY);
      roadGrad.addColorStop(0, '#221B15');
      roadGrad.addColorStop(1, '#120E0B');
      ctx.fillStyle = roadGrad;
      ctx.beginPath();
      ctx.moveTo(roadLeftTop, horizonY);
      ctx.lineTo(roadRightTop, horizonY);
      ctx.lineTo(roadRightBot, groundY);
      ctx.lineTo(roadLeftBot, groundY);
      ctx.closePath();
      ctx.fill();

      // Gold Edge Curbs
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(roadLeftTop, horizonY);
      ctx.lineTo(roadLeftBot, groundY);
      ctx.moveTo(roadRightTop, horizonY);
      ctx.lineTo(roadRightBot, groundY);
      ctx.stroke();

      // Lane Dividers
      ctx.strokeStyle = 'rgba(201, 168, 76, 0.2)';
      ctx.lineWidth = 1.5;
      [-0.33, 0.33].forEach((offset) => {
        ctx.beginPath();
        ctx.moveTo(width * 0.5 + width * 0.36 * 0.24 * offset, horizonY);
        ctx.lineTo(width * 0.5 + width * 0.36 * 1.16 * offset, groundY);
        ctx.stroke();
      });

      // Moving Horizontal Cobblestone Stripes
      const stripeScroll = (st.distance * 0.08) % 1;
      ctx.strokeStyle = 'rgba(255, 232, 180, 0.08)';
      for (let i = 0; i < 9; i++) {
        const z = 1 - ((i + stripeScroll) / 9);
        if (z <= 0 || z >= 1) continue;
        const { y, roadHalf } = project(1, z, width, height);
        ctx.beginPath();
        ctx.moveTo(width * 0.5 - roadHalf, y);
        ctx.lineTo(width * 0.5 + roadHalf, y);
        ctx.stroke();
      }

      // Draw entities sorted back-to-front (highest z first)
      const renderItems: Array<{ z: number; draw: () => void }> = [];

      for (const item of st.collectibles) {
        const { x, y, scale } = project(item.lane, item.z, width, height);
        const bob = Math.sin(timeSec * 6 + item.id) * 4 * scale;
        renderItems.push({
          z: item.z,
          draw: () =>
            item.kind === 'SIMIT'
              ? drawSimit(x, y, scale, bob)
              : drawSomun(x, y, scale, bob),
        });
      }

      for (const obs of st.obstacles) {
        renderItems.push({
          z: obs.z,
          draw: () => drawObstacle(obs, width, height),
        });
      }

      // Student Runner
      const playerZ = 0.09;
      const pProj = project(st.visualLane, playerZ, width, height);
      renderItems.push({
        z: playerZ,
        draw: () =>
          drawStudent(
            pProj.x,
            pProj.y,
            pProj.scale,
            timeSec,
            st.jumpY,
            st.slideTimer > 0
          ),
      });

      // Chasing Master Baker (Fırın Ustası) right behind the student
      const chaserZ = st.phase === 'GAME_OVER' ? 0.05 : 0.025;
      const chaserXShift = (st.visualLane - 1) * (width * 0.14);
      const chaserY = height * (0.94 - (st.phase === 'GAME_OVER' ? 0.03 : (1 - st.chaserProximity) * 0.01));
      renderItems.push({
        z: chaserZ,
        draw: () =>
          drawMasterBaker(
            width * 0.5 + chaserXShift * 0.85,
            chaserY,
            1.05,
            timeSec
          ),
      });

      renderItems.sort((a, b) => b.z - a.z);
      for (const entry of renderItems) {
        entry.draw();
      }

      // Simit pickup golden flash
      if (st.flashTimer > 0) {
        ctx.fillStyle = `rgba(229, 199, 107, ${st.flashTimer * 0.45})`;
        ctx.fillRect(0, 0, width, height);
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    rafId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(rafId);
  }, [syncHud]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    engineRef.current.touchStartX = touch.clientX;
    engineRef.current.touchStartY = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - engineRef.current.touchStartX;
    const dy = touch.clientY - engineRef.current.touchStartY;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      moveLane(dx > 0 ? 1 : -1);
    } else {
      if (dy < 0) triggerJump();
      else triggerSlide();
    }
  };

  return (
    <section id="firin-oyunu" className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#C9A84C] mb-2">
              Kodak Fırın · Aile Oyunu
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#F5EFE2]">
              Fırından Kaçış: Somun &amp; Simit Koşusu
            </h2>
            <p className="mt-2 font-serif italic text-lg text-[#E8DAC0]">
              “Babanın sözü ocağın kanunudur; vakti gelince her evlat kasanın başına döner.”
            </p>
          </div>
          <p className="text-sm text-[#AFA595] max-w-md">
            Sırtında okul çantasıyla kaçan öğrenciyi yönlendir; peşindeki Fırın Ustası’na yakalanmadan somun ekmek ve altın simit topla.
          </p>
        </div>

        <div className="leather-card rounded-2xl p-4 sm:p-6">
          {/* Clean Top HUD Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4 mb-4 border-b border-[#C9A84C]/20">
            <div className="rounded-lg bg-[#0A0807] border border-[#C9A84C]/15 px-4 py-2.5">
              <p className="text-xs text-[#9C9282]">Puan</p>
              <p className="font-mono text-lg font-semibold text-[#F5EFE2] tabular-nums">
                {score}
              </p>
            </div>
            <div className="rounded-lg bg-[#0A0807] border border-[#C9A84C]/15 px-4 py-2.5">
              <p className="text-xs text-[#9C9282]">Somun Ekmek</p>
              <p className="font-mono text-lg font-semibold text-[#E8A850] tabular-nums">
                {somunCount}
              </p>
            </div>
            <div className="rounded-lg bg-[#0A0807] border border-[#C9A84C]/15 px-4 py-2.5">
              <p className="text-xs text-[#9C9282]">Altın Simit</p>
              <p className="font-mono text-lg font-semibold text-[#F7D774] tabular-nums">
                {simitCount}
              </p>
            </div>
            <div className="rounded-lg bg-[#0A0807] border border-[#C9A84C]/15 px-4 py-2.5 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#9C9282]">Rekor</p>
                <p className="font-mono text-lg font-semibold text-[#C9A84C] tabular-nums">
                  {bestScore}
                </p>
              </div>
              <Trophy className="h-5 w-5 text-[#C9A84C]/80" />
            </div>
          </div>

          {/* Game Canvas Stage */}
          <div
            className="relative w-full overflow-hidden rounded-xl border border-[#C9A84C]/25 bg-[#090706] touch-none select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <canvas
              ref={canvasRef}
              width={920}
              height={500}
              className="w-full h-auto block aspect-[920/500]"
            />

            {/* Title Menu Overlay */}
            {phase === 'MENU' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/72 backdrop-blur-[2px] p-6 text-center">
                <p className="text-xs uppercase tracking-[0.22em] text-[#C9A84C] mb-2">
                  3 Şeritli Koşu
                </p>
                <h3 className="font-display text-2xl sm:text-4xl font-bold text-[#F5EFE2] mb-3">
                  Fırın Ustası Peşinde
                </h3>
                <p className="text-sm sm:text-base text-[#D3C9B8] max-w-lg mb-6">
                  Yön tuşları (veya A/D/W/S) ya da ekrandaki butonlarla şerit değiştir, un çuvallarının üzerinden zıpla, asılı tabelaların altından eğil.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#C9A84C] mb-7">
                  <span>Somun Ekmek: +10 Puan</span>
                  <span aria-hidden="true">·</span>
                  <span>Altın Simit: +50 Puan</span>
                </div>
                <button
                  type="button"
                  onClick={startGame}
                  className="rounded-lg bg-gradient-to-r from-[#C09A40] to-[#DFBE68] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#090705] hover:brightness-110 transition-all cursor-pointer"
                >
                  Oyunu Başlat
                </button>
              </div>
            )}

            {/* Game Over Overlay */}
            {phase === 'GAME_OVER' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#090706]/85 backdrop-blur-sm p-6 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-[#D96B52] mb-2">
                  Fırın Ustası Yakaladı
                </p>
                <h3 className="font-display text-3xl sm:text-5xl font-bold gold-foil-text mb-3">
                  Çabuk kasaya geç!
                </h3>
                <p className="font-serif italic text-base sm:text-lg text-[#DCD2C0] max-w-md mb-6">
                  “Okul çantasını kenara bırak, tezgâhta sıcak ekmek bekleyenler var.”
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#EFE7D8] mb-7 border-y border-[#C9A84C]/25 py-3 px-6">
                  <span className="font-mono tabular-nums">Skor: {score}</span>
                  <span aria-hidden="true" className="text-[#C9A84C]">·</span>
                  <span className="font-mono tabular-nums">Somun: {somunCount}</span>
                  <span aria-hidden="true" className="text-[#C9A84C]">·</span>
                  <span className="font-mono tabular-nums">Simit: {simitCount}</span>
                </div>

                <button
                  type="button"
                  onClick={startGame}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C09A40] to-[#DFBE68] px-7 py-3 text-sm font-semibold uppercase tracking-wider text-[#090705] hover:brightness-110 transition-all cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Tekrar Oyna</span>
                </button>
              </div>
            )}
          </div>

          {/* Touch & Click Arcade Controls Bar */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#9C9282]">
              Klavye: <span className="font-mono text-[#D7CEBE]">← →</span> Şerit ·{' '}
              <span className="font-mono text-[#D7CEBE]">↑ / Boşluk</span> Zıpla ·{' '}
              <span className="font-mono text-[#D7CEBE]">↓</span> Eğil
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveLane(-1)}
                aria-label="Sola geç"
                className="flex h-11 w-12 items-center justify-center rounded-lg bg-[#0A0807] border border-[#C9A84C]/30 text-[#F2ECE1] hover:border-[#E2C26B] active:bg-[#C9A84C] active:text-[#090705] transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={triggerJump}
                aria-label="Zıpla"
                className="flex h-11 px-4 items-center gap-1.5 rounded-lg bg-[#0A0807] border border-[#C9A84C]/30 text-xs font-medium text-[#F2ECE1] hover:border-[#E2C26B] active:bg-[#C9A84C] active:text-[#090705] transition-colors cursor-pointer"
              >
                <ArrowUp className="h-4 w-4" />
                <span>Zıpla</span>
              </button>
              <button
                type="button"
                onClick={triggerSlide}
                aria-label="Eğil"
                className="flex h-11 px-4 items-center gap-1.5 rounded-lg bg-[#0A0807] border border-[#C9A84C]/30 text-xs font-medium text-[#F2ECE1] hover:border-[#E2C26B] active:bg-[#C9A84C] active:text-[#090705] transition-colors cursor-pointer"
              >
                <ArrowDown className="h-4 w-4" />
                <span>Eğil</span>
              </button>
              <button
                type="button"
                onClick={() => moveLane(1)}
                aria-label="Sağa geç"
                className="flex h-11 w-12 items-center justify-center rounded-lg bg-[#0A0807] border border-[#C9A84C]/30 text-[#F2ECE1] hover:border-[#E2C26B] active:bg-[#C9A84C] active:text-[#090705] transition-colors cursor-pointer"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
