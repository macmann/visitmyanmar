'use client';
import AvatarModel,{type AvatarMotion} from './AvatarModel';
import type { AvatarLoadout } from '@/lib/types';
export default function PlayerAvatar({loadout,motion}:{loadout:AvatarLoadout;motion:AvatarMotion}){return <group position={[0,0,0]}><AvatarModel loadout={loadout} motion={motion}/></group>}
