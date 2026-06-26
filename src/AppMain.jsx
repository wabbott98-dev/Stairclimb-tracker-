import{useState,useEffect}from"react";
const SK="stairclimb-logs-v2",SLPK="stairclimb-sleep-v2",FSK="stairclimb-fasts-v2",NUTK="stairclimb-nutrition-v2",WTK="stairclimb-weight-v2",SEL="stairclimb-selected-v2",GC=800,GE=30,GS=12,GST=10000,GW=128,ED=new Date("2026-09-12");
const LOADS=["Backpack ~15lbs + Uniform + Boots","Weighted Vest 20lbs","Weighted Vest 24lbs","Weighted Vest 28lbs","No Load","Custom"];
const WORKOUTS=["Military HIIT","Military HIIT + Stair Climb","Stair Climb Only","Functional Training","Rest Day","Custom"];
const ID=[
{id:1,date:"2026-06-17",workouts:[{type:"Military HIIT",duration:39,calories:316},{type:"Stair Climb",duration:7,calories:61}],totalActiveCal:1181,exerciseMin:58,standHrs:16,steps:8941,distanceMi:4.06,stairFlights:22,stairLoadPreset:"Backpack ~15lbs + Uniform + Boots",stairLoad:"Backpack ~15lbs + Uniform + Boots",morningFlights:12,eveningFlights:10,waterOz:32,notes:"Day 1. HIIT before shift, stairs down before work, stairs up after 10PM. Strong start. Water intake — area to improve."},
{id:2,date:"2026-06-18",workouts:[{type:"Military HIIT + Stair Climb",duration:46,calories:447}],totalActiveCal:1253,exerciseMin:51,standHrs:19,steps:11289,distanceMi:5.15,stairFlights:42,stairLoadPreset:"Backpack ~15lbs + Uniform + Boots",stairLoad:"Backpack ~15lbs + Uniform + Boots",morningFlights:20,eveningFlights:22,waterOz:128,notes:"More energy today. First gallon hit! Water makes a real difference."},
{id:3,date:"2026-06-19",workouts:[{type:"Stair Climb Only",duration:4,calories:43}],totalActiveCal:213,exerciseMin:9,standHrs:4,steps:2547,distanceMi:1.16,stairFlights:14,stairLoadPreset:"Backpack ~15lbs + Uniform + Boots",stairLoad:"Backpack ~15lbs + Uniform + Boots",morningFlights:14,eveningFlights:0,waterOz:8,notes:"Post midnight shift after storm diversions. Still got stairs in at 1:48AM. Updating throughout day."}];
const ISleep=[
{id:1,date:"2026-06-17",hours:5.8,quality:"High",score:83,bedtime:"",waketime:"",wakeups:3,interruptionMin:13,notes:"5min earlier than average bedtime. 3 wake-ups."},
{id:2,date:"2026-06-18",hours:5.5,quality:"OK",score:67,bedtime:"",waketime:"",wakeups:4,interruptionMin:30,notes:"55min later than average. 4 wake-ups. Late night after storm diversions."}];
const IFasts=[{id:1,startDate:"2026-06-17",startTime:"20:30",endDate:"2026-06-18",endTime:"14:43",durationHrs:18,durationMin:13,zone:"Fat Burning",goalHrs:18,goalMet:true,notes:"Completed 18hr fast. Reached Fat Burning zone. Broke fast with steamed veggies."}];
const INutrition=[{id:1,date:"2026-06-18",breakfast:"",lunch:"",dinner:"Steamed broccoli, cauliflower & carrots with McCormick Garlic Herb seasoning",snacks:"",water:128,notes:"First meal after 18hr fast. Light and clean."}];
const ld=(k,def)=>{try{const r=localStorage.getItem(k);return r?JSON.parse(r):def;}catch{return def;}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
const days=()=>Math.ceil((ED-new Date())/86400000);
const inp={background:"#0a0a18",border:"1px solid #1c1c2e",borderRadius:8,color:"#fff",padding:"9px 12px",fontSize:16,width:"100%",boxSizing:"border-box",WebkitAppearance:"none"};
const lbl={color:"#555",fontSize:10,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.08em"};
const card={background:"#0d0d1a",borderRadius:16,padding:16,marginBottom:14,border:"1px solid #1c1c2e"};

function SBar({label,value,goal,color,unit}){const p=Math.min((value/goal)*100,100),o=value>=goal;return(<div style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:"#777",fontSize:12}}>{label}</span><span style={{color:o?color:"#ccc",fontSize:12,fontWeight:600}}>{typeof value==="number"&&value%1!==0?value.toFixed(2):value.toLocaleString()}<span style={{color:"#444",fontSize:10}}> / {goal} {unit}</span>{o&&<span style={{color,marginLeft:4}}>✓</span>}</span></div><div style={{background:"#111",borderRadius:4,height:5}}><div style={{width:`${p}%`,background:color,height:"100%",borderRadius:4}}/></div></div>);}

function Ring({value,goal,color,label,unit,size=78}){const p=Math.min(value/goal,1.5),r=(size-14)/2,c=2*Math.PI*r,f=Math.min(p,1)*c,o=p>1?(p-1)*c:0;return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><svg width={size}height={size}style={{transform:"rotate(-90deg)"}}><circle cx={size/2}cy={size/2}r={r}fill="none"stroke="#1a1a2e"strokeWidth={11}/><circle cx={size/2}cy={size/2}r={r}fill="none"stroke={color}strokeWidth={11}strokeDasharray={`${f} ${c-f}`}strokeLinecap="round"opacity={0.95}/>{o>0&&<circle cx={size/2}cy={size/2}r={r}fill="none"stroke="#fff"strokeWidth={7}strokeDasharray={`${o} ${c-o}`}strokeLinecap="round"opacity={0.5}/>}</svg><div style={{textAlign:"center"}}><div style={{color,fontWeight:700,fontSize:13}}>{typeof value==="number"&&value%1!==0?value.toFixed(1):value.toLocaleString()}</div><div style={{color:"#555",fontSize:10}}>{label}</div><div style={{color:"#333",fontSize:9}}>/{goal} {unit}</div></div></div>);}

function WBar({oz}){const p=Math.min((oz/GW)*100,100),m=oz>=GW;return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:8}}><div><div style={{color:"#444",fontSize:10,textTransform:"uppercase",marginBottom:3}}>💧 Water Intake</div><div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{color:m?"#5ac8fa":"#fff",fontSize:28,fontWeight:800,lineHeight:1}}>{oz}</span><span style={{color:"#444",fontSize:12}}>/ {GW} oz</span>{m&&<span style={{color:"#5ac8fa",fontSize:12}}>✓</span>}</div><div style={{color:"#333",fontSize:10,marginTop:2}}>≈{Math.round(oz/8)} glasses</div></div><div style={{fontSize:22}}>{p>=100?"💧💧💧":p>=75?"💧💧":p>=50?"💧":"🫙"}</div></div><div style={{display:"flex",gap:3,marginBottom:4}}>{Array.from({length:8}).map((_,i)=>{const s=i*16,e=(i+1)*16,f=oz>=e?1:oz>s?(oz-s)/16:0;return(<div key={i}style={{flex:1,height:10,background:"#0d0d1a",borderRadius:3,overflow:"hidden",position:"relative"}}><div style={{position:"absolute",left:0,top:0,width:`${f*100}%`,height:"100%",background:"linear-gradient(90deg,#1a5276,#5ac8fa)",borderRadius:3}}/></div>);})}</div><div style={{display:"flex",justifyContent:"space-between"}}>{["0","32","64","96","128🏆"].map((l,i)=><span key={i}style={{color:i===4&&m?"#5ac8fa":"#222",fontSize:9}}>{l}</span>)}</div></div>);}

function DC({day,isSel,onClick}){const d=new Date(day.date+"T12:00:00"),dn=d.toLocaleDateString("en-US",{weekday:"short"}),dt=d.getDate(),hc=day.totalActiveCal>=GC,hw=(day.waterOz||0)>=GW;return(<div onClick={onClick}style={{background:isSel?"#0f3460":"#0d0d1a",border:`1px solid ${isSel?"#e94560":"#1c1c2e"}`,borderRadius:12,padding:"9px 12px",cursor:"pointer",minWidth:58,textAlign:"center",flexShrink:0}}><div style={{color:"#555",fontSize:9,textTransform:"uppercase"}}>{dn}</div><div style={{color:"#fff",fontSize:17,fontWeight:800,lineHeight:1.2}}>{dt}</div><div style={{display:"flex",justifyContent:"center",gap:3,marginTop:3}}><div style={{width:6,height:6,borderRadius:"50%",background:hc?"#e94560":"#1c1c2e"}}/><div style={{width:6,height:6,borderRadius:"50%",background:hw?"#5ac8fa":"#1c1c2e"}}/></div></div>);}

function DayForm({initial,onSave,onCancel,title}){
const[form,setForm]=useState(initial);
const[customLoad,setCustomLoad]=useState(false);
const[customWorkout,setCustomWorkout]=useState(false);
const f=(k,v)=>setForm(p=>({...p,[k]:v}));
return(<div style={{...card,border:"1px solid #e9456033"}}>
<div style={{color:"#e94560",fontSize:12,fontWeight:700,marginBottom:18,textTransform:"uppercase"}}>{title}</div>
<div style={{marginBottom:12}}><label style={lbl}>Date</label><input type="date"style={inp}value={form.date}onChange={e=>f("date",e.target.value)}/></div>
<div style={{background:"#0a1520",border:"1px solid #1a3a5c",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
<label style={{...lbl,color:"#5ac8fa"}}>💧 Water (oz) — Goal: 128oz</label>
<input type="number"placeholder="128"inputMode="numeric"style={{...inp,background:"#06101a",border:"1px solid #1a3a5c"}}value={form.waterOz}onChange={e=>f("waterOz",e.target.value)}/>
{form.waterOz!==""&&<div style={{marginTop:8}}><div style={{background:"#060e16",borderRadius:4,height:6}}><div style={{width:`${Math.min((Number(form.waterOz)/GW)*100,100)}%`,background:"linear-gradient(90deg,#1a5276,#5ac8fa)",height:"100%",borderRadius:4}}/></div><div style={{color:"#2176ae",fontSize:10,marginTop:4}}>{Math.round((Number(form.waterOz)/GW)*100)}% · {Number(form.waterOz)>=GW?"🏆 Goal!":GW-Number(form.waterOz)+"oz to go"}</div></div>}
</div>
<div style={{color:"#2a2a3e",fontSize:10,textTransform:"uppercase",marginBottom:10}}>— Apple Watch —</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
{[{l:"Move Cal 🔴",k:"totalActiveCal",p:"1181"},{l:"Exercise Min 🟢",k:"exerciseMin",p:"58"},{l:"Stand Hrs 🔵",k:"standHrs",p:"16"},{l:"Steps",k:"steps",p:"8941"},{l:"Distance mi",k:"distanceMi",p:"4.06"}].map(fi=><div key={fi.k}><label style={lbl}>{fi.l}</label><input type="number"placeholder={fi.p}inputMode="decimal"style={inp}value={form[fi.k]}onChange={e=>f(fi.k,e.target.value)}/></div>)}
</div>
<div style={{color:"#2a2a3e",fontSize:10,textTransform:"uppercase",marginBottom:10}}>— Stair Sessions —</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Morning Flights</label><input type="number"placeholder="20"inputMode="numeric"style={inp}value={form.morningFlights}onChange={e=>f("morningFlights",e.target.value)}/></div>
<div><label style={lbl}>Evening Flights</label><input type="number"placeholder="20"inputMode="numeric"style={inp}value={form.eveningFlights}onChange={e=>f("eveningFlights",e.target.value)}/></div>
</div>
<div style={{marginBottom:12}}>
<label style={lbl}>Stair Load</label>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
{LOADS.map(l=><button key={l}onClick={()=>{f("stairLoadPreset",l);if(l!=="Custom")f("stairLoad",l);setCustomLoad(l==="Custom");}}style={{background:form.stairLoadPreset===l?"#0f3460":"#0a0a18",border:`1px solid ${form.stairLoadPreset===l?"#5ac8fa":"#1c1c2e"}`,borderRadius:8,color:form.stairLoadPreset===l?"#5ac8fa":"#555",fontSize:11,padding:"6px 10px",cursor:"pointer"}}>{l}</button>)}
</div>
{customLoad&&<input type="text"placeholder="Describe your load..."style={inp}value={form.stairLoad}onChange={e=>f("stairLoad",e.target.value)}/>}
</div>
<div style={{color:"#2a2a3e",fontSize:10,textTransform:"uppercase",marginBottom:10}}>— Workout —</div>
<div style={{marginBottom:12}}>
<label style={lbl}>Workout Type</label>
<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
{WORKOUTS.map(w=><button key={w}onClick={()=>{f("workoutType",w);setCustomWorkout(w==="Custom");}}style={{background:form.workoutType===w?"#0f3460":"#0a0a18",border:`1px solid ${form.workoutType===w?"#e94560":"#1c1c2e"}`,borderRadius:8,color:form.workoutType===w?"#e94560":"#555",fontSize:11,padding:"6px 10px",cursor:"pointer"}}>{w}</button>)}
</div>
{customWorkout&&<input type="text"placeholder="Describe workout..."style={inp}value={form.workoutType}onChange={e=>f("workoutType",e.target.value)}/>}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
<div><label style={lbl}>Duration (min)</label><input type="number"placeholder="39"inputMode="numeric"style={inp}value={form.workoutDuration}onChange={e=>f("workoutDuration",e.target.value)}/></div>
<div><label style={lbl}>Workout Cal</label><input type="number"placeholder="316"inputMode="numeric"style={inp}value={form.workoutCal}onChange={e=>f("workoutCal",e.target.value)}/></div>
</div>
<div style={{marginBottom:18}}><label style={lbl}>Notes</label><textarea rows={3}placeholder="Energy, soreness, stairs, water…"style={{...inp,resize:"none",lineHeight:1.5}}value={form.notes}onChange={e=>f("notes",e.target.value)}/></div>
<div style={{display:"flex",gap:10}}>
<button onClick={()=>onSave(form)}style={{flex:2,background:"#e94560",border:"none",borderRadius:12,color:"#fff",fontSize:16,fontWeight:700,padding:"14px 0",cursor:"pointer"}}>Save</button>
<button onClick={onCancel}style={{flex:1,background:"#111",border:"none",borderRadius:12,color:"#555",fontSize:15,padding:"14px 0",cursor:"pointer"}}>Cancel</button>
</div>
</div>);}

// ── SLEEP TAB ────────────────────────────────────────────────
function SleepTab(){
const[sleepLogs,setSleepLogs]=useState(()=>ld(SLPK,ISleep));
const[adding,setAdding]=useState(false);
const[editId,setEditId]=useState(null);
const blank={date:new Date().toISOString().split("T")[0],hours:"",quality:"Good",score:"",bedtime:"",waketime:"",wakeups:"",interruptionMin:"",notes:""};
const[form,setForm]=useState(blank);
const f=(k,v)=>setForm(p=>({...p,[k]:v}));
useEffect(()=>{sv(SLPK,sleepLogs);},[sleepLogs]);
const avg=sleepLogs.length?sleepLogs.slice(0,7).reduce((s,l)=>s+(l.hours||0),0)/Math.min(sleepLogs.length,7):0;
const qColor={Poor:"#e94560",OK:"#f5a623",Fair:"#f5a623",Good:"#92d36e",High:"#5ac8fa",Great:"#5ac8fa"};
function openAdd(){setForm(blank);setEditId(null);setAdding(true);}
function openEdit(l){setForm({date:l.date,hours:l.hours,quality:l.quality||"Good",score:l.score||"",bedtime:l.bedtime||"",waketime:l.waketime||"",wakeups:l.wakeups||"",interruptionMin:l.interruptionMin||"",notes:l.notes||""});setEditId(l.id);setAdding(true);}
function deleteLog(id){if(window.confirm("Delete this sleep entry?"))setSleepLogs(p=>p.filter(l=>l.id!==id));}
function save(){
if(!form.date||!form.hours)return;
const entry={...form,hours:parseFloat(form.hours),score:Number(form.score)||0,wakeups:Number(form.wakeups)||0,interruptionMin:Number(form.interruptionMin)||0};
if(editId){setSleepLogs(p=>p.map(l=>l.id===editId?{...l,...entry}:l).sort((a,b)=>b.date.localeCompare(a.date)));}
else{setSleepLogs(p=>[{id:Date.now(),...entry},...p].sort((a,b)=>b.date.localeCompare(a.date)));}
setAdding(false);setEditId(null);setForm(blank);}
return(<div>
<div style={{...card,background:"linear-gradient(135deg,#0d0d1a,#0f1f40)"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
<div style={{textAlign:"center"}}><div style={{color:"#a78bfa",fontSize:22,fontWeight:800}}>{avg.toFixed(1)}h</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>avg sleep</div></div>
<div style={{textAlign:"center"}}><div style={{color:"#92d36e",fontSize:22,fontWeight:800}}>{sleepLogs.filter(l=>l.hours>=7).length}</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>7hr+ days</div></div>
<div style={{textAlign:"center"}}><div style={{color:"#f5a623",fontSize:22,fontWeight:800}}>{sleepLogs.length}</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>logged</div></div>
</div>
<div style={{background:"#111",borderRadius:4,height:6,marginBottom:4}}><div style={{width:`${Math.min((avg/8)*100,100)}%`,background:"linear-gradient(90deg,#a78bfa,#5ac8fa)",height:"100%",borderRadius:4}}/></div>
<div style={{color:"#333",fontSize:9}}>Goal: 7–8 hrs/night · Current avg: {avg.toFixed(1)}hrs</div>
</div>
{!adding&&<button onClick={openAdd}style={{width:"100%",background:"#0f1f40",border:"1px solid #a78bfa44",borderRadius:12,color:"#a78bfa",fontSize:14,fontWeight:700,padding:"12px 0",cursor:"pointer",marginBottom:14}}>+ Log Sleep</button>}
{adding&&<div style={{...card,border:"1px solid #a78bfa44"}}>
<div style={{color:"#a78bfa",fontSize:12,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>😴 {editId?"Edit Sleep":"Log Sleep"}</div>
<div style={{marginBottom:12}}><label style={lbl}>Date</label><input type="date"style={inp}value={form.date}onChange={e=>f("date",e.target.value)}/></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Bedtime</label><input type="time"style={inp}value={form.bedtime}onChange={e=>f("bedtime",e.target.value)}/></div>
<div><label style={lbl}>Wake Time</label><input type="time"style={inp}value={form.waketime}onChange={e=>f("waketime",e.target.value)}/></div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Hours Slept</label><input type="number"placeholder="7.5"inputMode="decimal"step="0.5"style={inp}value={form.hours}onChange={e=>f("hours",e.target.value)}/></div>
<div><label style={lbl}>Sleep Score</label><input type="number"placeholder="83"inputMode="numeric"style={inp}value={form.score}onChange={e=>f("score",e.target.value)}/></div>
</div>
<div style={{marginBottom:12}}><label style={lbl}>Quality</label>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
{["Poor","Fair","Good","Great"].map(q=><button key={q}onClick={()=>f("quality",q)}style={{background:form.quality===q?qColor[q]+"33":"#0a0a18",border:`1px solid ${form.quality===q?qColor[q]:"#1c1c2e"}`,borderRadius:8,color:form.quality===q?qColor[q]:"#555",fontSize:11,padding:"8px 0",cursor:"pointer"}}>{q}</button>)}
</div></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Wake-ups</label><input type="number"placeholder="3"inputMode="numeric"style={inp}value={form.wakeups}onChange={e=>f("wakeups",e.target.value)}/></div>
<div><label style={lbl}>Interruption Min</label><input type="number"placeholder="13"inputMode="numeric"style={inp}value={form.interruptionMin}onChange={e=>f("interruptionMin",e.target.value)}/></div>
</div>
<div style={{marginBottom:16}}><label style={lbl}>Notes</label><textarea rows={2}placeholder="How rested did you feel?"style={{...inp,resize:"none"}}value={form.notes}onChange={e=>f("notes",e.target.value)}/></div>
<div style={{display:"flex",gap:10}}>
<button onClick={save}style={{flex:2,background:"#a78bfa",border:"none",borderRadius:12,color:"#fff",fontSize:15,fontWeight:700,padding:"13px 0",cursor:"pointer"}}>{editId?"Update":"Save"}</button>
<button onClick={()=>{setAdding(false);setEditId(null);}}style={{flex:1,background:"#111",border:"none",borderRadius:12,color:"#555",fontSize:14,padding:"13px 0",cursor:"pointer"}}>Cancel</button>
</div></div>}
{sleepLogs.map(l=><div key={l.id}style={card}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
<div><div style={{color:"#fff",fontSize:13,fontWeight:700}}>{new Date(l.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div><div style={{color:"#444",fontSize:10}}>{l.bedtime&&l.waketime?`${l.bedtime} → ${l.waketime}`:""}</div></div>
<div style={{display:"flex",alignItems:"flex-start",gap:12}}>
<div style={{textAlign:"right"}}><div style={{color:"#a78bfa",fontSize:22,fontWeight:800}}>{l.hours}h</div><div style={{color:qColor[l.quality]||"#555",fontSize:10,fontWeight:600}}>{l.quality}{l.score?` · ${l.score}`:""}</div></div>
<div style={{display:"flex",gap:10,paddingTop:2}}>
<button onClick={()=>openEdit(l)}style={{background:"none",border:"none",color:"#5ac8fa",fontSize:11,cursor:"pointer",padding:0}}>edit</button>
<button onClick={()=>deleteLog(l.id)}style={{background:"none",border:"none",color:"#2a2a3e",fontSize:11,cursor:"pointer",padding:0}}>delete</button>
</div></div></div>
<div style={{background:"#111",borderRadius:4,height:5,marginBottom:4}}><div style={{width:`${Math.min((l.hours/8)*100,100)}%`,background:l.hours>=7?"linear-gradient(90deg,#a78bfa,#5ac8fa)":"#e94560",height:"100%",borderRadius:4}}/></div>
<div style={{display:"flex",justifyContent:"space-between"}}><div style={{color:"#333",fontSize:9}}>{l.hours>=7?"✓ Goal met":`${l.hours} / 7hr goal`}</div>{l.wakeups?<div style={{color:"#333",fontSize:9}}>{l.wakeups} wake-ups · {l.interruptionMin}min</div>:null}</div>
{l.notes&&<div style={{color:"#666",fontSize:11,marginTop:8,fontStyle:"italic"}}>{l.notes}</div>}
</div>)}
{sleepLogs.length===0&&<div style={{textAlign:"center",color:"#333",fontSize:13,padding:"40px 0"}}>No sleep logs yet.</div>}
</div>);}

// ── FAST TAB ─────────────────────────────────────────────────
function FastTab(){
const[fasts,setFasts]=useState(()=>ld(FSK,IFasts));
const[adding,setAdding]=useState(false);
const[editId,setEditId]=useState(null);
const blank={startDate:new Date().toISOString().split("T")[0],startTime:"20:00",endDate:"",endTime:"",durationHrs:"",durationMin:"",zone:"Fat Burning",goalHrs:18,goalMet:false,notes:""};
const[form,setForm]=useState(blank);
const f=(k,v)=>setForm(p=>({...p,[k]:v}));
useEffect(()=>{sv(FSK,fasts);},[fasts]);
const zones=["Anabolic","Catabolic","Fat Burning","Ketosis","Deep Ketosis"];
const zoneEmoji={"Anabolic":"🔧","Catabolic":"⚡","Fat Burning":"🔥","Ketosis":"🥑","Deep Ketosis":"🚀"};
const zoneColor={"Anabolic":"#5ac8fa","Catabolic":"#f5a623","Fat Burning":"#e94560","Ketosis":"#92d36e","Deep Ketosis":"#a78bfa"};
const totalHrs=fasts.reduce((s,fa)=>s+(fa.durationHrs||0),0);
const deepFasts=fasts.filter(fa=>fa.durationHrs>=72).length;
const avgHrs=fasts.length?totalHrs/fasts.length:0;
function openAdd(){setForm(blank);setEditId(null);setAdding(true);}
function openEdit(fa){setForm({startDate:fa.startDate,startTime:fa.startTime||"20:00",endDate:fa.endDate||"",endTime:fa.endTime||"",durationHrs:fa.durationHrs,durationMin:fa.durationMin||"",zone:fa.zone||"Fat Burning",goalHrs:fa.goalHrs||18,goalMet:fa.goalMet||false,notes:fa.notes||""});setEditId(fa.id);setAdding(true);}
function deleteFast(id){if(window.confirm("Delete this fast?"))setFasts(p=>p.filter(fa=>fa.id!==id));}
function save(){
if(!form.startDate||!form.durationHrs)return;
const entry={...form,durationHrs:Number(form.durationHrs),durationMin:Number(form.durationMin)||0,goalHrs:Number(form.goalHrs)||18};
if(editId){setFasts(p=>p.map(fa=>fa.id===editId?{...fa,...entry}:fa));}
else{setFasts(p=>[{id:Date.now(),...entry},...p]);}
setAdding(false);setEditId(null);setForm(blank);}
return(<div>
<div style={{...card,background:"linear-gradient(135deg,#0d0d1a,#1a0f2e)"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
<div style={{textAlign:"center"}}><div style={{color:"#f5a623",fontSize:22,fontWeight:800}}>{fasts.length}</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>fasts done</div></div>
<div style={{textAlign:"center"}}><div style={{color:"#92d36e",fontSize:22,fontWeight:800}}>{avgHrs.toFixed(0)}h</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>avg duration</div></div>
<div style={{textAlign:"center"}}><div style={{color:"#a78bfa",fontSize:22,fontWeight:800}}>{deepFasts}</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>72hr+ fasts</div></div>
</div>
<div style={{background:"#1a0f2e",borderRadius:10,padding:"10px 12px"}}>
<div style={{color:"#444",fontSize:9,textTransform:"uppercase",marginBottom:6}}>🚀 72hr Deep Ketosis Goal</div>
<div style={{background:"#111",borderRadius:4,height:6,marginBottom:4}}><div style={{width:`${Math.min((avgHrs/72)*100,100)}%`,background:"linear-gradient(90deg,#f5a623,#a78bfa)",height:"100%",borderRadius:4}}/></div>
<div style={{color:"#333",fontSize:9}}>Current avg: {avgHrs.toFixed(0)}hrs · Target: 72hrs</div>
</div></div>
{!adding&&<button onClick={openAdd}style={{width:"100%",background:"#1a0f2e",border:"1px solid #f5a62344",borderRadius:12,color:"#f5a623",fontSize:14,fontWeight:700,padding:"12px 0",cursor:"pointer",marginBottom:14}}>+ Log Fast</button>}
{adding&&<div style={{...card,border:"1px solid #f5a62333"}}>
<div style={{color:"#f5a623",fontSize:12,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>⚡ {editId?"Edit Fast":"Log Fast"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Start Date</label><input type="date"style={inp}value={form.startDate}onChange={e=>f("startDate",e.target.value)}/></div>
<div><label style={lbl}>Start Time</label><input type="time"style={inp}value={form.startTime}onChange={e=>f("startTime",e.target.value)}/></div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>End Date</label><input type="date"style={inp}value={form.endDate}onChange={e=>f("endDate",e.target.value)}/></div>
<div><label style={lbl}>End Time</label><input type="time"style={inp}value={form.endTime}onChange={e=>f("endTime",e.target.value)}/></div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Duration Hrs</label><input type="number"placeholder="18"inputMode="numeric"style={inp}value={form.durationHrs}onChange={e=>f("durationHrs",e.target.value)}/></div>
<div><label style={lbl}>Duration Min</label><input type="number"placeholder="13"inputMode="numeric"style={inp}value={form.durationMin}onChange={e=>f("durationMin",e.target.value)}/></div>
</div>
<div style={{marginBottom:12}}><label style={lbl}>Fasting Zone Reached</label>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>
{zones.map(z=><button key={z}onClick={()=>f("zone",z)}style={{background:form.zone===z?zoneColor[z]+"33":"#0a0a18",border:`1px solid ${form.zone===z?zoneColor[z]:"#1c1c2e"}`,borderRadius:8,color:form.zone===z?zoneColor[z]:"#555",fontSize:11,padding:"6px 10px",cursor:"pointer"}}>{zoneEmoji[z]} {z}</button>)}
</div></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Goal (hrs)</label><input type="number"placeholder="18"inputMode="numeric"style={inp}value={form.goalHrs}onChange={e=>f("goalHrs",e.target.value)}/></div>
<div style={{display:"flex",alignItems:"flex-end",paddingBottom:2}}><button onClick={()=>f("goalMet",!form.goalMet)}style={{width:"100%",background:form.goalMet?"#92d36e33":"#0a0a18",border:`1px solid ${form.goalMet?"#92d36e":"#1c1c2e"}`,borderRadius:8,color:form.goalMet?"#92d36e":"#555",fontSize:13,padding:"10px 0",cursor:"pointer"}}>{form.goalMet?"✓ Goal Met":"Goal Met?"}</button></div>
</div>
<div style={{marginBottom:16}}><label style={lbl}>Notes</label><textarea rows={2}placeholder="How did you feel? What broke the fast?"style={{...inp,resize:"none"}}value={form.notes}onChange={e=>f("notes",e.target.value)}/></div>
<div style={{display:"flex",gap:10}}>
<button onClick={save}style={{flex:2,background:"#f5a623",border:"none",borderRadius:12,color:"#000",fontSize:15,fontWeight:700,padding:"13px 0",cursor:"pointer"}}>{editId?"Update":"Save"}</button>
<button onClick={()=>{setAdding(false);setEditId(null);}}style={{flex:1,background:"#111",border:"none",borderRadius:12,color:"#555",fontSize:14,padding:"13px 0",cursor:"pointer"}}>Cancel</button>
</div></div>}
{fasts.map(fa=><div key={fa.id}style={card}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
<div><div style={{color:"#fff",fontSize:13,fontWeight:700}}>{fa.startDate} {fa.startTime}→{fa.endDate} {fa.endTime}</div><div style={{color:zoneColor[fa.zone]||"#f5a623",fontSize:12,fontWeight:700,marginTop:2}}>{zoneEmoji[fa.zone]} {fa.zone}</div></div>
<div style={{display:"flex",alignItems:"flex-start",gap:12}}>
<div style={{textAlign:"right"}}><div style={{color:"#f5a623",fontSize:22,fontWeight:800}}>{fa.durationHrs}h{fa.durationMin?` ${fa.durationMin}m`:""}</div>{fa.goalMet&&<div style={{color:"#92d36e",fontSize:10}}>✓ Goal met</div>}</div>
<div style={{display:"flex",gap:10,paddingTop:2}}>
<button onClick={()=>openEdit(fa)}style={{background:"none",border:"none",color:"#5ac8fa",fontSize:11,cursor:"pointer",padding:0}}>edit</button>
<button onClick={()=>deleteFast(fa.id)}style={{background:"none",border:"none",color:"#2a2a3e",fontSize:11,cursor:"pointer",padding:0}}>delete</button>
</div></div></div>
<div style={{background:"#111",borderRadius:4,height:5,marginBottom:4}}><div style={{width:`${Math.min((fa.durationHrs/72)*100,100)}%`,background:`linear-gradient(90deg,#f5a623,${zoneColor[fa.zone]||"#a78bfa"})`,height:"100%",borderRadius:4}}/></div>
<div style={{color:"#333",fontSize:9,marginBottom:fa.notes?6:0}}>{fa.durationHrs}hrs / 72hr Deep Ketosis goal</div>
{fa.notes&&<div style={{color:"#666",fontSize:11,fontStyle:"italic"}}>{fa.notes}</div>}
</div>)}
{fasts.length===0&&<div style={{textAlign:"center",color:"#333",fontSize:13,padding:"40px 0"}}>No fasts logged yet.</div>}
</div>);}

// ── NUTRITION TAB ────────────────────────────────────────────
function NutriTab(){
const[logs,setNutriLogs]=useState(()=>ld(NUTK,INutrition));
const[adding,setAdding]=useState(false);
const[editId,setEditId]=useState(null);
const blank={date:new Date().toISOString().split("T")[0],breakfast:"",lunch:"",dinner:"",snacks:"",calories:"",protein:"",notes:""};
const[form,setForm]=useState(blank);
const f=(k,v)=>setForm(p=>({...p,[k]:v}));
useEffect(()=>{sv(NUTK,logs);},[logs]);
function openAdd(){setForm(blank);setEditId(null);setAdding(true);}
function openEdit(l){setForm({date:l.date,breakfast:l.breakfast||"",lunch:l.lunch||"",dinner:l.dinner||"",snacks:l.snacks||"",calories:l.calories||"",protein:l.protein||"",notes:l.notes||""});setEditId(l.id);setAdding(true);}
function deleteLog(id){if(window.confirm("Delete this nutrition entry?"))setNutriLogs(p=>p.filter(l=>l.id!==id));}
function save(){
if(!form.date)return;
const entry={...form,calories:Number(form.calories)||0,protein:Number(form.protein)||0};
if(editId){setNutriLogs(p=>p.map(l=>l.id===editId?{...l,...entry}:l).sort((a,b)=>b.date.localeCompare(a.date)));}
else{setNutriLogs(p=>[{id:Date.now(),...entry},...p].sort((a,b)=>b.date.localeCompare(a.date)));}
setAdding(false);setEditId(null);setForm(blank);}
return(<div>
<div style={{...card,background:"linear-gradient(135deg,#0d0d1a,#0f2010)"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
<div style={{textAlign:"center"}}><div style={{color:"#92d36e",fontSize:22,fontWeight:800}}>{logs.length}</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>days logged</div></div>
<div style={{textAlign:"center"}}><div style={{color:"#f5a623",fontSize:22,fontWeight:800}}>{logs.filter(l=>l.dinner).length}</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>dinners logged</div></div>
</div></div>
{!adding&&<button onClick={openAdd}style={{width:"100%",background:"#0f2010",border:"1px solid #92d36e44",borderRadius:12,color:"#92d36e",fontSize:14,fontWeight:700,padding:"12px 0",cursor:"pointer",marginBottom:14}}>+ Log Nutrition</button>}
{adding&&<div style={{...card,border:"1px solid #92d36e33"}}>
<div style={{color:"#92d36e",fontSize:12,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>🥗 {editId?"Edit Nutrition":"Log Nutrition"}</div>
<div style={{marginBottom:12}}><label style={lbl}>Date</label><input type="date"style={inp}value={form.date}onChange={e=>f("date",e.target.value)}/></div>
{[{l:"🌅 Breakfast",k:"breakfast",p:"e.g. Oatmeal, eggs, fruit"},{l:"☀️ Lunch",k:"lunch",p:"e.g. Grilled chicken salad"},{l:"🌙 Dinner",k:"dinner",p:"e.g. Steamed veggies, fish"},{l:"🍎 Snacks",k:"snacks",p:"e.g. Almonds, apple"}].map(fi=><div key={fi.k}style={{marginBottom:12}}><label style={lbl}>{fi.l}</label><input type="text"placeholder={fi.p}style={inp}value={form[fi.k]}onChange={e=>f(fi.k,e.target.value)}/></div>)}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Total Cal (approx)</label><input type="number"placeholder="1800"inputMode="numeric"style={inp}value={form.calories}onChange={e=>f("calories",e.target.value)}/></div>
<div><label style={lbl}>Protein (g)</label><input type="number"placeholder="120"inputMode="numeric"style={inp}value={form.protein}onChange={e=>f("protein",e.target.value)}/></div>
</div>
<div style={{marginBottom:16}}><label style={lbl}>Notes</label><textarea rows={2}placeholder="How did you eat today? Fasting window?"style={{...inp,resize:"none"}}value={form.notes}onChange={e=>f("notes",e.target.value)}/></div>
<div style={{display:"flex",gap:10}}>
<button onClick={save}style={{flex:2,background:"#92d36e",border:"none",borderRadius:12,color:"#000",fontSize:15,fontWeight:700,padding:"13px 0",cursor:"pointer"}}>{editId?"Update":"Save"}</button>
<button onClick={()=>{setAdding(false);setEditId(null);}}style={{flex:1,background:"#111",border:"none",borderRadius:12,color:"#555",fontSize:14,padding:"13px 0",cursor:"pointer"}}>Cancel</button>
</div></div>}
{logs.map(l=><div key={l.id}style={card}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{color:"#fff",fontSize:13,fontWeight:700}}>{new Date(l.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>
<div style={{display:"flex",alignItems:"center",gap:10}}>
{l.calories?<span style={{color:"#f5a623",fontSize:11}}>{l.calories}cal</span>:null}
{l.protein?<span style={{color:"#92d36e",fontSize:11}}>{l.protein}g protein</span>:null}
<button onClick={()=>openEdit(l)}style={{background:"none",border:"none",color:"#5ac8fa",fontSize:11,cursor:"pointer",padding:0}}>edit</button>
<button onClick={()=>deleteLog(l.id)}style={{background:"none",border:"none",color:"#2a2a3e",fontSize:11,cursor:"pointer",padding:0}}>delete</button>
</div></div>
{[{l:"🌅 Breakfast",k:"breakfast"},{l:"☀️ Lunch",k:"lunch"},{l:"🌙 Dinner",k:"dinner"},{l:"🍎 Snacks",k:"snacks"}].map(fi=>l[fi.k]?<div key={fi.k}style={{marginBottom:6}}><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>{fi.l}</div><div style={{color:"#ccc",fontSize:12}}>{l[fi.k]}</div></div>:null)}
{l.notes&&<div style={{color:"#666",fontSize:11,marginTop:6,fontStyle:"italic"}}>{l.notes}</div>}
</div>)}
{logs.length===0&&<div style={{textAlign:"center",color:"#333",fontSize:13,padding:"40px 0"}}>No nutrition logs yet.</div>}
</div>);}

// ── WEIGHT TAB ───────────────────────────────────────────────
function WeightTab(){
const[logs,setLogs]=useState(()=>ld(WTK,[]));
const[adding,setAdding]=useState(false);
const[editId,setEditId]=useState(null);
const[validErr,setValidErr]=useState("");
const blank={date:new Date().toISOString().split("T")[0],weight:"",bodyFat:"",muscleMass:"",bmi:"",hydration:"",notes:""};
const[form,setForm]=useState(blank);
const f=(k,v)=>{setValidErr("");setForm(p=>({...p,[k]:v}));};
useEffect(()=>{sv(WTK,logs);},[logs]);
const sorted=[...logs].sort((a,b)=>a.date.localeCompare(b.date));
const first=sorted[0];const last=sorted[sorted.length-1];
const change=first&&last&&first.id!==last.id?last.weight-first.weight:0;
function openAdd(){setForm(blank);setEditId(null);setValidErr("");setAdding(true);}
function openEdit(l){setForm({date:l.date,weight:l.weight,bodyFat:l.bodyFat||"",muscleMass:l.muscleMass||"",bmi:l.bmi||"",hydration:l.hydration||"",notes:l.notes||""});setEditId(l.id);setValidErr("");setAdding(true);}
function deleteLog(id){if(window.confirm("Delete this weight entry?"))setLogs(p=>p.filter(l=>l.id!==id));}
function save(){
if(!form.date||!form.weight)return;
const bf=parseFloat(form.bodyFat)||0,mm=parseFloat(form.muscleMass)||0;
if(bf>0&&mm>0&&bf+mm>105){setValidErr(`⚠️ Body fat (${bf}%) + muscle (${mm}%) = ${bf+mm}%. Total can't exceed ~100%. Check your values.`);return;}
const entry={...form,weight:parseFloat(form.weight),bodyFat:bf,muscleMass:mm,hydration:parseFloat(form.hydration)||0,bmi:parseFloat(form.bmi)||0};
if(editId){setLogs(p=>p.map(l=>l.id===editId?{...l,...entry}:l).sort((a,b)=>a.date.localeCompare(b.date)));}
else{setLogs(p=>[...p,{id:Date.now(),...entry}].sort((a,b)=>a.date.localeCompare(b.date)));}
setAdding(false);setEditId(null);setForm(blank);setValidErr("");}
return(<div>
<div style={{...card,background:"linear-gradient(135deg,#0d0d1a,#1a1a0f)"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
<div style={{textAlign:"center"}}><div style={{color:"#f5a623",fontSize:22,fontWeight:800}}>{last?.weight||"—"}</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>current lbs</div></div>
<div style={{textAlign:"center"}}><div style={{color:change<0?"#92d36e":change>0?"#e94560":"#555",fontSize:22,fontWeight:800}}>{change!==0?(change<0?"":"+")+change.toFixed(1):"—"}</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>change</div></div>
<div style={{textAlign:"center"}}><div style={{color:"#5ac8fa",fontSize:22,fontWeight:800}}>{logs.length}</div><div style={{color:"#444",fontSize:9,textTransform:"uppercase"}}>entries</div></div>
</div>
{sorted.length>1&&<div>
<div style={{display:"flex",gap:2,alignItems:"flex-end",height:40,marginBottom:4}}>
{sorted.slice(-7).map((l,i,arr)=>{const mn=Math.min(...arr.map(x=>x.weight)),mx=Math.max(...arr.map(x=>x.weight)),h=mx===mn?20:((l.weight-mn)/(mx-mn))*36+4;return(<div key={l.id}style={{flex:1,background:i===arr.length-1?"#f5a623":"#1a1a2e",borderRadius:"3px 3px 0 0",height:`${h}px`,transition:"height 0.3s"}}/>);})}
</div>
<div style={{color:"#333",fontSize:9}}>Last 7 weigh-ins trend</div>
</div>}
</div>
{!adding&&<button onClick={openAdd}style={{width:"100%",background:"#1a1a0f",border:"1px solid #f5a62344",borderRadius:12,color:"#f5a623",fontSize:14,fontWeight:700,padding:"12px 0",cursor:"pointer",marginBottom:14}}>+ Log Weight</button>}
{adding&&<div style={{...card,border:"1px solid #f5a62333"}}>
<div style={{color:"#f5a623",fontSize:12,fontWeight:700,marginBottom:16,textTransform:"uppercase"}}>⚖️ {editId?"Edit Weight":"Log Weight"}</div>
{validErr&&<div style={{background:"#e9456022",border:"1px solid #e9456044",borderRadius:8,padding:"8px 12px",marginBottom:12,color:"#e94560",fontSize:12}}>{validErr}</div>}
<div style={{marginBottom:12}}><label style={lbl}>Date</label><input type="date"style={inp}value={form.date}onChange={e=>f("date",e.target.value)}/></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Weight (lbs)</label><input type="number"placeholder="185"inputMode="decimal"step="0.1"style={inp}value={form.weight}onChange={e=>f("weight",e.target.value)}/></div>
<div><label style={lbl}>Body Fat %</label><input type="number"placeholder="22"inputMode="decimal"step="0.1"style={inp}value={form.bodyFat}onChange={e=>f("bodyFat",e.target.value)}/></div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
<div><label style={lbl}>Muscle Mass %</label><input type="number"placeholder="40"inputMode="decimal"style={inp}value={form.muscleMass}onChange={e=>f("muscleMass",e.target.value)}/></div>
<div><label style={lbl}>Hydration %</label><input type="number"placeholder="55"inputMode="decimal"style={inp}value={form.hydration}onChange={e=>f("hydration",e.target.value)}/></div>
</div>
<div style={{marginBottom:12}}><label style={lbl}>BMI</label><input type="number"placeholder="24.5"inputMode="decimal"step="0.1"style={inp}value={form.bmi}onChange={e=>f("bmi",e.target.value)}/></div>
<div style={{marginBottom:16}}><label style={lbl}>Notes</label><textarea rows={2}placeholder="Morning weigh-in, post workout, etc."style={{...inp,resize:"none"}}value={form.notes}onChange={e=>f("notes",e.target.value)}/></div>
<div style={{display:"flex",gap:10}}>
<button onClick={save}style={{flex:2,background:"#f5a623",border:"none",borderRadius:12,color:"#000",fontSize:15,fontWeight:700,padding:"13px 0",cursor:"pointer"}}>{editId?"Update":"Save"}</button>
<button onClick={()=>{setAdding(false);setEditId(null);setValidErr("");}}style={{flex:1,background:"#111",border:"none",borderRadius:12,color:"#555",fontSize:14,padding:"13px 0",cursor:"pointer"}}>Cancel</button>
</div></div>}
{sorted.slice().reverse().map(l=><div key={l.id}style={card}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
<div><div style={{color:"#fff",fontSize:13,fontWeight:700}}>{new Date(l.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>{l.notes&&<div style={{color:"#555",fontSize:11,marginTop:2}}>{l.notes}</div>}</div>
<div style={{display:"flex",alignItems:"flex-start",gap:12}}>
<div style={{textAlign:"right"}}><div style={{color:"#f5a623",fontSize:26,fontWeight:800,lineHeight:1}}>{l.weight}</div><div style={{color:"#444",fontSize:10}}>lbs</div></div>
<div style={{display:"flex",gap:10,paddingTop:4}}>
<button onClick={()=>openEdit(l)}style={{background:"none",border:"none",color:"#5ac8fa",fontSize:11,cursor:"pointer",padding:0}}>edit</button>
<button onClick={()=>deleteLog(l.id)}style={{background:"none",border:"none",color:"#2a2a3e",fontSize:11,cursor:"pointer",padding:0}}>delete</button>
</div></div></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
{l.bodyFat?<div style={{background:"#111",borderRadius:8,padding:"6px 8px",textAlign:"center"}}><div style={{color:"#e94560",fontSize:13,fontWeight:700}}>{l.bodyFat}%</div><div style={{color:"#444",fontSize:9}}>body fat</div></div>:null}
{l.muscleMass?<div style={{background:"#111",borderRadius:8,padding:"6px 8px",textAlign:"center"}}><div style={{color:"#92d36e",fontSize:13,fontWeight:700}}>{l.muscleMass}%</div><div style={{color:"#444",fontSize:9}}>muscle</div></div>:null}
{l.hydration?<div style={{background:"#111",borderRadius:8,padding:"6px 8px",textAlign:"center"}}><div style={{color:"#5ac8fa",fontSize:13,fontWeight:700}}>{l.hydration}%</div><div style={{color:"#444",fontSize:9}}>hydration</div></div>:null}
</div>
</div>)}
{logs.length===0&&<div style={{textAlign:"center",color:"#333",fontSize:13,padding:"40px 0"}}>No weight entries yet.<br/>Log your starting weight to begin tracking.</div>}
</div>);}

// ── APP SHELL ────────────────────────────────────────────────
export default function App(){
const[logs,setLogs]=useState(()=>ld(SK,ID));
const[selId,setSelId]=useState(()=>{try{const r=localStorage.getItem(SEL);return r?JSON.parse(r):ld(SK,ID)[0]?.id||1;}catch{return 1;}});
const[tab,setTab]=useState("training");
const[mode,setMode]=useState("view");
const[msg,setMsg]=useState("");
const emptyForm={date:new Date().toISOString().split("T")[0],workoutType:"",workoutDuration:"",workoutCal:"",totalActiveCal:"",exerciseMin:"",standHrs:"",steps:"",distanceMi:"",morningFlights:"",eveningFlights:"",stairLoadPreset:"Backpack ~15lbs + Uniform + Boots",stairLoad:"Backpack ~15lbs + Uniform + Boots",waterOz:"",notes:""};
useEffect(()=>{sv(SK,logs);},[logs]);
useEffect(()=>{try{localStorage.setItem(SEL,JSON.stringify(selId));}catch(e){}},[selId]);
const sel=logs.find(d=>d.id===selId)||logs[0];
const daysToEvent=days();
const rec=[...logs].slice(-7);
const wCal=rec.reduce((s,d)=>s+(d.totalActiveCal||0),0);
const wFl=rec.reduce((s,d)=>s+(d.stairFlights||0),0);
const wSt=rec.reduce((s,d)=>s+(d.steps||0),0);
const wWat=rec.filter(d=>(d.waterOz||0)>=GW).length;
const tFl=logs.reduce((s,d)=>s+(d.stairFlights||0),0);
function formFromDay(d){return{date:d.date,workoutType:d.workouts?.[0]?.type||"",workoutDuration:d.workouts?.[0]?.duration||"",workoutCal:d.workouts?.[0]?.calories||"",totalActiveCal:d.totalActiveCal||"",exerciseMin:d.exerciseMin||"",standHrs:d.standHrs||"",steps:d.steps||"",distanceMi:d.distanceMi||"",morningFlights:d.morningFlights||"",eveningFlights:d.eveningFlights||"",stairLoadPreset:d.stairLoadPreset||"Backpack ~15lbs + Uniform + Boots",stairLoad:d.stairLoad||"",waterOz:d.waterOz||"",notes:d.notes||""};}
function saveNew(form){if(!form.date||!form.totalActiveCal){setMsg("⚠️ Enter date and active calories.");setTimeout(()=>setMsg(""),3000);return;}
const mf=Number(form.morningFlights)||0,ef=Number(form.eveningFlights)||0;
const e={id:Date.now(),date:form.date,workouts:form.workoutType?[{type:form.workoutType,duration:Number(form.workoutDuration)||0,calories:Number(form.workoutCal)||0}]:[],totalActiveCal:Number(form.totalActiveCal),exerciseMin:Number(form.exerciseMin)||0,standHrs:Number(form.standHrs)||0,steps:Number(form.steps)||0,distanceMi:parseFloat(form.distanceMi)||0,stairFlights:mf+ef,morningFlights:mf,eveningFlights:ef,stairLoadPreset:form.stairLoadPreset,stairLoad:form.stairLoad,waterOz:Number(form.waterOz)||0,notes:form.notes};
const nl=[...logs,e].sort((a,b)=>a.date.localeCompare(b.date));setLogs(nl);setSelId(e.id);setMode("view");setMsg("✓ Day saved!");setTimeout(()=>setMsg(""),2500);}
function saveEdit(form){if(!form.date||!form.totalActiveCal){setMsg("⚠️ Enter date and active calories.");setTimeout(()=>setMsg(""),3000);return;}
const mf=Number(form.morningFlights)||0,ef=Number(form.eveningFlights)||0;
const updated={...sel,date:form.date,workouts:form.workoutType?[{type:form.workoutType,duration:Number(form.workoutDuration)||0,calories:Number(form.workoutCal)||0}]:[],totalActiveCal:Number(form.totalActiveCal),exerciseMin:Number(form.exerciseMin)||0,standHrs:Number(form.standHrs)||0,steps:Number(form.steps)||0,distanceMi:parseFloat(form.distanceMi)||0,stairFlights:mf+ef,morningFlights:mf,eveningFlights:ef,stairLoadPreset:form.stairLoadPreset,stairLoad:form.stairLoad,waterOz:Number(form.waterOz)||0,notes:form.notes};
const nl=logs.map(d=>d.id===sel.id?updated:d).sort((a,b)=>a.date.localeCompare(b.date));setLogs(nl);setMode("view");setMsg("✓ Updated!");setTimeout(()=>setMsg(""),2500);}
function delDay(id){if(logs.length<=1)return;const nl=logs.filter(d=>d.id!==id);setLogs(nl);setSelId(nl[nl.length-1]?.id);}
const tabStyle=(t)=>({flex:1,background:tab===t?"#0f3460":"transparent",border:"none",borderTop:`2px solid ${tab===t?"#e94560":"transparent"}`,color:tab===t?"#fff":"#444",fontSize:10,padding:"10px 0",cursor:"pointer",textTransform:"uppercase",letterSpacing:"0.05em"});
const card2={background:"#0d0d1a",borderRadius:16,padding:16,marginBottom:14,border:"1px solid #1c1c2e"};
return(
<div style={{background:"#08080f",minHeight:"100vh",fontFamily:"-apple-system,sans-serif",color:"#fff",maxWidth:480,margin:"0 auto"}}>
<div style={{padding:"20px 16px 0",paddingTop:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
<div><div style={{color:"#e94560",fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>9/11 Memorial Stair Climb</div><div style={{fontSize:22,fontWeight:800,lineHeight:1.15}}>Charlotte<br/>Training Log</div><div style={{color:"#252535",fontSize:10,marginTop:4}}>Sep 12, 2026 · BofA Corporate Center</div></div>
<div style={{background:"#0f3460",borderRadius:14,padding:"10px 14px",textAlign:"center",minWidth:68}}><div style={{color:"#e94560",fontSize:30,fontWeight:800,lineHeight:1}}>{daysToEvent}</div><div style={{color:"#444",fontSize:9,marginTop:2,textTransform:"uppercase"}}>days out</div></div>
</div>
{msg&&<div style={{background:msg.startsWith("⚠️")?"#e9456022":"#16c79a22",border:`1px solid ${msg.startsWith("⚠️")?"#e9456044":"#16c79a44"}`,borderRadius:10,padding:"8px 14px",marginBottom:14,color:msg.startsWith("⚠️")?"#e94560":"#16c79a",fontSize:13,textAlign:"center"}}>{msg}</div>}
</div>
<div style={{display:"flex",background:"#08080f",borderBottom:"1px solid #1c1c2e",position:"sticky",top:0,zIndex:10}}>
{[{k:"training",i:"🪜"},{k:"sleep",i:"😴"},{k:"fasting",i:"⚡"},{k:"nutrition",i:"🥗"},{k:"weight",i:"⚖️"}].map(t=><button key={t.k}onClick={()=>setTab(t.k)}style={tabStyle(t.k)}>{t.i}<br/>{t.k}</button>)}
</div>
<div style={{padding:"16px 16px 60px"}}>
{tab==="training"&&(<>
<div style={card2}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{color:"#444",fontSize:10,textTransform:"uppercase"}}>Last 7 Days</span><span style={{color:"#333",fontSize:10}}>{logs.length} days</span></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:12}}>
{[{v:wCal.toLocaleString(),l:"cal",c:"#e94560"},{v:wFl,l:"flights",c:"#16c79a"},{v:`${(wSt/1000).toFixed(1)}k`,l:"steps",c:"#f5a623"},{v:`${wWat}/7`,l:"💧days",c:"#5ac8fa"}].map((s,i)=><div key={i}style={{textAlign:"center"}}><div style={{color:s.c,fontSize:17,fontWeight:800}}>{s.v}</div><div style={{color:"#333",fontSize:9,textTransform:"uppercase"}}>{s.l}</div></div>)}
</div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:"#333",fontSize:10}}>All-time flights</span><span style={{color:"#16c79a",fontSize:10,fontWeight:700}}>{tFl}</span></div>
<div style={{background:"#111",borderRadius:4,height:5}}><div style={{width:`${Math.min((tFl/(65*84))*100,100)}%`,background:"linear-gradient(90deg,#16c79a,#5ac8fa)",height:"100%",borderRadius:4}}/></div>
</div>
<div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:10,WebkitOverflowScrolling:"touch"}}>
{logs.map(d=><DC key={d.id}day={d}isSel={d.id===selId}onClick={()=>{setSelId(d.id);setMode("view");}}/>)}
<div onClick={()=>setMode("add")}style={{background:"#0d0d1a",border:"1px dashed #2a2a3e",borderRadius:12,padding:"9px 12px",cursor:"pointer",minWidth:58,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,gap:2}}><span style={{color:"#2a2a3e",fontSize:24}}>+</span><span style={{color:"#1e1e2e",fontSize:8}}>LOG DAY</span></div>
</div>
{sel&&mode==="view"&&(<>
<div style={card2}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<span style={{color:"#555",fontSize:11}}>{new Date(sel.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</span>
<div style={{display:"flex",gap:12}}><button onClick={()=>setMode("edit")}style={{background:"none",border:"none",color:"#5ac8fa",fontSize:11,cursor:"pointer",padding:0}}>edit</button><button onClick={()=>{if(window.confirm("Delete?"))delDay(sel.id);}}style={{background:"none",border:"none",color:"#2a2a3e",fontSize:11,cursor:"pointer",padding:0}}>delete</button></div>
</div>
<div style={{display:"flex",justifyContent:"space-around"}}><Ring value={sel.totalActiveCal}goal={GC}color="#e94560"label="Move"unit="cal"/><Ring value={sel.exerciseMin}goal={GE}color="#92d36e"label="Exercise"unit="min"/><Ring value={sel.standHrs}goal={GS}color="#5ac8fa"label="Stand"unit="hrs"/></div>
</div>
<div style={card2}><WBar oz={sel.waterOz||0}/></div>
<div style={card2}><SBar label="Steps"value={sel.steps}goal={GST}color="#f5a623"unit="steps"/><SBar label="Distance"value={sel.distanceMi}goal={5}color="#a78bfa"unit="mi"/><SBar label="Stand Hrs"value={sel.standHrs}goal={GS}color="#5ac8fa"unit="hrs"/></div>
<div style={card2}>
<div style={{color:"#444",fontSize:10,textTransform:"uppercase",marginBottom:12}}>Stair Sessions</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
<div style={{textAlign:"center",background:"#111",borderRadius:10,padding:"8px"}}><div style={{color:"#16c79a",fontSize:20,fontWeight:800}}>{sel.morningFlights||0}</div><div style={{color:"#444",fontSize:9}}>morning</div></div>
<div style={{textAlign:"center",background:"#111",borderRadius:10,padding:"8px"}}><div style={{color:"#16c79a",fontSize:20,fontWeight:800}}>{sel.eveningFlights||0}</div><div style={{color:"#444",fontSize:9}}>evening</div></div>
<div style={{textAlign:"center",background:"#0f3460",borderRadius:10,padding:"8px"}}><div style={{color:"#5ac8fa",fontSize:20,fontWeight:800}}>{sel.stairFlights||0}</div><div style={{color:"#444",fontSize:9}}>total</div></div>
</div>
{sel.stairLoad&&<div style={{background:"#0f1f40",borderRadius:8,padding:"7px 10px",marginBottom:8}}><div style={{color:"#5ac8fa",fontSize:10}}>Load</div><div style={{color:"#ccc",fontSize:12}}>{sel.stairLoad}</div></div>}
<div style={{background:"#111",borderRadius:6,height:7}}><div style={{width:`${Math.min(((sel.stairFlights||0)/65)*100,100)}%`,background:"linear-gradient(90deg,#16c79a,#5ac8fa)",height:"100%",borderRadius:6}}/></div>
<div style={{color:"#333",fontSize:10,marginTop:4}}>{sel.stairFlights||0}/65 event target</div>
</div>
{sel.workouts?.length>0&&<div style={card2}><div style={{color:"#444",fontSize:10,textTransform:"uppercase",marginBottom:12}}>Workouts</div>{sel.workouts.map((w,i)=><div key={i}style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<sel.workouts.length-1?"1px solid #111":"none"}}><div><div style={{color:"#fff",fontSize:13,fontWeight:600}}>{w.type}</div><div style={{color:"#444",fontSize:11}}>{w.duration}min</div></div><div style={{color:"#e94560",fontSize:14,fontWeight:700}}>{w.calories}cal</div></div>)}</div>}
{sel.notes&&<div style={card2}><div style={{color:"#444",fontSize:10,textTransform:"uppercase",marginBottom:8}}>Notes</div><div style={{color:"#888",fontSize:13,lineHeight:1.6}}>{sel.notes}</div></div>}
</>)}
{mode==="edit"&&sel&&<DayForm initial={formFromDay(sel)}onSave={saveEdit}onCancel={()=>setMode("view")}title="Edit Day"/>}
{mode==="add"&&<DayForm initial={emptyForm}onSave={saveNew}onCancel={()=>setMode("view")}title="Log New Day"/>}
</>)}
{tab==="sleep"&&<SleepTab/>}
{tab==="fasting"&&<FastTab/>}
{tab==="nutrition"&&<NutriTab/>}
{tab==="weight"&&<WeightTab/>}
<div style={{textAlign:"center",color:"#111",fontSize:10,marginTop:28}}>CLT CBP · 9/11 STAIR CLIMB · SEP 12 2026</div>
</div>
</div>);}
