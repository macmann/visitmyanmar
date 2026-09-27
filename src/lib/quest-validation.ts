import { DAY_ONE_OBJECTIVES } from '@/content/day-one';
import { ACTIVITIES, LOCATIONS } from '@/content/locations';
import { BUS_ROUTE } from '@/content/game';
import type { GameplayEventType } from './types';

const supportedEvents=new Set<GameplayEventType>(['LOCATION_ENTERED','LOCATION_DISCOVERED','NPC_TALKED','ITEM_PURCHASED','FOOD_EATEN','PHOTO_TAKEN','ACTIVITY_COMPLETED','LOCATION_REVEALED','DAY_COMPLETED','LUGGAGE_STORED','LUGGAGE_COLLECTED','SLEEP_COMPLETED','TRAVEL_STARTED']);
const virtualTargets=new Set(['guest_house','market','shwedagon','landmark_photo','viewpoint_photo','mohinga',BUS_ROUTE.id]);
export function validateQuestContent(){
 const errors:string[]=[];const objectiveIds=new Set(DAY_ONE_OBJECTIVES.map(x=>x.id));const locationIds=new Set(LOCATIONS.map(x=>x.id));const activityIds=new Set(ACTIVITIES.map(x=>x.id));
 for(const objective of DAY_ONE_OBJECTIVES){
  if(!supportedEvents.has(objective.completionEvent.type))errors.push(`Objective ${objective.id} references unsupported event ${objective.completionEvent.type}`);
  for(const requirement of objective.requirements)if(!objectiveIds.has(requirement))errors.push(`Objective ${objective.id} references missing prerequisite ${requirement}`);
  if(objective.nextObjectiveId&&!objectiveIds.has(objective.nextObjectiveId))errors.push(`Objective ${objective.id} references missing next objective ${objective.nextObjectiveId}`);
  const target=objective.completionEvent.targetId;if(!locationIds.has(target)&&!activityIds.has(target)&&!virtualTargets.has(target)&&!ACTIVITIES.some(x=>x.foodId===target))errors.push(`Objective ${objective.id} references missing content ${target}`);
 }
 for(const location of LOCATIONS)for(const activity of location.activities)if(!activityIds.has(activity))errors.push(`Location ${location.id} references missing activity ${activity}`);
 return errors;
}
export function reportQuestValidation(){const errors=validateQuestContent();for(const error of errors)console.error(`[QuestValidation] ${error}`);if(!errors.length)console.info(`[QuestValidation] ${DAY_ONE_OBJECTIVES.length} reachable objectives validated`);return errors}
