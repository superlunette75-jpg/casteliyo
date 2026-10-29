export type Workout = {completed:number[]; status:'working'|'resting'|'complete'; deadline:number};
export const freshWorkout:Workout={completed:[],status:'working',deadline:0};
export function completeSet(state:Workout,reps:number,sets:number,rest:number,now:number):Workout{
 if(state.status!=='working'||reps<1)return state;
 const completed=[...state.completed,reps];
 return {completed,status:completed.length>=sets?'complete':'resting',deadline:now+rest*1000};
}
export function resumeSet(state:Workout,now:number,skip=false):Workout{
 return state.status==='resting'&&(skip||now>=state.deadline)?{...state,status:'working',deadline:0}:state;
}
