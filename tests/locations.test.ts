import {describe,expect,it} from 'vitest';
import {ACTIVITIES,LOCATIONS,activityById,locationById} from '../src/content/locations';

describe('data-driven locations and activities',()=>{
 it('defines every initial location type without adding destinations',()=>expect(new Set(LOCATIONS.map(x=>x.type))).toEqual(new Set(['TEA_SHOP','MARKET','HOTEL','LANDMARK','BUS_STATION'])));
 it('references valid activities from each location',()=>{for(const location of LOCATIONS)for(const id of location.activities)expect(activityById(id)?.locationId).toBe(location.id)});
 it('keeps economic values server-configured and non-negative',()=>{for(const activity of ACTIVITIES){expect(activity.gameMinutes).toBeGreaterThanOrEqual(0);expect(activity.mmkCost??0).toBeGreaterThanOrEqual(0);expect(activity.energyRestore??0).toBeGreaterThanOrEqual(0)}});
 it('supports the tea shop discovery loop',()=>{expect(locationById('tea_shop')?.activities).toEqual(expect.arrayContaining(['food_mohinga','tea_culture','reveal_viewpoint']));expect(activityById('reveal_viewpoint')?.discoveryId).toBe('viewpoint_revealed')});
});
