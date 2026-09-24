export type MajorState='EXPLORING'|'SLEEPING'|'TRAVELLING'|'LONG_ACTIVITY';
export type PersistentAction={id:string;kind:'SLEEP'|'TRAVEL';startedAt:string;completesAt:string;gameMinutes:number;energyRecovery:number;destination?:string};
export type TimelineItem={at:string;day:number;text:string};
export type PlayerSave={id:string;destination:string;zone:string;day:number;gameMinutes:number;energy:number;mmk:number;majorState:MajorState;position:[number,number,number];discoveries:string[];foods:string[];photos:string[];talkedTo:string[];completedQuests:string[];baganUnlocked:boolean;activeAction:PersistentAction|null;timeline:TimelineItem[];inventory:string[];equipped:Record<string,string>;updatedAt:string};
