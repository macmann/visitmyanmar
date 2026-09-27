'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AvatarModel from './AvatarModel';
import type { AvatarLoadout } from '@/lib/types';
export default function AvatarPreview({loadout,className='avatar-preview'}:{loadout:AvatarLoadout;className?:string}){return <div className={className}><Canvas shadows camera={{position:[3,2.1,4.8],fov:34}}><color attach="background" args={['#d9d7c9']}/><ambientLight intensity={1.3}/><directionalLight castShadow position={[3,5,4]} intensity={2}/><group position={[0,-1.08,0]}><AvatarModel loadout={loadout}/></group><mesh receiveShadow rotation-x={-Math.PI/2} position-y={-1.09}><circleGeometry args={[2.2,48]}/><meshStandardMaterial color="#a9ad9b"/></mesh><OrbitControls target={[0,.05,0]} enablePan={false} minDistance={3.3} maxDistance={6} minPolarAngle={Math.PI*.28} maxPolarAngle={Math.PI*.58}/></Canvas><span>DRAG TO ROTATE · SCROLL TO ZOOM</span></div>}
