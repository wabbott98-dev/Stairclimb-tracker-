import { useState, useEffect } from "react";
import { WaterBar, Ring, StatBar, DayCard, loadFromStorage, saveToStorage, loadSelectedId, getDaysToEvent, GOAL_CAL, GOAL_EXERCISE, GOAL_STAND, GOAL_STEPS, GOAL_WATER } from "./App.jsx";

export default function AppMain() {
  const [logs, setLogs] = useState(() => loadFromStorage());
  const [selectedId, setSelectedId] = useState(() => loadSelectedId(loadFromStorage()));
  const [adding, setAdding] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], workoutType:"", workoutDuration:"", workoutCal:"", totalActiveCal:"", exerciseMin:"", standHrs:"", steps:"", distanceMi:"", stairFlights:"", stairLoad:"", waterOz:"", notes:"" });

  useEffect(() => { saveToStorage(logs); }, [logs]);
  useEffect(() => { try { localStorage.setItem("stairclimb-selected-v1", JSON.stringify(selectedId)); } catch(e) {} }, [selectedId]);

  const selected = logs.find(d => d.id === selectedId) || logs[0];
  const daysToEvent = getDaysToEvent();
  const recent = [...logs].slice(-7);
  const weekCal = recent.reduce((s,d) => s+(d.totalActiveCal||0), 0);
  const weekFlights = recent.reduce((s,d) => s+(d.stairFlights||0), 0);
  const weekSteps = recent.reduce((s,d) => s+(d.steps||0), 0);
  const weekWaterDays = recent.filter(d => (d.waterOz||0) >= GOAL_WATER).length;
  const totalFlights = logs.reduce((s,d) => s+(d.stairFlights||0), 0);

  function handleAdd() {
    if (!form.date || !form.totalActiveCal) { setSaveMsg("⚠️ Please enter date and active calories."); setTimeout(() => setSaveMsg(""), 3000); return; }
    setSaving(true);
    const newEntry = { id: Date.now(), date: form.date, workouts: form.workoutType ? [{ type: form.workoutType, duration: Number(form.workoutDuration)||0, calories: Number(form.workoutCal)||0 }] : [], totalActiveCal: Number(form.totalActiveCal), exerciseMin: Number(form.exerciseMin)||0, standHrs: Number(form.standHrs)||0, steps: Number(form.steps)||0, distanceMi: parseFloat(form.distanceMi)||0, stairFlights: Number(form.stairFlights)||0, stairLoad: form.stairLoad, waterOz: Number(form.waterOz)||0, notes: form.notes };
    const newLogs = [...logs, newEntry].sort((a,b) => a.date.localeCompare(b.date));
    setLogs(newLogs); setSelectedId(newEntry.id); setAdding(false); setSaving(false);
    setSaveMsg("✓ Day saved!"); setTimeout(() => setSaveMsg(""), 2500);
    setForm({ date: new Date().toISOString().split("T")[0], workoutType:"", workoutDuration:"", workoutCal:"", totalActiveCal:"", exerciseMin:"", standHrs:"", steps:"", distanceMi:"", stairFlights:"", stairLoad:"", waterOz:"", notes:"" });
  }

  function handleDelete(id) {
    if (logs.length <= 1) return;
    const newLogs = logs.filter(d => d.id !== id);
    setLogs(newLogs); setSelectedId(newLogs[newLogs.length-1]?.id);
  }

  const inp = { background:"#0a0a18", border:"1px solid #1c1c2e", borderRadius:8, color:"#fff", padding:"9px 12px", fontSize:16, width:"100%", boxSizing:"border-box", WebkitAppearance:"none" };
  const lbl = { color:"#555", fontSize:10, marginBottom:4, display:"block", textTransform:"uppercase", letterSpacing:"0.08em" };
  const card = { background:"#0d0d1a", borderRadius:16, padding:16, marginBottom:14, border:"1px solid #1c1c2e" };

  return (
    <div style={{ background:"#08080f", minHeight:"100vh", fontFamily:"-apple-system,sans-serif", color:"#fff", padding:"20px 16px 60px", maxWidth:480, margin:"0 auto" }}>

      <div style={{ marginBottom:22, paddingTop:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ color:"#e94560", fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:4 }}>9/11 Memorial Stair Climb</div>
            <div style={{ fontSize:24, fontWeight:800, lineHeight:1.15 }}>Charlotte<br/>Training Log</div>
            <div style={{ color:"#252535", fontSize:10, marginTop:5 }}>Sep 12, 2026 · Bank of America Corporate Center</div>
          </div>
          <div style={{ background:"#0f3460", borderRadius:14, padding:"10px 14px", textAlign:"center", minWidth:68 }}>
            <div style={{ color:"#e94560", fontSize:32, fontWeight:800, lineHeight:1 }}>{daysToEvent}</div>
            <div style={{ color:"#444", fontSize:9, marginTop:2, textTransform:"uppercase" }}>days out</div>
          </div>
        </div>
      </div>

      {saveMsg && <div style={{ background:saveMsg.startsWith("⚠️")?"#e9456022":"#16c79a22", border:`1px solid ${saveMsg.startsWith("⚠️")?"#e9456044":"#16c79a44"}`, borderRadius:10, padding:"8px 14px", marginBottom:14, color:saveMsg.startsWith("⚠️")?"#e94560":"#16c79a", fontSize:13, textAlign:"center" }}>{saveMsg}</div>}

      <div style={card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <div style={{ color:"#444", fontSize:10, textTransform:"uppercase" }}>Last 7 Days</div>
          <div style={{ color:"#333", fontSize:10 }}>{logs.length} days logged</div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[{val:weekCal.toLocaleString(),label:"cal",color:"#e94560"},{val:weekFlights,label:"flights",color:"#16c79a"},{val:`${(weekSteps/1000).toFixed(1)}k`,label:"steps",color:"#f5a623"},{val:`${weekWaterDays}/7`,label:"💧 days",color:"#5ac8fa"}].map((s,i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ color:s.color, fontSize:18, fontWeight:800 }}>{s.val}</div>
              <div style={{ color:"#333", fontSize:9, textTransform:"uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
            <span style={{ color:"#333", fontSize:10 }}>All-time stair progress</span>
            <span style={{ color:"#16c79a", fontSize:10, fontWeight:700 }}>{totalFlights} flights</span>
