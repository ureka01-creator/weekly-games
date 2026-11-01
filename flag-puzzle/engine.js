(function(root){
'use strict';
function grid(level){if(level===4)return {cols:2,rows:2};if(level===6)return {cols:3,rows:2};if(level===12)return {cols:4,rows:3};throw new Error('Unsupported piece count');}
function shuffled(count,random=Math.random){const ids=Array.from({length:count},(_,i)=>i);for(let i=count-1;i>0;i--){const j=Math.floor(random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}if(ids.every((x,i)=>x===i))ids.push(ids.shift());return ids;}
function samePixels(a,b){if(a.length!==b.length)return false;let total=0;for(let i=0;i<a.length;i++){const d=Math.abs(a[i]-b[i]);if(d>6)return false;total+=d;}return total/a.length<.35;}
function groupsFromPixels(samples){const groups=[];for(let i=0;i<samples.length;i++){const match=samples.findIndex((s,j)=>j<i&&samePixels(s,samples[i]));groups.push(match<0?i:groups[match]);}return groups;}
function edges(level,id){const {cols,rows}=grid(level),r=Math.floor(id/cols),c=id%cols;const vertical=(row,col)=>(row*7+col*3)%2?-1:1;const horizontal=(row,col)=>(row*5+col*11)%2?1:-1;return [r?-horizontal(r-1,c):0,c<cols-1?vertical(r,c):0,r<rows-1?horizontal(r,c):0,c?-vertical(r,c-1):0];}
function geometry(level,id){const {cols,rows}=grid(level),w=640/cols,h=480/rows,pad=Math.min(w,h)*.26,e=edges(level,id),radius=Math.min(w,h)*.18;const number=n=>Number(n.toFixed(3));let path='M0 0';function side(ax,ay,bx,by,sign){const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy);const point=(t,n)=>number(ax+dx*t+dy/len*n*radius*sign)+' '+number(ay+dy*t-dx/len*n*radius*sign);if(!sign){path+=' L'+point(1,0);return;}path+=' L'+point(.35,0);for(const k of [[.42,0,.45,.1,.43,.35],[.34,.95,.41,1.25,.5,1.25],[.59,1.25,.66,.95,.57,.35],[.55,.1,.58,0,.65,0]])path+=' C'+point(k[0],k[1])+' '+point(k[2],k[3])+' '+point(k[4],k[5]);path+=' L'+point(1,0);}
side(0,0,w,0,e[0]);side(w,0,w,h,e[1]);side(w,h,0,h,e[2]);side(0,h,0,0,e[3]);path+=' Z';return {w,h,pad,x:(id%cols)*w,y:Math.floor(id/cols)*h,path,edges:e};}
function shapeMatches(game,piece,slot){return !game.jigsaw||edges(game.level,piece).join(',')===edges(game.level,slot).join(',');}
function create(level,groups,jigsaw=false){grid(level);return {level,jigsaw,groups:groups?groups.slice():Array.from({length:level},(_,i)=>i),slots:Array(level).fill(null),used:new Set()};}
function place(game,piece,slot){if(!Number.isInteger(piece)||!Number.isInteger(slot)||piece<0||slot<0||piece>=game.level||slot>=game.level||game.used.has(piece)||game.slots[slot]!==null||game.groups[piece]!==game.groups[slot]||!shapeMatches(game,piece,slot))return false;game.slots[slot]=piece;game.used.add(piece);return true;}
function matchingSlot(game,piece){return game.slots.findIndex((p,i)=>p===null&&game.groups[i]===game.groups[piece]&&shapeMatches(game,piece,i));}
const api={edges,geometry,shapeMatches,grid,shuffled,samePixels,groupsFromPixels,create,place,matchingSlot};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PuzzleEngine=api;
})(typeof window!=='undefined'?window:this);
