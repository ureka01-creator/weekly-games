'use strict';
// A textured sphere, rendered locally. Picking uses the same spherical transform.
(() => {
  const canvas=$('#globeCanvas'),host=$('#mapViewport'),toggle=$('#globeToggle');
  const DEG=Math.PI/180,TAU=Math.PI*2;
  const colors={'아시아':'#d6d9ad','아프리카':'#e9d8ad','유럽':'#b7cec3','북아메리카':'#b9cda6','남아메리카':'#cdd9a4','오세아니아':'#bcd6c9','남극':'#e9eeeb'};
  let active=false,ready=false,output=null,texturePixels=null,normals=null,normalKey='',lon=127*DEG,lat=20*DEG,scale=1,frame=0;
  const screen=canvas.getContext('2d',{alpha:false});
  const textureCanvas=document.createElement('canvas');textureCanvas.width=2160;textureCanvas.height=1080;
  const ctx=textureCanvas.getContext('2d');
  const pickCanvas=document.createElement('canvas');pickCanvas.width=1080;pickCanvas.height=540;
  const pick=pickCanvas.getContext('2d',{willReadFrequently:true});
  const codes=COUNTRIES.map(c=>c.code),paths=WORLD_PATHS.map(f=>({...f,path:new Path2D(f.d)}));
  const label=document.createElement('div');label.className='globe-country';label.hidden=true;host.append(label);
  const marker=document.createElement('div');marker.className='globe-marker';marker.hidden=true;host.append(marker);
  const pickColors=new Map(codes.map((code,i)=>[code,`rgb(${(i+1)&255},${(i+1)>>8},0)`]));
  for(const f of paths){if(pickColors.has(f.code)){pick.fillStyle=pickColors.get(f.code);pick.fill(f.path)}}
  for(const c of COUNTRIES.filter(c=>c.area<2500)){pick.fillStyle=pickColors.get(c.code);pick.beginPath();pick.arc((c.lon+180)*3,(90-c.lat)*3,2.4,0,TAU);pick.fill()}
  function initialize(){if(ready)return true;if(!screen){toast('이 브라우저에서는 3D 보기를 사용할 수 없어요.');return false}ready=true;refresh();return true}
  function refresh(){if(!ready)return;
    ctx.setTransform(2,0,0,2,0,0);ctx.fillStyle='#c1dce3';ctx.fillRect(0,0,1080,540);
    ctx.strokeStyle='#a8cdd455';ctx.lineWidth=.6;ctx.beginPath();for(let x=0;x<=1080;x+=90){ctx.moveTo(x,0);ctx.lineTo(x,540)}for(let y=0;y<=540;y+=60){ctx.moveTo(0,y);ctx.lineTo(1080,y)}ctx.stroke();
    for(const f of paths){const c=byCode.get(f.code);ctx.fillStyle=f.code===state.selected?'#28707e':state.visited.has(f.code)?'#80aaa0':colors[c?.region]||'#d4ded3';if(c&&state.region!=='전체'&&c.region!==state.region)ctx.fillStyle='#dce5de';ctx.fill(f.path);ctx.strokeStyle='#f8fbef';ctx.lineWidth=.55;ctx.stroke(f.path)}
    for(const c of COUNTRIES.filter(c=>c.area<2500&&(state.extra||c.core))){ctx.fillStyle=c.code===state.selected?'#d5993c':'#5b867f';ctx.beginPath();ctx.arc((c.lon+180)*3,(90-c.lat)*3,c.code===state.selected?2.2:1.1,0,TAU);ctx.fill()}
    texturePixels=ctx.getImageData(0,0,2160,1080).data;schedule();
  }
  function basis(){return {front:[Math.sin(lon)*Math.cos(lat),Math.sin(lat),Math.cos(lon)*Math.cos(lat)],right:[Math.cos(lon),0,-Math.sin(lon)],up:[-Math.sin(lon)*Math.sin(lat),Math.cos(lat),-Math.cos(lon)*Math.sin(lat)]}}
  function radius(){return Math.min(canvas.clientWidth,canvas.clientHeight)*.425*scale}
  const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
  function draw(){frame=0;if(!active||!ready||!texturePixels||canvas.clientWidth===0)return;
    const cssWidth=canvas.clientWidth,cssHeight=canvas.clientHeight,ratio=Math.min(devicePixelRatio||1,1.5,720/Math.max(cssWidth,cssHeight)),w=Math.round(cssWidth*ratio),h=Math.round(cssHeight*ratio);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;output=screen.createImageData(w,h)}
    if(!output)output=screen.createImageData(w,h);
    const r=radius()*ratio,key=`${w}:${h}:${r.toFixed(2)}`,b=basis();
    if(normalKey!==key){normalKey=key;normals=[];const out=output.data;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){const px=(x+.5-w/2)/r,py=-(y+.5-h/2)/r,r2=px*px+py*py,offset=(y*w+x)*4;out[offset]=233;out[offset+1]=240;out[offset+2]=239;out[offset+3]=255;if(r2<=1){const z=Math.sqrt(1-r2),light=.76+.24*Math.max(0,(-.5*px+.8*py+1.4*z)/1.688),rim=Math.pow(1-z,3)*.24;normals.push(offset,px,py,z,light,rim)}}
      normals=new Float32Array(normals);
    }
    const out=output.data,src=texturePixels;
    for(let i=0;i<normals.length;i+=6){const offset=normals[i],x=normals[i+1],y=normals[i+2],z=normals[i+3],light=normals[i+4],rim=normals[i+5];const wx=b.right[0]*x+b.up[0]*y+b.front[0]*z,wy=b.up[1]*y+b.front[1]*z,wz=b.right[2]*x+b.up[2]*y+b.front[2]*z;const tx=Math.min(2159,Math.max(0,Math.floor((.5+Math.atan2(wx,wz)/TAU)*2160))),ty=Math.min(1079,Math.max(0,Math.floor((.5-Math.asin(Math.max(-1,Math.min(1,wy)))/Math.PI)*1080))),ti=(ty*2160+tx)*4;out[offset]=src[ti]*light*(1-rim)+66*rim;out[offset+1]=src[ti+1]*light*(1-rim)+125*rim;out[offset+2]=src[ti+2]*light*(1-rim)+140*rim;}
    screen.putImageData(output,0,0);
    const c=byCode.get(state.selected),clon=c.lon*DEG,clat=c.lat*DEG;const n=[Math.sin(clon)*Math.cos(clat),Math.sin(clat),Math.cos(clon)*Math.cos(clat)];const z=dot(n,b.front),px=canvas.clientWidth/2+dot(n,b.right)*radius(),py=canvas.clientHeight/2-dot(n,b.up)*radius();marker.hidden=z<=.04||px<0||px>canvas.clientWidth||py<0||py>canvas.clientHeight;marker.style.left=px+'px';marker.style.top=py+'px';label.textContent=c.name;label.hidden=false;
  }
  function schedule(){if(active&&!frame)frame=requestAnimationFrame(draw)}
  function focus(c){lon=c.lon*DEG;lat=Math.max(-75,Math.min(75,c.lat))*DEG;schedule()}
  function zoom(factor){scale=Math.max(.8,Math.min(4,scale*factor));schedule()}
  function reset(){scale=1;focus(byCode.get(state.selected));schedule()}
  function setActive(value){if(value&&!initialize())return;active=value;canvas.hidden=!value;$('#map').hidden=value;label.hidden=!value;marker.hidden=!value;host.classList.toggle('globe-mode',value);toggle.setAttribute('aria-pressed',String(value));toggle.textContent=value?'▧ 2D 지도':'◎ 3D 지구본';$('#mapTitle').textContent=value?'3D 지구본':'세계지도';$('#mapInstruction').textContent=value?'드래그로 회전 · 두 손가락으로 확대':'드래그로 이동 · 버튼으로 확대';$('#mapHint').textContent=value?'지구본을 돌려 나라를 찾아보세요':'나라를 누르면 자세히 볼 수 있어요';if(value){focus(byCode.get(state.selected));schedule()}else{document.querySelectorAll('.ocean').forEach(e=>e.hidden=state.box[2]<1000)}}
  toggle.onclick=()=>setActive(!active);
  let pointers=new Map(),start=null,lastCenter=null,lastDistance=0,moved=false;
  function center(){const ps=[...pointers.values()];return {x:ps.reduce((v,p)=>v+p.x,0)/ps.length,y:ps.reduce((v,p)=>v+p.y,0)/ps.length,d:ps.length>1?Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y):0}}
  canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});start={x:e.clientX,y:e.clientY};moved=pointers.size>1;lastCenter=center();lastDistance=lastCenter.d});
  canvas.addEventListener('pointermove',e=>{if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const c=center();if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>4)moved=true;if(c.d&&lastDistance)zoom(c.d/lastDistance);if(lastCenter){lon-=(c.x-lastCenter.x)/radius();lat=Math.max(-1.4,Math.min(1.4,lat+(c.y-lastCenter.y)/radius()));lon=((lon+Math.PI)%TAU+TAU)%TAU-Math.PI;schedule()}lastCenter=c;lastDistance=c.d});
  function pickCountry(e){const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/radius(),y=-(e.clientY-r.top-r.height/2)/radius(),r2=x*x+y*y;if(r2>=1)return;const b=basis(),z=Math.sqrt(1-r2),n=b.front.map((v,i)=>v*z+b.right[i]*x+b.up[i]*y);const longitude=Math.atan2(n[0],n[2]),latitude=Math.asin(Math.max(-1,Math.min(1,n[1])));const px=Math.max(0,Math.min(1079,Math.floor((longitude/DEG+180)*3))),py=Math.max(0,Math.min(539,Math.floor((90-latitude/DEG)*3)));const rgba=pick.getImageData(px,py,1,1).data,index=rgba[0]+rgba[1]*256-1;let code=rgba[3]===255?codes[index]:null;
    if(!code){let best=.045/scale;for(const c of COUNTRIES){if(!state.extra&&!c.core)continue;const dlat=c.lat*DEG-latitude,dlon=(c.lon*DEG-longitude)*Math.cos(latitude),distance=Math.hypot(dlat,dlon);if(distance<best){best=distance;code=c.code}}}
    if(code&&byCode.has(code)){if(!byCode.get(code).core&&!state.extra){state.extra=true;$('#includeExtra').checked=true;renderRegions()}selectCountry(code)}
  }
  function release(e){if(!pointers.has(e.pointerId))return;const click=!moved&&pointers.size===1;pointers.delete(e.pointerId);if(pointers.size){lastCenter=center();lastDistance=lastCenter.d}else{lastCenter=null;lastDistance=0}if(click&&e.type==='pointerup')pickCountry(e)}
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.1:1/1.1)},{passive:false});
  canvas.addEventListener('keydown',e=>{const step=12*DEG;if(e.key==='ArrowLeft')lon-=step;else if(e.key==='ArrowRight')lon+=step;else if(e.key==='ArrowUp')lat=Math.min(1.4,lat+step);else if(e.key==='ArrowDown')lat=Math.max(-1.4,lat-step);else if(['+','='].includes(e.key))zoom(1.2);else if(e.key==='-')zoom(.8);else if(e.key==='Home')reset();else return;e.preventDefault();schedule()});
  new ResizeObserver(()=>schedule()).observe(host);
  window.atlasGlobe={get active(){return active},refresh,focus,zoom,reset};
})();
