import fs from 'node:fs';import path from 'node:path';import type { PlayerSave } from './types';import { newPlayer,resolveAction } from './rules';
const dir=path.join(process.cwd(),'.data'),file=path.join(dir,'players.json');
type DB=Record<string,PlayerSave>;
function read():DB{try{return JSON.parse(fs.readFileSync(file,'utf8')) as DB}catch{return {}}}
function write(db:DB){fs.mkdirSync(dir,{recursive:true});const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(db,null,2));fs.renameSync(tmp,file)}
export function getPlayer(id:string){const db=read();let p=resolveAction(db[id]??newPlayer(id));db[id]=p;write(db);return p}
export function mutatePlayer(id:string,fn:(p:PlayerSave)=>PlayerSave){const db=read();const current=resolveAction(db[id]??newPlayer(id));const next={...fn(current),updatedAt:new Date().toISOString()};db[id]=next;write(db);return next}
