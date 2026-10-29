import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialCounter, updateSquat, kneeAngle} from './squat';
import {measure,updateExercise} from './tracking';
import type {Point} from './squat';
import {freshWorkout,completeSet,resumeSet} from './sets';
test('sets pause for rest, ignore duplicate completion and finish at target',()=>{
 const first=completeSet(freshWorkout,10,2,30,1000);
 assert.equal(first.status,'resting');assert.deepEqual(first.completed,[10]);
 assert.equal(completeSet(first,10,2,30,2000),first);
 assert.equal(resumeSet(first,30000),first);
 const next=resumeSet(first,31000);assert.equal(next.status,'working');
 const done=completeSet(next,8,2,30,32000);assert.equal(done.status,'complete');assert.deepEqual(done.completed,[10,8]);
 assert.equal(resumeSet(done,90000,true),done);
});
test('empty sets are ignored and rest can be skipped',()=>{
 assert.equal(completeSet(freshWorkout,0,3,60,0),freshWorkout);
 assert.equal(resumeSet(completeSet(freshWorkout,5,3,60,0),1,true).status,'working');
});
test('push-ups require extension, lowering and extension; jitter is ignored',()=>{
 let s=updateExercise(initialCounter,'pushup',90,100);
 s=updateExercise(s,'pushup',175,500);assert.equal(s.reps,0);
 s=updateExercise(s,'pushup',140,900);s=updateExercise(s,'pushup',175,1000);assert.equal(s.reps,0);
 s=updateExercise(s,'pushup',90,1300);s=updateExercise(s,'pushup',175,1400);assert.equal(s.reps,0);
 s=updateExercise(s,'pushup',175,1700);assert.equal(s.reps,1);
 s=updateExercise(s,'pushup',175,1800);assert.equal(s.reps,1);
});
test('push-ups reset incomplete movement on tracking loss and long gaps',()=>{
 for(const gap of [false,true]){
 let s=updateExercise(initialCounter,'pushup',175,100);s=updateExercise(s,'pushup',90,500);
 if(!gap)s=updateExercise(s,'pushup',null,600);
 s=updateExercise(s,'pushup',175,2000);assert.equal(s.reps,0);
 }
});
test('tracking selects the more visible arm and never switches during a rep',()=>{
 const points:Point[]=Array.from({length:33},()=>({x:.5,y:.5,visibility:0}));
 for(const [a,b,c,confidence] of [[11,13,15,.8],[12,14,16,.95]]){
 points[a]={x:.3,y:.2,visibility:confidence};points[b]={x:.3,y:.4,visibility:confidence};points[c]={x:.3,y:.6,visibility:confidence};
 }
 const first=measure(points,'pushup',null,640,480);assert.equal(first.side,'right');assert.equal(first.angle,180);
 points[14].visibility=.2;
 assert.equal(measure(points,'pushup','right',640,480).angle,null);
 points[14].visibility=.95;points[16].x=1;
 assert.equal(measure(points,'pushup','right',640,480).angle,null);
});
test('counts a complete squat once, ignoring partial movements',()=>{
 let s=updateSquat(initialCounter,175,100);
 s=updateSquat(s,130,500); s=updateSquat(s,175,700); assert.equal(s.reps,0);
 s=updateSquat(s,90,900); s=updateSquat(s,175,1300); assert.equal(s.reps,1);
 s=updateSquat(s,175,1500); assert.equal(s.reps,1);
});
test('tracking loss discards an incomplete rep',()=>{
 let s=updateSquat(initialCounter,175,100); s=updateSquat(s,90,500);
 s=updateSquat(s,null,600); s=updateSquat(s,175,1000); assert.equal(s.reps,0);
});
test('long frame gap discards an incomplete rep',()=>{
 let s=updateSquat(initialCounter,175,100); s=updateSquat(s,90,500); s=updateSquat(s,175,2000); assert.equal(s.reps,0);
});
test('joint geometry calculates a right angle',()=>assert.equal(kneeAngle({x:0,y:1},{x:0,y:0},{x:1,y:0}),90));
