import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialCounter, updateSquat, kneeAngle} from './squat';
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
