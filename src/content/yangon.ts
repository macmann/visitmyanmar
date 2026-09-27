import type { Vec3 } from '@/lib/types';

export type DistrictId = 'tamarind_quarter' | 'downtown' | 'market_chinatown' | 'shwedagon_area' | 'kandawgyi' | 'waterfront';
export type Bounds2D = { minX: number; maxX: number; minZ: number; maxZ: number };
export type WorldZone = {
  id: DistrictId;
  destinationId: 'YANGON';
  name: string;
  subtitle: string;
  bounds: Bounds2D;
  spawn: Vec3;
  transportPoint: Vec3;
  locationIds: string[];
  discoveryIds: string[];
  npcIds: string[];
  activities: string[];
  visualTheme: { ground: string; architecture: string; accent: string; density: 'QUIET' | 'MEDIUM' | 'DENSE' };
  ambientConfig: { day: string; evening: string; night: string; activityByTime: [number, number, number, number] };
  map: { x: number; y: number; width: number; height: number; roads: string[] };
};

/**
 * Yangon is intentionally compressed for play: relative character and broad
 * relationships are suggested, but these bounds are not GIS coordinates and
 * no structure should be read as an exact architectural reproduction.
 */
export const YANGON_ZONES: WorldZone[] = [
  { id:'tamarind_quarter', destinationId:'YANGON', name:'Tamarind Quarter', subtitle:'Guesthouse lanes', bounds:{minX:-88,maxX:-42,minZ:-25,maxZ:30}, spawn:[-68,1.1,5], transportPoint:[-51,1.1,-13], locationIds:['hotel','tea_shop','market','viewpoint','bus'], discoveryIds:['place_guest_house','place_tea_shop','place_market'], npcIds:['tea_shop_owner','street_local'], activities:['breakfast','neighbourhood-walk'], visualTheme:{ground:'#667957',architecture:'plaster-and-timber',accent:'#d99058',density:'MEDIUM'}, ambientConfig:{day:'neighbourhood',evening:'evening-lanes',night:'quiet-city',activityByTime:[.7,1,.75,.25]}, map:{x:4,y:34,width:24,height:31,roads:['west-loop','station-road']} },
  { id:'downtown', destinationId:'YANGON', name:'Downtown', subtitle:'Civic streets & Sule', bounds:{minX:-42,maxX:15,minZ:-35,maxZ:30}, spawn:[-18,1.1,1], transportPoint:[-35,1.1,18], locationIds:['sule','heritage_row','book_arcade'], discoveryIds:['place_sule','place_heritage_row','story_downtown_grid'], npcIds:['downtown_bookseller'], activities:['architecture-walk','photo-walk'], visualTheme:{ground:'#6d7658',architecture:'older-urban-blocks',accent:'#d4a62b',density:'DENSE'}, ambientConfig:{day:'downtown-traffic',evening:'downtown-evening',night:'reduced-traffic',activityByTime:[.65,1,.85,.35]}, map:{x:29,y:30,width:27,height:36,roads:['sule-road','merchant-road']} },
  { id:'market_chinatown', destinationId:'YANGON', name:'Market & Chinatown', subtitle:'Bogyoke lanes and street food', bounds:{minX:15,maxX:67,minZ:-35,maxZ:30}, spawn:[38,1.1,-1], transportPoint:[22,1.1,19], locationIds:['bogyoke_market','street_food','lantern_alley'], discoveryIds:['place_bogyoke','place_street_food','food_shan_noodles','food_samosa_salad'], npcIds:['bogyoke_seller','food_vendor'], activities:['browse','food-trail'], visualTheme:{ground:'#70694e',architecture:'market-arcades-and-shopfronts',accent:'#c74f3e',density:'DENSE'}, ambientConfig:{day:'market',evening:'street-food-evening',night:'lantern-lanes',activityByTime:[.55,.9,1,.65]}, map:{x:57,y:30,width:25,height:36,roads:['bogyoke-road','food-lane']} },
  { id:'shwedagon_area', destinationId:'YANGON', name:'Shwedagon Area', subtitle:'Gardens & respectful viewpoints', bounds:{minX:-38,maxX:18,minZ:-92,maxZ:-35}, spawn:[-10,1.1,-62], transportPoint:[-29,1.1,-45], locationIds:['shwedagon','shwedagon_viewpoint','south_gate_gardens'], discoveryIds:['place_shwedagon','story_shwedagon_observation'], npcIds:['landmark_guide'], activities:['observe','learn','photography'], visualTheme:{ground:'#55704d',architecture:'garden-approach',accent:'#e6b52c',density:'QUIET'}, ambientConfig:{day:'garden',evening:'garden-evening',night:'quiet-garden',activityByTime:[.35,.65,.55,.2]}, map:{x:31,y:2,width:27,height:27,roads:['pagoda-road','garden-walk']} },
  { id:'kandawgyi', destinationId:'YANGON', name:'Kandawgyi', subtitle:'Lake walks & sunset', bounds:{minX:18,maxX:72,minZ:-92,maxZ:-35}, spawn:[44,1.1,-64], transportPoint:[25,1.1,-45], locationIds:['kandawgyi_walk','lake_viewpoint','garden_bench'], discoveryIds:['place_kandawgyi','photo_lake_sunset','secret_lakeside_steps'], npcIds:['park_visitor'], activities:['park-walk','sunset-photo'], visualTheme:{ground:'#4f754f',architecture:'lake-and-park',accent:'#5eaaad',density:'QUIET'}, ambientConfig:{day:'park-birds',evening:'lake-sunset',night:'quiet-water',activityByTime:[.25,.6,.7,.15]}, map:{x:59,y:2,width:27,height:27,roads:['lake-walk','park-road']} },
  { id:'waterfront', destinationId:'YANGON', name:'Waterfront & Strand', subtitle:'River edge & old frontage', bounds:{minX:-38,maxX:67,minZ:30,maxZ:82}, spawn:[11,1.1,56], transportPoint:[-25,1.1,40], locationIds:['strand_frontage','pansodan_jetty','river_view'], discoveryIds:['place_waterfront','photo_river_frame','story_river_city'], npcIds:['taxi_driver'], activities:['river-walk','photography'], visualTheme:{ground:'#63725d',architecture:'older-river-frontage',accent:'#4b8c9b',density:'MEDIUM'}, ambientConfig:{day:'waterfront',evening:'river-evening',night:'reduced-waterfront',activityByTime:[.4,.75,.8,.25]}, map:{x:31,y:67,width:51,height:27,roads:['strand-road','jetty-approach']} },
];

export const zoneAt = ([x,,z]: Vec3) => YANGON_ZONES.find(zone => x >= zone.bounds.minX && x <= zone.bounds.maxX && z >= zone.bounds.minZ && z <= zone.bounds.maxZ) ?? YANGON_ZONES[0];
export const zoneById = (id: string) => YANGON_ZONES.find(zone => zone.id === id);
export const loadedZonesAt = (position: Vec3, radius = 56) => YANGON_ZONES.filter(zone => {
  const x = Math.max(zone.bounds.minX, Math.min(position[0], zone.bounds.maxX));
  const z = Math.max(zone.bounds.minZ, Math.min(position[2], zone.bounds.maxZ));
  return Math.hypot(position[0] - x, position[2] - z) <= radius;
});

export const LOCAL_TRANSPORT = YANGON_ZONES.map(zone => ({
  id: `taxi_${zone.id}`,
  zoneId: zone.id,
  name: zone.name,
  arrival: zone.spawn,
  fare: zone.id === 'tamarind_quarter' ? 500 : zone.id === 'downtown' ? 700 : 900,
  gameMinutes: zone.id === 'waterfront' || zone.id === 'kandawgyi' ? 20 : 15,
  discoveryId: `transport:${zone.id}`,
}));

export const DISTRICT_CONNECTIONS: [DistrictId, DistrictId][] = [
  ['tamarind_quarter','downtown'], ['downtown','market_chinatown'], ['downtown','shwedagon_area'],
  ['market_chinatown','waterfront'], ['shwedagon_area','kandawgyi'], ['downtown','waterfront'],
];
