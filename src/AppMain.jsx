import{useState,useEffect}from"react";
const SK="stairclimb-logs-v1",SEL="stairclimb-selected-v1",GC=800,GE=30,GS=12,GST=10000,GW=128,ED=new Date("2026-09-12");
const ID=[{id:1,date:"2026-06-17",workouts:[{type:"Military HIIT",duration:39,calories:316},{type:"Stair Climb (Down)",duration:4,calories:26},{type:"Stair Climb (Up)",duration:3,calories:35}],totalActiveCal:1181,exerciseMin:58,standHrs:16,steps:8941,distanceMi:4.06,stairFlights:22,stairLoad:"Backpack ~15lbs + Uniform + Boots",waterOz:0,notes:"Day 1. Strong start. Water intake — area to improve."}];
const load=()=>{try{const r=localStorage.getItem(SK);return r?JSON.parse(r):ID;}catch{return ID;}};
const save=(l)=>{try{localStorage.setItem(SK,JSON.stringify(l));}catch(e){}};
const loadSel=(l)=>{try{const r=localStorage.getItem(SEL);return r?JSON.parse(r):l[0]?.id||1;}catch{return l[0]?.id||1;}};
const days=()=>Math.ceil((ED-new Date())/(86400000));
const inp={background:"#0a0a18",border:"1px solid #1c1c2e",borderRadius:8,color:"#fff",padding:"9px 12px",fontSize:16,width:"100%",boxSizing:"border-box",WebkitAppearance:"none"};
const lbl={color:"#555",fontSize:10,marginBottom:4,display:"block",textTransform:"uppercase",letterSpacing:"0.08em"};
const card={background:"#0d0d1a",borderRadius:16,padding:16,marginBottom:14,border:"1px solid #1c1c2e"};
function SBar({label,value,goal,color,unit}){const p=Math.min((value/goal)*100,100),o=value>=goal;return(<div style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:"#777",fontSize:12}}>{label}</span><span style={{color:o?color:"#ccc",fontSize:12,fontWeight:600}}>{typeof value==="number"&&value%1!==0?value.toFixed(2):value.toLocaleString()}<span style={{color:"#444",fontSize:10}}> / {goal} {unit}</span>{o&&<span style={{color,marginLeft:4}}>✓</span>}</span></div><div style={{background:"#111",borderRadius:4,height:5}}><div style={{width:`${p}%`,background:color,height:"100%",borderRadius:4}}/></div></div>);}
function Ring({value,goal,color,label,unit,size=78}){const p=Math.min(value/goal,1.5),r=(size-14)/2,c=2*Math.PI*r,f=Math.min(p,1)*c,o=p>1?(p-1)*c:0;return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><svg width={size}height={size}style={{transform:"rotate(-90deg)"}}><circle cx={size/2}cy={size/2}r={r}fill="none"stroke="#1a1a2e"strokeWidth={11}/><circle cx={size/2}cy={size/2}r={r}fill="none"stroke={color}strokeWidth={11}strokeDasharray={`${f} ${c-f}`}strokeLinecap="round"opacity={0.95}/>{o>0&&<circle cx={size/2}cy={size/2}r={r}fill="none"stroke="#fff"strokeWidth={7}strokeDasharray={`${o} ${c-o}`}strokeLinecap="round"opacity={0.5}/>}</svg><div style={{textAlign:"center"}}><div style={{color,fontWeight:700,fontSize:13}}>{typeof value==="number"&&value%1!==0?value.toFixed(1):value.toLocaleString()}</div><div style={{color:"#555",fontSize:10}}>{label}</div><div style={{color:"#333",fontSize:9}}>/{goal} {unit}</div></div></div>);}
function WBar({oz}){const p=Math.min((oz/GW)*100,100),m=oz>=GW;return(<div><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:8}}><div><div style={{color:"#444",fontSize:10,textTransform:"uppercase",marginBottom:3}}>💧 Water Intake</div><div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{color:m?"#5ac8fa":"#fff",fontSize:28,fontWeight:800,lineHeight:1}}>{oz}</span><span style={{color:"#444",fontSize:12}}>/ {GW} oz</span>{m&&<span style={{color:"#5ac8fa",fontSize:12}}>✓</span>}</div><div style={{color:"#333",fontSize:10,marginTop:2}}>≈{Math.round(oz/8)} glasses</div></div><div style={{fontSize:22}}>{p>=100?"💧💧💧":p>=75?"💧💧":p>=50?"💧":"🫙"}</div></div><div style={{display:"flex",gap:3,marginBottom:4}}>{Array.from({length:8}).map((_,i)=>{const s=i*16,e=(i+1)*16,f=oz>=e?1:oz>s?(oz-s)/16:0;return(<div key={i}style={{flex:1,height:10,background:"#0d0d1a",borderRadius:3,overflow:"hidden",position:"relative"}}><div style={{position:"absolute",left:0,top:0,width:`${f*100}%`,height:"100%",background:"linear-gradient(90deg,#1a5276,#5ac8fa)",borderRadius:3}}/></div>);})}</div><div style={{display:"flex",justifyContent:"space-between"}}>{["0","32","64","96","128🏆"].map((l,i)=><span key={i}style={{color:i===4&&m?"#5ac8fa":"#222",fontSize:9}}>{l}</span>)}</div></div>);}
function DC({day,isSel,onClick}){const d=new Date(day.date+"T12:00:00"),dn=d.toLocaleDateString("en-US",{weekday:"short"}),dt=d.getDate(),hc=day.totalActiveCal>=GC,hw=(day.waterOz||0)>=GW;return(<div onClick={onClick}style={{background:isSel?"#0f3460":"#0d0d1a",border:`1px solid ${isSel?"#e94560":"#1c1c2e"}`,borderRadius:12,padding:"9px 12px",cursor:"pointer",minWidth:58,textAlign:"center",flexShrink:0}}><div style={{color:"#555",fontSize:9,textTransform:"uppercase"}}>{dn}</div><div style={{color:"#fff",fontSize:17,fontWeight:800,lineHeight:1.2}}>{dt}</div><div style={{display:"flex",justifyContent:"center",gap:3,marginTop:3}}><div style={{width:6,height:6,borderRadius:"50%",background:hc?"#e94560":"#1c1c2e"}}/><div style={{width:6,height:6,borderRadius:"50%",background:hw?"#5ac8fa":"#1c1c2e"}}/></div></div>);}
export default function App(){
const[logs,setLogs]=useState(()=>load());
const[selId,setSelId]=useState(()=>loadSel(load()));
const[adding,setAdding]=useState(false);
const[msg,setMsg]=useState("");
const[form,setForm]=useState({date:new Date().toISOString().split("T")[0],workoutType:"",workoutDuration:"",workoutCal:"",totalActiveCal:"",exerciseMin:"",standHrs:"",steps:"",distanceMi:"",stairFlights:"",stairLoad:"",waterOz:"",notes:""});
useEffect(()=>{save(logs);},[logs]);
useEffect(()=>{try{localStorage.setItem(SEL,JSON.stringify(selId));}catch(e){}},[selId]);
const sel=logs.find(d=>d.id===selId)||logs[0];
const rec=[...logs].slice(-7);
const wCal=rec.reduce((s,d)=>s+(d.totalActiveCal||0),0);
const wFl=rec.reduce((s,d)=>s+(d.stairFlights||0),0);
const wSt=rec.reduce((s,d)=>s+(d.steps||0),0);
const wWat=rec.filter(d=>(d.waterOz||0)>=GW).length;
const tFl=logs.reduce((s,d)=>s+(d.stairFlights||0),0);
function addDay(){if(!form.date||!form.totalActiveCal){setMsg("⚠️ Enter date and active calories.");setTimeout(()=>setMsg(""),3000);return;}
const e={id:Date.now(),date:form.date,workouts:form.workoutType?[{type:form.workoutType,duration:Number(form.workoutDuration)||0,calories:Number(form.workoutCal)||0}]:[],totalActiveCal:Number(form.totalActiveCal),exerciseMin:Number(form.exerciseMin)||0,standHrs:Number(form.standHrs)||0,steps:Number(form.steps)||0,distanceMi:parseFloat(form.distanceMi)||0,stairFlights:Number(form.stairFlights)||0,stairLoad:form.stairLoad,waterOz:Number(form.waterOz)||0,notes:form.notes};
const nl=[...logs,e].sort((a,b)=>a.date.localeCompare(b.date));setLogs(nl);setSelId(e.id);setAdding(false);setMsg("✓ Saved!");setTimeout(()=>setMsg(""),2500);setForm({date:new Date().toISOString().split("T")[0],workoutType:"",workoutDuration:"",workoutCal:"",totalActiveCal:"",exerciseMin:"",standHrs:"",steps:"",distanceMi:"",stairFlights:"",stairLoad:"",waterOz:"",notes:""});}
function delDay(id){if(logs.length<=1)return;const nl=logs.filter(d=>d.id!==id);setLogs(nl);setSelId(nl[nl.length-1]?.id);}
return(
<div style={{background:"#08080f",minHeight:"100vh",fontFamily:"-apple-system,sans-serif",color:"#fff",padding:"20px 16px 60px",maxWidth:480,margin:"0 auto"}}>
<div style={{marginBottom:22,paddingTop:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div><div style={{color:"#e94560",fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>9/11 Memorial Stair Climb</div><div style={{fontSize:24,fontWeight:800,lineHeight:1.15}}>Charlotte<br/>Training Log</div><div style={{color:"#252535",fontSize:10,marginTop:5}}>Sep 12, 2026 · BofA Corporate Center</div></div>
<div style={{background:"#0f3460",borderRadius:14,padding:"10px 14px",textAlign:"center",minWidth:68}}><div style={{color:"#e94560",fontSize:32,fontWeight:800,lineHeight:1}}>{days()}</div><div style={{color:"#444",fontSize:9,marginTop:2,textTransform:"uppercase"}}>days out</div></div>
</div></div>
{msg&&<div style={{background:msg.startsWith("⚠️")?"#e9456022":"#16c79a22",border:`1px solid ${msg.startsWith("⚠️")?"#e9456044":"#16c79a44"}`,borderRadius:10,padding:"8px 14px",marginBottom:14,color:msg.startsWith("⚠️")?"#e94560":"#16c79a",fontSize:13,textAlign:"center"}}>{msg}</div>}
<div style={card}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><span style={{color:"#444",fontSize:10,textTransform:"uppercase"}}>Last 7 Days</span><span style={{color:"#333",fontSize:10}}>{logs.length} days</span></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
{[{v:wCal.toLocaleString(),l:"cal",c:"#e94560"},{v:wFl,l:"flights",c:"#16c79a"},{v:`${(wSt/1000).toFixed(1)}k`,l:"steps",c:"#f5a623"},{v:`${wWat}/7`,l:"💧days",c:"#5ac8fa"}].map((s,i)=><div key={i}style={{textAlign:"center"}}><div style={{color:s.c,fontSize:18,fontWeight:800}}>{s.v}</div><div style={{color:"#333",fontSize:9,textTransform:"uppercase"}}>{s.l}</div></div>)}
</div>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:"#333",fontSize:10}}>All-time flights</span><span style={{color:"#16c79a",fontSize:10,fontWeight:700}}>{tFl}</span></div>
<div style={{background:"#111",borderRadius:4,height:5}}><div style={{width:`${Math.min((tFl/(65*84))*100,100)}%`,background:"linear-gradient(90deg,#16c79a,#5ac8fa)",height:"100%",borderRadius:4}}/></div>
</div>
<div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:8,marginBottom:10,WebkitOverflowScrolling:"touch"}}>
{logs.map(d=><DC key={d.id}day={d}isSel={d.id===selId}onClick={()=>{setSelId(d.id);setAdding(false);}}/>)}
<div onClick={()=>{setAdding(true);setSelId(null);}}style={{background:"#0d0d1a",border:"1px dashed #2a2a3e",borderRadius:12,padding:"9px 12px",cursor:"pointer",minWidth:58,textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0,gap:2}}><span style={{color:"#2a2a3e",fontSize:24}}>+</span><span style={{color:"#1e1e2e",fontSize:8}}>LOG DAY</span></div>
</div>
{sel&&!adding&&(<>
<div style={card}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{color:"#555",fontSize:11}}>{new Date(sel.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</span><button onClick={()=>{if(window.confirm("Delete?"))delDay(sel.id);}}style={{background:"none",border:"none",color:"#2a2a3e",fontSize:11,cursor:"pointer",padding:0}}>delete</button></div>
<div style={{display:"flex",justifyContent:"space-around"}}><Ring value={sel.totalActiveCal}goal={GC}color="#e94560"label="Move"unit="cal"/><Ring value={sel.exerciseMin}goal={GE}color="#92d36e"label="Exercise"unit="min"/><Ring value={sel.standHrs}goal={GS}color="#5ac8fa"label="Stand"unit="hrs"/></div>
</div>
<div style={card}><WBar oz={sel.waterOz||0}/></div>
<div style={card}><SBar label="Steps"value={sel.steps}goal={GST}color="#f5a623"unit="steps"/><SBar label="Distance"value={sel.distanceMi}goal={5}color="#a78bfa"unit="mi"/><SBar label="Stand Hrs"value={sel.standHrs}goal={GS}color="#5ac8fa"unit="hrs"/></div>
<div style={card}><div style={{color:"#444",fontSize:10,textTransform:"uppercase",marginBottom:12}}>Stair Session</div><div style={{display:"flex",alignItems:"center",gap:14}}><div style={{textAlign:"center",minWidth:60}}><div style={{color:"#16c79a",fontSize:40,fontWeight:800,lineHeight:1}}>{sel.stairFlights}</div><div style={{color:"#444",fontSize:10}}>flights</div></div><div style={{flex:1}}>{sel.stairLoad&&<div style={{background:"#0f1f40",borderRadius:8,padding:"7px 10px",marginBottom:8}}><div style={{color:"#5ac8fa",fontSize:10}}>Load</div><div style={{color:"#ccc",fontSize:12}}>{sel.stairLoad}</div></div>}<div style={{background:"#111",borderRadius:6,height:7}}><div style={{width:`${Math.min((sel.stairFlights/65)*100,100)}%`,background:"linear-gradient(90deg,#16c79a,#5ac8fa)",height:"100%",borderRadius:6}}/></div><div style={{color:"#333",fontSize:10,marginTop:4}}>{sel.stairFlights}/65 target</div></div></div></div>
{sel.workouts?.length>0&&<div style={card}><div style={{color:"#444",fontSize:10,textTransform:"uppercase",marginBottom:12}}>Workouts</div>{sel.workouts.map((w,i)=><div key={i}style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<sel.workouts.length-1?"1px solid #111":"none"}}><div><div style={{color:"#fff",fontSize:13,fontWeight:600}}>{w.type}</div><div style={{color:"#444",fontSize:11}}>{w.duration}min</div></div><div style={{color:"#e94560",fontSize:14,fontWeight:700}}>{w.calories}cal</div></div>)}</div>}
{sel.notes&&<div style={card}><div style={{color:"#444",fontSize:10,textTransform:"uppercase",marginBottom:8}}>Notes</div><div style={{color:"#888",fontSize:13,lineHeight:1.6}}>{sel.notes}</div></div>}
</>)}
{adding&&(<div style={{...card,border:"1px solid #e9456033"}}>
<div style={{color:"#e94560",fontSize:12,fontWeight:700,marginBottom:18,textTransform:"uppercase"}}>Log New Day</div>
<div style={{marginBottom:12}}><label style={lbl}>Date</label><input type="date"style={inp}value={form.date}onChange={e=>setForm({...form,date:e.target.value})}/></div>
<div style={{background:"#0a1520",border:"1px solid #1a3a5c",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
<label style={{...lbl,color:"#5ac8fa"}}>💧 Water (oz) — Goal: 128oz (1 gallon)</label>
<input type="number"placeholder="96"inputMode="numeric"style={{...inp,background:"#06101a",border:"1px solid #1a3a5c"}}value={form.waterOz}onChange={e=>setForm({...form,waterOz:e.target.value})}/>
{form.waterOz!==""&&<div style={{marginTop:8}}><div style={{background:"#060e16",borderRadius:4,height:6}}><div style={{width:`${Math.min((Number(form.waterOz)/GW)*100,100)}%`,background:"linear-gradient(90deg,#1a5276,#5ac8fa)",height:"100%",borderRadius:4}}/></div><div style={{color:"#2176ae",fontSize:10,marginTop:4}}>{Math.round((Number(form.waterOz)/GW)*100)}% · {Number(form.waterOz)>=GW?"🏆 Goal!":GW-Number(form.waterOz)+"oz to go"}</div></div>}
</div>
<div style={{color:"#2a2a3e",fontSize:10,textTransform:"uppercase",marginBottom:10}}>— Apple Watch —</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
{[{l:"Move Cal 🔴",k:"totalActiveCal",p:"1181"},{l:"Exercise Min 🟢",k:"exerciseMin",p:"58"},{l:"Stand Hrs 🔵",k:"standHrs",p:"16"},{l:"Steps",k:"steps",p:"8941"},{l:"Distance mi",k:"distanceMi",p:"4.06"},{l:"Stair Flights",k:"stairFlights",p:"22"}].map(f=><div key={f.k}><label style={lbl}>{f.l}</label><input type="number"placeholder={f.p}inputMode="decimal"style={inp}value={form[f.k]}onChange={e=>setForm({...form,[f.k]:e.target.value})}/></div>)}
</div>
<div style={{marginBottom:12}}><label style={lbl}>Stair Load</label><input type="text"placeholder="Backpack ~15lbs + Boots"style={inp}value={form.stairLoad}onChange={e=>setForm({...form,stairLoad:e.target.value})}/></div>
<div style={{color:"#2a2a3e",fontSize:10,textTransform:"uppercase",marginBottom:10}}>— Workout —</div>
<div style={{marginBottom:12}}><label style={lbl}>Workout Type</label><input type="text"placeholder="Military HIIT"style={inp}value={form.workoutType}onChange={e=>setForm({...form,workoutType:e.target.value})}/></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
<div><label style={lbl}>Duration (min)</label><input type="number"placeholder="39"inputMode="numeric"style={inp}value={form.workoutDuration}onChange={e=>setForm({...form,workoutDuration:e.target.value})}/></div>
<div><label style={lbl}>Workout Cal</label><input type="number"placeholder="316"inputMode="numeric"style={inp}value={form.workoutCal}onChange={e=>setForm({...form,workoutCal:e.target.value})}/></div>
</div>
<div style={{marginBottom:18}}><label style={lbl}>Notes</label><textarea rows={3}placeholder="Energy, soreness, stairs, water…"style={{...inp,resize:"none",lineHeight:1.5}}value={form.notes}onChange={e=>setForm({...form,notes:e.target.value})}/></div>
<div style={{display:"flex",gap:10}}>
<button onClick={addDay}style={{flex:2,background:"#e94560",border:"none",borderRadius:12,color:"#fff",fontSize:16,fontWeight:700,padding:"14px 0",cursor:"pointer"}}>Save Day</button>
<button onClick={()=>setAdding(false)}style={{flex:1,background:"#111",border:"none",borderRadius:12,color:"#555",fontSize:15,padding:"14px 0",cursor:"pointer"}}>Cancel</button>
</div>
</div>)}
<div style={{textAlign:"center",color:"#111",fontSize:10,marginTop:28}}>CLT CBP · 9/11 STAIR CLIMB · SEP 12 2026</div>
</div>);
}
