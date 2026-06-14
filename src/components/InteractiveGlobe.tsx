import React, { useRef, useEffect } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface LandCircle {
  x: number;
  y: number;
  z: number;
  cosR: number;
}

const LAND_CIRCLES: LandCircle[] = [
  { "x": -0.633022, "y": 0.766044, "z": -0.111619, "cosR": 0.951057 },
  { "x": -0.433013, "y": 0.866025, "z": -0.25, "cosR": 0.965926 },
  { "x": -0.211309, "y": 0.906308, "z": -0.365998, "cosR": 0.978148 },
  { "x": -0.538986, "y": 0.819152, "z": 0.196175, "cosR": 0.970296 },
  { "x": -0.776039, "y": 0.615661, "z": -0.136837, "cosR": 0.978148 },
  { "x": -0.723268, "y": 0.573576, "z": -0.384569, "cosR": 0.984808 },
  { "x": -0.90039, "y": 0.390731, "z": -0.191384, "cosR": 0.992546 },
  { "x": -0.970662, "y": 0.224951, "z": 0.084922, "cosR": 0.997564 },
  { "x": -0.198632, "y": 0.951057, "z": 0.236721, "cosR": 0.978148 },
  { "x": -0.195373, "y": 0.978148, "z": 0.07111, "cosR": 0.990268 },
  { "x": -0.86273, "y": -0.087156, "z": 0.498097, "cosR": 0.965926 },
  { "x": -0.739942, "y": -0.258819, "z": 0.620885, "cosR": 0.978148 },
  { "x": -0.784886, "y": -0.422618, "z": 0.453154, "cosR": 0.984808 },
  { "x": -0.710264, "y": -0.642788, "z": 0.286965, "cosR": 0.990268 },
  { "x": -0.611327, "y": -0.766044, "z": 0.198632, "cosR": 0.996195 },
  { "x": 0.23457, "y": 0.422618, "z": 0.875426, "cosR": 0.970296 },
  { "x": 0, "y": 0.34202, "z": 0.939693, "cosR": 0.978148 },
  { "x": 0.416198, "y": 0.173648, "z": 0.892539, "cosR": 0.978148 },
  { "x": 0.207785, "y": 0.034899, "z": 0.977552, "cosR": 0.984808 },
  { "x": 0.368915, "y": -0.173648, "z": 0.913098, "cosR": 0.981627 },
  { "x": 0.368629, "y": -0.422618, "z": 0.827953, "cosR": 0.990268 },
  { "x": 0.687248, "y": -0.34202, "z": 0.640869, "cosR": 0.997564 },
  { "x": 0.058319, "y": 0.743145, "z": 0.666584, "cosR": 0.992546 },
  { "x": 0.219846, "y": 0.766044, "z": 0.604023, "cosR": 0.987688 },
  { "x": 0.121508, "y": 0.882948, "z": 0.453475, "cosR": 0.992546 },
  { "x": 0.242404, "y": 0.906308, "z": 0.346189, "cosR": 0.992546 },
  { "x": -0.040092, "y": 0.642788, "z": 0.764995, "cosR": 0.996195 },
  { "x": 0.198267, "y": 0.642788, "z": 0.739942, "cosR": 0.99863 },
  { "x": 0.3079, "y": 0.615661, "z": 0.725368, "cosR": 0.99863 },
  { "x": 0.506824, "y": 0.669131, "z": 0.543502, "cosR": 0.997564 },
  { "x": 0.469846, "y": 0.866025, "z": 0.17101, "cosR": 0.951057 },
  { "x": 0.462339, "y": 0.882948, "z": -0.081523, "cosR": 0.951057 },
  { "x": 0.383022, "y": 0.866025, "z": -0.321394, "cosR": 0.965926 },
  { "x": 0.640342, "y": 0.766044, "z": 0.056023, "cosR": 0.970296 },
  { "x": 0.582563, "y": 0.766044, "z": -0.271654, "cosR": 0.978148 },
  { "x": 0.79124, "y": 0.573576, "z": -0.212012, "cosR": 0.965926 },
  { "x": 0.806707, "y": 0.573576, "z": 0.142244, "cosR": 0.984808 },
  { "x": 0.90342, "y": 0.374607, "z": 0.208571, "cosR": 0.987688 },
  { "x": 0.940256, "y": 0.275637, "z": -0.199858, "cosR": 0.992546 },
  { "x": 0.645974, "y": 0.406737, "z": 0.645974, "cosR": 0.987688 },
  { "x": 0.670705, "y": 0.559193, "z": 0.487296, "cosR": 0.992546 },
  { "x": 0.541338, "y": 0.587785, "z": -0.601217, "cosR": 0.997564 },
  { "x": 0.825929, "y": 0.173648, "z": -0.536365, "cosR": 0.996195 },
  { "x": 0.905756, "y": -0.034899, "z": -0.422361, "cosR": 0.994522 },
  { "x": 0.639266, "y": -0.104528, "z": -0.761848, "cosR": 0.996195 },
  { "x": 0.786297, "y": -0.374607, "z": -0.491333, "cosR": 0.990268 },
  { "x": 0.640856, "y": -0.422618, "z": -0.640856, "cosR": 0.987688 },
  { "x": 0.481042, "y": -0.544639, "z": -0.686999, "cosR": 0.994522 },
  { "x": 0.105035, "y": -0.656059, "z": -0.747365, "cosR": 0.99863 },
  { "x": 0.069606, "y": -0.601815, "z": -0.795596, "cosR": 0.99863 }
];

const checkLand = (lat: number, lon: number): boolean => {
  // Antarctica check: lat is in radians (-PI/2 to PI/2)
  // -62 degrees = -62 * Math.PI / 180 = -1.082 radians
  if (lat < -1.082) return true;

  // Query point unit vector
  const cosLat = Math.cos(lat);
  const px = cosLat * Math.sin(lon);
  const py = Math.sin(lat);
  const pz = cosLat * Math.cos(lon);

  for (let i = 0; i < LAND_CIRCLES.length; i++) {
    const c = LAND_CIRCLES[i];
    const dot = px * c.x + py * c.y + pz * c.z;
    if (dot >= c.cosR) {
      return true;
    }
  }
  return false;
};

export const InteractiveGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  
  // Rotation states stored in refs to avoid 60fps React render infinite loops
  const rotY = useRef(0);
  const rotX = useRef(0.3); // Initial tilt

  // Drag states
  const isDragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startRot = useRef({ y: 0, x: 0 });
  const velocity = useRef({ y: 0.005, x: 0 }); // Y rotation speed

  // Setup globe dimensions & points
  const radius = 140; // Globe radius in pixels
  
  // Generate 3D grid lines (Meridians & Parallels)
  const meridians = useRef<Point3D[][]>([]);
  const parallels = useRef<Point3D[][]>([]);
  const landPoints = useRef<Point3D[]>([]);
  const hotspots = useRef<Point3D[]>([]);

  useEffect(() => {
    // Generate 9 lines of longitude (meridians)
    const longLinesCount = 9;
    const pointsPerLong = 35;
    const generatedMeridians: Point3D[][] = [];
    
    for (let i = 0; i < longLinesCount; i++) {
      const phi = (i / longLinesCount) * 2 * Math.PI;
      const path: Point3D[] = [];
      for (let j = 0; j < pointsPerLong; j++) {
        const theta = -Math.PI / 2 + (j / (pointsPerLong - 1)) * Math.PI;
        path.push({
          x: radius * Math.cos(theta) * Math.sin(phi),
          y: radius * Math.sin(theta),
          z: radius * Math.cos(theta) * Math.cos(phi)
        });
      }
      generatedMeridians.push(path);
    }
    meridians.current = generatedMeridians;

    // Generate 7 lines of latitude (parallels)
    const latLinesCount = 7;
    const pointsPerLat = 45;
    const generatedParallels: Point3D[][] = [];
    
    for (let i = 1; i < latLinesCount; i++) {
      const theta = -Math.PI / 2 + (i / latLinesCount) * Math.PI;
      const path: Point3D[] = [];
      for (let j = 0; j < pointsPerLat; j++) {
        const phi = (j / (pointsPerLat - 1)) * 2 * Math.PI;
        path.push({
          x: radius * Math.cos(theta) * Math.sin(phi),
          y: radius * Math.sin(theta),
          z: radius * Math.cos(theta) * Math.cos(phi)
        });
      }
      generatedParallels.push(path);
    }
    parallels.current = generatedParallels;

    // Generate uniform-density land dots
    const generatedLandPoints: Point3D[] = [];
    const latSpacingAngle = 0.045; // smaller means higher density
    
    for (let lat = -Math.PI / 2 + 0.05; lat < Math.PI / 2 - 0.05; lat += latSpacingAngle) {
      const cosLat = Math.cos(lat);
      const lonSpacingAngle = latSpacingAngle / cosLat;
      
      for (let lon = -Math.PI; lon < Math.PI; lon += lonSpacingAngle) {
        if (checkLand(lat, lon)) {
          generatedLandPoints.push({
            x: radius * Math.cos(lat) * Math.sin(lon),
            y: radius * Math.sin(lat),
            z: radius * Math.cos(lat) * Math.cos(lon)
          });
        }
      }
    }
    landPoints.current = generatedLandPoints;

    // Hotspots (cities/hubs) with random premium locations
    hotspots.current = [
      { lat: 0.6, lon: 0.5 },
      { lat: -0.4, lon: 1.8 },
      { lat: 0.2, lon: -1.2 },
      { lat: -0.3, lon: -0.5 },
      { lat: 0.7, lon: 3.0 },
      { lat: -0.1, lon: -2.5 },
      { lat: 0.4, lon: 2.2 }
    ].map(coords => {
      const theta = coords.lat;
      const phi = coords.lon;
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta),
        z: radius * Math.cos(theta) * Math.cos(phi)
      };
    });
  }, []);

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = containerRef.current?.offsetWidth || 360);
    let height = (canvas.height = 360);
    const cx = width / 2;
    const cy = height / 2;

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      width = canvas.width = containerRef.current.offsetWidth;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    // Track active pulse time
    let pulseTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Apply automatic friction & momentum rotations in refs
      if (!isDragging.current) {
        // Slow rotation drag momentum decay
        velocity.current.y += (0.002 - velocity.current.y) * 0.03; // decay back to normal speed
        velocity.current.x += (0 - velocity.current.x) * 0.03;
        
        rotY.current += velocity.current.y;
        rotX.current += velocity.current.x;
      }

      const currentRotY = rotY.current;
      const currentRotX = rotX.current;

      // Update coordinates badge UI directly from ref to avoid React render cycles
      if (badgeRef.current) {
        badgeRef.current.innerText = `LAT: ${currentRotX.toFixed(2)} / LON: ${currentRotY.toFixed(2)}`;
      }

      pulseTime += 0.05;

      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      // Rotation / projection function
      const project = (p: Point3D) => {
        // Rotate Y axis
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y1 = p.y;

        // Rotate X axis
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;
        const x2 = x1;

        // Perspective scale factor
        const scale = 380 / (380 - z2);

        return {
          sx: cx + x2 * scale,
          sy: cy - y2 * scale,
          sz: z2
        };
      };

      // Draw globe shadow/background glow circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(24, 24, 27, 0.005)';
      ctx.fill();

      // Separate lines into front/back to maintain perfect depth sorting
      const drawLines = (lines: Point3D[][]) => {
        lines.forEach(path => {
          ctx.beginPath();
          let drawing = false;

          for (let i = 0; i < path.length; i++) {
            const { sx, sy, sz } = project(path[i]);

            // Depth check: draw back lines faint, front lines solid
            const isFront = sz > -15;

            if (i === 0) {
              ctx.moveTo(sx, sy);
              drawing = isFront;
            } else {
              // Adjust lines opacity based on segment depth
              ctx.lineWidth = isFront ? 1.0 : 0.4;
              ctx.strokeStyle = isFront 
                ? 'rgba(24, 24, 27, 0.22)' 
                : 'rgba(24, 24, 27, 0.05)';
              
              if (isFront && !drawing) {
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                drawing = true;
              } else if (!isFront && drawing) {
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                drawing = false;
              }

              ctx.lineTo(sx, sy);
              if (drawing) {
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(sx, sy);
              }
            }
          }
          ctx.stroke();
        });
      };

      // 1. Draw Back Lines First
      ctx.setLineDash([2, 4]); // Dotted style for back of globe
      drawLines(parallels.current);
      drawLines(meridians.current);
      ctx.setLineDash([]); // Reset line dash

      // 2. Draw Back-facing Land Dots (Subtle tech-grey)
      landPoints.current.forEach(point => {
        const { sx, sy, sz } = project(point);
        if (sz <= 0) {
          const depthAlpha = (sz + radius) / radius; // 0 at back edge to 1 at center
          ctx.beginPath();
          ctx.arc(sx, sy, 0.75, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(113, 113, 122, ${0.08 * depthAlpha})`; // extremely faint grey
          ctx.fill();
        }
      });

      // 3. Draw Front Lines (Solid style)
      drawLines(parallels.current);
      drawLines(meridians.current);

      // 4. Draw Front-facing Land Dots (Bold Charcoal)
      landPoints.current.forEach(point => {
        const { sx, sy, sz } = project(point);
        if (sz > 0) {
          const depthAlpha = sz / radius; // 0 at edges to 1 at front center
          const dotSize = 1.0 + depthAlpha * 0.8;
          ctx.beginPath();
          ctx.arc(sx, sy, dotSize, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(24, 24, 27, ${0.75 * depthAlpha})`; // bold charcoal/black
          ctx.fill();
        }
      });

      // 5. Draw Hotspot Nodes with glowing circles
      hotspots.current.forEach(point => {
        const { sx, sy, sz } = project(point);

        // Only render node on front facing globe sphere
        if (sz > 0) {
          const depthAlpha = sz / radius; // 0 (edges) to 1 (front center)
          
          // Ripple pulse circles
          const pulseRadius = 6 + (Math.sin(pulseTime * 2) + 1) * 6;
          ctx.beginPath();
          ctx.arc(sx, sy, pulseRadius, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(24, 24, 27, ${0.15 * depthAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Connection lines back to center or next nodes
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, 2 * Math.PI);
          ctx.fillStyle = `rgba(24, 24, 27, ${0.85 * depthAlpha})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Run animation loop once on mount

  // Drag interaction event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startRot.current = { y: rotY.current, x: rotX.current };
    velocity.current = { y: 0, x: 0 };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startMouse.current.x;
    const deltaY = e.clientY - startMouse.current.y;

    const newRotY = startRot.current.y + deltaX * 0.007;
    const newRotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, startRot.current.x + deltaY * 0.007));

    velocity.current = {
      y: newRotY - rotY.current,
      x: newRotX - rotX.current
    };

    rotY.current = newRotY;
    rotX.current = newRotX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div ref={containerRef} className="w-full h-[360px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none relative group">
      
      {/* Abstract outer tech rings decoration */}
      <div className="absolute w-[320px] h-[320px] border border-zinc-200/40 rounded-full pointer-events-none z-0" />
      <div className="absolute w-[350px] h-[350px] border border-dashed border-zinc-200/20 rounded-full pointer-events-none z-0 animate-spin-slow" style={{ animationDuration: '80s' }} />

      {/* Floating coordinates badge ref-based to avoid React triggers */}
      <div 
        ref={badgeRef}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-md px-3 py-1 border border-zinc-200 rounded-full text-[9px] font-mono font-bold text-zinc-500 pointer-events-none shadow-sm z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
      >
        LAT: 0.30 / LON: 0.00
      </div>

      <canvas 
        ref={canvasRef} 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative z-10 outline-none"
      />
    </div>
  );
};
