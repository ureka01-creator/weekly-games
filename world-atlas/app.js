'use strict';
const $=s=>document.querySelector(s),NS='http://www.w3.org/2000/svg';
const byCode=new Map(COUNTRIES.map(c=>[c.code,c]));
const regions=['전체','아시아','유럽','아프리카','북아메리카','남아메리카','오세아니아','남극'];
const state={view:'map',region:'전체',search:'',extra:false,selected:'KR',visited:new Set(),box:[0,0,1080,540]};
let storageWorks=true;try{const v=JSON.parse(localStorage.getItem('little-world-passport-v1')||'[]');if(Array.isArray(v))state.visited=new Set(v.filter(x=>byCode.has(x)));}catch{storageWorks=false;}
const notes={
KR:['우리나라예요. 한반도의 남쪽에 있고, 동쪽과 서쪽, 남쪽이 바다와 만나요.','태극기는 가운데 빨강·파랑 태극과 네 모서리의 검은 괘로 이루어져 있어요.'],
JP:['여러 섬으로 이루어진 나라예요. 후지산과 벚꽃을 떠올려 보세요.','흰 바탕 한가운데 빨간 동그라미가 있어요. 태양을 나타내요.'],
CN:['동아시아에 있는 큰 나라예요. 자이언트판다의 고향이기도 해요.','빨간 바탕에 노란 별 다섯 개가 있어요. 큰 별 하나와 작은 별 네 개예요.'],
US:['북아메리카에 있어요. 50개의 주가 모인 나라예요.','빨강·흰색 줄 13개와 파란 칸 안의 흰 별 50개가 있어요.'],
GB:['잉글랜드·스코틀랜드·웨일스·북아일랜드로 이루어져 있어요.','파랑 바탕에 빨강과 흰색 십자가가 겹쳐져 있어요. 유니언 잭이라고도 불러요.'],
FR:['에펠탑이 있는 파리가 수도예요. 빵과 미술로도 잘 알려져 있어요.','왼쪽부터 파랑·흰색·빨강 세로줄이에요.'],
DE:['유럽 가운데에 있어요. 숲과 오래된 성, 자동차 산업으로 알려져 있어요.','위에서부터 검정·빨강·노랑 가로줄이에요.'],
IT:['지도에서 장화처럼 생긴 반도를 찾아보세요. 로마와 베네치아가 있어요.','왼쪽부터 초록·흰색·빨강 세로줄이에요.'],
ES:['유럽 남서쪽 이베리아반도에 있어요. 마드리드와 바르셀로나가 있는 나라예요.','빨강·노랑·빨강 가로줄과 문장이 있어요. 가운데 노란 줄이 더 넓어요.'],
PT:['이베리아반도 서쪽에서 대서양과 만나요. 수도는 리스본이에요.','초록과 빨강 세로 영역이 있고, 경계에 문장이 있어요.'],
CA:['북아메리카 북쪽에 있어요. 넓은 숲과 많은 호수가 있어요.','가운데 흰 바탕에 빨간 단풍잎이 있어요. 양옆은 빨강이에요.'],
BR:['남아메리카에서 가장 넓은 나라예요. 아마존 열대우림의 큰 부분이 있어요.','초록 바탕에 노란 마름모, 가운데 파란 원과 별들이 있어요.'],
AR:['남아메리카 남쪽에 있어요. 넓은 팜파스 초원과 파타고니아가 있어요.','하늘색·흰색·하늘색 가로줄과 가운데 태양이 있어요.'],
MX:['북아메리카에 있어요. 옥수수로 만든 토르티야와 오래된 유적이 유명해요.','초록·흰색·빨강 세로줄과 가운데 독수리 문장이 있어요.'],
AU:['오세아니아에 있어요. 캥거루와 코알라의 고향이에요.','파란 바탕에 영국 국기 모양과 흰 별들이 있어요.'],
NZ:['큰 두 섬인 북섬과 남섬을 중심으로 이루어져 있어요. 키위라는 새가 살아요.','파란 바탕에 영국 국기 모양과 흰 테두리의 빨간 별 네 개가 있어요.'],
IN:['남아시아에 있어요. 타지마할이 있고, 아주 다양한 언어를 사용해요.','주황·흰색·초록 가로줄과 가운데 파란 바퀴 모양이 있어요.'],
NP:['히말라야산맥에 있는 나라예요. 에베레스트산은 네팔과 중국 사이에 있어요.','네모가 아닌 두 개의 삼각형 모양이에요. 빨간 바탕에 하얀 달과 태양이 있어요.'],
MN:['중국과 러시아 사이에 있어요. 넓은 초원과 고비사막이 있어요.','빨강·파랑·빨강 세로줄, 왼쪽에는 노란 소욤보 문양이 있어요.'],
VN:['동남아시아에 있는 길쭉한 나라예요. 쌀국수와 하롱베이를 떠올려 보세요.','빨간 바탕 한가운데 노란 별 하나가 있어요.'],
TH:['동남아시아에 있어요. 수도 방콕에는 짜오프라야강이 흘러요.','빨강·흰색·파랑·흰색·빨강 가로줄이에요. 가운데 파란 줄이 더 넓어요.'],
ID:['동남아시아의 수많은 섬으로 이루어져 있어요. 자바섬과 발리섬이 있어요.','위는 빨강, 아래는 흰색인 두 가로줄이에요.'],
SG:['동남아시아에 있는 도시국가예요. 한 도시가 나라를 이루고 있어요.','빨강·흰색 가로줄에 하얀 초승달과 별 다섯 개가 있어요.'],
MY:['말레이반도와 보르네오섬 일부에 걸쳐 있어요. 쿠알라룸푸르에 쌍둥이 빌딩이 있어요.','빨강·흰색 줄무늬와 파란 칸 안의 노란 초승달·별이 있어요.'],
PH:['동남아시아에 있는 섬나라예요. 마닐라가 수도예요.','파랑·빨강 가로 영역과 흰 삼각형, 노란 태양과 별 세 개가 있어요.'],
EG:['아프리카 북동쪽에 있어요. 나일강과 고대 피라미드가 유명해요.','빨강·흰색·검정 가로줄, 가운데 독수리 문장이 있어요.'],
ZA:['아프리카 맨 남쪽에 있어요. 행정·입법·사법 수도가 나뉘어 있어요.','여러 색을 담고 있고, 초록색이 옆으로 누운 Y자처럼 뻗어 있어요.'],
KE:['아프리카 동쪽에 있어요. 사바나에서 다양한 야생동물을 만날 수 있어요.','검정·빨강·초록 가로줄과 흰 줄, 가운데 방패와 창이 있어요.'],
TZ:['아프리카 동쪽에 있어요. 아프리카에서 가장 높은 킬리만자로산이 있어요.','초록과 파랑 사이를 노란 테두리의 검은 대각선 줄이 가로질러요.'],
MG:['아프리카 동쪽 인도양에 있는 큰 섬나라예요. 여우원숭이의 고향이에요.','왼쪽 흰 세로 영역, 오른쪽 위 빨강과 아래 초록 영역이에요.'],
GR:['유럽 남동쪽에 있어요. 고대 올림픽이 시작된 곳이에요.','파랑·흰색 줄무늬와 파란 칸 안의 흰 십자가가 있어요.'],
CH:['유럽의 알프스산맥에 있어요. 바다와 맞닿지 않은 내륙국이에요.','빨간 정사각형 바탕에 흰 십자가가 있어요.'],
SE:['유럽 북쪽에 있어요. 숲과 호수가 많아요.','파란 바탕에 노란 십자가가 왼쪽으로 치우쳐 있어요.'],
NO:['유럽 북쪽에 있어요. 빙하가 만든 깊은 바닷길인 피오르가 유명해요.','빨간 바탕에 흰 테두리가 있는 파란 십자가가 있어요.'],
FI:['유럽 북쪽에 있어요. 호수가 아주 많은 나라예요.','흰 바탕에 파란 십자가가 왼쪽으로 치우쳐 있어요.'],
DK:['유럽 북쪽에 있어요. 안데르센과 레고가 태어난 나라예요.','빨간 바탕에 흰 십자가가 왼쪽으로 치우쳐 있어요.'],
IS:['북대서양에 있는 섬나라예요. 빙하와 화산이 함께 있어요.','파란 바탕에 흰 테두리가 있는 빨간 십자가가 있어요.'],
RU:['유럽과 아시아에 걸쳐 있는 세계에서 가장 넓은 나라예요.','위에서부터 흰색·파랑·빨강 가로줄이에요.'],
TR:['유럽과 아시아를 잇는 곳에 있어요. 수도는 이스탄불이 아닌 앙카라예요.','빨간 바탕에 흰 초승달과 별이 있어요.'],
SA:['아라비아반도에 있어요. 사막이 넓게 펼쳐져 있어요.','초록 바탕에 흰 아랍어 글씨와 칼 모양이 있어요.'],
AE:['아라비아반도에 있는 나라예요. 아부다비와 두바이가 있어요.','왼쪽 빨간 세로줄, 오른쪽 초록·흰색·검정 가로줄이에요.'],
VA:['로마 안에 있는 아주 작은 나라예요. 가톨릭 교황이 머무는 곳이에요.','노랑·흰색 세로 영역과 흰 영역 안의 열쇠·관 문양이 있어요.'],
PS:['지중해 동쪽에 있어요. 서안지구와 가자지구로 이루어져 있어요.','검정·흰색·초록 가로줄과 왼쪽의 빨간 삼각형이 있어요.'],
KP:['한반도 북쪽에 있어요. 우리나라와 육지로 이어져 있어요.','파랑·빨강·파랑 가로 영역 사이에 흰 줄이 있고, 흰 원 속 빨간 별이 있어요.'],
CU:['카리브해에 있는 섬나라예요. 수도는 아바나예요.','파랑·흰색 줄무늬와 빨간 삼각형 안의 흰 별이 있어요.'],
CL:['남아메리카 서쪽에서 태평양을 따라 길게 뻗은 나라예요.','흰색·빨강 가로 영역, 왼쪽 위 파란 칸 안에 흰 별이 있어요.'],
PE:['남아메리카에 있어요. 안데스산맥과 마추픽추 유적이 있어요.','빨강·흰색·빨강 세로줄이에요. 문장이 들어가는 형식도 있어요.'],
CO:['남아메리카 북쪽에 있어요. 태평양과 카리브해를 모두 만나요.','노랑·파랑·빨강 가로줄이에요. 맨 위 노란 줄이 더 넓어요.'],
IE:['유럽 서쪽 아일랜드섬에 있어요. 초록빛 들판으로 알려져 있어요.','왼쪽부터 초록·흰색·주황 세로줄이에요.'],
NL:['유럽 서쪽에 있어요. 풍차와 튤립으로 알려져 있어요.','위에서부터 빨강·흰색·파랑 가로줄이에요.'],
BE:['유럽 서쪽에 있어요. 브뤼셀이 수도이고 와플로도 알려져 있어요.','왼쪽부터 검정·노랑·빨강 세로줄이에요.'],
AT:['유럽의 알프스산맥에 있어요. 음악의 도시 빈이 수도예요.','빨강·흰색·빨강 가로줄이에요.'],
PL:['유럽 가운데에 있어요. 작곡가 쇼팽의 고향이에요.','위는 흰색, 아래는 빨강인 가로줄이에요.'],
UA:['유럽 동쪽에 있어요. 넓은 평야가 펼쳐져 있어요.','위는 파랑, 아래는 노랑인 가로줄이에요.'],
BD:['남아시아에 있어요. 여러 큰 강이 만나는 삼각주가 있어요.','초록 바탕에 빨간 원이 조금 왼쪽으로 치우쳐 있어요.'],
PK:['남아시아에 있어요. 높은 산과 인더스강이 있어요.','초록 바탕에 흰 초승달과 별, 왼쪽 흰 세로줄이 있어요.'],
BT:['히말라야산맥에 있어요. 산으로 둘러싸인 내륙국이에요.','노랑과 주황을 대각선으로 나누고 가운데 흰 용이 있어요.'],
LK:['인도 남쪽 인도양에 있는 섬나라예요. 차 생산으로도 알려져 있어요.','검을 든 사자와 잎 문양, 초록·주황 세로줄이 노란 테두리 안에 있어요.'],
MV:['인도양의 작은 산호섬들로 이루어진 나라예요.','빨간 바탕 안에 초록 사각형과 흰 초승달이 있어요.'],
FJ:['남태평양의 여러 섬으로 이루어져 있어요. 수도는 수바예요.','하늘색 바탕에 영국 국기 모양과 방패 문장이 있어요.'],
PG:['뉴기니섬의 동쪽과 주변 섬들로 이루어진 나라예요.','검정과 빨강을 대각선으로 나누고 별들과 노란 극락조가 있어요.'],
AQ:['남극은 나라가 아니라 대륙이에요. 여러 나라의 과학자들이 연구하러 가요.','남극 전체를 대표하는 공식 국기는 없어요. 이 그림은 남극을 나타내는 상징 깃발 중 하나예요.']};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function flag(c,cls=''){return `<img class="${cls}" src="${FLAGS[c.code]}" alt="${esc(c.name)} 국기" loading="lazy">`;}
function displayLanguage(code,fallback){try{return new Intl.DisplayNames(['ko'],{type:'language'}).of(code)||fallback}catch{return fallback}}
function getNotes(c){if(notes[c.code])return notes[c.code];const area=c.area?`넓이는 약 ${Math.round(c.area).toLocaleString('ko-KR')}㎢예요. `:'';return [`${c.name}은(는) ${c.region}에 있어요. ${c.landlocked?'바다와 직접 맞닿지 않은 내륙에 있어요.':area}`,'국기를 크게 보며 색과 모양을 찾아보세요. 다른 나라 국기와 어떤 점이 닮았나요?'];}
function capitals(c){if(c.code==='ZA')return '프리토리아 · 케이프타운 · 블룸폰테인';if(c.code==='PS')return '동예루살렘(주장) / 라말라(행정)';if(c.code==='IL')return '예루살렘(지위 분쟁)';if(c.code==='KZ')return '아스타나';return c.capital.join(' · ')||'별도 수도 없음';}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),2600)}
function save(){try{localStorage.setItem('little-world-passport-v1',JSON.stringify([...state.visited]));return true}catch{storageWorks=false;return false}}
function renderDetail(){const c=byCode.get(state.selected),n=getNotes(c),done=state.visited.has(c.code);$('#detail').innerHTML=`<div class="detail-tag"><span>${esc(c.region)} · ${c.core?'나라 탐험':'나라·지역 탐험'}</span><span aria-hidden="true">✧</span></div><div class="big-flag">${flag(c)}</div><h2>${esc(c.name)}</h2><p class="english">${esc(c.english)}</p><button class="speak" id="speak">♫ 이름과 설명 듣기</button><div class="facts"><div class="fact"><span>중심 도시 · 수도</span><strong>${esc(capitals(c))}</strong></div><div class="fact"><span>어디에 있을까?</span><strong>${esc(c.region)}</strong></div><div class="fact"><span>사용하는 언어</span><strong>${esc(c.language.map(([k,v])=>displayLanguage(k,v)).join(' · ')||'자료 없음')}</strong></div><div class="fact"><span>사용하는 돈</span><strong>${esc(c.currency.map(([k,v])=>{try{return new Intl.DisplayNames(['ko'],{type:'currency'}).of(k)}catch{return v.name}}).join(' · ')||'자료 없음')}</strong></div></div><div class="fun"><h3>✧ 이 나라가 궁금해!</h3><p>${esc(n[0])}</p><h3>⚑ 국기를 살펴봐요</h3><p>${esc(n[1])}</p></div><button id="stamp" class="stamp-button ${done?'stamped':''}">${done?'✓ 여권에 도장이 있어요 · 다시 누르면 취소':'✈ 여권에 도장 찍기'}</button><button id="locate" class="locate">지도에서 위치 찾기 ↗</button>`;
$('#speak').onclick=()=>{if(!('speechSynthesis' in window)){toast('이 기기에서는 읽어주기를 지원하지 않아요.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(`${c.name}. ${c.region}에 있어요. ${n[0]} ${n[1]}`);u.lang='ko-KR';u.rate=.88;const voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith('ko'));if(voice)u.voice=voice;u.onerror=e=>{if(!['interrupted','canceled'].includes(e.error))toast('한국어 음성을 사용할 수 없어요. 기기 음성 설정을 확인해 주세요.')};speechSynthesis.speak(u)};
$('#stamp').onclick=()=>{if(done)state.visited.delete(c.code);else state.visited.add(c.code);const saved=save();toast(done?'도장을 지웠어요.':saved?`${c.name} 탐험 도장, 꾹!`:'도장을 찍었어요. 이 기기에서는 새로고침하면 기록이 사라질 수 있어요.');renderDetail();renderCards();paintMap();updateCount()};
$('#locate').onclick=()=>{setView('map');focusCountry(c);$('#explore').scrollIntoView({behavior:'smooth',block:'start'})};}
function filtered(){const q=state.search.trim().toLocaleLowerCase();return COUNTRIES.filter(c=>(state.extra||c.core)&&(state.region==='전체'||c.region===state.region)&&(!q||[c.name,c.english,c.official,c.code].some(x=>x.toLocaleLowerCase().includes(q)))&&(state.view!=='passport'||state.visited.has(c.code))).sort((a,b)=>a.name.localeCompare(b.name,'ko'));}
function renderCards(){const cs=filtered();$('#cards').innerHTML=cs.map(c=>`<button class="country-card ${state.selected===c.code?'active':''}" data-code="${c.code}" aria-label="${esc(c.name)} 자세히 보기">${flag(c,'card-flag')}<strong>${esc(c.name)}</strong><small>${esc(c.region)}</small>${state.visited.has(c.code)?'<span class="done" aria-label="탐험 완료">✓</span>':''}</button>`).join('');$('#resultCount').textContent=`${cs.length}곳`;$('#empty').hidden=!!cs.length;$('#emptyText').textContent=state.view==='passport'?'나라를 살펴보고 ‘여권에 도장 찍기’를 눌러 보세요.':'다른 나라 이름이나 대륙으로 다시 찾아보세요.';$('#listTitle').firstChild.textContent=state.view==='passport'?'나만의 탐험 여권 ':'국기로 만나는 세계 ';$('#listEyebrow').textContent=state.view==='passport'?'MY LITTLE PASSPORT':'FLAGS OF THE WORLD';$('#passportIntro').hidden=state.view!=='passport';}
function updateCount(){$('#navCount').textContent=[...state.visited].filter(x=>byCode.get(x)?.core).length;}
function selectCountry(code,{fromCard=false,focus=false}={}){if(!byCode.has(code))return;state.selected=code;renderDetail();renderCards();paintMap();if(focus)focusCountry(byCode.get(code));if(fromCard){if(state.view!=='map')setView('map');$('#detail').scrollIntoView({behavior:'smooth',block:'nearest'});}try{history.replaceState(null,'','#'+code)}catch{}}
function setView(view){state.view=view;document.body.dataset.view=view;document.querySelectorAll('.nav').forEach(b=>{b.classList.toggle('active',b.dataset.view===view);b.setAttribute('aria-pressed',b.dataset.view===view)});renderCards();}
function renderRegions(){$('#regions').innerHTML=regions.filter(x=>x!=='남극'||state.extra).map(r=>`<button class="region ${state.region===r?'selected':''}" data-region="${r}" aria-pressed="${state.region===r}">${r==='전체'?'🌐 전체':r}</button>`).join('');}
function svg(tag,attrs){const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));return e;}
function drawMap(){for(const f of WORLD_PATHS){const c=byCode.get(f.code);const el=svg('path',{d:f.d,class:'country','data-code':f.code,'data-region':c?.region||'','aria-label':c?c.name+' 선택':'기타 지역',...(c?{tabindex:0,role:'button'}:{})});if(c){const t=svg('title',{});t.textContent=c.name;el.append(t)}$('#land').append(el)}for(const c of COUNTRIES.filter(c=>c.area<2500&&c.code!=='AQ')){const el=svg('circle',{cx:(c.lon+180)*3,cy:(90-c.lat)*3,r:3.7,class:'micro','data-code':c.code,'aria-label':c.name+' 선택',tabindex:0,role:'button'});const t=svg('title',{});t.textContent=c.name;el.append(t);$('#smallCountries').append(el)}paintMap();}
function paintMap(){document.querySelectorAll('#map [data-code]').forEach(el=>{const c=byCode.get(el.dataset.code);el.classList.toggle('selected',el.dataset.code===state.selected);el.classList.toggle('visited',state.visited.has(el.dataset.code));el.classList.toggle('dim',!!c&&state.region!=='전체'&&c.region!==state.region);if(el.classList.contains('micro'))el.style.display=c&&(state.extra||c.core)?'':'none'});const c=byCode.get(state.selected);$('#marker').innerHTML='';const x=(c.lon+180)*3,y=(90-c.lat)*3;const ring=svg('circle',{cx:x,cy:y,r:7,fill:'none',stroke:'#bd8533','stroke-width':2,'vector-effect':'non-scaling-stroke'});$('#marker').append(ring);}
function setBox(box){let [x,y,w,h]=box;w=Math.min(1080,Math.max(80,w));h=w/2;x=Math.max(-25,Math.min(1105-w,x));y=Math.max(-10,Math.min(550-h,y));state.box=[x,y,w,h];$('#map').setAttribute('viewBox',state.box.join(' '));document.querySelectorAll('.ocean').forEach(e=>e.hidden=w<1000);}
function zoom(f){const[x,y,w,h]=state.box;setBox([x+w*(1-f)/2,y+h*(1-f)/2,w*f,h*f])}
function focusCountry(c){const width=c.area>5000000?900:c.area>500000?600:c.area>50000?350:180;setBox([(c.lon+180)*3-width/2,(90-c.lat)*3-width/4,width,width/2]);}
$('#cards').onclick=e=>{const b=e.target.closest('[data-code]');if(b)selectCountry(b.dataset.code,{fromCard:true,focus:true})};
$('#regions').onclick=e=>{const b=e.target.closest('[data-region]');if(b){state.region=b.dataset.region;renderRegions();renderCards();paintMap()}};
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('#search').oninput=e=>{state.search=e.target.value;renderCards()};$('#search').onkeydown=e=>{if(e.key==='Enter'){const cs=filtered();if(cs.length)selectCountry(cs[0].code,{fromCard:true,focus:true})}};
$('#includeExtra').onchange=e=>{state.extra=e.target.checked;if(!state.extra&&state.region==='남극')state.region='전체';renderRegions();renderCards();paintMap()};
$('#clearFilters').onclick=()=>{state.region='전체';state.search='';$('#search').value='';if(state.view==='passport')setView('map');renderRegions();renderCards();paintMap()};
$('#random').onclick=()=>{let cs=COUNTRIES.filter(c=>c.core&&(state.region==='전체'||c.region===state.region)&&c.code!==state.selected);if(!cs.length)cs=COUNTRIES.filter(c=>c.core);selectCountry(cs[Math.floor(Math.random()*cs.length)].code,{focus:true});setView('map');$('#explore').scrollIntoView({behavior:'smooth',block:'start'})};
$('#zoomIn').onclick=()=>zoom(.65);$('#zoomOut').onclick=()=>zoom(1.5);$('#resetMap').onclick=()=>setBox([0,0,1080,540]);
let drag=null,ignoreClick=false;
$('#map').addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&state.box[2]===1080)return;ignoreClick=false;drag={x:e.clientX,y:e.clientY,box:[...state.box],moved:false}});
$('#map').addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>5){if(!drag.moved)$('#map').setPointerCapture(e.pointerId);drag.moved=true;$('#mapViewport').classList.add('dragging');const scale=drag.box[2]/$('#map').getBoundingClientRect().width;setBox([drag.box[0]-dx*scale,drag.box[1]-dy*scale,drag.box[2],drag.box[3]])}});
function endDrag(){if(drag?.moved)ignoreClick=true;drag=null;$('#mapViewport').classList.remove('dragging')}
$('#map').addEventListener('pointerup',endDrag);$('#map').addEventListener('pointercancel',endDrag);
$('#map').addEventListener('click',e=>{if(ignoreClick){ignoreClick=false;return}const el=e.target.closest('[data-code]');if(el&&byCode.has(el.dataset.code))selectCountry(el.dataset.code)});
$('#map').addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){const el=e.target.closest('[data-code]');if(el){e.preventDefault();selectCountry(el.dataset.code)}}});
window.addEventListener('hashchange',()=>{const code=location.hash.slice(1).toUpperCase();if(byCode.has(code))selectCountry(code)});
if(byCode.has(location.hash.slice(1).toUpperCase()))state.selected=location.hash.slice(1).toUpperCase();
setView('map');renderRegions();drawMap();renderDetail();renderCards();updateCount();
