import { useState, useEffect } from "react";

const STORAGE_KEY = "stairclimb-logs-v1";
const SELECTED_KEY = "stairclimb-selected-v1";
const GOAL_CAL = 800;
const GOAL_EXERCISE = 30;
const GOAL_STAND = 12;
const GOAL_STEPS = 10000;
const GOAL_WATER = 128;
const EVENT_DATE = new Date("2026-09-12");

const initialData = [{ id: 1, date: "2026-06-17", workouts: [{ type: "Military HIIT", duration: 39, calories: 316 }, { type: "Stair Climb (Down)", duration: 4, calories: 26 }, { type: "Stair Climb (Up)", duration: 3, calories: 35 }], totalActiveCal: 1181, exerciseMin: 58, standHrs: 16, steps: 8941, distanceMi: 4.06, stairFlights: 22, stairLoad: "Backpack ~15lbs + Uniform + Boots", waterOz: 0, notes: "Day 1. Strong start. Water intake — area to improve." }];

function getDaysToEvent() { return Math.ceil((EVENT_DATE - new Date()) / (1000 * 60 * 60 * 24)); }
function loadFromStorage() { try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : initialData; } catch { return initialData; } }
function saveToStorage(logs) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(logs)); } catch (e) {} }
function loadSelectedId(logs) { try { const r = localStorage.getItem(SELECTED_KEY); return r ? JSON.parse(r) : logs[0]?.id || 1; } catch { return logs[0]?.id || 1; } }

export function WaterBar({ oz }) {
  const pct = Math.min((oz / GOAL_WATER) * 100, 100);
  const met = oz >= GOAL_WATER;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          <div style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>💧 Water Intake</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ color: met ? "#5ac8fa" : "#fff", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{oz}</span>
            <span style={{ color: "#444", fontSize: 12 }}>/ {GOAL_WATER} oz</span>
            {met && <span style={{ color: "#5ac8fa", fontSize: 12 }}>✓ Goal!</span>}
          </div>
          <div style={{ color: "#333", fontSize: 10, marginTop: 2 }}>≈ {Math.round(oz/8)} glasses · {(oz/128).toFixed(2)} gal</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22 }}>{pct >= 100 ? "💧💧💧" : pct >= 75 ? "💧💧" : pct >= 50 ? "💧" : "🫙"}</div>
          <div style={{ color: "#333", fontSize: 10 }}>{Math.round(pct)}%</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
        {Array.from({ length: 8 }).map((_, i) => { const s = i*16, e = (i+1)*16, f = oz>=e?1:oz>s?(oz-s)/16:0; return (<div key={i} style={{ flex:1, height:10, background:"#0d0d1a", borderRadius:3, overflow:"hidden", position:"relative" }}><div style={{ position:"absolute", left:0, top:0, width:`${f*100}%`, height:"100%", background:"linear-gradient(90deg,#1a5276,#5ac8fa)", borderRadius:3 }} /></div>); })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {["0","32oz","64oz","96oz","128oz 🏆"].map((l,i) => <span key={i} style={{ color: i===4&&met?"#5ac8fa":"#222", fontSize:9 }}>{l}</span>)}
      </div>
    </div>
  );
}

export function Ring({ value, goal, color, label, unit, size=78 }) {
  const pct=Math.min(value/goal,1.5), r=(size-14)/2, circ=2*Math.PI*r, filled=Math.min(pct,1)*circ, overfill=pct>1?(pct-1)*circ:0;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a1a2e" strokeWidth={11} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={11} strokeDasharray={`${filled} ${circ-filled}`} strokeLinecap="round" opacity={0.95} />
        {overfill>0 && <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#fff" strokeWidth={7} strokeDasharray={`${overfill} ${circ-overfill}`} strokeLinecap="round" opacity={0.5} />}
      </svg>
      <div style={{ textAlign:"center" }}>
        <div style={{ color, fontWeight:700, fontSize:13 }}>{typeof value==="number"&&value%1!==0?value.toFixed(1):value.toLocaleString()}</div>
        <div style={{ color:"#555", fontSize:10 }}>{label}</div>
        <div style={{ color:"#333", fontSize:9 }}>/{goal} {unit}</div>
      </div>
    </div>
  );
}

export function StatBar({ label, value, goal, color, unit }) {
  const pct=Math.min((value/goal)*100,100), over=value>=goal;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ color:"#777", fontSize:12 }}>{label}</span>
        <span style={{ color:over?color:"#ccc", fontSize:12, fontWeight:600 }}>
          {typeof value==="number"&&value%1!==0?value.toFixed(2):value.toLocaleString()}
          <span style={{ color:"#444", fontSize:10 }}> / {goal} {unit}</span>
          {over && <span style={{ color, marginLeft:4 }}>✓</span>}
        </span>
      </div>
      <div style={{ background:"#111", borderRadius:4, height:5 }}>
        <div style={{ width:`${pct}%`, background:color, height:"100%", borderRadius:4 }} />
      </div>
    </div>
  );
}

export function DayCard({ day, isSelected, onClick }) {
  const d=new Date(day.date+"T12:00:00"), dayName=d.toLocaleDateString("en-US",{weekday:"short"}), dateNum=d.getDate(), hitCal=day.totalActiveCal>=GOAL_CAL, hitWater=(day.waterOz||0)>=GOAL_WATER;
  return (
    <div onClick={onClick} style={{ background:isSelected?"#0f3460":"#0d0d1a", border:`1px solid ${isSelected?"#e94560":"#1c1c2e"}`, borderRadius:12, padding:"9px 12px", cursor:"pointer", minWidth:58, textAlign:"center", transition:"all 0.2s", flexShrink:0 }}>
      <div style={{ color:"#555", fontSize:9, textTransform:"uppercase" }}>{dayName}</div>
      <div style={{ color:"#fff", fontSize:17, fontWeight:800, lineHeight:1.2 }}>{dateNum}</div>
      <div style={{ display:"flex", justifyContent:"center", gap:3, marginTop:3 }}>
        <div style={{ width:6, height:6, borderRadius:"50%", background:hitCal?"#e94560":"#1c1c2e" }} />
        <div style={{ width:6, height:6, borderRadius:"50%", background:hitWater?"#5ac8fa":"#1c1c2e" }} />
      </div>
    </div>
  );
}

export { loadFromStorage, saveToStorage, loadSelectedId, getDaysToEvent, GOAL_CAL, GOAL_EXERCISE, GOAL_STAND, GOAL_STEPS, GOAL_WATER };
