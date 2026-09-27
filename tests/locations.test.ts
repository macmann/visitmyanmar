import {describe,expect,it} from 'vitest';
import {ACTIVITIES,LOCATIONS,activityById,locationById} from '../src/content/locations';

describe('data-driven locations and activities',()=>{
 it('defines every Yangon location type without adding a Bagan world',()=>expect(new Set(LOCATIONS.map(x=>x.type))).toEqual(new Set(['TEA_SHOP','MARKET','HOTEL','LANDMARK','VIEWPOINT','BUS_STATION','URBAN','PARK','WATERFRONT','FOOD_STREET'])));
 it('references valid activities from each location',()=>{for(const location of LOCATIONS)for(const id of location.activities)expect(activityById(id)?.locationId).toBe(location.id)});
 it('keeps economic values server-configured and non-negative',()=>{for(const activity of ACTIVITIES){expect(activity.gameMinutes).toBeGreaterThanOrEqual(0);expect(activity.mmkCost??0).toBeGreaterThanOrEqual(0);expect(activity.energyRestore??0).toBeGreaterThanOrEqual(0)}});
 it('supports the people-led market and landmark discovery loop',()=>{expect(locationById('tea_shop')?.activities).toEqual(expect.arrayContaining(['food_mohinga','tea_culture','meet_tea_owner','market_recommendation']));expect(locationById('market')?.activities).toContain('landmark_recommendation');expect(locationById('shwedagon')?.activities).toContain('reveal_viewpoint');expect(activityById('reveal_viewpoint')?.discoveryId).toBe('viewpoint_revealed')});
});

describe('tea shop milestone content',()=>{
 it('keeps food effects in authoritative activity configuration',()=>{const foods=ACTIVITIES.filter(x=>x.locationId==='tea_shop'&&x.foodId);expect(foods.map(x=>x.foodId)).toEqual(['mohinga','laphet','tea_snack']);for(const food of foods){expect(food.mmkCost).toBeGreaterThan(0);expect(food.energyRestore).toBeGreaterThan(0);expect(food.availableAt).toContain('tea_shop')}});
 it('marks mohinga as the breakfast quest event',()=>expect(activityById('food_mohinga')).toMatchObject({mealType:'BREAKFAST',questEvent:'FOOD_EATEN'}));
});
