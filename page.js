 "use client";
import {useEffect,useState} from "react";

export default function Home(){
 const [prompt,setPrompt]=useState("");
 const [style,setStyle]=useState("Cartoon");
 const [ratio,setRatio]=useState("9:16");
 const [job,setJob]=useState(null);
 const [error,setError]=useState("");

 async function generate(){
  if(!prompt.trim()) return setError("Enter a video prompt first.");
  setError(""); setJob({state:"queued"});
  try{
   const r=await fetch("/api/generate",{method:"POST",headers:{"content-type":"application/json"},
     body:JSON.stringify({prompt,style,aspectRatio:ratio})});
   const d=await r.json();
   if(!r.ok) throw new Error(d.error);
   setJob(d);
  }catch(e){setJob(null);setError(e.message)}
 }
 useEffect(()=>{
  if(!job?.id || ["completed","failed"].includes(job.state)) return;
  const t=setInterval(async()=>{
   try{
    const r=await fetch("/api/status?id="+encodeURIComponent(job.id),{cache:"no-store"});
    const d=await r.json(); setJob(d);
   }catch(e){setError(e.message)}
  },4000);
  return()=>clearInterval(t);
 },[job?.id,job?.state]);

 return <main style={{minHeight:"100vh",background:"#0b1020",color:"#fff",padding:"32px"}}>
  <div style={{maxWidth:900,margin:"auto"}}>
   <h1 style={{fontSize:48,marginBottom:8}}>VideoForge <span style={{color:"#9b5cff"}}>AI</span></h1>
   <p style={{color:"#aab2ca"}}>Turn a text prompt into a short AI video.</p>
   <section style={card}>
    <label>Video prompt</label>
    <textarea value={prompt} onChange={e=>setPrompt(e.target.value)}
      placeholder="A cute little superhero saves a kitten in a colorful city, funny and energetic..."
      style={textarea}/>
    <div style={{display:"flex",gap:12,marginTop:18,flexWrap:"wrap"}}>
      {["Cartoon","Realistic"].map(x=><button key={x} onClick={()=>setStyle(x)}
       style={style===x?activeBtn:btn}>{x==="Cartoon"?"🎨":"🎬"} {x}</button>)}
      <select value={ratio} onChange={e=>setRatio(e.target.value)} style={select}>
       <option value="9:16">9:16 Shorts</option><option value="16:9">16:9 YouTube</option><option value="1:1">1:1 Square</option>
      </select>
    </div>
    <button onClick={generate} style={generateBtn}>✨ Create AI Video</button>
    {error&&<p style={{color:"#ff8f8f"}}>{error}</p>}
   </section>
   {job&&<section style={card}>
    <h2>Video Result</h2>
    {job.state!=="completed" && job.state!=="failed" && <p>⏳ Generating… Status: <b>{job.state}</b></p>}
    {job.state==="failed" && <p style={{color:"#ff8f8f"}}>Generation failed: {job.failureReason||"Unknown error"}</p>}
    {job.video && <><video src={job.video} controls playsInline style={{width:"100%",maxHeight:600,borderRadius:16}}/>
      <a href={job.video} target="_blank" rel="noreferrer" style={download}>Open / Download Video</a></>}
   </section>}
  </div>
 </main>
}
const card={background:"#121a30",border:"1px solid #293455",borderRadius:22,padding:24,marginTop:24};
const textarea={width:"100%",minHeight:150,boxSizing:"border-box",background:"#090f20",color:"#fff",border:"1px solid #303b5d",borderRadius:14,padding:16,fontSize:16};
const btn={padding:"13px 18px",borderRadius:12,border:"1px solid #34405f",background:"#0c1326",color:"#ccd5ed",cursor:"pointer"};
const activeBtn={...btn,border:"1px solid #9b5cff",background:"#241744",color:"#fff"};
const select={...btn};
const generateBtn={marginTop:20,padding:"15px 22px",border:0,borderRadius:13,background:"linear-gradient(135deg,#8b5cf6,#ec4899)",color:"#fff",fontWeight:800,cursor:"pointer"};
const download={display:"inline-block",marginTop:14,padding:"12px 16px",borderRadius:10,background:"#fff",color:"#111",textDecoration:"none",fontWeight:700};