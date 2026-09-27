'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Sky, Stars } from '@react-three/drei';
import { CapsuleCollider, CuboidCollider, Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { PALETTE } from '@/content/assets';
import { SPOTS } from '@/content/game';
import { loadSettings } from '@/lib/settings';
import { attractionStatus } from '@/lib/rules';
import { interactionTargetAt } from '@/lib/interactions';
import { useGame } from '@/store/game';
import { DEFAULT_SPAWN, isSafeWorldPosition, safeSpawn, WORLD_BOUNDS } from '@/content/world';
import PlayerAvatar from '@/components/avatar/PlayerAvatar';
import type { AvatarMotion } from '@/components/avatar/AvatarModel';
import { CAMERA, MOVEMENT } from '@/content/tuning';
import { loadedZonesAt, YANGON_ZONES } from '@/content/yangon';
import { debugPositionWrite } from '@/lib/position-diagnostics';

type BoxDef = { p: [number, number, number]; s: [number, number, number]; color?: string; roof?: string; label?: string };
const BUILDINGS: BoxDef[] = [
  { p: [-74, 4, 16], s: [10, 8, 8], color: PALETTE.cream, roof: PALETTE.roof, label: 'GOLDEN TAMARIND' },
  { p: [-74, 5, 4], s: [9, 10, 9], color: '#c87d62' }, { p: [-74, 4, -5], s: [9, 8, 7], color: '#e1b174' },
  { p: [-58, 3, 12], s: [9, 6, 7], color: PALETTE.teal, label: 'MORNING STAR · လက်ဖက်ရည်' },
  { p: [-26, 4, 16], s: [8, 8, 8], color: '#d48866', label: 'GENERAL GOODS' },
  { p: [-15, 4, 10], s: [8, 8, 11], color: '#dfb279' }, { p: [-14, 5, -1], s: [8, 10, 8], color: '#8aa19a' },
  { p: [-26, 4, -17], s: [9, 8, 7], color: '#be7967' }, { p: [-57, 5, -18], s: [9, 10, 7], color: '#d8aa72' },
  { p: [-74, 3.5, -17], s: [11, 7, 8], color: '#6e8791', label: 'YANGON ROAD · TICKETS' },
  { p: [-11, 3.5, 22], s: [7, 7, 7], color: '#b56e59' },
];

function Building({ b }: { b: BoxDef }) {
  const floors = Math.max(2, Math.floor(b.s[1] / 2.2));
  return <RigidBody type="fixed" colliders="cuboid">
    <group position={b.p}>
      <mesh castShadow receiveShadow><boxGeometry args={b.s}/><meshStandardMaterial color={b.color}/></mesh>
      <mesh position={[0, b.s[1] / 2 + .28, 0]} castShadow><boxGeometry args={[b.s[0] + .5, .55, b.s[2] + .5]}/><meshStandardMaterial color={b.roof ?? PALETTE.roof}/></mesh>
      {Array.from({ length: floors }).map((_, y) => [-1, 1].map(x => <mesh key={`${x}-${y}`} position={[x * b.s[0] * .25, y * 1.8 - b.s[1] * .28, b.s[2] / 2 + .012]}>
        <planeGeometry args={[1.05, .8]}/><meshStandardMaterial color="#c9e0d1" emissive="#d9ae58" emissiveIntensity={.08}/>
      </mesh>))}
      {b.label && <><mesh position={[0, -.2, b.s[2] / 2 + .08]}><boxGeometry args={[b.s[0] * .72, 1, .15]}/><meshStandardMaterial color={PALETTE.darkGreen}/></mesh><Html position={[0, -.2, b.s[2] / 2 + .18]} center transform distanceFactor={7}><span className="building-sign">{b.label}</span></Html></>}
    </group>
  </RigidBody>;
}

const Tree = memo(function Tree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return <group position={[x, 0, z]} scale={scale}><mesh position-y={1.15} castShadow><cylinderGeometry args={[.16, .3, 2.3, 7]}/><meshStandardMaterial color={PALETTE.wood}/></mesh><mesh position={[-.35, 2.6, 0]} castShadow><icosahedronGeometry args={[1.15, 1]}/><meshStandardMaterial color={PALETTE.green}/></mesh><mesh position={[.55, 2.55, .12]} castShadow><icosahedronGeometry args={[.95, 1]}/><meshStandardMaterial color={PALETTE.darkGreen}/></mesh></group>;
});

function Lamp({ x, z, night }: { x: number; z: number; night: boolean }) {
  return <group position={[x, 0, z]}><mesh position-y={1.7}><cylinderGeometry args={[.07, .12, 3.4, 8]}/><meshStandardMaterial color="#273b3a"/></mesh><mesh position-y={3.4}><sphereGeometry args={[.22, 10, 10]}/><meshStandardMaterial color={night ? PALETTE.lamp : '#d5d0bb'} emissive={PALETTE.lamp} emissiveIntensity={night ? 2.5 : 0}/></mesh>{night && <pointLight position={[0, 3.25, 0]} color={PALETTE.lamp} intensity={3} distance={7}/>}</group>;
}

function Roads() {
  const vertical=[-51,-18,12,38,62], horizontal=[-76,-48,-18,8,38,62];
  return <RigidBody type="fixed" colliders={false}>
    <CuboidCollider args={[82,.1,89]} position={[-8,-.1,-5]}/>
    <mesh receiveShadow rotation-x={-Math.PI/2} position={[-8,0,-5]}><planeGeometry args={[164,178]}/><meshStandardMaterial color="#63785b"/></mesh>
    {vertical.map(x=><group key={x}><mesh position={[x,.025,-5]}><boxGeometry args={[8,.08,178]}/><meshStandardMaterial color={PALETTE.road}/></mesh><mesh position={[x-5,.09,-5]}><boxGeometry args={[2,.16,178]}/><meshStandardMaterial color={PALETTE.sidewalk}/></mesh><mesh position={[x+5,.09,-5]}><boxGeometry args={[2,.16,178]}/><meshStandardMaterial color={PALETTE.sidewalk}/></mesh></group>)}
    {horizontal.map(z=><group key={z}><mesh position={[-8,.03,z]}><boxGeometry args={[164,.09,8]}/><meshStandardMaterial color="#454b4d"/></mesh><mesh position={[-8,.095,z-5]}><boxGeometry args={[164,.17,2]}/><meshStandardMaterial color={PALETTE.sidewalk}/></mesh><mesh position={[-8,.095,z+5]}><boxGeometry args={[164,.17,2]}/><meshStandardMaterial color={PALETTE.sidewalk}/></mesh></group>)}
    <mesh position={[45,.02,-65]}><cylinderGeometry args={[18,18,.05,48]}/><meshStandardMaterial color="#3d7180" roughness={.25}/></mesh>
    <mesh position={[16,.02,78]}><boxGeometry args={[112,.05,12]}/><meshStandardMaterial color="#356b78" roughness={.2}/></mesh>
  </RigidBody>;
}

function WorldBoundary() {
  const { minX, maxX, minZ, maxZ, wallHeight, wallThickness } = WORLD_BOUNDS;
  const width = maxX - minX, depth = maxZ - minZ, midY = wallHeight / 2;
  return <RigidBody type="fixed" colliders={false}>
    <CuboidCollider args={[width / 2, wallHeight / 2, wallThickness / 2]} position={[(minX + maxX) / 2, midY, minZ]}/>
    <CuboidCollider args={[width / 2, wallHeight / 2, wallThickness / 2]} position={[(minX + maxX) / 2, midY, maxZ]}/>
    <CuboidCollider args={[wallThickness / 2, wallHeight / 2, depth / 2]} position={[minX, midY, (minZ + maxZ) / 2]}/>
    <CuboidCollider args={[wallThickness / 2, wallHeight / 2, depth / 2]} position={[maxX, midY, (minZ + maxZ) / 2]}/>
    {/* Low visible fencing/planting makes the playable edge legible; tall colliders behind it are the final safeguard. */}
    {[minZ + .45, maxZ - .45].map(z => <group key={z}>{Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[minX + 2 + i * 3.7, .65, z]} castShadow><boxGeometry args={[3.25, 1.3, .35]}/><meshStandardMaterial color={i % 2 ? '#315844' : '#496d4d'}/></mesh>)}</group>)}
    {[minX + .45, maxX - .45].map(x => <group key={x}>{Array.from({ length: 18 }, (_, i) => <mesh key={i} position={[x, .65, minZ + 2 + i * 3.7]} castShadow><boxGeometry args={[.35, 1.3, 3.25]}/><meshStandardMaterial color={i % 2 ? '#315844' : '#496d4d'}/></mesh>)}</group>)}
  </RigidBody>;
}

function Pagoda({ night }: { night: boolean }) {
  return <RigidBody type="fixed" colliders={false}>
    <CuboidCollider args={[6.2, .5, 6.2]} position={[-10, .5, -62]}/>
    <group position={[-10, 0, -62]}>
      <mesh position-y={.3} receiveShadow><cylinderGeometry args={[7, 7.5, .6, 8]}/><meshStandardMaterial color="#e9dfc5"/></mesh>
      <mesh position={[0, .75, 0]}><cylinderGeometry args={[4.8, 5.7, .9, 32]}/><meshStandardMaterial color={PALETTE.deepGold}/></mesh>
      {[0, 1, 2, 3, 4].map(i => <mesh key={i} position-y={1.55 + i * 1.22} castShadow><cylinderGeometry args={[3.7 - i * .55, 4.25 - i * .55, 1.25, 32]}/><meshStandardMaterial color={i % 2 ? '#f0c94e' : PALETTE.gold} metalness={.35} roughness={.35} emissive={night ? '#76520e' : '#000'} emissiveIntensity={night ? .35 : 0}/></mesh>)}
      <mesh position-y={8.8} castShadow><coneGeometry args={[1.25, 4.3, 28]}/><meshStandardMaterial color="#f7d45b" metalness={.45}/></mesh>
      <mesh position-y={11}><sphereGeometry args={[.23, 12, 12]}/><meshStandardMaterial color={PALETTE.white} emissive={PALETTE.lamp} emissiveIntensity={night ? 3 : .2}/></mesh>
      {[-1, 1].flatMap(x => [-1, 1].map(z => <group key={`${x}${z}`} position={[x * 5.2, .6, z * 5.2]}><mesh position-y={.9}><cylinderGeometry args={[.55, .8, 1.8, 16]}/><meshStandardMaterial color={PALETTE.gold}/></mesh><mesh position-y={2.2}><coneGeometry args={[.55, 1.2, 16]}/><meshStandardMaterial color="#f0c94e"/></mesh></group>))}
      <Html position={[0, 1.1, 7.1]} center transform distanceFactor={8}><span className="district-sign">GOLDEN PAGODA GARDENS</span></Html>
    </group>
  </RigidBody>;
}

function Market() {
  return <group>{[-50, -46, -42].map((x, i) => <RigidBody type="fixed" colliders="cuboid" key={x}><group position={[x, 0, 14]}><mesh position-y={1}><boxGeometry args={[3.2, 2, 2.4]}/><meshStandardMaterial color="#8a5d3e"/></mesh><mesh position={[0, 2.2, 0]} rotation-z={i % 2 ? .04 : -.04}><boxGeometry args={[3.8, .12, 3]}/><meshStandardMaterial color={[PALETTE.marketRed, '#e1ad45', PALETTE.teal][i]}/></mesh>{[-.8, 0, .8].map((v, j) => <mesh key={j} position={[v, 1.55, -1.25]}><sphereGeometry args={[.22, 8, 8]}/><meshStandardMaterial color={['#dd753c', '#719447', '#d9c751'][j]}/></mesh>)}</group></RigidBody>)}</group>;
}

function TeaShop() {
  return <group>{[-61, -58, -55].map((x, i) => <group key={x} position={[x, 0, 6.4]}><mesh position-y={.55}><cylinderGeometry args={[.65, .65, .1, 16]}/><meshStandardMaterial color="#8a5536"/></mesh>{[-.75, .75].map(z => <mesh key={z} position={[0, .32, z]}><cylinderGeometry args={[.25, .3, .6, 10]}/><meshStandardMaterial color={i === 1 ? '#d39b44' : '#4d7770'}/></mesh>)}</group>)}<mesh position={[-58, 1, 5.75]}><boxGeometry args={[8, .12, 2.3]}/><meshStandardMaterial color="#d59b3c"/></mesh></group>;
}

function BusStation() {
  return <RigidBody type="fixed" colliders="cuboid"><group position={[-76, 0, -12]}><mesh position-y={1.15} castShadow><boxGeometry args={[6.5, 2.3, 2.4]}/><meshStandardMaterial color="#c65c45"/></mesh><mesh position={[-1.8, .55, 1.22]}><circleGeometry args={[.55, 16]}/><meshStandardMaterial color="#252c30"/></mesh><mesh position={[1.8, .55, 1.22]}><circleGeometry args={[.55, 16]}/><meshStandardMaterial color="#252c30"/></mesh><mesh position={[0, 1.45, 1.23]}><planeGeometry args={[4.5, .65]}/><meshStandardMaterial color="#a9d4d3"/></mesh></group></RigidBody>;
}

const PEDESTRIAN_ROUTES = [
  [[-15, 4], [-57, 4], [-57, 10], [-15, 10]], [[8, 8], [18, 8], [18, 12], [8, 12]],
  [[6, -6], [6, -19], [11, -19], [11, -6]], [[-15, 16], [-11, 16], [-11, 24], [22, 24]],
  [[-28, -8], [-15, -8], [-15, -3], [-28, -3]], [[-4, 25], [5, 25], [5, 7], [-4, 7]],
] as const;
const CLOTHES = ['#b34e3f', '#457b77', '#d49b42', '#725b8e', '#d27757', '#315f82'];

function Pedestrian({ route, offset, color }: { route: readonly (readonly [number, number])[]; offset: number; color: string }) {
  const ref = useRef<THREE.Group>(null), pauseUntil = useRef(0), waypoint = useRef(offset % route.length);
  useFrame(({ clock }, dt) => {
    const person = ref.current; if (!person) return;
    if (clock.elapsedTime < pauseUntil.current) { person.rotation.y += Math.sin(clock.elapsedTime + offset) * dt * .15; return; }
    const target = route[waypoint.current], dx = target[0] - person.position.x, dz = target[1] - person.position.z, distance = Math.hypot(dx, dz);
    if (distance < .15) { waypoint.current = (waypoint.current + 1) % route.length; pauseUntil.current = clock.elapsedTime + .7 + (offset % 3) * .35; return; }
    const speed = .75 + (offset % 4) * .09, step = Math.min(distance, speed * dt);
    person.position.x += dx / distance * step; person.position.z += dz / distance * step;
    person.rotation.y = THREE.MathUtils.damp(person.rotation.y, Math.atan2(dx, dz), 7, dt);
  });
  const start = route[offset % route.length];
  return <group ref={ref} position={[start[0], 0, start[1]]} scale={.94 + (offset % 3) * .035}>
    <mesh position-y={.92} castShadow><capsuleGeometry args={[.22, .72, 4, 7]}/><meshStandardMaterial color={color}/></mesh>
    <mesh position-y={1.68} castShadow><sphereGeometry args={[.22, 9, 8]}/><meshStandardMaterial color={offset % 2 ? '#9c6546' : '#bd805d'}/></mesh>
    <mesh position={[0, 1.86, -.02]}><sphereGeometry args={[.225, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]}/><meshStandardMaterial color={offset % 3 ? '#27221f' : '#51382a'}/></mesh>
  </group>;
}

function MovingVehicle({ lane, reverse = false }: { lane: number; reverse?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }, dt) => {
    if (!ref.current) return; const player = useGame.getState().player?.position;
    const blocked = player && Math.abs(player[0] - lane) < 2 && Math.abs(player[2] - ref.current.position.z) < 5;
    const direction = reverse ? 1 : -1; ref.current.position.z += direction * (blocked ? .2 : 2.1) * dt;
    if (ref.current.position.z * direction > 34) ref.current.position.z = -34 * direction;
  });
  return <group ref={ref} position={[lane, 0, reverse ? -25 : 25]} rotation-y={reverse ? Math.PI : 0}><mesh position-y={.55} castShadow><boxGeometry args={[1.55, 1.05, 3.2]}/><meshStandardMaterial color={reverse ? '#d6a23c' : '#497884'}/></mesh><mesh position={[0, 1, -.2]}><boxGeometry args={[1.35, .55, 1.45]}/><meshStandardMaterial color="#9cc2c2"/></mesh>{[-1, 1].flatMap(x=>[-1,1].map(z=><mesh key={`${x}${z}`} position={[x*.78,.27,z*1.05]} rotation-z={Math.PI/2}><cylinderGeometry args={[.28,.28,.15,10]}/><meshStandardMaterial color="#202629"/></mesh>))}</group>;
}

function StreetLife({ density }: { density: number }) {
  const count = density === 0 ? 10 : density === 1 ? 14 : 18;
  return <>{Array.from({length:count},(_,i)=><Pedestrian key={i} route={PEDESTRIAN_ROUTES[i%PEDESTRIAN_ROUTES.length]} offset={i} color={CLOTHES[i%CLOTHES.length]}/>)}
    {density > 0 && <><MovingVehicle lane={-2.25}/><MovingVehicle lane={2.25} reverse/></>}
    {[[-14, -5], [17, 5], [-11, -5]].map(([x, z], i) => <group key={x} position={[x, 0, z]} rotation-y={i ? Math.PI / 2 : 0}><mesh position-y={.55}><boxGeometry args={[3.3, 1.1, 1.55]}/><meshStandardMaterial color={['#527987', '#b65748', '#d5a143'][i]}/></mesh></group>)}
  </>;
}

function SpotMarker({ spot, active }: { spot: (typeof SPOTS)[number]; active: boolean }) {
  const marker = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const wave = (Math.sin(clock.elapsedTime * 3 + spot.position[0]) + 1) / 2;
    if (marker.current) {
      marker.current.position.y = 1.25 + wave * .25;
      marker.current.rotation.y = clock.elapsedTime * 1.2;
    }
    if (halo.current) {
      const scale = .82 + wave * .35;
      halo.current.scale.setScalar(scale);
    }
  });
  return <group position={spot.position}>
    <mesh ref={halo} position-y={.08} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[1.05, 1.38, 40]}/>
      <meshBasicMaterial color={spot.color} transparent opacity={active ? .95 : .58} depthWrite={false}/>
    </mesh>
    <mesh position-y={.04} rotation-x={-Math.PI / 2}>
      <circleGeometry args={[.92, 40]}/>
      <meshBasicMaterial color={spot.color} transparent opacity={active ? .24 : .1} depthWrite={false}/>
    </mesh>
    <group ref={marker}>
      <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        <octahedronGeometry args={[active ? .34 : .26, 0]}/>
        <meshStandardMaterial color={spot.color} emissive={spot.color} emissiveIntensity={active ? 2.8 : 1.4} toneMapped={false}/>
      </mesh>
      <pointLight color={spot.color} intensity={active ? 2.2 : .7} distance={active ? 5 : 3}/>
    </group>
    {active && <Html position={[0, 2.55, 0]} center distanceFactor={13}><div className="world-label"><b>INTERACTABLE</b><span>{spot.name}</span></div></Html>}
  </group>;
}

function Spots() {
  const activeTargetId = useGame(s => s.activeInteractionTarget?.id), discoveries=useGame(s=>s.player?.discoveries??[]);
  const available=(id:string)=>id==='market'?discoveries.includes('market_revealed'):id==='shwedagon'?discoveries.includes('landmark_revealed'):id==='viewpoint'?discoveries.includes('viewpoint_revealed'):true;
  return <>{SPOTS.filter(spot=>available(spot.id)).map(spot => <SpotMarker key={spot.id} spot={spot} active={activeTargetId === spot.id}/>)}</>;
}

function Lighting() {
  const minutes = useGame(s => s.player?.gameMinutes ?? 480), h = minutes / 60;
  const daylight = Math.max(.04, Math.sin(((h - 5) / 14) * Math.PI));
  const night = h < 6 || h >= 19;
  const dawn = THREE.MathUtils.smoothstep(h, 5, 8), dusk = THREE.MathUtils.smoothstep(h, 16.5, 19.5);
  const warm = Math.max(1 - dawn, dusk), sky = new THREE.Color('#78b7d0').lerp(new THREE.Color('#e78a68'), warm).lerp(new THREE.Color(PALETTE.night), night ? .9 : 0);
  const sunAngle = ((h - 6) / 12) * Math.PI, sun: [number, number, number] = [Math.cos(sunAngle) * 45, Math.max(-4, Math.sin(sunAngle) * 42), 18];
  return <><color attach="background" args={[sky]}/><fog attach="fog" args={[sky.clone().lerp(new THREE.Color('#829185'), .22), 38, 92]}/>{!night&&<Sky distance={450000} sunPosition={sun} inclination={.49} azimuth={(h - 6) / 24} turbidity={warm > .45 ? 9 : 5} rayleigh={warm > .45 ? 2.4 : 1.3}/>}<hemisphereLight args={[night ? '#62749b' : '#d7edf0', night ? '#18232e' : '#655b46', .35 + daylight * .62]}/><directionalLight castShadow position={sun} intensity={night ? .12 : daylight * 1.85} color={warm > .35 ? '#ffb06c' : '#fff4db'} shadow-mapSize={[1024, 1024]} shadow-camera-left={-35} shadow-camera-right={35} shadow-camera-top={35} shadow-camera-bottom={-35} shadow-camera-near={1} shadow-camera-far={90} shadow-bias={-.0002} shadow-normalBias={.025}/>{night && <Stars radius={70} depth={20} count={600} factor={2}/>} {[-14, 8, 19].flatMap(x => [-58, 8].map(z => <Lamp key={`${x}${z}`} x={x} z={z} night={night}/>))}<Lamp x={19} z={-8} night={night}/><Lamp x={12} z={-16} night={night}/></>;
}

function Controller() {
  const body = useRef<RapierRigidBody>(null), keys = useRef(new Set<string>()), yaw = useRef(-.6), pitch = useRef(.38), distance = useRef(8), actualDistance = useRef(8), dragging = useRef(false), state = useRef<AvatarMotion>('IDLE');
  const [anim, setAnim] = useState<AvatarMotion>('IDLE');
  const pos = useGame(s => s.player?.position), setActiveInteractionTarget = useGame(s => s.setActiveInteractionTarget), cameraMode = useGame(s => s.cameraMode), recoveryNonce = useGame(s => s.recoveryNonce), devFallNonce = useGame(s => s.devFallNonce);
  const { camera, gl } = useThree();
  const seenRecovery = useRef(recoveryNonce), seenFall = useRef(devFallNonce), diagnosticsAt = useRef(0), recovering = useRef(false);
  const velocity = useRef(new THREE.Vector3()), forward = useMemo(() => new THREE.Vector3(), []), right = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => { const game = useGame.getState(); if (!game.panel && !game.locationId && !game.cameraMode && !game.transitioning) keys.current.add(e.code); }, up = (e: KeyboardEvent) => keys.current.delete(e.code);
    const pointerDown = () => { dragging.current = true; }, pointerUp = () => { dragging.current = false; };
    const move = (e: PointerEvent) => { if (!dragging.current) return; yaw.current -= e.movementX * .004; pitch.current = THREE.MathUtils.clamp(pitch.current + e.movementY * .003, CAMERA.minPitch, CAMERA.maxPitch); };
    const wheel = (e: WheelEvent) => { distance.current = THREE.MathUtils.clamp(distance.current + e.deltaY * .008, CAMERA.minDistance, CAMERA.maxDistance); };
    addEventListener('keydown', down); addEventListener('keyup', up); addEventListener('pointerup', pointerUp); addEventListener('pointermove', move); gl.domElement.addEventListener('pointerdown', pointerDown); gl.domElement.addEventListener('wheel', wheel);
    return () => { removeEventListener('keydown', down); removeEventListener('keyup', up); removeEventListener('pointerup', pointerUp); removeEventListener('pointermove', move); gl.domElement.removeEventListener('pointerdown', pointerDown); gl.domElement.removeEventListener('wheel', wheel); };
  }, [gl]);
  useEffect(() => useGame.subscribe(s => { if (s.panel || s.locationId || s.cameraMode || s.transitioning) keys.current.clear(); }), []);
  const recover = (automatic: boolean) => {
    const b = body.current, player = useGame.getState().player; if (!b || !player || recovering.current) return;
    recovering.current = true;
    const target = isSafeWorldPosition(player.lastSafePosition) ? player.lastSafePosition : safeSpawn(player.currentCheckpoint).position;
    const old = b.translation(); debugPositionWrite(automatic ? 'FALL_RECOVERY' : 'RESET_POSITION', [old.x, old.y, old.z], [...target]);
    const diagnostics=useGame.getState().worldDiagnostics;if(diagnostics)useGame.getState().setWorldDiagnostics({...diagnostics,lastWrite:automatic?'FALL_RECOVERY':'RESET_POSITION',lastTeleport:automatic?'FALL_RECOVERY':'RESET_POSITION'});
    b.setTranslation({ x: target[0], y: Math.max(1.1, target[1]), z: target[2] }, true);
    b.setLinvel({ x: 0, y: 0, z: 0 }, true); b.setAngvel({ x: 0, y: 0, z: 0 }, true); b.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
    velocity.current.set(0, 0, 0); actualDistance.current = Math.min(distance.current, 6);
    const focus = new THREE.Vector3(target[0], target[1] + 1.35, target[2]); camera.position.copy(focus).add(new THREE.Vector3(0, 3, 5)); camera.lookAt(focus);
    player.position = [...target]; useGame.getState().setCameraMode(false); useGame.getState().setNotice(automatic ? 'Returned to a safe location.' : 'Position reset · Journey progress preserved.');
    setTimeout(() => { recovering.current = false; }, 300);
  };
  useEffect(() => { if (seenRecovery.current !== recoveryNonce) { seenRecovery.current = recoveryNonce; recover(false); } }, [recoveryNonce]);
  useEffect(() => { if (seenFall.current !== devFallNonce && body.current) { seenFall.current = devFallNonce; const old=body.current.translation(),to:[number,number,number]=[0,WORLD_BOUNDS.killY-2,0];debugPositionWrite('DEV_TELEPORT',[old.x,old.y,old.z],to);body.current.setTranslation({x:to[0],y:to[1],z:to[2]},true); } }, [devFallNonce]);
  useFrame((_, dt) => {
    const b = body.current; if (!b) return;
    const t = b.translation(), inputX = Number(keys.current.has('KeyD')) - Number(keys.current.has('KeyA')), inputZ = Number(keys.current.has('KeyW')) - Number(keys.current.has('KeyS'));
    if (t.y < WORLD_BOUNDS.killY) { recover(true); return; }
    forward.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current)); right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const desired = forward.multiplyScalar(inputZ).add(right.multiplyScalar(inputX)); const jogging = keys.current.has('ShiftLeft') || keys.current.has('ShiftRight');
    if (desired.lengthSq()) desired.normalize().multiplyScalar(jogging ? MOVEMENT.jogSpeed : MOVEMENT.walkSpeed);
    const blend = 1 - Math.exp(-dt * (desired.lengthSq() ? MOVEMENT.acceleration : MOVEMENT.deceleration)); velocity.current.lerp(desired, blend);
    const current = b.linvel(); b.setLinvel({ x: velocity.current.x, y: current.y, z: velocity.current.z }, true);
    if (velocity.current.lengthSq() > .08) { const targetYaw = Math.atan2(velocity.current.x, velocity.current.z); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, targetYaw, 0)); const old = b.rotation(); const currentQ = new THREE.Quaternion(old.x, old.y, old.z, old.w).slerp(q, 1 - Math.exp(-dt * MOVEMENT.rotationSpeed)); b.setRotation(currentQ, true); }
    const nextState: AvatarMotion = velocity.current.length() < .2 ? 'IDLE' : jogging && velocity.current.length()>4.2 ? 'JOG' : 'WALK'; if (nextState !== state.current) { state.current = nextState; setAnim(nextState); }
    const player = useGame.getState().player; if (player) { const old:[number,number,number]=[...player.position]; player.position=[t.x,t.y,t.z];debugPositionWrite('PHYSICS_MOVEMENT',old,player.position); }
    const focus = new THREE.Vector3(t.x, t.y + CAMERA.shoulderHeight, t.z), orbit = new THREE.Vector3(Math.sin(yaw.current) * Math.cos(pitch.current), Math.sin(pitch.current), Math.cos(yaw.current) * Math.cos(pitch.current));
    const ray = new THREE.Ray(focus,orbit), hit = new THREE.Vector3(); let safe=distance.current;
    const blockers=[...BUILDINGS.map(b=>new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(...b.p),new THREE.Vector3(...b.s)).expandByScalar(.35)),new THREE.Box3(new THREE.Vector3(12,-.2,-23),new THREE.Vector3(26,12,-9))];
    for(const box of blockers){const point=ray.intersectBox(box,hit);if(point)safe=Math.min(safe,Math.max(2.2,point.distanceTo(focus)-CAMERA.collisionPadding));}
    actualDistance.current=THREE.MathUtils.damp(actualDistance.current,safe,safe<actualDistance.current?18:CAMERA.collisionRecovery,dt);
    const desiredCamera=focus.clone().addScaledVector(orbit,actualDistance.current); camera.position.lerp(desiredCamera,1-Math.exp(-dt*12));
    const matrix=new THREE.Matrix4().lookAt(camera.position,focus,camera.up), targetRotation=new THREE.Quaternion().setFromRotationMatrix(matrix); camera.quaternion.slerp(targetRotation,1-Math.exp(-dt*16));
    const candidate=interactionTargetAt([t.x,t.y,t.z]);const known=!candidate||candidate.id==='market'?player?.discoveries.includes('market_revealed'):candidate.id==='shwedagon'?player?.discoveries.includes('landmark_revealed'):candidate.id==='viewpoint'?player?.discoveries.includes('viewpoint_revealed'):true;setActiveInteractionTarget(known?candidate:null);
    if (performance.now()-diagnosticsAt.current>500){diagnosticsAt.current=performance.now();const store=useGame.getState(),p=store.player,previous=store.worldDiagnostics;if(p)store.setWorldDiagnostics({position:[t.x,t.y,t.z],visual:[t.x,t.y,t.z],lastSaved:previous?.lastSaved??p.lastSafePosition,lastSafe:p.lastSafePosition,lastWrite:'PHYSICS_MOVEMENT',lastTeleport:previous?.lastTeleport??'NONE',checkpoint:p.currentCheckpoint,outOfBounds:t.y<WORLD_BOUNDS.killY||t.x<WORLD_BOUNDS.minX||t.x>WORLD_BOUNDS.maxX||t.z<WORLD_BOUNDS.minZ||t.z>WORLD_BOUNDS.maxZ,grounded:t.y>=.9&&t.y<1.35});}
  });
  const loadout=useGame(s=>s.player!.avatarLoadout);
  return <RigidBody ref={body} colliders={false} position={pos ?? DEFAULT_SPAWN.position} enabledRotations={[false, true, false]} friction={0} linearDamping={1.5} angularDamping={8} canSleep={false} ccd><CapsuleCollider args={[.65, .38]} position={[0, 1.03, 0]}/><PlayerAvatar loadout={loadout} motion={anim}/></RigidBody>;
}

function DistrictScenery({zoneId}:{zoneId:string}){const zone=YANGON_ZONES.find(z=>z.id===zoneId)!;const cx=(zone.bounds.minX+zone.bounds.maxX)/2,cz=(zone.bounds.minZ+zone.bounds.maxZ)/2;if(zoneId==='tamarind_quarter')return null;const count=zone.visualTheme.density==='DENSE'?10:6;return <group>{Array.from({length:count},(_,i)=>{const cols=5,x=zone.bounds.minX+9+(i%cols)*9,z=zone.bounds.minZ+10+Math.floor(i/cols)*15;return <Building key={i} b={{p:[x,3.5+(i%3),z],s:[6.5,7+(i%3)*2,7],color:i%2?zone.visualTheme.accent:'#d4aa78'}}/>})}{zoneId==='market_chinatown'&&Array.from({length:6},(_,i)=><group key={i} position={[27+i*6,0,5]}><mesh position-y={1}><boxGeometry args={[4,2,3]}/><meshStandardMaterial color={i%2?'#c55543':'#dda83e'}/></mesh></group>)}{zoneId==='kandawgyi'&&Array.from({length:8},(_,i)=><Tree key={i} x={25+(i%4)*14} z={-87+Math.floor(i/4)*42}/>)}{zoneId==='waterfront'&&<group position={[22,0,72]}><mesh position-y={1.8}><boxGeometry args={[8,3.6,5]}/><meshStandardMaterial color="#b88a63"/></mesh><Html position={[0,4,0]} center><span className="district-sign">RIVER JETTY · ဆိပ်ကမ်း</span></Html></group>}<Html position={[cx,7,cz]} center distanceFactor={18}><span className="district-sign">{zone.name.toUpperCase()}</span></Html></group>}

function StreamedDistricts(){const [ids,setIds]=useState(()=>loadedZonesAt(useGame.getState().player?.position??DEFAULT_SPAWN.position).map(z=>z.id));const last=useRef('');useFrame(()=>{const p=useGame.getState().player?.position;if(!p)return;const next=loadedZonesAt(p).map(z=>z.id),key=next.join('|');if(key!==last.current){last.current=key;setIds(next)}});return <>{ids.map(id=><DistrictScenery key={id} zoneId={id}/>)}</>}

function PhysicsWorld({ graphics, trees, night }: { graphics: string; trees: number[][]; night: boolean }) {
  return <Physics gravity={[0, -22, 0]}>
    <Roads/>
    <WorldBoundary/>
    {BUILDINGS.map((b, i) => <Building key={i} b={b}/>)}
    <Pagoda night={night}/>
    <Market/>
    <TeaShop/>
    <BusStation/>
    <StreamedDistricts/>
    <StreetLife density={graphics === 'LOW' ? 0 : graphics === 'HIGH' ? 2 : 1}/>
    <Spots/>
    {trees.slice(0, graphics === 'LOW' ? 7 : trees.length).map(([x, z], i) => <Tree key={i} x={x} z={z} scale={.85 + i % 3 * .12}/>)}
    <Controller/>
  </Physics>;
}

function PerformanceReporter() {
  const { gl } = useThree();
  const samples = useRef<number[]>([]), lastReport = useRef(0);
  useFrame((_, dt) => {
    samples.current.push(1 / Math.max(dt, .001));
    if (samples.current.length > 90) samples.current.shift();
    if (performance.now() - lastReport.current < 1000) return;
    lastReport.current = performance.now();
    const current = useGame.getState().worldDiagnostics;
    if (!current) return;
    const memory = gl.info.memory, render = gl.info.render;
    useGame.getState().setWorldDiagnostics({ ...current, fps: Math.round(samples.current.reduce((a,b)=>a+b,0) / samples.current.length), drawCalls: render.calls, triangles: render.triangles, textures: memory.textures, geometries: memory.geometries });
  });
  return null;
}

export default function World() {
  const graphics = typeof window === 'undefined' ? 'MEDIUM' : loadSettings().graphics;
  const trees = [[-15, 12], [-16, 19], [7, 10], [20, 7], [-11, 17], [24, -8], [12, -10], [-11, -20], [9, -22], [-15, -9], [-30, -6], [-30, 26]];
  const minutes = useGame(s => s.player?.gameMinutes ?? 480);
  const night = minutes / 60 < 6 || minutes / 60 >= 19;
  return <Canvas shadows={graphics !== 'LOW'} camera={{ position: [-14, 8, 20], fov: 52, near: .1, far: 190 }} gl={{ antialias: graphics !== 'LOW', preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }} dpr={graphics === 'HIGH' ? [1, 2] : [1, 1.4]}>
    <Lighting/>
    <PhysicsWorld graphics={graphics} trees={trees} night={night}/>
    {process.env.NODE_ENV !== 'production' && <PerformanceReporter/>}
  </Canvas>;
}
