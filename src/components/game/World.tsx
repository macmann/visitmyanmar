'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Stars } from '@react-three/drei';
import { CapsuleCollider, CuboidCollider, Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { PALETTE } from '@/content/assets';
import { SPOTS } from '@/content/game';
import { loadSettings } from '@/lib/settings';
import { attractionStatus } from '@/lib/rules';
import { useGame } from '@/store/game';

type BoxDef = { p: [number, number, number]; s: [number, number, number]; color?: string; roof?: string; label?: string };
const BUILDINGS: BoxDef[] = [
  { p: [-24, 4, 16], s: [10, 8, 8], color: PALETTE.cream, roof: PALETTE.roof, label: 'GOLDEN TAMARIND' },
  { p: [-24, 5, 4], s: [9, 10, 9], color: '#c87d62' }, { p: [-24, 4, -5], s: [9, 8, 7], color: '#e1b174' },
  { p: [-8, 3, 12], s: [9, 6, 7], color: PALETTE.teal, label: 'MORNING STAR · လက်ဖက်ရည်' },
  { p: [4, 4, 16], s: [8, 8, 8], color: '#d48866', label: 'GENERAL GOODS' },
  { p: [25, 4, 10], s: [8, 8, 11], color: '#dfb279' }, { p: [26, 5, -1], s: [8, 10, 8], color: '#8aa19a' },
  { p: [4, 4, -17], s: [9, 8, 7], color: '#be7967' }, { p: [-7, 5, -18], s: [9, 10, 7], color: '#d8aa72' },
  { p: [-24, 3.5, -17], s: [11, 7, 8], color: '#6e8791', label: 'YANGON ROAD · TICKETS' },
  { p: [29, 3.5, 22], s: [7, 7, 7], color: '#b56e59' },
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
  return <RigidBody type="fixed" colliders={false}>
    <CuboidCollider args={[35, .1, 35]} position={[0, -.1, 0]}/>
    <mesh receiveShadow rotation-x={-Math.PI / 2}><planeGeometry args={[70, 70]}/><meshStandardMaterial color="#647d5d"/></mesh>
    <mesh position={[0, .025, 0]} receiveShadow><boxGeometry args={[10, .08, 70]}/><meshStandardMaterial color={PALETTE.road}/></mesh>
    <mesh position={[0, .03, 0]} rotation-y={Math.PI / 2} receiveShadow><boxGeometry args={[9, .09, 70]}/><meshStandardMaterial color="#454b4d"/></mesh>
    {[-6, 6].map(x => <mesh key={x} position={[x, .09, 0]}><boxGeometry args={[2, .16, 70]}/><meshStandardMaterial color={PALETTE.sidewalk}/></mesh>)}
    {[-5.5, 5.5].map(z => <mesh key={z} position={[0, .095, z]}><boxGeometry args={[70, .17, 2]}/><meshStandardMaterial color={PALETTE.sidewalk}/></mesh>)}
    {Array.from({ length: 10 }).map((_, i) => <mesh key={i} position={[0, .1, -31 + i * 7]}><boxGeometry args={[.14, .04, 3.2]}/><meshStandardMaterial color={PALETTE.roadLine}/></mesh>)}
    {Array.from({ length: 10 }).map((_, i) => <mesh key={i} position={[-31 + i * 7, .105, 0]}><boxGeometry args={[3.2, .04, .14]}/><meshStandardMaterial color={PALETTE.roadLine}/></mesh>)}
    {[-3.8, -2.6, -1.4, 1.4, 2.6, 3.8].map(x => <mesh key={x} position={[x, .11, 4.2]}><boxGeometry args={[.7, .04, 2.5]}/><meshStandardMaterial color="#e7e2d1"/></mesh>)}
  </RigidBody>;
}

function Pagoda({ night }: { night: boolean }) {
  return <RigidBody type="fixed" colliders={false}>
    <CuboidCollider args={[6.2, .5, 6.2]} position={[19, .5, -16]}/>
    <group position={[19, 0, -16]}>
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
  return <group>{[9, 13, 17].map((x, i) => <RigidBody type="fixed" colliders="cuboid" key={x}><group position={[x, 0, 14]}><mesh position-y={1}><boxGeometry args={[3.2, 2, 2.4]}/><meshStandardMaterial color="#8a5d3e"/></mesh><mesh position={[0, 2.2, 0]} rotation-z={i % 2 ? .04 : -.04}><boxGeometry args={[3.8, .12, 3]}/><meshStandardMaterial color={[PALETTE.marketRed, '#e1ad45', PALETTE.teal][i]}/></mesh>{[-.8, 0, .8].map((v, j) => <mesh key={j} position={[v, 1.55, -1.25]}><sphereGeometry args={[.22, 8, 8]}/><meshStandardMaterial color={['#dd753c', '#719447', '#d9c751'][j]}/></mesh>)}</group></RigidBody>)}</group>;
}

function TeaShop() {
  return <group>{[-10, -7, -4].map((x, i) => <group key={x} position={[x, 0, 6.4]}><mesh position-y={.55}><cylinderGeometry args={[.65, .65, .1, 16]}/><meshStandardMaterial color="#8a5536"/></mesh>{[-.75, .75].map(z => <mesh key={z} position={[0, .32, z]}><cylinderGeometry args={[.25, .3, .6, 10]}/><meshStandardMaterial color={i === 1 ? '#d39b44' : '#4d7770'}/></mesh>)}</group>)}<mesh position={[-7, 1, 5.75]}><boxGeometry args={[8, .12, 2.3]}/><meshStandardMaterial color="#d59b3c"/></mesh></group>;
}

function BusStation() {
  return <RigidBody type="fixed" colliders="cuboid"><group position={[-20, 0, -12]}><mesh position-y={1.15} castShadow><boxGeometry args={[6.5, 2.3, 2.4]}/><meshStandardMaterial color="#c65c45"/></mesh><mesh position={[-1.8, .55, 1.22]}><circleGeometry args={[.55, 16]}/><meshStandardMaterial color="#252c30"/></mesh><mesh position={[1.8, .55, 1.22]}><circleGeometry args={[.55, 16]}/><meshStandardMaterial color="#252c30"/></mesh><mesh position={[0, 1.45, 1.23]}><planeGeometry args={[4.5, .65]}/><meshStandardMaterial color="#a9d4d3"/></mesh></group></RigidBody>;
}

function StreetLife() {
  const people = [[-10, 0, 4], [10, 0, 8], [16, 0, 8], [7, 0, -5], [25, 0, 16]] as const;
  return <>{people.map((p, i) => <group key={i} position={p}><mesh position-y={.9}><capsuleGeometry args={[.22, .75, 5, 8]}/><meshStandardMaterial color={['#b34e3f', '#457b77', '#d49b42', '#725b8e', '#d27757'][i]}/></mesh><mesh position-y={1.65}><sphereGeometry args={[.22, 10, 10]}/><meshStandardMaterial color="#9c6546"/></mesh></group>)}{[[-14, -5], [17, 5], [29, -5]].map(([x, z], i) => <group key={x} position={[x, 0, z]} rotation-y={i ? Math.PI / 2 : 0}><mesh position-y={.55}><boxGeometry args={[3.3, 1.1, 1.55]}/><meshStandardMaterial color={['#527987', '#b65748', '#d5a143'][i]}/></mesh>{[-1, 1].map(v => <mesh key={v} position={[v, .2, .82]} rotation-x={Math.PI / 2}><cylinderGeometry args={[.32, .32, .16, 12]}/><meshStandardMaterial color="#202629"/></mesh>)}</group>)}</>;
}

function Spots() {
  const nearby = useGame(s => s.nearby);
  return <>{SPOTS.map(s => <group key={s.id} position={s.position}><mesh position-y={.13} rotation-x={-Math.PI / 2}><ringGeometry args={[1.15, 1.28, 32]}/><meshBasicMaterial color={s.color} transparent opacity={nearby === s.id ? .9 : .18}/></mesh>{nearby === s.id && <Html position={[0, 2.7, 0]} center distanceFactor={13}><div className="world-label">{s.name}</div></Html>}</group>)}</>;
}

function Lighting() {
  const minutes = useGame(s => s.player?.gameMinutes ?? 480), h = minutes / 60;
  const daylight = Math.max(.06, Math.sin(((h - 5) / 14) * Math.PI));
  const night = h < 6 || h >= 19;
  const sunset = h >= 17 && h < 19;
  return <><color attach="background" args={[night ? PALETTE.night : sunset ? '#d77f63' : '#83b8c1']}/><fog attach="fog" args={[night ? '#17253a' : sunset ? '#b67865' : '#8eaaa0', 40, 88]}/><hemisphereLight args={[night ? '#63759a' : '#c7e5e5', '#554b3f', .35 + daylight * .55]}/><directionalLight castShadow position={[h < 12 ? -20 : 20, 24, 12]} intensity={daylight * 1.6} color={sunset ? '#ffad6c' : '#fff2d0'} shadow-mapSize={[1024, 1024]} shadow-camera-far={80}/>{night && <Stars radius={70} depth={20} count={600} factor={2}/>} {[-14, 8, 19].flatMap(x => [-8, 8].map(z => <Lamp key={`${x}${z}`} x={x} z={z} night={night}/>))}<Lamp x={19} z={-8} night={night}/><Lamp x={12} z={-16} night={night}/><Pagoda night={night}/></>;
}

type AnimState = 'IDLE' | 'WALK' | 'JOG' | 'INTERACT' | 'PHOTO';
function AvatarVisual({ state }: { state: AnimState }) {
  const root = useRef<THREE.Group>(null), phase = useRef(0);
  useFrame((_, dt) => { phase.current += dt * (state === 'JOG' ? 10 : state === 'WALK' ? 6 : 2); if (root.current) root.current.position.y = state === 'IDLE' ? Math.sin(phase.current) * .015 : Math.abs(Math.sin(phase.current)) * .06; });
  const swing = state === 'JOG' ? .55 : state === 'WALK' ? .32 : .04;
  return <group ref={root}><mesh castShadow position-y={1.12}><capsuleGeometry args={[.32, .9, 7, 12]}/><meshStandardMaterial color="#b94f3e"/></mesh><mesh castShadow position-y={2.02}><sphereGeometry args={[.3, 16, 16]}/><meshStandardMaterial color="#9d6546"/></mesh><mesh position={[0, 2.32, 0]}><sphereGeometry args={[.31, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]}/><meshStandardMaterial color="#252d2c"/></mesh><mesh position={[0, 1.15, -.33]}><boxGeometry args={[.62, .78, .2]}/><meshStandardMaterial color="#315b63"/></mesh>{[-1, 1].map(side => <group key={side} rotation-z={side * Math.sin(phase.current) * swing}><mesh position={[side * .45, 1.2, 0]}><capsuleGeometry args={[.1, .62, 5, 8]}/><meshStandardMaterial color="#9d6546"/></mesh><mesh position={[side * .2, .35, 0]}><capsuleGeometry args={[.12, .7, 5, 8]}/><meshStandardMaterial color="#273a43"/></mesh></group>)}</group>;
}

function Controller() {
  const body = useRef<RapierRigidBody>(null), keys = useRef(new Set<string>()), yaw = useRef(-.6), pitch = useRef(.48), distance = useRef(9), dragging = useRef(false), state = useRef<AnimState>('IDLE');
  const [anim, setAnim] = useState<AnimState>('IDLE');
  const pos = useGame(s => s.player?.position), setNearby = useGame(s => s.setNearby), cameraMode = useGame(s => s.cameraMode);
  const { camera, gl } = useThree();
  const velocity = useRef(new THREE.Vector3()), forward = useMemo(() => new THREE.Vector3(), []), right = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => keys.current.add(e.code), up = (e: KeyboardEvent) => keys.current.delete(e.code);
    const pointerDown = () => { dragging.current = true; }, pointerUp = () => { dragging.current = false; };
    const move = (e: PointerEvent) => { if (!dragging.current) return; yaw.current -= e.movementX * .004; pitch.current = THREE.MathUtils.clamp(pitch.current + e.movementY * .003, .18, 1.05); };
    const wheel = (e: WheelEvent) => { distance.current = THREE.MathUtils.clamp(distance.current + e.deltaY * .008, 5, 13); };
    addEventListener('keydown', down); addEventListener('keyup', up); addEventListener('pointerup', pointerUp); addEventListener('pointermove', move); gl.domElement.addEventListener('pointerdown', pointerDown); gl.domElement.addEventListener('wheel', wheel);
    return () => { removeEventListener('keydown', down); removeEventListener('keyup', up); removeEventListener('pointerup', pointerUp); removeEventListener('pointermove', move); gl.domElement.removeEventListener('pointerdown', pointerDown); gl.domElement.removeEventListener('wheel', wheel); };
  }, [gl]);
  useFrame((_, dt) => {
    const b = body.current; if (!b) return;
    const t = b.translation(), inputX = Number(keys.current.has('KeyD')) - Number(keys.current.has('KeyA')), inputZ = Number(keys.current.has('KeyW')) - Number(keys.current.has('KeyS'));
    forward.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current)); right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
    const desired = forward.multiplyScalar(inputZ).add(right.multiplyScalar(inputX)); const jogging = keys.current.has('ShiftLeft') || keys.current.has('ShiftRight');
    if (desired.lengthSq()) desired.normalize().multiplyScalar(jogging ? 6.3 : 3.6);
    const blend = 1 - Math.exp(-dt * (desired.lengthSq() ? 11 : 8)); velocity.current.lerp(desired, blend);
    const current = b.linvel(); b.setLinvel({ x: velocity.current.x, y: current.y, z: velocity.current.z }, true);
    if (velocity.current.lengthSq() > .08) { const targetYaw = Math.atan2(velocity.current.x, velocity.current.z); const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, targetYaw, 0)); const old = b.rotation(); const currentQ = new THREE.Quaternion(old.x, old.y, old.z, old.w).slerp(q, 1 - Math.exp(-dt * 12)); b.setRotation(currentQ, true); }
    const nextState: AnimState = cameraMode ? 'PHOTO' : velocity.current.length() < .2 ? 'IDLE' : jogging ? 'JOG' : 'WALK'; if (nextState !== state.current) { state.current = nextState; setAnim(nextState); }
    const player = useGame.getState().player; if (player) player.position = [t.x, t.y, t.z];
    const focus = new THREE.Vector3(t.x, t.y + 1.25, t.z), horizontal = Math.cos(pitch.current) * distance.current;
    const desiredCamera = new THREE.Vector3(t.x + Math.sin(yaw.current) * horizontal, t.y + 1.4 + Math.sin(pitch.current) * distance.current, t.z + Math.cos(yaw.current) * horizontal);
    camera.position.lerp(desiredCamera, 1 - Math.exp(-dt * 9)); camera.lookAt(focus);
    const nearest = SPOTS.map(s => ({ id: s.id, d: Math.hypot(s.position[0] - t.x, s.position[2] - t.z) })).sort((a, c) => a.d - c.d)[0]; setNearby(nearest.d < 3.7 ? nearest.id : null);
  });
  return <RigidBody ref={body} colliders={false} position={pos ?? [-22, 1, 11]} enabledRotations={[false, true, false]} friction={0} linearDamping={1.5} canSleep={false}><CapsuleCollider args={[.65, .38]} position={[0, 1.03, 0]}/><AvatarVisual state={anim}/></RigidBody>;
}

export default function World() {
  const graphics = typeof window === 'undefined' ? 'MEDIUM' : loadSettings().graphics;
  const trees = [[-15, 12], [-16, 19], [7, 10], [20, 7], [29, 17], [24, -8], [12, -10], [29, -20], [9, -22], [-15, -9], [-30, -6], [-30, 26]];
  return <Canvas shadows={graphics !== 'LOW'} camera={{ position: [-14, 8, 20], fov: 52, near: .1, far: 110 }} gl={{ antialias: graphics !== 'LOW', preserveDrawingBuffer: true }} dpr={graphics === 'HIGH' ? [1, 2] : [1, 1.4]}>
    <Lighting/><Environment preset="sunset" background={false}/><Physics gravity={[0, -22, 0]}><Roads/>{BUILDINGS.map((b, i) => <Building key={i} b={b}/>)}<Market/><TeaShop/><BusStation/><StreetLife/><Spots/>{trees.slice(0, graphics === 'LOW' ? 7 : trees.length).map(([x, z], i) => <Tree key={i} x={x} z={z} scale={.85 + i % 3 * .12}/>)}<Controller/></Physics>
  </Canvas>;
}
