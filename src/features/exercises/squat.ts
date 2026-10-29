export type Counter = { phase: 'ready' | 'standing' | 'down'; reps: number; since: number; last: number };
export const initialCounter: Counter = {phase:'ready', reps:0, since:0, last:0};
export function updateSquat(state: Counter, angle: number | null, time: number): Counter {
  if (angle === null || !Number.isFinite(angle)) return {...initialCounter, reps: state.reps, last:time};
  if (time - state.last > 700 && state.last > 0) state = {...initialCounter, reps:state.reps};
  const next = {...state, last: time};
  if (state.phase === 'ready' && angle > 160) return {...next, phase:'standing', since:time};
  if (state.phase === 'standing' && angle < 105 && time-state.since > 300) return {...next, phase:'down', since:time};
  if (state.phase === 'down' && angle > 160 && time-state.since > 300) return {...next, phase:'standing', reps:state.reps+1, since:time};
  return next;
}
export type Point = {x:number; y:number; visibility?:number};
export function kneeAngle(a:Point,b:Point,c:Point) {
  const ux=a.x-b.x, uy=a.y-b.y, vx=c.x-b.x, vy=c.y-b.y;
  const length=Math.hypot(ux,uy)*Math.hypot(vx,vy);
  return length ? Math.acos(Math.max(-1,Math.min(1,(ux*vx+uy*vy)/length)))*180/Math.PI : NaN;
}
