(function(root){
'use strict';
function grid(level){if(level===4)return {cols:2,rows:2};if(level===6)return {cols:3,rows:2};if(level===12)return {cols:4,rows:3};throw new Error('Unsupported piece count');}
function shuffled(count,random=Math.random){const ids=Array.from({length:count},(_,i)=>i);for(let i=count-1;i>0;i--){const j=Math.floor(random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}if(ids.every((x,i)=>x===i))ids.push(ids.shift());return ids;}
function samePixels(a,b){if(a.length!==b.length)return false;let total=0;for(let i=0;i<a.length;i++){const d=Math.abs(a[i]-b[i]);if(d>6)return false;total+=d;}return total/a.length<.35;}
function groupsFromPixels(samples){const groups=[];for(let i=0;i<samples.length;i++){const match=samples.findIndex((s,j)=>j<i&&samePixels(s,samples[i]));groups.push(match<0?i:groups[match]);}return groups;}
function create(level,groups){grid(level);return {level,groups:groups?groups.slice():Array.from({length:level},(_,i)=>i),slots:Array(level).fill(null),used:new Set()};}
function place(game,piece,slot){if(!Number.isInteger(piece)||!Number.isInteger(slot)||piece<0||slot<0||piece>=game.level||slot>=game.level||game.used.has(piece)||game.slots[slot]!==null||game.groups[piece]!==game.groups[slot])return false;game.slots[slot]=piece;game.used.add(piece);return true;}
function matchingSlot(game,piece){return game.slots.findIndex((p,i)=>p===null&&game.groups[i]===game.groups[piece]);}
const api={grid,shuffled,samePixels,groupsFromPixels,create,place,matchingSlot};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PuzzleEngine=api;
})(typeof window!=='undefined'?window:this);
