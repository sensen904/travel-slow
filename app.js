
(() => {
  const root = document.getElementById('travel-planner-photo-v8');
  const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cities = [{name:'杭州',tag:'湖光与慢生活',pos:'0% 0%',days:'3 天 · 城市自由行'},{name:'大理',tag:'在山海之间放慢脚步',pos:'100% 0%',days:'4 天 · 山水漫游'},{name:'厦门',tag:'海风、街巷与日落',pos:'0% 100%',days:'3 天 · 海边散步'},{name:'重庆',tag:'山城夜色与热辣美食',pos:'100% 100%',days:'3 天 · 城市探索'}];
  const spots = {sudi:{name:'苏堤漫步',generic:'湖畔漫步',duration:90,time:'1.5 小时',desc:'湖边散步 · 拍照',photo:'0% 0%'},qingshi:{name:'老街闲逛',generic:'老街闲逛',duration:90,time:'1.5 小时',desc:'街巷漫游 · 寻找小吃',photo:'0% 100%'},tea:{name:'茶园小憩',generic:'山间小憩',duration:120,time:'2 小时',desc:'自然风光 · 慢节奏',photo:'100% 0%'}};
  const legacyFoods = [{id:'noodle',name:'片儿川',category:'午餐',icon:'utensils',price:'¥25–40',store:'湖畔面馆（示例）'},{id:'milktea',name:'桂花奶茶',category:'奶茶',icon:'cup-soda',price:'¥18–28',store:'街角茶铺（示例）'},{id:'cake',name:'定胜糕',category:'小吃',icon:'cookie',price:'¥10–20',store:'老街糕点铺（示例）'},{id:'breakfast',name:'豆浆与烧饼',category:'早餐',icon:'coffee',price:'¥10–20',store:'早食铺（示例）'},{id:'dinner',name:'本地家常菜',category:'晚餐',icon:'utensils',price:'¥60–100',store:'街巷小馆（示例）'}];
  const foodCategories=['早餐','午餐','晚餐','小吃'];
  const mealIcon=category=>category==='早餐'?'coffee':category==='小吃'?'cookie':'utensils';
  const todayFoods=(s,day=s.day)=>s.foodItems?.[day]||[];
  function normaliseUserContent(s){
    s.photoRevision=8;
    s.spotBasics=s.spotBasics&&typeof s.spotBasics==='object'?s.spotBasics:{};
    s.spotPhotos=s.spotPhotos&&typeof s.spotPhotos==='object'&&!Array.isArray(s.spotPhotos)?s.spotPhotos:{};
    for(const [spot,items] of Object.entries(s.spotPhotos))s.spotPhotos[spot]=Array.isArray(items)?items.filter(item=>item&&typeof item.id==='string').map(item=>({id:item.id.slice(0,160),name:String(item.name||'拍照图片').slice(0,150)})):[];
    s.foodItems=s.foodItems&&typeof s.foodItems==='object'&&!Array.isArray(s.foodItems)?s.foodItems:{};
    s.foodGroupsOpen=s.foodGroupsOpen&&typeof s.foodGroupsOpen==='object'?s.foodGroupsOpen:{'早餐':true};
    s.foodDrafts=s.foodDrafts&&typeof s.foodDrafts==='object'?s.foodDrafts:{};
    for(const [day,items] of Object.entries(s.foodItems))s.foodItems[day]=Array.isArray(items)?items.filter(f=>f&&String(f.name||'').trim()).map((f,i)=>({...f,id:String(f.id||`food-restored-${day}-${i}`).replace(/[^a-zA-Z0-9_-]/g,''),name:String(f.name).trim().slice(0,40),category:foodCategories.includes(f.category)?f.category:'小吃',icon:mealIcon(foodCategories.includes(f.category)?f.category:'小吃')})):[];
    for(const [key,ids] of Object.entries(s.assignments||{})){const day=key.split(':')[0];if(!s.foodItems[day])s.foodItems[day]=[];for(const id of ids){if(s.foodItems[day].some(f=>f.id===id))continue;const previous=legacyFoods.find(f=>f.id===id);if(previous){const category=foodCategories.includes(previous.category)?previous.category:'小吃';s.foodItems[day].push({...previous,category,icon:mealIcon(category)});}}}
  }
  const basicsFor=s=>s.spotBasics[s.spot]||(s.spotBasics[s.spot]={ticket:'',duration:'',opening:''});
  const defaultHotels = [{name:'亚朵酒店',source:'美团',price:'420',priceBasis:'每晚',people:'2',room:'大床房',window:'有窗',bed:'1.8 × 2.0 米',address:'湖畔片区（示例）'},{name:'全季酒店',source:'携程',price:'360',priceBasis:'每晚',people:'2',room:'双床房',window:'有窗',bed:'1.2 × 2.0 米 / 床',address:'老街片区（示例）'}];
  const demoTrips = [{id:'hangzhou-oct',city:'杭州',start:'2026-10-01',end:'2026-10-03',days:3,companion:'小林',people:2},{id:'dali-sep',city:'大理',start:'2026-09-12',end:'2026-09-15',days:4,companion:'朋友们',people:4},{id:'xiamen-jul',city:'厦门',start:'2026-07-18',end:'2026-07-20',days:3,companion:'家人',people:3},{id:'chongqing-jun',city:'重庆',start:'2026-06-05',end:'2026-06-07',days:3,companion:'阿远',people:2}];
  const create = () => ({screen:'home',city:'杭州',day:1,days:3,tripStart:'2026-10-01',tripEnd:'2026-10-03',companion:'小林',people:2,currentTripId:'hangzhou-oct',pastTrips:structuredClone(demoTrips),plannedTrips:[],orders:{1:['sudi','qingshi'],2:['tea','qingshi'],3:['sudi','tea']},assignments:{},customSpots:{},spotNotes:{},spotBasics:{},foodItems:{},foodGroupsOpen:{'早餐':true},foodDrafts:{},hotels:structuredClone(defaultHotels),hotel:0,spot:'sudi',food:'noodle',foodCat:'全部',guideTab:'概览',sheet:null,selectedAssign:'sudi',selectedMode:'地铁',routePreference:'少换乘',saved:false,toast:'',locked:{},savedTrips:[],homeRevision:2});
  const todayISO=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);};
  const futureISO=n=>{const d=new Date(todayISO()+'T12:00:00');d.setDate(d.getDate()+n);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
  const emptyHotel={name:'酒店待添加',source:'',room:'',price:'',priceBasis:'每晚',people:'',window:'',bed:'',address:''};
  const states = {clean:create()};
  const saved = window.TravelStore.load();
  if(saved?.privateContent?.apps) for(const key of Object.keys(states)) {const v=saved.privateContent.apps[key]; if(v?.homeRevision===2 && Array.isArray(v.hotels) && v.orders && Array.isArray(v.pastTrips)) Object.assign(states[key],v,{sheet:null,toast:''});}
  for(const [key,s] of Object.entries(states)){s._appKey=key;s.customSpots=s.customSpots||{};s.spotNotes=s.spotNotes||{};normaliseUserContent(s);for(const h of s.hotels){h.source=h.source||'';h.priceBasis=h.priceBasis||'每晚';}if(s.screen==='hotelForm'&&!s.hotelDraft){s.hotelEditing=s.hotel;s.hotelDraft=structuredClone((s.hotels[s.hotel]||emptyHotel));}if(s.screen==='hotelImport'){s.hotelImport={source:s.hotelImport?.source||'',imageNames:[],isDemo:false};}}
  const spotName = (s,id) => s.customSpots?.[id]?.name||(s.city==='杭州'?spots[id]?.name:spots[id]?.generic)||'待确认景点';
  const order = s => s.orders[s.day]||(s.orders[s.day]=[]);
  const assigned = (s,id) => s.assignments[`${s.day}:${id}`] || [];
  const foodById = (s,id) => Object.values(s.foodItems||{}).flat().find(f=>f.id===id)||legacyFoods.find(f=>f.id===id)||{id,name:'美食内容待填写',category:'小吃',icon:'utensils',price:'',store:''};
  const cityOf = s => cities.find(c=>c.name===s.city)||{name:s.city,pos:'0% 0%'};
  const travelDays = s => Array.from({length:s.days},(_,i)=>i+1);
  const dayDate = (s,day=s.day) => new Date(Date.parse(s.tripStart)+(day-1)*86400000).toISOString().slice(0,10);
  const circleDate = (s,day) => {const date=dayDate(s,day);return `${Number(date.slice(5,7))}.${Number(date.slice(8,10))}`;};
  const dayTitle = s => {const date=dayDate(s);return `${Number(date.slice(5,7))}月${Number(date.slice(8,10))}日`;};
  const exportImages = {};
  function makeExportImage(s,key) {
    const ord=order(s),hotel=(s.hotels[s.hotel]||emptyHotel),canvas=document.createElement('canvas');
    const accent=key==='clean'?'#326957':'#607b60',muted='#6c786f',line='#e2e8df';
    const blockHeights=ord.map(id=>160+assigned(s,id).length*38),height=590+blockHeights.reduce((a,b)=>a+b,0)+Math.max(0,ord.length-1)*54;
    canvas.width=780;canvas.height=height;
    const c=canvas.getContext('2d');
    c.fillStyle=key==='clean'?'#ffffff':'#faf8f1';c.fillRect(0,0,780,height);
    const text=(value,x,y,size=25,color='#293e34',weight=400)=>{c.fillStyle=color;c.font=`${weight} ${size}px "Microsoft YaHei",sans-serif`;c.fillText(value,x,y);};
    const fit=(value,maxWidth,size=25)=>{c.font=`400 ${size}px "Microsoft YaHei",sans-serif`;let copy=String(value);while(c.measureText(copy).width>maxWidth&&copy.length)copy=copy.slice(0,-1);return copy===String(value)?copy:copy+'…';};
    const rule=y=>{c.strokeStyle=line;c.lineWidth=2;c.beginPath();c.moveTo(48,y);c.lineTo(732,y);c.stroke();};
    text('旅行规划 · 今日行程',48,65,23,accent);
    text(fit(`${s.city} · ${dayTitle(s)}`,680,39),48,127,39,'#293e34',500);
    text(`${dayDate(s).replaceAll('-','.')}  ·  ${s.people}人出游`,48,176,24,muted);
    text(fit(`同行人：${s.companion}`,680,24),48,217,24,muted);
    rule(247);
    text('今日酒店',48,292,22,muted);
    text(fit(`${hotelLabel(hotel)} · ${hotelValue(hotel.room)} · ${hotelPrice(hotel)}`,680,26),48,336,26);
    text('今天想吃',48,387,22,muted);
    text(fit(todayFoods(s).map(f=>f.name).join(' · ')||'还没有添加想吃的内容',680,25),48,426,25);
    let y=472,minutes=9*60+legInfo(s,'hotel',ord[0]).minutes,timingKnown=true;
    for(let i=0;i<ord.length;i++){
      const id=ord[i],p=spotOf(s,id),time=timingKnown&&!p.custom?`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`:'待安排';if(p.custom||!p.durationKnown)timingKnown=false;
      rule(y);y+=48;
      c.beginPath();c.arc(68,y-7,20,0,Math.PI*2);c.fillStyle=accent;c.fill();text(String(i+1),60,y+2,23,'#ffffff');
      text(fit(spotName(s,id),430,30),105,y+3,30,'#293e34',500);text(time,626,y+1,25,accent);
      text(fit(`游玩时间：${p.time}`,570,24),105,y+49,24,muted);
      text(fit(`门票价格：${p.ticket}`,570,23),105,y+87,23,muted);
      y+=112;
      for(const fid of assigned(s,id)){text(`美食：${foodById(s,fid).name} · 附近门店待确认`,105,y+13,23,accent);y+=38;}
      const leg=legInfo(s,id,ord[i+1]||'hotel');minutes+=p.duration+assigned(s,id).length*60+leg.minutes;
      if(i<ord.length-1){text(p.custom||spotOf(s,ord[i+1]).custom?'交通时间待计算 → 下一站':`${s.selectedMode} · 示例 ${leg.minutes} 分钟 → 下一站`,105,y+21,23,muted);y+=54;}
    }
    if(!ord.length){text('当天还没有添加景点',48,y+35,26,muted);}
    text('价格、门店和交通时间为原型示例',48,height-27,20,muted);
    return canvas.toDataURL('image/png');
  }
  const tripPeriod = t => `${t.start.replaceAll('-','.')}–${t.end.slice(5).replace('-','.')} · ${t.days}天`;
  const activateTrip = (s,t) => {s.city=t.city;s.day=1;s.days=t.days;s.tripStart=t.start;s.tripEnd=t.end;s.companion=t.companion;s.people=t.people;s.currentTripId=t.id;s.hotels=structuredClone(t.hotels||(t.id.startsWith('trip-')?[]:defaultHotels));s.hotel=t.hotel||0;s.prepChecks=structuredClone(t.prepChecks||{});s.orders=t.orders?structuredClone(t.orders):Object.fromEntries(Array.from({length:t.days},(_,i)=>[i+1,i%3===0?['sudi','qingshi']:i%3===1?['tea','qingshi']:['sudi','tea']]));s.assignments=t.assignments?structuredClone(t.assignments):{};s.customSpots=t.customSpots?structuredClone(t.customSpots):{};s.spotNotes=t.spotNotes?structuredClone(t.spotNotes):{};s.spotBasics=t.spotBasics?structuredClone(t.spotBasics):{};s.spotPhotos=t.spotPhotos?structuredClone(t.spotPhotos):{};s.foodItems=t.foodItems?structuredClone(t.foodItems):{};s.foodDrafts={};normaliseUserContent(s);s.spot=order(s)[0]||'sudi';s.locked={};s.saved=false;s.screen='itinerary';s.sheet=null;s.toast='';};
  const rememberTrip = s => {const t=[...s.pastTrips,...s.plannedTrips].find(t=>t.id===s.currentTripId);if(t){Object.assign(t,{start:s.tripStart,end:s.tripEnd,days:s.days,companion:s.companion,people:s.people,hotels:structuredClone(s.hotels),hotel:s.hotel,prepChecks:structuredClone(s.prepChecks||{}),orders:structuredClone(s.orders),assignments:structuredClone(s.assignments),customSpots:structuredClone(s.customSpots),spotNotes:structuredClone(s.spotNotes),spotBasics:structuredClone(s.spotBasics),spotPhotos:structuredClone(s.spotPhotos),foodItems:structuredClone(s.foodItems)});}};
  const dateCount = (start,end) => start&&end?Math.round((Date.parse(end)-Date.parse(start))/86400000)+1:0;
  const smallDate = value => value?`${Number(value.slice(5,7))}月${Number(value.slice(8,10))}日`:'待选择';
  const chineseNumber = value => {if(/^\d+$/.test(value))return Number(value);const digits={'零':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};if(value==='十')return 10;if(value.includes('十')){const [t,u]=value.split('十');return (t?digits[t]:1)*10+(u?digits[u]:0);}return digits[value];};
  function countParticipants(value) {
    const text=String(value||'').trim().replaceAll('（','(').replaceAll('）',')');
    if(!text)return {count:null,hint:'填写同行人后自动识别人数'};
    const number='[零一二两三四五六七八九十\\d]+';
    const total=text.match(new RegExp(`(?:共|一共|总共|总计|我们|一家)\\s*(${number})\\s*(?:人|位|口)`))||text.match(new RegExp(`^(${number})\\s*(?:个人|人)(?:一起出游|出行)?$`));
    if(total){const count=chineseNumber(total[1]);return count>0?{count,hint:'已识别总人数'}:{count:null,hint:'请填写有效人数'};}
    const family=text.match(new RegExp(`(${number})大(${number})小`));
    if(family)return {count:chineseNumber(family[1])+chineseNumber(family[2]),hint:'已识别总人数'};
    if(/^(?:我自己|自己|独自|独自出游|独自出行|只有我|一个人|我一个人|本人|我)$/.test(text))return {count:1,hint:'独自出游'};
    const parts=text.replaceAll('爸爸妈妈','爸爸、妈妈').replaceAll('爸妈','爸爸、妈妈').replace(/一起(?:出游|出行|旅行)?|一同(?:出游|出行)?/g,'').split(/还有|加上|带上|带着|以及|和|与|及|带|[、，,；;＋+\n]/).map(v=>v.trim()).filter(Boolean);
    let others=0;const named=new Set();
    for(const part of parts){
      if(/^(?:我|自己|本人|我自己)$/.test(part))continue;
      const quantity=part.match(new RegExp(`^(${number})\\s*(?:位|名|个|人)\\s*.+$`))||part.match(new RegExp(`^.+?\\(\\s*(${number})\\s*人\\s*\\)$`));
      if(quantity){const amount=chineseNumber(quantity[1]);if(!Number.isFinite(amount)||amount<1)return {count:null,hint:'请补充同行人数'};others+=amount;continue;}
      if(/朋友们|同事们|同学们|孩子们|家人|一家人|大家|几个|若干|等人|^朋友$|^同事$|^同学$/.test(part))return {count:null,hint:'请写出同行人姓名，或注明人数，例如“2位朋友”'};
      if(!named.has(part)){named.add(part);others+=1;}
    }
    return {count:others+1,hint:'人数包含你本人'};
  }
  const participantInfo = draft => {const result=countParticipants(draft.companion);return result.count===null&&draft.knownPeople?{count:draft.knownPeople,hint:'已记录的出行人数'}:result;};
  const beginDraft = (s,mode) => {s.tripDraft=mode==='new-trip'?{city:'',start:futureISO(7),end:futureISO(9),companion:'',knownPeople:null}:{city:s.city,start:s.tripStart,end:s.tripEnd,companion:s.companion,knownPeople:s.people};s.sheet=mode;};
  function tripFields(s) {
    const d=s.tripDraft,info=participantInfo(d),days=dateCount(d.start,d.end);
    return `<div class="tp-setting-field"><span>旅行天数</span><button class="tp-date-control cursor-interaction" type="button" data-action="open-calendar"><span><strong>${days>0?`${days} 天`:'选择旅行日期'}</strong><small>${d.start&&d.end?`${d.start.replaceAll('-','.')} — ${d.end.replaceAll('-','.')}`:'选择出发日期和结束日期'}</small></span>${icon('calendar-days')}</button></div><div class="tp-setting-field"><label class="tp-setting-label"><span>和谁出行</span><span class="tp-people-count" data-people-badge aria-live="polite">出行人数：${info.count===null?'待确认':`${info.count} 人`}</span></label><textarea aria-label="和谁出行" name="companion" data-companion rows="2" maxlength="300" placeholder="例如：小林、阿远；独自出游可填“我自己”" required>${escape(d.companion)}</textarea><p class="tp-field-help">填写同行人，用顿号、逗号或“和”分隔，人数包含你本人。</p><p class="tp-field-help" data-people-hint ${info.count===null?'':'hidden'}>${info.count===null?info.hint:''}</p></div>`;
  }
  function calendarBody(s) {
    const d=s.tripDraft,[year,month]=s.calendarMonth.split('-').map(Number),offset=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7,days=new Date(Date.UTC(year,month,0)).getUTCDate(),length=dateCount(d.start,d.end);
    const cells=Array.from({length:offset},()=>'<span aria-hidden="true"></span>').join('')+Array.from({length:days},(_,i)=>{const day=i+1,iso=`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`,endpoint=iso===d.start||iso===d.end,inside=d.start&&d.end&&iso>d.start&&iso<d.end;return `<button type="button" class="tp-calendar-day cursor-interaction ${endpoint?'tp-range-endpoint':inside?'tp-range-inside':''}" data-action="calendar-date" data-date="${iso}" aria-label="${month}月${day}日${iso===d.start?'，出发':iso===d.end?'，结束':''}" aria-pressed="${endpoint||Boolean(inside)}"><span>${day}</span>${endpoint?`<small>${iso===d.start?'出发':'结束'}</small>`:''}</button>`;}).join('');
    return `<p class="tp-calendar-instruction" aria-live="polite">${s.rangeSelecting==='end'?'请选择结束日期':'先选出发日期，再选结束日期'}</p><div class="tp-calendar-nav"><button class="tp-icon cursor-interaction" type="button" data-action="calendar-month" data-dir="-1" aria-label="上一个月">${icon('chevron-left')}</button><strong>${year}年 ${month}月</strong><button class="tp-icon cursor-interaction" type="button" data-action="calendar-month" data-dir="1" aria-label="下一个月">${icon('chevron-right')}</button></div><div class="tp-weekdays" aria-hidden="true">${['一','二','三','四','五','六','日'].map(day=>`<span>${day}</span>`).join('')}</div><div class="tp-calendar-grid" aria-label="选择起止日期">${cells}</div><div class="tp-range-summary"><div><small>出发</small><strong>${smallDate(d.start)}</strong></div><span>${icon('arrow-right')}</span><div><small>结束</small><strong>${smallDate(d.end)}</strong></div><div><small>旅行天数</small><strong>${length>0?`${length} 天`:'待选择'}</strong></div></div><button class="tp-primary cursor-interaction" type="button" data-action="calendar-confirm" ${length>0?'':'disabled'}>${length>0?`确认日期 · ${length} 天`:'请选择结束日期'}</button>`;
  }
  function applyDraft(s) {
    const d=s.tripDraft,info=participantInfo(d),days=dateCount(d.start,d.end);if(!days||days<1)return '请选择有效的起止日期。';if(days>60)return '单次旅行最多支持60天，请缩短日期范围。';if(info.count===null)return info.hint;
    s.tripStart=d.start;s.tripEnd=d.end;s.days=days;s.companion=d.companion.trim();s.people=info.count;s.day=Math.min(s.day,days);for(let day=1;day<=days;day++)if(!s.orders[day])s.orders[day]=[];
    rememberTrip(s);const inPast=s.pastTrips.findIndex(t=>t.id===s.currentTripId),inPlanned=s.plannedTrips.findIndex(t=>t.id===s.currentTripId);if(s.tripEnd>=todayISO()&&inPast>=0)s.plannedTrips.push(s.pastTrips.splice(inPast,1)[0]);if(s.tripEnd<todayISO()&&inPlanned>=0)s.pastTrips.push(s.plannedTrips.splice(inPlanned,1)[0]);return null;
  }
  const legInfo = (s,from,to) => {const pair=`${from}:${to}`,matrix={'hotel:sudi':18,'hotel:qingshi':28,'hotel:tea':38,'sudi:qingshi':25,'qingshi:sudi':32,'sudi:tea':35,'tea:sudi':40,'qingshi:tea':30,'tea:qingshi':34,'sudi:hotel':20,'qingshi:hotel':26,'tea:hotel':36};const base=(matrix[pair]||25)+(s.hotel===1?5:0);return {minutes:Math.max(8,Math.round(base*(s.selectedMode==='公交'?1.4:s.selectedMode==='打车'?.7:1))),icon:s.selectedMode==='公交'?'bus-front':s.selectedMode==='打车'?'car-taxi-front':'train-front'};};
  const persist = () => {for(const key of Object.keys(states)){rememberTrip(states[key]);states[key]._rev=(states[key]._rev||0)+1;}const apps=structuredClone(states);for(const s of Object.values(apps)){const current=[...s.pastTrips,...s.plannedTrips].find(t=>t.id===s.currentTripId);if(current)for(const field of ['orders','assignments','customSpots','spotNotes','spotBasics','spotPhotos','foodItems'])delete current[field];}const snapshot={modelContent:{design:'旅行规划手机界面',style:'清爽清单',homeRevision:2,hotelRevision:5,spotRevision:7,foodRevision:7,photoRevision:8,cleanPage:states.clean.screen,chosenCity:states.clean.city},privateContent:{apps}};window.TravelStore.save(snapshot);};
  const header = (title,subtitle,back='itinerary',action='') => `<div class="tp-head"><button class="tp-icon cursor-interaction" data-action="go" data-screen="${back}" aria-label="返回">${icon('arrow-left')}</button><div><h2>${escape(title)}</h2><p class="tp-small">${escape(subtitle)}</p></div>${action}</div>`;
  const bottom = (active) => `<nav class="tp-bottom-nav" aria-label="主导航"><button class="cursor-interaction ${active==='home'?'is-active':''}" data-action="go" data-screen="home">${icon('compass')}目的地</button><button class="cursor-interaction ${active==='my'?'is-active':''}" data-action="go" data-screen="my">${icon('notebook-pen')}我的行程</button></nav>`;
  const actions = (primary,action) => `<button class="tp-primary cursor-interaction" data-action="${action}">${primary}</button>`;
  function home(s) {
    const row=t=>{const c=cities.find(c=>c.name===t.city);return `<button class="tp-history-row cursor-interaction" data-action="open-trip" data-trip="${escape(t.id)}"><div class="tp-photo ${c?'':'tp-no-photo'}" ${c?`style="background-position:${c.pos}"`:''} role="img" aria-label="${escape(t.city)}旅行封面">${c?'':icon('map-pin')}</div><div class="tp-history-copy"><strong>${escape(t.city)}</strong><span class="tp-history-meta">${icon('calendar-days')}<span>${tripPeriod(t)}</span></span><span class="tp-history-meta">${icon('users-round')}<span>和${escape(t.companion)}一起出游 · ${t.people}人</span></span></div><span class="tp-history-arrow">${icon('chevron-right')}</span></button>`;};
    const past=[...s.pastTrips].sort((a,b)=>b.start.localeCompare(a.start));
    const planned=[...s.plannedTrips].sort((a,b)=>a.start.localeCompare(b.start));
    return `<div class="tp-home-title"><p class="tp-eyebrow">旅行规划 · TRAVEL SLOW</p><h1>我的旅行</h1><p>计划下一次出发，记下走过的地方。</p></div><div class="tp-content tp-home-content"><button class="tp-primary tp-add-trip cursor-interaction" data-action="new-trip">${icon('plus')}<span>添加这次旅行</span>${icon('arrow-up-right')}</button>${planned.length?`<section class="tp-plan-section"><div class="tp-history-head"><h2>待出发的旅行</h2></div>${planned.map(row).join('')}</section>`:''}<section aria-label="以往的旅行"><div class="tp-history-head"><h2>以往的旅行</h2><span class="tp-small">示例可编辑</span></div>${past.map(row).join('')}</section></div>`;
  }

  const prepCount=s=>['hotel','spots','route'].filter(k=>!s.prepChecks?.[k]).length;
  function preparation(s){
    const checks=s.prepChecks||{},left=prepCount(s);
    const rows=[{id:'hotel',title:'酒店住宿',detail:'核对预订、入住日期和房型',screen:'hotels',action:'核对酒店'},{id:'spots',title:'景点信息',detail:'补充门票、游玩时间和开放预约',screen:'guide',action:'去完善'},{id:'route',title:'交通路线',detail:'出发前确认当天各站位置',screen:'map',action:'查看路线'}];
    return header('出发前准备',s.city+' · '+dayTitle(s))+'<div class="tp-content"><div class="web-prep-summary"><small>出发前准备</small><h2>'+ (left?'还有 '+left+' 项待核对':'都准备好了，出发吧')+'</h2><p>住宿 · 景点信息 · 当天路线</p></div><h3 class="web-prep-heading">建议出发前确认</h3>'+rows.map(row=>'<section class="web-prep-card"><div><strong>'+row.title+'</strong><span class="web-badge '+(checks[row.id]?'done':'')+'">'+(checks[row.id]?'已核对':'待核对')+'</span><button type="button" class="tp-link" data-action="prep-open" data-section="'+row.screen+'">'+row.action+' ›</button></div><p class="tp-small">'+row.detail+'</p><label class="web-check"><input type="checkbox" data-prep-check="'+row.id+'" '+(checks[row.id]?'checked':'')+'>我已核对这项内容</label></section>').join('')+'<button class="web-prep-food" data-action="go" data-screen="foods"><span><strong>美食清单</strong><small>想好之后再来填写</small></span><span>去填写 ›</span></button><button class="tp-outline web-prep-back" data-action="go" data-screen="itinerary">回到当天行程</button></div>';
  }

  function itinerary(s) {
    const hotel=(s.hotels[s.hotel]||emptyHotel); const ord=order(s); let minutes=9*60+legInfo(s,'hotel',ord[0]).minutes;let timingKnown=true;
    const cards=ord.map((id,i)=>{
      const p=spotOf(s,id);const at=timingKnown&&!p.custom?`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`:'待安排';if(p.custom||!p.durationKnown)timingKnown=false;const leg=legInfo(s,id,ord[i+1]||'hotel');minutes+=p.duration+assigned(s,id).length*60+leg.minutes;
      return `<article class="tp-stop" data-drop-spot="${id}"><div class="tp-stop-head"><span class="tp-clock">${at}</span><div><span class="tp-small">第 ${i+1} 站${s.locked[id]?' · 已锁定':''}</span></div><button class="tp-drag" data-drag-spot="${id}" draggable="true" aria-label="拖动${escape(spotName(s,id))}排序">${icon('grip-vertical')}</button></div><div class="tp-stop-detail">${p.photo?`<div class="tp-photo" style="background-position:${p.photo}" role="img" aria-label="景点示意图片"></div>`:`<div class="tp-photo tp-custom-cover">${icon('map-pin')}</div>`}<div><button class="tp-spot-name cursor-interaction" data-action="guide" data-spot="${id}">${escape(spotName(s,id))}</button><p class="tp-stop-desc">${p.desc}</p><p class="tp-small">游玩时间：${escape(p.time)} · 门票：${escape(p.ticket)}</p></div></div>${assigned(s,id).map(fid=>`<div class="tp-assigned">${icon(foodById(s,fid).icon)} ${foodById(s,fid).category} · ${escape(foodById(s,fid).name)}<br><span>附近示例门店 · 待确认 · 预留 60 分钟</span></div>`).join('')}<div class="tp-stop-actions"><button class="tp-link cursor-interaction" data-action="lock" data-spot="${id}">${icon(s.locked[id]?'lock-keyhole':'lock-keyhole-open')}${s.locked[id]?'解锁':'锁定'}</button><div><button data-action="remove-stop" data-spot="${id}" aria-label="移除${escape(spotName(s,id))}">${icon('trash-2')}</button><button class="cursor-interaction" data-action="move" data-dir="-1" data-spot="${id}" aria-label="上移${escape(spotName(s,id))}">${icon('arrow-up')}</button><button class="cursor-interaction" data-action="move" data-dir="1" data-spot="${id}" aria-label="下移${escape(spotName(s,id))}">${icon('arrow-down')}</button><button class="tp-link cursor-interaction" data-action="guide" data-spot="${id}">攻略 ${icon('chevron-right')}</button></div></div></article>${i<ord.length-1?`<div class="tp-leg"><span>${icon(leg.icon)} ${p.custom||spotOf(s,ord[i+1]).custom?'交通时间待计算':`${s.selectedMode} · 示例 ${leg.minutes} 分钟`}</span><button class="cursor-interaction" data-action="transport">换方案 ${icon('chevron-down')}</button></div>`:''}`;
    }).join('');
    return `${header(`${s.city} · 我的慢旅行`,`${s.days} 天 / ${s.people} 人 · 和${s.companion}出游`,'home',`<button class="tp-icon cursor-interaction" data-action="settings" aria-label="设置旅行日期">${icon('sliders-horizontal')}</button>`)}<div class="tp-tabs" aria-label="选择旅行日期">${travelDays(s).map(d=>`<button class="tp-tab cursor-interaction" aria-pressed="${s.day===d}" aria-label="${dayDate(s,d)}" data-action="day" data-day="${d}"><strong>${circleDate(s,d)}</strong></button>`).join('')}</div><div class="tp-content">${s.toast?`<div class="tp-toast" role="status">${s.toast}</div>`:''}<div class="tp-box tp-hotel-strip"><div class="tp-hotel-symbol">${icon('bed-double')}</div><div><strong>${escape(hotelLabel(hotel))}</strong><p class="tp-small">${s.hotels.length?escape(hotelValue(hotel.room))+' · '+escape(hotelPrice(hotel))+' · '+escape(hotelValue(hotel.window)):'导入截图或填写信息，选好这次住宿'}</p></div><button class="tp-link cursor-interaction" data-action="go" data-screen="hotels">对比 ${icon('chevron-right')}</button></div><button class="web-prep-entry" data-action="go" data-screen="preparation"><strong>出发前准备</strong><span>${prepCount(s)?prepCount(s)+' 项待核对':'已准备好'} ›</span></button><div class="tp-title-row"><h3>今天想吃</h3><button class="cursor-interaction" data-action="go" data-screen="foods">美食清单 ${icon('plus')}</button></div><div class="tp-food-tray">${todayFoods(s).map(f=>`<button class="tp-food-chip cursor-interaction" data-action="assign-open" data-food="${f.id}" data-drag-food="${f.id}" draggable="true">${icon('grip-vertical')}${escape(f.name)}</button>`).join('')}${todayFoods(s).length?'':'<p class="tp-small tp-food-empty">还没有添加想吃的内容</p>'}</div><p class="tp-tray-note">${todayFoods(s).length?'拖到景点安排美食，也可以点选；门店待确认。':'打开美食清单，按早餐、午餐、晚餐、小吃添加。'}</p><div class="tp-list-heading"><h3>今日游览</h3><small>拖动调整 · 时间随顺序更新</small></div>${s.hotels.length?`<div class="tp-leg"><span>${icon('bed-double')} 从${escape(hotelLabel(hotel))}出发</span></div>`:''}${cards||'<div class="tp-empty-day"><h3>这一天还没有景点</h3><p class="tp-small">添加想去的景点，开始安排游览顺序。</p></div>'}${s.hotels.length?`<div class="tp-leg"><span>${icon('bed-double')} 返回${escape(hotelLabel(hotel))}</span></div>`:''}<button class="tp-outline cursor-interaction" data-action="go" data-screen="spots">${icon('plus')} 添加景点</button><div class="tp-summary"><span>在外部地图查看位置与距离</span><button class="tp-link cursor-interaction" data-action="external-map">路线总览 ${icon('arrow-up-right')}</button></div><div class="tp-actions"><button class="tp-primary cursor-interaction" data-action="export-image">${icon('image-down')}导出图片</button></div></div>`;
  }
  const hotelImageCache = {clean:[],journal:[]};
  const hotelValue = value => value!==undefined&&value!==null&&String(value).trim()?String(value):'待确认';
  const hotelLabel = h => h===emptyHotel?'还没添加酒店':`${h.name}${h.source?`（${h.source}）`:'（来源未标注）'}`;
  const hotelPrice = h => h.price?`¥${h.price}${h.priceBasis==='每晚'?'/晚':h.priceBasis==='入住总价'?' / 总价':' · 计价待确认'}`:'待确认';
  function demoHotelScreenshot() {
    const canvas=document.createElement('canvas');canvas.width=720;canvas.height=880;
    const c=canvas.getContext('2d');c.fillStyle='#f5f6f2';c.fillRect(0,0,720,880);
    const text=(value,x,y,size=28,color='#2c4036')=>{c.fillStyle=color;c.font=`400 ${size}px "Microsoft YaHei",sans-serif`;c.fillText(value,x,y);};
    text('酒店预订页面 · 原型示例',40,62,24,'#758076');
    c.fillStyle='#e7eee3';c.fillRect(40,100,640,190);
    text('亚朵酒店',75,183,46);text('杭州 · 西湖片区（示例）',75,245,27,'#65786a');
    c.fillStyle='#ffffff';c.fillRect(40,320,640,465);
    text('高级大床房',72,379,35);text('可入住 2 人',72,438,27);
    text('2026.10.16 — 2026.10.18',72,500,25,'#758076');
    text('¥420 / 晚',72,596,46,'#326957');text('所选房型 · 每晚价格',72,650,24,'#758076');
    text('地址：杭州西湖片区（示例）',72,727,25);
    text('示例截图未展示窗户和床尺寸',40,836,24,'#758076');
    return canvas.toDataURL('image/png');
  }
  function beginHotelImport(s,key) {
    hotelImageCache[key]=[];s.hotelImport={source:'',imageNames:[],isDemo:false};s.screen='hotelImport';s.sheet=null;s.toast='';
  }
  function hotels(s) {
    const columns=s.hotels;
    const rows=[['价格',h=>hotelPrice(h)],['可住人数',h=>h.people?`${h.people} 人`:'待确认'],['房型',h=>hotelValue(h.room)],['窗户',h=>hotelValue(h.window)],['床尺寸',h=>hotelValue(h.bed)],['位置',h=>hotelValue(h.address)],[`${s.days-1} 晚估算`,h=>h.price&&h.priceBasis==='每晚'?`¥${Number(h.price)*Math.max(0,s.days-1)}`:'待确认']];
    return `${header('我的酒店对比','截图导入信息 · 来源由你标注')}<div class="tp-content">${s.toast?`<div class="tp-toast" role="status">${escape(s.toast)}</div>`:''}<button class="tp-hotel-upload cursor-interaction" data-action="hotel-import">${icon('image-plus')}<strong>导入酒店截图</strong><span>添加酒店截图，体验识别与信息核对</span></button><p class="tp-hotel-caption">${s.tripStart.replaceAll('-','.')} — ${s.tripEnd.replaceAll('-','.')} · 入住 ${Math.max(0,s.days-1)} 晚</p>${columns.length?'':'<div class="tp-empty-day"><h3>还没有添加酒店</h3><p class="tp-small">导入截图，或手动填写酒店信息来比较。</p><button class="tp-link" data-action="hotel-manual">手动添加酒店</button></div>'}<div class="tp-hotel-table-wrap" ${columns.length?'':'hidden'} role="region" aria-label="酒店信息对比，可横向滑动"><table class="tp-hotel-table" style="min-width:${80+122*columns.length}px"><thead><tr><th class="tp-hotel-dimension">对比维度</th>${columns.map((h,i)=>`<th><strong>${escape(hotelLabel(h))}</strong><button class="tp-link cursor-interaction" data-action="hotel-edit" data-hotel="${i}">核对信息 ${icon('pencil')}</button></th>`).join('')}</tr></thead><tbody>${rows.map(([title,get])=>`<tr><th>${title}</th>${columns.map(h=>`<td class="${get(h)==='待确认'?'tp-unconfirmed':''}">${escape(get(h))}</td>`).join('')}</tr>`).join('')}<tr><th>纳入行程</th>${columns.map((h,i)=>`<td><button class="tp-link cursor-interaction" data-action="select-hotel" data-hotel="${i}">${s.hotel===i?'✓ 已选':'选择酒店'}</button></td>`).join('')}</tr></tbody></table></div>${columns.length>2?`<p class="tp-small" style="margin-top:10px">共 ${columns.length} 家酒店，横向滑动查看全部</p>`:''}<p class="tp-field-help" style="margin:12px 0">截图没有的信息标为待确认；来源由你填写。价格请核对房型、日期和计价方式。</p><button class="tp-outline cursor-interaction" data-action="back-itinerary">返回行程</button></div>`;
  }
  function hotelImport(s) {
    const d=s.hotelImport,key=s._appKey,images=hotelImageCache[key]||[];
    return `${header('导入酒店截图','同一家酒店可添加多张截图','hotels')}<div class="tp-content"><form class="tp-form" data-hotel-import-form><label>信息来源 <span class="tp-small">由你填写，系统不识别来源</span><input name="source" data-hotel-source value="${escape(d.source)}" placeholder="例如：美团、携程、飞猪" maxlength="30" required></label><div><span class="tp-import-label">酒店截图</span><input type="file" data-hotel-files accept="image/png,image/jpeg,image/webp" multiple aria-label="选择酒店截图" hidden><button class="tp-hotel-upload cursor-interaction" type="button" data-action="pick-hotel-files">${icon('image-plus')}<strong>${images.length?'继续添加截图':'点击导入酒店截图'}</strong><span>可添加房型、价格、酒店详情等页面</span></button>${images.length?`<div class="tp-import-images">${images.map((item,i)=>`<figure><img src="${item.url}" alt="${escape(item.name)}"><figcaption>${escape(item.name)}</figcaption><button type="button" class="tp-icon cursor-interaction" data-action="remove-hotel-image" data-index="${i}" aria-label="移除第${i+1}张截图">${icon('x')}</button></figure>`).join('')}</div><p class="tp-small">已添加 ${images.length} 张${d.isDemo?'示例':''}截图</p>`:''}</div><p class="tp-field-help">识别酒店名、价格、可住人数、房型、窗户、床尺寸和位置。未展示的信息不补猜。</p><p class="tp-form-error" role="alert" data-hotel-import-error hidden></p><button class="tp-primary cursor-interaction" type="button" data-action="recognize-hotel">${icon('scan-text')}识别并加入对比</button><button class="tp-link tp-demo-link cursor-interaction" type="button" data-action="hotel-demo">使用示例截图体验</button><p class="tp-small">体验版：示例截图可演示识别；你上传的截图需手动核对填写。</p></form></div>`;
  }
  function hotelForm(s) {
    const h=s.hotelDraft,editing=s.hotelEditing!==null;
    const input=(name,title,options={})=>`<label>${title}${!h[name]&&name!=='source'?'<span class="tp-field-missing">待确认 · 可补充</span>':''}<input name="${name}" value="${escape(h[name]||'')}" placeholder="${options.placeholder||'待确认，可补充'}" ${options.type?`type="${options.type}" min="${name==='price'?0:1}" ${name==='price'?'step="0.01"':''}`:''} maxlength="${options.maxlength||80}" ${options.required?'required':''}></label>`;
    return `${header('核对酒店信息','识别内容可修改 · 未识别项可稍后补充','hotels')}<div class="tp-content">${s.hotelReviewNote?`<div class="tp-hotel-review-note" role="status">${escape(s.hotelReviewNote)}</div>`:''}${hotelScreens(s)}<form class="tp-form" data-hotel-form>${input('source','信息来源（由你填写）',{required:true,placeholder:'例如：美团、携程、飞猪',maxlength:30})}${input('name','酒店名称',{required:true,maxlength:60})}<div class="tp-form-row">${input('price','价格 / 元',{type:'number'})}<label>计价方式<select name="priceBasis">${['待确认','每晚','入住总价'].map(v=>`<option ${h.priceBasis===v?'selected':''}>${v}</option>`).join('')}</select></label></div><div class="tp-form-row">${input('people','可住人数',{type:'number'})}${input('room','房型')}</div><div class="tp-form-row">${input('window','窗户')}${input('bed','床尺寸')}</div>${input('address','位置或地址')}<p class="tp-field-help">只保留图片中展示的信息；来源以你的填写为准。其他项目可保留待确认。</p><button class="tp-primary cursor-interaction" type="button" data-action="save-hotel">${editing?'保存修改':'添加到酒店对比'}</button></form></div>`;
  }
  function enteredDuration(value){const text=String(value||'').trim();if(!text||/[—–~-]|至|到/.test(text))return null;const hours=text.match(/(\d+(?:\.\d+)?)\s*(?:小时|小時|时|h)/i),minutes=text.match(/(\d+(?:\.\d+)?)\s*(?:分钟|分鐘|分|min)/i);return hours||minutes?Number(hours?.[1]||0)*60+Number(minutes?.[1]||0):null;}
  const spotOf = (s,id) => {const base=s.customSpots?.[id]||spots[id]||{name:'待确认景点',custom:true,desc:'信息待补充',photo:null};const basic=s.spotBasics?.[id]||{},minutes=enteredDuration(basic.duration);return {...base,time:basic.duration||'未填写',ticket:basic.ticket||'未填写',duration:minutes||0,durationKnown:minutes!==null};};
  const noteImageCache = {},noteLoads=new Set(),hotelLoads=new Set();
  function hydrateNotes(s){const scope=noteKey(s);if(noteLoads.has(scope))return;noteLoads.add(scope);window.TravelStore.imagesFor(scope).then(images=>{noteImageCache[scope]=Object.fromEntries(images.map(i=>[i.id,i.url]));if(images.length&&s.screen==='guide'&&s.guideTab==='概览'&&noteKey(s)===scope)render(s._appKey);}).catch(()=>{});}
  function hydrateHotelScreens(s){const scope=s.hotelDraft?.imageScope;if(!scope||hotelLoads.has(scope))return;hotelLoads.add(scope);window.TravelStore.imagesFor(scope).then(images=>{noteImageCache[scope]=Object.fromEntries(images.map(i=>[i.id,i.url]));if(s.screen==='hotelForm'&&s.hotelDraft?.imageScope===scope)render(s._appKey);}).catch(()=>{});}
  function hotelScreens(s){const scope=s.hotelDraft?.imageScope,images=noteImageCache[scope]||{};return Object.keys(images).length?'<div class="tp-import-images">'+Object.values(images).map(url=>'<figure><img src="'+url+'" alt="酒店原始截图"></figure>').join('')+'</div>':'';}

  const noteKey = s => `${s.currentTripId}:${s.spot}`;
  const notesFor = s => s.spotNotes[s.spot]||(s.spotNotes[s.spot]={text:'',links:[],images:[]});
  function xhsNoteUrl(value) {
    let text=String(value).trim();if(/^(?:www\.)?(?:xiaohongshu\.com|xhslink\.com)\//i.test(text))text='https://'+text;
    const matches=text.match(/https?:\/\/[^\s<>]+/g)||[];
    for(let candidate of matches){candidate=candidate.replace(/[。），、,;；]+$/g,'');try{const u=new URL(candidate);if(['http:','https:'].includes(u.protocol)&&(u.hostname==='xiaohongshu.com'||u.hostname.endsWith('.xiaohongshu.com')||u.hostname==='xhslink.com'||u.hostname.endsWith('.xhslink.com'))&&u.href.length<=1000)return u.href;}catch{}}
    return null;
  }
  function notesEditor(s) {
    const n=notesFor(s),cache=noteImageCache[noteKey(s)]||{};
    return `<section class="tp-notes" aria-label="景点备注"><div class="tp-title-row"><h3>备注</h3><small class="tp-small" data-notes-status aria-live="polite">自动暂存</small></div><textarea class="tp-note-text" aria-label="景点文字备注" data-note-text maxlength="1200" rows="3" placeholder="写下想去的区域、游玩提醒或自己的安排…">${escape(n.text)}</textarea><div class="tp-note-tools"><button class="tp-note-tool cursor-interaction" type="button" data-action="insert-note-image">${icon('image-plus')}插入图片</button><button class="tp-note-tool cursor-interaction" type="button" data-action="insert-note-link">${icon('link')}小红书笔记链接</button></div><input type="file" data-note-files accept="image/png,image/jpeg,image/webp" multiple aria-label="选择备注图片" hidden>${n.images.length?`<div class="tp-note-images">${n.images.map((item,i)=>`<figure>${cache[item.id]?`<img src="${cache[item.id]}" alt="${escape(item.name)}">`:'<div class="tp-note-image-missing">图片需重新添加</div>'}<figcaption>${escape(item.name)}</figcaption><button type="button" class="tp-note-remove cursor-interaction" data-action="remove-note-image" data-index="${i}" aria-label="删除第${i+1}张备注图片">${icon('x')}</button></figure>`).join('')}</div>`:''}${n.links.length?`<div class="tp-note-links">${n.links.map((url,i)=>`<article><span class="tp-note-link-symbol">${icon('link')}</span><div><strong>小红书笔记</strong><span>${escape(new URL(url).hostname)}</span><a class="tp-link cursor-interaction" href="${escape(url)}" target="_blank" rel="noopener noreferrer">打开笔记 ${icon('arrow-up-right')}</a></div><button type="button" class="tp-note-remove cursor-interaction" data-action="remove-note-link" data-index="${i}" aria-label="删除第${i+1}条笔记链接">${icon('x')}</button></article>`).join('')}</div>`:''}<p class="tp-form-error" data-notes-error role="alert" hidden></p></section>`;
  }
  function picker(s) {
    return `${header('添加想去的景点',`${s.city} · ${dayTitle(s)}行程`)}<div class="tp-content"><div class="tp-spot-input-intro"><span>${icon('map-pin')}</span><h3>这次想去哪里？</h3><p class="tp-small">输入景点名称，加入当天行程并填写游玩攻略。</p></div><form class="tp-form" data-spot-input-form><label>景点名称<input name="spotName" data-spot-name value="${escape(s.spotInput||'')}" placeholder="例如：苏堤漫步、灵隐寺" maxlength="40" required></label><p class="tp-small">每次填写一个景点。</p><button class="tp-primary cursor-interaction" type="button" data-action="open-entered-spot">查看游玩攻略 ${icon('arrow-right')}</button></form></div>`;
  }
  const photoImages={},photoLoads=new Map(),photoStatus={},photoBusy=new Set();
  let photoDBPromise;
  const photoScope=s=>JSON.stringify([s.currentTripId,s.spot]);
  const photosFor=s=>s.spotPhotos[s.spot]||(s.spotPhotos[s.spot]=[]);
  function photoDB(){
    if(!photoDBPromise)photoDBPromise=new Promise((resolve,reject)=>{try{const request=indexedDB.open('travel-planner-spot-photos-v8',1);request.onupgradeneeded=()=>{const store=request.result.createObjectStore('photos',{keyPath:'id'});store.createIndex('scope','scope',{unique:false});};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('本机存储暂不可用'));}catch(error){reject(error);}}).catch(()=>null);
    return photoDBPromise;
  }
  async function photoStore(mode,operation){
    const db=await photoDB();if(!db)throw new Error('当前环境不能访问本机存储');
    return new Promise((resolve,reject)=>{let value;const transaction=db.transaction('photos',mode),request=operation(transaction.objectStore('photos'));if(request)request.onsuccess=()=>value=request.result;transaction.oncomplete=()=>resolve(value);transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error||new Error('本机保存未完成'));});
  }
  function hydrateSpotPhotos(s){
    const scope=photoScope(s),trip=s.currentTripId,spot=s.spot;
    if(!photoLoads.has(scope))photoLoads.set(scope,(async()=>{
      try{const records=await photoStore('readonly',store=>store.index('scope').getAll(scope));const valid=records.filter(item=>item.blob instanceof Blob&&['image/png','image/jpeg','image/webp'].includes(item.blob.type));
        photoImages[scope]=photoImages[scope]||{};for(const item of valid)if(!photoImages[scope][item.id])photoImages[scope][item.id]=URL.createObjectURL(item.blob);
        const owner=s.currentTripId===trip?s:[...s.pastTrips,...s.plannedTrips].find(t=>t.id===trip);if(owner){owner.spotPhotos=owner.spotPhotos||{};owner.spotPhotos[spot]=valid.map(item=>({id:item.id,name:item.name}));}
      }catch{photoStatus[scope]='';}
      if(s.screen==='guide'&&s.guideTab==='拍照'&&photoScope(s)===scope)render(s._appKey);
    })());
    return photoLoads.get(scope);
  }
  function photographyEditor(s){
    const scope=photoScope(s),cache=photoImages[scope]||{},items=photosFor(s),busy=photoBusy.has(scope);
    return `<section class="tp-photo-editor" aria-label="我的拍照图片"><input type="file" data-spot-photo-files accept="image/png,image/jpeg,image/webp" multiple aria-label="选择拍照图片" hidden><button type="button" class="tp-photo-upload cursor-interaction" data-photo-action="pick" ${busy?'disabled':''}>${icon('image-plus')}<strong>${busy?'正在保存图片…':'添加拍照图片'}</strong><span>上传想参考或想记录的图片</span></button>${items.length?`<div class="tp-photo-grid">${items.map(item=>`<figure><button type="button" class="tp-photo-thumb cursor-interaction" data-photo-action="preview" data-photo-id="${escape(item.id)}" aria-label="放大预览${escape(item.name)}">${cache[item.id]?`<img src="${cache[item.id]}" alt="${escape(item.name)}">`:'<span class="tp-small">正在读取本机图片</span>'}</button><figcaption><span>${escape(item.name)}</span><button type="button" class="tp-icon cursor-interaction" data-photo-action="remove" data-photo-id="${escape(item.id)}" aria-label="删除${escape(item.name)}">${icon('trash-2')}</button></figcaption></figure>`).join('')}</div>`:''}<p class="tp-photo-status" data-photo-status role="status" aria-live="polite" ${photoStatus[scope]?'':'hidden'}>${escape(photoStatus[scope]||'')}</p><p class="tp-form-error" data-photo-error role="alert" hidden></p><dialog class="tp-photo-dialog" data-photo-viewer aria-label="拍照图片预览"><div class="tp-photo-dialog-head"><strong>图片预览</strong><button type="button" class="tp-icon cursor-interaction" data-photo-action="close-preview" aria-label="关闭图片预览">${icon('x')}</button></div><img data-photo-preview-image alt=""><p data-photo-preview-name></p></dialog></section>`;
  }
  function guide(s) {
    const p=spotOf(s,s.spot),basic=basicsFor(s);let content='';
    if(s.guideTab==='概览')content=`<form class="tp-form tp-guide-basics" data-guide-basics-form aria-label="景点基础信息"><label>门票价格<input name="ticket" data-spot-basic="ticket" value="${escape(basic.ticket||'')}" placeholder="填写门票价格" maxlength="80"></label><label>游玩时间<input name="duration" data-spot-basic="duration" value="${escape(basic.duration||'')}" placeholder="填写预计游玩时间" maxlength="80"></label><label>开放与预约<input name="opening" data-spot-basic="opening" value="${escape(basic.opening||'')}" placeholder="填写开放时间和预约信息" maxlength="200"></label></form>${notesEditor(s)}`;
    if(s.guideTab==='美食'){const items=todayFoods(s);content=`<p class="tp-guide-text">${items.length?'你添加的美食，可安排到此景点。':'还没有添加想吃的内容，可在美食清单中填写。'}</p>${items.map(f=>`<div class="tp-food-row"><div class="tp-food-symbol">${icon(f.icon)}</div><div><button class="tp-food-name cursor-interaction" data-action="food-detail" data-food="${f.id}">${escape(f.name)}</button><p class="tp-small">${f.category} · 门店待确认</p></div><button class="tp-link cursor-interaction" data-action="assign-open" data-food="${f.id}">安排</button></div>`).join('')}`;}
    if(s.guideTab==='特产')content=p.custom?'<p class="tp-guide-text">此景点的特产信息待补充。</p>':'<div class="tp-title-row"><h3>当地特色伴手礼</h3></div><p class="tp-guide-text">茶点、糕点、当地茶叶等（示例）。展示推荐购买位置、携带方式和参考价格来源。</p><div class="tp-warn">具体商品与购买点待核实。</div>';
    if(s.guideTab==='拍照')content=photographyEditor(s);
    return `${header('景点游玩攻略',`${s.city} · ${dayTitle(s)}`)}<div class="tp-content"><div class="tp-guide-title"><h1>${escape(spotName(s,s.spot))}</h1></div><div class="tp-guide-tabs">${['概览','美食','特产','拍照'].map(t=>`<button class="cursor-interaction" data-action="guide-tab" data-tab="${t}" aria-pressed="${s.guideTab===t}">${t}</button>`).join('')}</div>${content}</div>`;
  }
  function foodList(s) {
    const items=todayFoods(s);
    return `${header('今天想吃什么',`${dayTitle(s)} · 把想吃的安排到沿途`)}<div class="tp-content"><p class="tp-meal-intro">按分组记录想吃的内容，再安排到沿途景点。</p><div class="tp-meal-groups">${foodCategories.map(category=>{const list=items.filter(f=>f.category===category),open=Boolean(s.foodGroupsOpen[category]);return `<section class="tp-meal-group"><button class="tp-meal-toggle cursor-interaction" type="button" data-action="toggle-food-group" data-category="${category}" aria-expanded="${open}" aria-controls="tp-meal-${s._appKey}-${foodCategories.indexOf(category)}"><strong>${category}</strong><span>${list.length} 项</span>${icon(open?'chevron-up':'chevron-down')}</button><div id="tp-meal-${s._appKey}-${foodCategories.indexOf(category)}" class="tp-meal-body" ${open?'':'hidden'}><form class="tp-meal-form" data-food-add-form data-category="${category}"><input name="foodName" data-food-draft="${category}" value="${escape(s.foodDrafts[category]||'')}" aria-label="${category}想吃的内容" placeholder="写下${category}想吃什么" maxlength="40" required><button class="tp-meal-add cursor-interaction" type="button" data-action="add-food" data-category="${category}">${icon('plus')}添加</button></form>${list.length?`<ul class="tp-meal-items">${list.map(f=>`<li><button class="tp-meal-name cursor-interaction" type="button" data-action="food-detail" data-food="${f.id}">${escape(f.name)}</button><button class="tp-link cursor-interaction" type="button" data-action="assign-open" data-food="${f.id}" aria-label="安排${escape(f.name)}">安排</button><button class="tp-icon cursor-interaction" type="button" data-action="remove-food" data-food="${f.id}" aria-label="删除${escape(f.name)}">${icon('trash-2')}</button></li>`).join('')}</ul>`:'<p class="tp-meal-empty">还没有添加，写下想吃的内容吧。</p>'}</div></section>`;}).join('')}</div><div class="tp-actions"><button class="tp-outline cursor-interaction" data-action="go" data-screen="itinerary">回到当天行程</button></div></div>`;
  }
  function foodDetail(s) {const f=foodById(s,s.food);return `${header('美食与门店',`${f.category} · 我的美食清单`,'foods')}<div class="tp-content"><div class="tp-box"><div class="tp-food-symbol" style="margin-bottom:12px">${icon(f.icon)}</div><h1>${escape(f.name)}</h1><p class="tp-guide-text">${f.price?`${escape(f.price)} / 人（已记录）`:'价格待补充'}</p><p class="tp-small">口味、价格、营业时间以具体门店为准。</p></div><div class="tp-title-row"><h3>沿途门店</h3></div><div class="tp-store"><div class="tp-store-head">${icon('map-pin')}<strong>${escape(f.store||'尚未填写门店')}</strong></div><p class="tp-small">景点附近 · 距离待核实</p><p class="tp-guide-text">确认门店营业时间、位置、菜单和价格后，再纳入正式路线。</p><button class="tp-outline cursor-interaction" data-action="assign-open" data-food="${f.id}">安排到某个景点</button></div></div>`;}
  function mapHandoff(s) {
    const ord=order(s);
    const mapLink=id=>'https://api.map.baidu.com/place/search?'+new URLSearchParams({query:spotName(s,id),region:s.city,output:'html',src:'webapp.travelslow.planner'}).toString();
    return `<div class="tp-map-heading"><span>${icon('map-pinned')}</span><div><strong>百度地图 · 今日路线</strong><p class="tp-small">${dayTitle(s)} · ${ord.length} 个景点</p></div></div><p class="tp-guide-text">按行程顺序，逐站查看实际位置。</p><ol class="tp-map-ordered">${ord.map((id,i)=>`<li><span class="tp-number">${i+1}</span><div><strong>${escape(spotName(s,id))}</strong><small>第 ${i+1} 站 · 游玩时间：${escape(spotOf(s,id).time)}</small><a class="web-map-link" href="${escape(mapLink(id))}" target="_blank" rel="noopener noreferrer">在百度地图查看 ${icon('arrow-up-right')}</a></div></li>`).join('')}</ol><p class="web-map-help">打开地图后，请确认具体地点。此体验版支持逐站搜索，暂不在外部地图自动标注整条路线。</p>${actions('返回行程','close-sheet')}`;
  }

  function my(s) {return `${header('我的行程','保存的计划，随时继续调整','home')}<div class="tp-content"><div class="tp-banner tp-photo" style="margin:0 0 16px;background-position:${cityOf(s).pos}"><div class="tp-banner-copy"><strong>${escape(s.city)} · ${s.saved?'已保存':'示例计划'}</strong><small>${s.days} 天 · ${s.people} 人</small></div></div><div class="tp-box"><h3>${escape(s.city)}慢旅行</h3><p class="tp-guide-text">${Object.values(s.orders).reduce((n,a)=>n+a.length,0)} 个景点安排 · 自主选择酒店和美食</p><button class="tp-primary cursor-interaction" data-action="go" data-screen="itinerary">${icon('notebook-pen')}继续编辑</button><div class="tp-actions"><button class="tp-outline cursor-interaction" data-action="share">${icon('share-2')}查看分享摘要</button></div></div>${s.toast?`<div class="tp-toast" style="margin-top:14px" role="status">${s.toast}</div>`:''}</div>${bottom('my')}`;}
  function sheet(s) {
    if(!s.sheet)return '';
    let title='',body='';
    if(s.sheet==='new-trip') {title='添加这次旅行';body=`<form class="tp-form tp-new-trip-form" data-new-trip-form><label>目的地<input name="destination" data-destination list="tp-destinations-${escape(s.city)}" value="${escape(s.tripDraft.city)}" placeholder="选择或填写你想去的地方" maxlength="30" required><datalist id="tp-destinations-${escape(s.city)}">${cities.map(c=>`<option value="${c.name}"></option>`).join('')}</datalist></label>${tripFields(s)}<p class="tp-form-error" role="alert" data-trip-error hidden></p><button class="tp-primary cursor-interaction" type="button" data-action="create-trip">创建旅行规划 ${icon('arrow-right')}</button></form>`;}
    if(s.sheet==='assign') {const f=foodById(s,s.food);title=`安排${escape(f.name)}`;body=`<p class="tp-small">选择景点，再确认附近门店。示例将预留 60 分钟。</p>${order(s).map(id=>`<button class="tp-sheet-option cursor-interaction ${s.selectedAssign===id?'is-selected':''}" data-action="assign-pick" data-spot="${id}">${icon('map-pin')}<span>${escape(spotName(s,id))}<br><small class="tp-small">附近示例门店 · 待确认</small></span>${s.selectedAssign===id?icon('check'):''}</button>`).join('')}<div class="tp-warn">关联美食意向后，还需核实门店位置与营业时间。</div>${actions('加入当天行程','assign-confirm')}`;}
    if(s.sheet==='transport') {title='这一段怎么走';body=`<p class="tp-small">对比内容为示例，正式路线按实际地点计算。</p>${[{m:'地铁',i:'train-front',t:'25 分钟 · ¥5 / 人 · 换乘 1 次'},{m:'公交',i:'bus-front',t:'35 分钟 · ¥2 / 人 · 换乘 0 次'},{m:'打车',i:'car-taxi-front',t:'18 分钟 · 估价 ¥25–35 / 车'}].map(v=>`<button class="tp-sheet-option cursor-interaction ${s.selectedMode===v.m?'is-selected':''}" data-action="mode" data-mode="${v.m}">${icon(v.i)}<span>${v.m}<br><small class="tp-small">${v.t}</small></span>${s.selectedMode===v.m?icon('check'):''}</button>`).join('')}${actions('应用交通方案','transport-confirm')}`;}
    if(s.sheet==='settings') {title='这次旅行';body=`<form class="tp-form" data-settings-form>${tripFields(s)}<p class="tp-form-error" role="alert" data-trip-error hidden></p><button class="tp-primary cursor-interaction" type="button" data-action="settings-confirm">保存设置</button></form>`;}
    if(s.sheet==='date-range') {title='选择旅行日期';body=calendarBody(s);}
    if(s.sheet==='note-link'){title='添加小红书笔记';body=`<form class="tp-form" data-note-link-form><label>笔记链接<textarea name="link" data-note-link rows="3" maxlength="1500" placeholder="粘贴小红书笔记链接，或整段分享文字" required></textarea></label><p class="tp-field-help">保存链接，方便随时打开原笔记。</p><p class="tp-form-error" data-note-link-error role="alert" hidden></p><button class="tp-primary cursor-interaction" type="button" data-action="save-note-link">${icon('plus')} 添加到备注</button></form>`;}

    if(s.sheet==='external-map') {title='在外部地图查看';body=mapHandoff(s);}
    if(s.sheet==='export-image') {title='导出当天行程';body=`<p class="tp-export-date">${dayTitle(s)} · 包含酒店、美食、景点顺序与交通</p><img class="tp-export-preview" src="${exportImages[s.exportKey]}" alt="${escape(s.city)} ${dayTitle(s)}行程分享长图"><p class="tp-small" style="margin-bottom:14px">长按图片也可保存，发送给同行人。</p><a class="tp-primary cursor-interaction" href="${exportImages[s.exportKey]}" download="${escape(s.city)}-${dayDate(s)}-行程.png">${icon('download')} 保存图片</a>`;}

    if(s.sheet==='share') {title='行程分享摘要';body=`<div class="tp-box"><h3>${escape(s.city)}慢旅行 · ${s.days} 天</h3>${travelDays(s).map(d=>`<p class="tp-guide-text">${circleDate(s,d)}：${s.orders[d].map(id=>escape(spotName(s,id))).join(' → ')}</p>`).join('')}</div><p class="tp-small" style="margin:12px 0">分享摘要默认隐藏酒店名称与位置。</p>${actions('返回我的行程','close-sheet')}`;}
    return `<div class="tp-sheet-layer"><section class="tp-sheet" role="dialog" aria-modal="true" aria-label="${title}"><div class="tp-sheet-head"><h3>${title}</h3><button class="tp-icon cursor-interaction" data-action="close-sheet" aria-label="关闭面板">${icon('x')}</button></div>${body}</section></div>`;
  }
  const pages = {preparation,home,itinerary,hotels,hotelForm,hotelImport,spots:picker,guide,foods:foodList,foodDetail,my};
  let webScreen='';
  function render(key) {const el=root.querySelector(`[data-app="${key}"]`),s=states[key];if(!pages[s.screen])s.screen='home';el.innerHTML=`<div class="tp-status"><span>9:41</span><span>${icon('signal')}${icon('wifi')}${icon('battery-full')}</span></div>${pages[s.screen](s)}${['home','itinerary','hotels','hotelImport','hotelForm','spots','guide'].includes(s.screen)?'':'<div class="tp-notice">界面预览 · 封面为生成示意图 · 价格与交通均为示例</div>'}${sheet(s)}`; if(globalThis.lucide)lucide.createIcons({attrs:{width:18,height:18}}); if(s.sheet){const focus=el.querySelector('[role="dialog"] button');if(focus)focus.focus({preventScroll:true});}if(s.screen==='guide'&&s.guideTab==='拍照')hydrateSpotPhotos(s);if(s.screen==='guide'&&s.guideTab==='概览')hydrateNotes(s);if(s.screen==='hotelForm')hydrateHotelScreens(s);document.documentElement.style.overflow=s.sheet?'hidden':'';if(webScreen!==s.screen){window.scrollTo({top:0,behavior:'instant'});webScreen=s.screen;}}
  const notify=(s,msg)=>{s.toast=msg;};
  root.addEventListener('change',e=>{if(!e.target.matches('[data-prep-check]'))return;const s=states.clean;s.prepChecks=s.prepChecks||{};s.prepChecks[e.target.dataset.prepCheck]=e.target.checked;persist();render('clean');});
  let ignoredClickTarget=null;
  root.addEventListener('click',async e=>{
    if(ignoredClickTarget&&ignoredClickTarget.contains(e.target)){e.preventDefault();ignoredClickTarget=null;return;}
    const b=e.target.closest('[data-action]');if(!b)return;const app=b.closest('[data-app]');if(!app)return;const key=app.dataset.app,s=states[key],a=b.dataset.action;
    if(a==='prep-open'){
      if(b.dataset.section==='map'){s.sheet='external-map';}
      else if(b.dataset.section==='guide'){s.spot=order(s)[0]||'sudi';s.guideTab='概览';s.screen=order(s).length?'guide':'spots';}
      else s.screen=b.dataset.section;
    }
    if(a==='remove-stop'){const id=b.dataset.spot;s.orders[s.day]=order(s).filter(v=>v!==id);delete s.assignments[s.day+':'+id];}

    if(a==='go'){s.screen=b.dataset.screen;s.toast='';}
    if(a==='city'){s.city=b.dataset.city;s.screen='itinerary';s.toast='';}
    if(a==='new-trip')beginDraft(s,'new-trip');
    if(a==='open-trip'){rememberTrip(s);const t=[...s.pastTrips,...s.plannedTrips].find(t=>t.id===b.dataset.trip);if(t)activateTrip(s,t);}
    if(a==='create-trip'){const form=b.closest('[data-new-trip-form]');if(!form.reportValidity())return;const d=s.tripDraft,info=participantInfo(d),length=dateCount(d.start,d.end),error=form.querySelector('[data-trip-error]');if(length<1||length>60||!d.city.trim()||info.count===null){error.hidden=false;error.textContent=length>60?'单次旅行最多支持60天。':length<1?'请选择旅行起止日期。':!d.city.trim()?'请填写目的地。':info.hint;return;}rememberTrip(s);const t={id:`trip-${Date.now()}`,city:d.city.trim(),start:d.start,end:d.end,days:length,companion:d.companion.trim(),people:info.count,orders:Object.fromEntries(Array.from({length:length},(_,i)=>[i+1,[]]))};(t.end<todayISO()?s.pastTrips:s.plannedTrips).push(t);activateTrip(s,t);notify(s,'旅行已创建，添加想去的景点开始规划。');}
    if(a==='day'){s.day=Number(b.dataset.day);s.toast='';}
    if(a==='settings')beginDraft(s,'settings');
    if(a==='external-map'){if(!order(s).length){notify(s,'先添加景点，再查看当天路线。');}else{s.sheet='external-map';}}
    if(a==='export-image'){s.exportKey=key;exportImages[key]=makeExportImage(s,key);s.sheet='export-image';}
    if(a==='download-image'){const link=document.createElement('a');link.href=exportImages[key];link.download=`${s.city}-${dayDate(s)}-行程.png`;link.addEventListener('click',event=>event.stopPropagation());app.append(link);link.click();link.remove();return;}

    if(a==='settings-confirm'){const form=b.closest('[data-settings-form]');if(!form.reportValidity())return;const message=applyDraft(s);if(message){const error=form.querySelector('[data-trip-error]');error.hidden=false;error.textContent=message;return;}s.sheet=null;notify(s,'旅行日期和出行人数已更新');}
    if(a==='open-calendar'){s.rangeReturn=s.sheet;s.rangePrevious={start:s.tripDraft.start,end:s.tripDraft.end};s.calendarMonth=(s.tripDraft.start||todayISO()).slice(0,7);s.rangeSelecting='start';s.sheet='date-range';}
    if(a==='calendar-month'){const [year,month]=s.calendarMonth.split('-').map(Number),date=new Date(Date.UTC(year,month-1+Number(b.dataset.dir),1));s.calendarMonth=date.toISOString().slice(0,7);}
    if(a==='calendar-date'){const date=b.dataset.date;if(s.rangeSelecting!=='end'||date<s.tripDraft.start){s.tripDraft.start=date;s.tripDraft.end='';s.rangeSelecting='end';}else{s.tripDraft.end=date;s.rangeSelecting='start';}}
    if(a==='calendar-confirm'){s.sheet=s.rangeReturn;s.rangePrevious=null;}
    if(a==='hotel-manual'){s.hotelEditing=null;s.hotelDraft={...emptyHotel,name:''};s.hotelReviewNote='填写酒店信息，来源可标注官网、电话咨询或预订平台。';s.screen='hotelForm';}
    if(a==='hotel-form'||a==='hotel-import')beginHotelImport(s,key);

    if(a==='pick-hotel-files'){app.querySelector('[data-hotel-files]').click();return;}
    if(a==='remove-hotel-image'){hotelImageCache[key].splice(Number(b.dataset.index),1);s.hotelImport.imageNames=hotelImageCache[key].map(item=>item.name);}
    if(a==='hotel-demo'){hotelImageCache[key]=[{name:'酒店预订截图（示例）.png',url:demoHotelScreenshot(),demo:true}];s.hotelImport.imageNames=['酒店预订截图（示例）.png'];s.hotelImport.isDemo=true;}
    if(a==='hotel-edit'){s.hotelEditing=Number(b.dataset.hotel);s.hotelDraft=structuredClone(s.hotels[s.hotelEditing]);s.hotelReviewNote='来源由你填写，截图未展示的项目可保留待确认。';s.screen='hotelForm';}
    if(a==='recognize-hotel'){
      const form=b.closest('[data-hotel-import-form]');if(!form.reportValidity())return;
      const d=s.hotelImport,images=hotelImageCache[key];
      if(!images.length){const error=form.querySelector('[data-hotel-import-error]');error.hidden=false;error.textContent='请先添加酒店截图。';return;}
      const importTrip=s.currentTripId,imageScope=importTrip+':hotel:'+Date.now();
      try{for(let i=0;i<images.length;i++)await window.TravelStore.putImage(imageScope,{id:'hotel-'+i,name:images[i].name,url:images[i].url});}catch{const error=form.querySelector('[data-hotel-import-error]');error.hidden=false;error.textContent='截图保存失败，请减少图片大小后重试。';return;}
      if(s.currentTripId!==importTrip||s.screen!=='hotelImport'||s.hotelImport!==d)return;
      if(d.isDemo&&images.every(image=>image.demo)){
        s.hotels.push({name:'亚朵酒店',source:d.source.trim(),price:'420',priceBasis:'每晚',people:'2',room:'高级大床房',window:'',bed:'',address:'杭州西湖片区（示例）',imageNames:[...d.imageNames],recognitionDemo:true,imageScope});s.screen='hotels';notify(s,'示例酒店已识别并添加，窗户和床尺寸待确认。');
      }else{
        s.hotelEditing=null;s.hotelDraft={name:'',source:d.source.trim(),price:'',priceBasis:'待确认',people:'',room:'',window:'',bed:'',address:'',imageNames:[...d.imageNames],imageScope};s.hotelReviewNote='截图已保存。体验版尚未接入真实识别，请对照截图填写酒店信息。';s.screen='hotelForm';
      }
    }
    if(a==='save-hotel'){const form=b.closest('[data-hotel-form]');if(!form.reportValidity())return;const data=Object.fromEntries(new FormData(form));for(const key of Object.keys(data))data[key]=data[key].trim();if(s.hotelEditing===null)s.hotels.push({...s.hotelDraft,...data});else Object.assign(s.hotels[s.hotelEditing],data);s.screen='hotels';s.hotelReviewNote='';notify(s,'酒店信息已保存，来源保留你的填写。');}
    if(a==='select-hotel'){s.hotel=Number(b.dataset.hotel);s.screen='itinerary';notify(s,'酒店已更新，出发与返回点随之更新');}
    if(a==='guide'){s.spot=b.dataset.spot;s.guideTab='概览';s.screen='guide';}
    if(a==='guide-tab')s.guideTab=b.dataset.tab;
    if(a==='open-entered-spot'){
      const form=b.closest('[data-spot-input-form]');if(!form.reportValidity())return;
      const name=form.elements.spotName.value.trim();if(!name){form.elements.spotName.setCustomValidity('请填写景点名称');form.reportValidity();return;}
      let id=Object.keys({...spots,...s.customSpots}).find(id=>spotName(s,id)===name);
      if(!id){id=`custom-${Date.now()}-${Object.keys(s.customSpots).length}`;s.customSpots[id]={name,custom:true,duration:0,time:'待补充',desc:'自选景点 · 信息待补充',photo:null};}
      s.spot=id;if(!order(s).includes(id))order(s).push(id);s.guideTab='概览';s.screen='guide';s.toast='';
    }
    if(a==='insert-note-image'){app.querySelector('[data-note-files]').click();return;}
    if(a==='insert-note-link')s.sheet='note-link';
    if(a==='save-note-link'){
      const form=b.closest('[data-note-link-form]');if(!form.reportValidity())return;const url=xhsNoteUrl(form.elements.link.value),error=form.querySelector('[data-note-link-error]'),note=notesFor(s);
      if(!url){error.hidden=false;error.textContent='请粘贴有效的小红书笔记链接或分享文字。';return;}
      if(note.links.includes(url)){error.hidden=false;error.textContent='这条笔记已经添加。';return;}
      if(note.links.length>=5){error.hidden=false;error.textContent='本次原型每个景点最多添加5条笔记链接。';return;}
      note.links.push(url);s.sheet=null;
    }
    if(a==='remove-note-link')notesFor(s).links.splice(Number(b.dataset.index),1);
    if(a==='remove-note-image'){const note=notesFor(s),index=Number(b.dataset.index),item=note.images[index];if(item){await window.TravelStore.removeImage(noteKey(s),item.id);delete noteImageCache[noteKey(s)]?.[item.id];note.images.splice(index,1);}}

    if(a==='toggle-spot'){const id=b.dataset.spot,ord=order(s),index=ord.indexOf(id);if(index>=0&&ord.length>1)ord.splice(index,1);else if(index<0)ord.push(id);else notify(s,'当天至少保留一个景点');}
    if(a==='add-from-guide'){if(!order(s).includes(s.spot))order(s).push(s.spot);s.screen='itinerary';notify(s,'景点已加入，行程时间已更新');}
    if(a==='back-itinerary')s.screen='itinerary';
    if(a==='move'){const index=order(s).indexOf(b.dataset.spot),next=index+Number(b.dataset.dir);if(next>=0&&next<order(s).length){[order(s)[index],order(s)[next]]=[order(s)[next],order(s)[index]];notify(s,'已保留你的新顺序，时间与交通摘要已更新');}}
    if(a==='lock'){s.locked[b.dataset.spot]=!s.locked[b.dataset.spot];}
    if(a==='assign-open'){if(!order(s).length){notify(s,'先添加一个景点，再安排沿途美食。');}else{s.food=b.dataset.food;s.selectedAssign=order(s).includes(s.spot)?s.spot:order(s)[0];s.sheet='assign';}}
    if(a==='assign-pick')s.selectedAssign=b.dataset.spot;
    if(a==='assign-confirm'){for(const id of Object.keys({...spots,...s.customSpots})){const previous=`${s.day}:${id}`;if(s.assignments[previous])s.assignments[previous]=s.assignments[previous].filter(f=>f!==s.food);}const k=`${s.day}:${s.selectedAssign}`;if(!s.assignments[k])s.assignments[k]=[];s.assignments[k].push(s.food);s.sheet=null;s.screen='itinerary';notify(s,'美食意向已关联，时间已更新；门店仍待确认');}
    if(a==='food-detail'){s.food=b.dataset.food;s.screen='foodDetail';}
    if(a==='toggle-food-group'){const category=b.dataset.category;s.foodGroupsOpen[category]=!s.foodGroupsOpen[category];}
    if(a==='add-food'){const form=b.closest('[data-food-add-form]');if(!form.reportValidity())return;const category=b.dataset.category,name=form.elements.foodName.value.trim();if(!name){form.elements.foodName.setCustomValidity('请填写想吃的内容');form.reportValidity();return;}const list=todayFoods(s);if(list.some(f=>f.category===category&&f.name===name)){form.elements.foodName.setCustomValidity('这个分组已经添加了相同内容');form.reportValidity();return;}if(!s.foodItems[s.day])s.foodItems[s.day]=[];s.foodItems[s.day].push({id:`food-${Date.now()}-${list.length}`,name,category,icon:mealIcon(category),price:'',store:''});s.foodDrafts[category]='';s.foodGroupsOpen[category]=true;}
    if(a==='remove-food'){s.foodItems[s.day]=todayFoods(s).filter(f=>f.id!==b.dataset.food);for(const ids of Object.values(s.assignments))for(let i=ids.length-1;i>=0;i--)if(ids[i]===b.dataset.food)ids.splice(i,1);}
    if(a==='transport')s.sheet='transport';
    if(a==='mode')s.selectedMode=b.dataset.mode;
    if(a==='transport-confirm'){s.sheet=null;notify(s,'交通类型已更新（示例），保留景点顺序');}
    if(a==='route-pref'){s.routePreference=b.dataset.pref;notify(s,'交通偏好已更新');}
    if(a==='share')s.sheet='share';
    if(a==='close-sheet'){if(s.sheet==='date-range'){if(s.rangePrevious)Object.assign(s.tripDraft,s.rangePrevious);s.sheet=s.rangeReturn;}else{s.sheet=null;}}
    render(key);persist();
    if(a==='recognize-hotel'&&s.screen==='hotels'){const table=app.querySelector('.tp-hotel-table-wrap');if(table)table.scrollLeft=table.scrollWidth;}
    if(a==='add-food')app.querySelector(`[data-food-draft="${b.dataset.category}"]`)?.focus({preventScroll:true});
    if(a==='calendar-date')app.querySelector(`[data-date="${b.dataset.date}"]`)?.focus({preventScroll:true});
  });
  root.addEventListener('input',e=>{if(!e.target.matches('[data-companion],[data-destination]'))return;const app=e.target.closest('[data-app]'),s=states[app.dataset.app];if(e.target.matches('[data-destination]')){s.tripDraft.city=e.target.value;return;}s.tripDraft.companion=e.target.value;s.tripDraft.knownPeople=null;const info=participantInfo(s.tripDraft),badge=app.querySelector('[data-people-badge]'),hint=app.querySelector('[data-people-hint]');badge.textContent=`出行人数：${info.count===null?'待确认':`${info.count} 人`}`;hint.hidden=info.count!==null;hint.textContent=info.count===null?info.hint:'';});
  root.addEventListener('change',e=>{if(e.target.matches('[data-companion],[data-destination]'))persist();});
  root.addEventListener('submit',e=>{if(e.target.matches('[data-hotel-form],[data-hotel-import-form]')){e.preventDefault();e.target.querySelector('[data-action="save-hotel"],[data-action="recognize-hotel"]')?.click();}});

  root.addEventListener('input',e=>{if(!e.target.matches('[data-hotel-source]'))return;const app=e.target.closest('[data-app]'),s=states[app.dataset.app];s.hotelImport.source=e.target.value;const error=app.querySelector('[data-hotel-import-error]');if(error)error.hidden=true;});
  root.addEventListener('change',async e=>{
    if(e.target.matches('[data-hotel-source]')){persist();return;}
    if(!e.target.matches('[data-hotel-files]'))return;
    const app=e.target.closest('[data-app]'),key=app.dataset.app,s=states[key],files=[...e.target.files];
    const showError=message=>{const error=app.querySelector('[data-hotel-import-error]');if(error){error.hidden=false;error.textContent=message;}};
    if(files.some(file=>!['image/png','image/jpeg','image/webp'].includes(file.type))){showError('请选择PNG、JPEG或WebP图片。');return;}
    if(files.some(file=>file.size>10*1024*1024)){showError('单张截图请控制在10MB以内。');return;}
    if(files.length+hotelImageCache[key].length>6){showError('同一家酒店最多添加6张截图。');return;}
    const request=s._hotelUploadSeq=(s._hotelUploadSeq||0)+1;
    try{
      const images=await Promise.all(files.map(file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({name:file.name,url:reader.result,demo:false});reader.onerror=reject;reader.readAsDataURL(file);})));
      if(s.screen!=='hotelImport'||request!==s._hotelUploadSeq)return;
      hotelImageCache[key].push(...images);s.hotelImport.imageNames=hotelImageCache[key].map(item=>item.name);s.hotelImport.isDemo=false;render(key);persist();
    }catch{showError('图片读取失败，请重新选择。');}
  });

  root.addEventListener('input',e=>{
    const app=e.target.closest('[data-app]');if(!app)return;const s=states[app.dataset.app];
    if(e.target.matches('[data-spot-basic]')){basicsFor(s)[e.target.dataset.spotBasic]=e.target.value;s._rev=(s._rev||0)+1;}
    if(e.target.matches('[data-food-draft]')){s.foodDrafts[e.target.dataset.foodDraft]=e.target.value;e.target.setCustomValidity('');s._rev=(s._rev||0)+1;}
    if(e.target.matches('[data-spot-name]')){s.spotInput=e.target.value;e.target.setCustomValidity('');s._rev=(s._rev||0)+1;}
    if(e.target.matches('[data-note-text]')){notesFor(s).text=e.target.value;s._rev=(s._rev||0)+1;const status=app.querySelector('[data-notes-status]');if(status)status.textContent='编辑中';}
  });
  root.addEventListener('change',async e=>{
    const app=e.target.closest('[data-app]');if(!app)return;const s=states[app.dataset.app];
    if(e.target.matches('[data-note-text],[data-spot-name],[data-spot-basic],[data-food-draft]')){persist();const status=app.querySelector('[data-notes-status]');if(status)status.textContent='已暂存';return;}
    if(!e.target.matches('[data-note-files]'))return;
    const trip=s.currentTripId,spot=s.spot,key=noteKey(s),note=notesFor(s),files=[...e.target.files];
    const showError=message=>{const error=app.querySelector('[data-notes-error]');if(error){error.hidden=false;error.textContent=message;}};
    if(files.some(file=>!['image/png','image/jpeg','image/webp'].includes(file.type))){showError('请选择PNG、JPEG或WebP图片。');return;}
    if(files.length+note.images.length>6||files.some(file=>file.size>10*1024*1024)){showError('最多添加6张图片，单张请控制在10MB以内。');return;}
    try{
      const images=await Promise.all(files.map((file,i)=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({id:`image-${Date.now()}-${i}`,name:file.name,url:reader.result});reader.onerror=reject;reader.readAsDataURL(file);})));
      await Promise.all(images.map(image=>window.TravelStore.putImage(key,image)));
      const owner=s.currentTripId===trip?s:[...s.pastTrips,...s.plannedTrips].find(t=>t.id===trip);if(!owner)return;
      owner.spotNotes=owner.spotNotes||{};const targetNote=owner.spotNotes[spot]||(owner.spotNotes[spot]={text:'',links:[],images:[]});
      noteImageCache[key]=noteImageCache[key]||{};for(const image of images){noteImageCache[key][image.id]=image.url;targetNote.images.push({id:image.id,name:image.name});}
      if(s.currentTripId===trip&&s.screen==='guide'&&s.spot===spot)render(app.dataset.app);persist();
    }catch{showError('图片读取失败，请重新选择。');}
  });
  root.addEventListener('submit',e=>{if(e.target.matches('[data-spot-input-form],[data-note-link-form],[data-food-add-form],[data-guide-basics-form]')){e.preventDefault();e.target.querySelector('[data-action="open-entered-spot"],[data-action="save-note-link"],[data-action="add-food"]')?.click();}});
  root.addEventListener('click',async e=>{
    const button=e.target.closest('[data-photo-action]');if(!button)return;const app=button.closest('[data-app]');if(!app)return;const s=states[app.dataset.app],action=button.dataset.photoAction,scope=photoScope(s),id=button.dataset.photoId;
    if(action==='pick'){app.querySelector('[data-spot-photo-files]').click();return;}
    if(action==='preview'){const item=photosFor(s).find(item=>item.id===id),url=photoImages[scope]?.[id];if(!item||!url)return;const dialog=app.querySelector('[data-photo-viewer]');dialog.querySelector('[data-photo-preview-image]').src=url;dialog.querySelector('[data-photo-preview-image]').alt=item.name;dialog.querySelector('[data-photo-preview-name]').textContent=item.name;dialog.showModal();return;}
    if(action==='close-preview'){app.querySelector('[data-photo-viewer]').close();return;}
    if(action==='remove'){const items=photosFor(s),index=items.findIndex(item=>item.id===id);if(index<0)return;items.splice(index,1);const url=photoImages[scope]?.[id];if(url){URL.revokeObjectURL(url);delete photoImages[scope][id];}try{await photoStore('readwrite',store=>store.delete(id));photoStatus[scope]=items.length?'图片已保存到本机':'';}catch{photoStatus[scope]='图片已从当前页面移除；本机存储暂不可用。';}if(photoScope(s)===scope)render(app.dataset.app);persist();}
  });
  root.addEventListener('change',async e=>{
    if(!e.target.matches('[data-spot-photo-files]'))return;const app=e.target.closest('[data-app]'),s=states[app.dataset.app],scope=photoScope(s),files=[...e.target.files];
    const showError=text=>{const error=app.querySelector('[data-photo-error]');if(error){error.textContent=text;error.hidden=false;}};
    if(!files.length)return;if(files.some(file=>!['image/png','image/jpeg','image/webp'].includes(file.type))){showError('请选择PNG、JPEG或WebP图片。');return;}
    if(files.some(file=>file.size>10*1024*1024)){showError('单张图片请控制在10MB以内。');return;}
    await hydrateSpotPhotos(s);if(photoScope(s)!==scope)return;const items=photosFor(s);if(items.length+files.length>12){showError('每个景点最多添加12张拍照图片。');return;}
    const stamp=Date.now(),records=files.map((file,i)=>({id:`shot-${stamp}-${i}-${Math.random().toString(36).slice(2,8)}`,scope,name:file.name.slice(0,150),blob:file}));photoImages[scope]=photoImages[scope]||{};
    for(const item of records){items.push({id:item.id,name:item.name});photoImages[scope][item.id]=URL.createObjectURL(item.blob);}photoBusy.add(scope);photoStatus[scope]='正在保存到本机…';render(app.dataset.app);
    try{await photoStore('readwrite',store=>{let request;for(const record of records)request=store.put(record);return request;});photoStatus[scope]='图片已保存到本机';}catch{photoStatus[scope]='图片已添加。当前环境无法保存到本机，关闭后需重新添加；离线原型支持本机保存。';}
    photoBusy.delete(scope);if(s.screen==='guide'&&s.guideTab==='拍照'&&photoScope(s)===scope)render(app.dataset.app);persist();
  });
  let dragging=null;
  let pointerDrag=null;
  root.addEventListener('pointerdown',e=>{ignoredClickTarget=null;const target=e.target.closest('[data-drag-food],[data-drag-spot]');if(!target||e.button!==0)return;pointerDrag={target,pointerId:e.pointerId,x:e.clientX,y:e.clientY,moved:false,payload:{app:target.closest('[data-app]').dataset.app,type:target.hasAttribute('data-drag-food')?'food':'spot',id:target.dataset.dragFood||target.dataset.dragSpot}};target.setPointerCapture(e.pointerId);});
  root.addEventListener('pointermove',e=>{if(!pointerDrag||e.pointerId!==pointerDrag.pointerId)return;if(Math.hypot(e.clientX-pointerDrag.x,e.clientY-pointerDrag.y)>8)pointerDrag.moved=true;if(!pointerDrag.moved)return;dragging=pointerDrag.payload;root.querySelectorAll('.is-drop').forEach(el=>el.classList.remove('is-drop'));const drop=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop-spot]');if(drop&&drop.closest('[data-app]').dataset.app===dragging.app)drop.classList.add('is-drop');});
  root.addEventListener('pointerup',e=>{if(!pointerDrag||e.pointerId!==pointerDrag.pointerId)return;const active=pointerDrag;pointerDrag=null;if(active.target.hasPointerCapture(e.pointerId))active.target.releasePointerCapture(e.pointerId);if(active.moved){ignoredClickTarget=active.target;dragging=active.payload;const drop=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-drop-spot]');if(drop&&drop.closest('[data-app]').dataset.app===dragging.app)drop.dispatchEvent(new Event('drop',{bubbles:true,cancelable:true}));}dragging=null;root.querySelectorAll('.is-drop').forEach(el=>el.classList.remove('is-drop'));});
  root.addEventListener('pointercancel',()=>{pointerDrag=null;dragging=null;root.querySelectorAll('.is-drop').forEach(el=>el.classList.remove('is-drop'));});
  root.addEventListener('dragstart',e=>{if(e.target.closest('[data-drag-food],[data-drag-spot]'))e.preventDefault();});
  root.addEventListener('dragover',e=>{const drop=e.target.closest('[data-drop-spot]');if(drop&&dragging&&drop.closest('[data-app]').dataset.app===dragging.app){e.preventDefault();drop.classList.add('is-drop');}});
  root.addEventListener('dragleave',e=>{const drop=e.target.closest('[data-drop-spot]');if(drop&&!drop.contains(e.relatedTarget))drop.classList.remove('is-drop');});
  root.addEventListener('drop',e=>{const drop=e.target.closest('[data-drop-spot]');if(!drop||!dragging)return;e.preventDefault();const key=drop.closest('[data-app]').dataset.app;if(key!==dragging.app)return;const s=states[key],to=drop.dataset.dropSpot;if(dragging.type==='food'){s.food=dragging.id;s.selectedAssign=to;s.sheet='assign';}else{const ord=order(s),from=ord.indexOf(dragging.id),target=ord.indexOf(to);if(from>=0&&target>=0&&from!==target){ord.splice(from,1);ord.splice(target,0,dragging.id);notify(s,'顺序已调整，时间与交通摘要已更新');}}dragging=null;render(key);persist();});
  root.addEventListener('dragend',()=>{dragging=null;root.querySelectorAll('.is-drop').forEach(el=>el.classList.remove('is-drop'));});
  root.addEventListener('submit',e=>{if(e.target.matches('[data-new-trip-form],[data-settings-form]')){e.preventDefault();e.target.querySelector('[data-action="create-trip"],[data-action="settings-confirm"]')?.click();}});
  document.addEventListener('keydown',e=>{const dialog=root.querySelector('[aria-modal="true"]');if(!dialog)return;if(e.key==='Escape'){e.preventDefault();dialog.querySelector('[data-action="close-sheet"]')?.click();}if(e.key==='Tab'){const targets=[...dialog.querySelectorAll('button,input,textarea,select,a')].filter(el=>!el.disabled&&!el.hidden&&el.offsetParent!==null);const first=targets[0],last=targets.at(-1);if(e.shiftKey&&document.activeElement===first){last?.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first?.focus();e.preventDefault();}}});
  let autosaveTimer;root.addEventListener('input',()=>{clearTimeout(autosaveTimer);autosaveTimer=setTimeout(persist,300);});window.addEventListener('pagehide',persist);
  window.addEventListener('openai:set_globals',e=>{const v=e.detail?.globals?.widgetState?.privateContent?.apps;if(v)for(const k of Object.keys(states))if(v[k]?.photoRevision===8&&v[k]?.orders&&Array.isArray(v[k].hotels)){if((v[k]._rev||0)<=(states[k]._rev||0))continue;Object.assign(states[k],v[k]);normaliseUserContent(states[k]);render(k);}});
  if(root.dataset.preview==='spots')for(const s of Object.values(states)){s.screen='spots';s.sheet=null;s.toast='';s.spotInput='';}
  if(root.dataset.preview==='hotels')for(const s of Object.values(states)){s.screen='hotels';s.sheet=null;s.toast='';}
  if(root.dataset.preview==='itinerary')for(const s of Object.values(states)){s.screen='itinerary';s.day=1;s.sheet=null;s.toast='';}
  if(root.dataset.preview==='settings')for(const s of Object.values(states)){s.screen='itinerary';beginDraft(s,'settings');s.tripDraft.companion='小林、阿远';s.tripDraft.knownPeople=null;}
  if(root.dataset.preview==='photo')for(const s of Object.values(states)){rememberTrip(s);const trip=[...s.pastTrips,...s.plannedTrips].find(t=>t.id==='hangzhou-oct');if(trip)activateTrip(s,trip);s.screen='guide';s.spot='sudi';s.guideTab='拍照';s.sheet=null;s.toast='';}
  states.clean.screen='home';states.clean.sheet=null;states.clean.toast='';render('clean');
})();
