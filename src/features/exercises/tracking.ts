import { kneeAngle, type Point, type Counter, updateSquat } from './squat';

export type Exercise = 'squat' | 'pushup';
export type Side = 'left' | 'right';
export const exerciseNames: Record<Exercise, string> = {squat:'Bodyweight squats',pushup:'Push-ups'};
const joints = {squat:{left:[23,25,27],right:[24,26,28]},pushup:{left:[11,13,15],right:[12,14,16]}};
export function visible(point: Point | undefined): point is Point {
 return !!point && (point.visibility??0)>.7 && point.x>.02 && point.x<.98 && point.y>.02 && point.y<.98;
}
// Lock one side for the session. Never splice opposite arms into an incomplete rep.
export function measure(points:Point[], exercise:Exercise, side:Side|null, width:number,height:number):{angle:number|null;side:Side|null}{
 const candidates:Side[]=side?[side]:['left','right'];
 const usable=candidates.filter(s=>joints[exercise][s].every(i=>visible(points[i])));
 const chosen=usable.sort((a,b)=>Math.min(...joints[exercise][b].map(i=>points[i].visibility??0))-Math.min(...joints[exercise][a].map(i=>points[i].visibility??0)))[0];
 if(!chosen)return {angle:null,side};
 const p=joints[exercise][chosen].map(i=>({...points[i],x:points[i].x*width,y:points[i].y*height}));
 return {angle:kneeAngle(p[0],p[1],p[2]),side:chosen};
}
export function updateExercise(state:Counter,exercise:Exercise,angle:number|null,time:number):Counter{
 // Both exercises use a complete extension → flexion → extension cycle.
 // Push-ups use elbow flexion, squats use knee flexion.
 return updateSquat(state,angle,time);
}
