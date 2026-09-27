'use client';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AVATAR_ASSETS, avatarItem } from '@/content/avatar';
import type { AvatarLoadout } from '@/lib/types';

export type AvatarMotion='IDLE'|'WALK'|'JOG'|'SLEEP';
type Props={loadout:AvatarLoadout;motion?:AvatarMotion;modelUrl?:string|null};

function RiggedAvatar({url,motion}:{url:string;motion:AvatarMotion}){
 const root=useRef<THREE.Group>(null);const gltf=useGLTF(url);const {actions}=useAnimations(gltf.animations,root);
 useEffect(()=>{const name=AVATAR_ASSETS.animations[motion],next=actions[name];if(!next)return;next.reset().fadeIn(.28).play();return()=>{next.fadeOut(.28)}},[actions,motion]);
 useEffect(()=>{gltf.scene.traverse(object=>{if(object instanceof THREE.SkinnedMesh||object instanceof THREE.Mesh){object.castShadow=true;object.receiveShadow=true}})},[gltf.scene]);
 return <group ref={root}><primitive object={gltf.scene}/></group>;
}

function Limb({side,skin,cloth,shoe,motion,phase}:{side:number;skin:string;cloth:string;shoe:string;motion:AvatarMotion;phase:React.MutableRefObject<number>}){
 const arm=useRef<THREE.Group>(null),leg=useRef<THREE.Group>(null);
 useFrame(()=>{const moving=motion==='WALK'||motion==='JOG';const amount=motion==='JOG'?.72:.46;const wave=moving?Math.sin(phase.current)*amount:Math.sin(phase.current*.28)*.025;if(arm.current)arm.current.rotation.x=side*wave;if(leg.current)leg.current.rotation.x=-side*wave});
 return <>
  <group ref={arm} position={[side*.43,1.56,0]}><mesh castShadow position={[0,-.34,0]}><capsuleGeometry args={[.105,.48,8,12]}/><meshStandardMaterial color={cloth}/></mesh><mesh castShadow position={[0,-.76,0]}><capsuleGeometry args={[.09,.35,8,12]}/><meshStandardMaterial color={skin}/></mesh><mesh castShadow position={[0,-1.02,.015]} scale={[.9,1.12,.75]}><sphereGeometry args={[.12,14,12]}/><meshStandardMaterial color={skin}/></mesh></group>
  <group ref={leg} position={[side*.205,.78,0]}><mesh castShadow position={[0,-.34,0]}><capsuleGeometry args={[.145,.48,8,12]}/><meshStandardMaterial color={cloth}/></mesh><mesh castShadow position={[0,-.83,0]}><capsuleGeometry args={[.125,.42,8,12]}/><meshStandardMaterial color={cloth}/></mesh><group name={side < 0 ? 'LeftFootSocket' : 'RightFootSocket'} position={[0,-.66,.09]}><mesh castShadow scale={[1,.72,1.55]}><sphereGeometry args={[.17,16,12]}/><meshStandardMaterial color={shoe}/></mesh></group></group>
 </>;
}

function ProceduralTraveler({loadout,motion='IDLE'}:Props){
 const root=useRef<THREE.Group>(null),phase=useRef(0);const body=avatarItem(loadout.BODY),hair=avatarItem(loadout.HAIR),top=avatarItem(loadout.TOP),bottom=avatarItem(loadout.BOTTOM),shoes=avatarItem(loadout.SHOES),bag=avatarItem(loadout.BAG),hat=avatarItem(loadout.HAT);const skin=body?.color??'#c58b62';
 useFrame((_,dt)=>{phase.current+=dt*(motion==='JOG'?10:motion==='WALK'?6:2);if(root.current){const target=motion==='SLEEP'?-Math.PI/2:0;root.current.rotation.z=THREE.MathUtils.damp(root.current.rotation.z,target,8,dt);root.current.position.y=motion==='IDLE'?Math.sin(phase.current)*.008:0}});
 return <group ref={root} dispose={null}>
  <mesh castShadow position={[0,1.34,0]} scale={[.82,1,.58]}><sphereGeometry args={[.52,24,18]}/><meshStandardMaterial color={top?.color}/></mesh>
  <mesh castShadow position={[0,1.77,0]} scale={[1,.68,.72]}><sphereGeometry args={[.24,18,14]}/><meshStandardMaterial color={skin}/></mesh>
  <mesh castShadow position={[0,1.94,0]} scale={[.88,1.05,.82]}><sphereGeometry args={[.29,24,18]}/><meshStandardMaterial color={skin}/></mesh>
  <mesh castShadow position={[0,2.105,-.005]} scale={[1.02,.62,1.02]}><sphereGeometry args={[.29,20,14,0,Math.PI*2,0,Math.PI/2]}/><meshStandardMaterial color={hair?.color??'#202322'}/></mesh>
  {loadout.HAIR==='hair_medium_brown'&&<mesh castShadow position={[0,1.93,-.22]} scale={[1,.9,.5]}><sphereGeometry args={[.31,18,14]}/><meshStandardMaterial color={hair?.color}/></mesh>}{loadout.HAIR==='hair_tied_black'&&<mesh castShadow position={[0,1.9,-.34]}><sphereGeometry args={[.14,16,12]}/><meshStandardMaterial color={hair?.color}/></mesh>}
  <mesh castShadow position={[0,.93,0]} scale={[1,.7,.72]}><sphereGeometry args={[.39,20,14]}/><meshStandardMaterial color={bottom?.color}/></mesh>
  <Limb side={-1} skin={skin} cloth={top?.color??'#39778a'} shoe={shoes?.color??'#e6e3d9'} motion={motion} phase={phase}/><Limb side={1} skin={skin} cloth={top?.color??'#39778a'} shoe={shoes?.color??'#e6e3d9'} motion={motion} phase={phase}/>
  {bag&&<group position={[0,1.35,-.43]}><mesh castShadow scale={[.72,1,.38]}><sphereGeometry args={[.38,18,14]}/><meshStandardMaterial color={bag.color}/></mesh><mesh position={[0,.05,-.15]}><torusGeometry args={[.25,.035,8,18]}/><meshStandardMaterial color={bag.accent}/></mesh></group>}
  {top?.accent&&<mesh position={[0,1.4,.43]}><circleGeometry args={[.1,18]}/><meshStandardMaterial color={top.accent}/></mesh>}
  {hat&&<group position={[0,2.2,0]}><mesh castShadow scale={[1,.38,1]}><sphereGeometry args={[.32,18,12]}/><meshStandardMaterial color={hat.color}/></mesh><mesh position={[0,-.03,.25]}><boxGeometry args={[.42,.045,.28]}/><meshStandardMaterial color={hat.color}/></mesh></group>}
 </group>;
}

export default function AvatarModel(props:Props){const url=props.modelUrl??AVATAR_ASSETS.baseModel;return url?<Suspense fallback={<ProceduralTraveler {...props}/>}><RiggedAvatar url={url} motion={props.motion??'IDLE'}/></Suspense>:<ProceduralTraveler {...props}/>}
