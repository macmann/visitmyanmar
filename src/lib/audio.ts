export type AudioCategory='AMBIENT'|'MUSIC'|'SFX'|'UI';
export type AudioCue={id:string;category:AudioCategory;source?:string;loop?:boolean;volume?:number};

/**
 * Small, asset-agnostic audio bus. Day 1 intentionally ships without unlicensed
 * recordings; experiences can register local cues later without coupling sound
 * playback to quest or location components. It is always safe when muted or
 * during server rendering.
 */
class AudioBus {
 private enabled=true;
 private gains:Record<AudioCategory,number>={AMBIENT:1,MUSIC:1,SFX:1,UI:1};
 setEnabled(enabled:boolean){this.enabled=enabled}
 setGain(category:AudioCategory,gain:number){this.gains[category]=Math.max(0,Math.min(1,gain))}
 play(cue:AudioCue){
  if(!this.enabled||!cue.source||typeof Audio==='undefined')return null;
  const audio=new Audio(cue.source);audio.loop=cue.loop??false;audio.volume=Math.max(0,Math.min(1,(cue.volume??1)*this.gains[cue.category]));void audio.play().catch(()=>undefined);return audio;
 }
}
export const audioBus=new AudioBus();
