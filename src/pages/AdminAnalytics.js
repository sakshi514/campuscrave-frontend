import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function AdminAnalytics() {

const navigate = useNavigate();

const [open,setOpen] = useState(false);
const [data,setData] = useState(null);

useEffect(()=>{

const fetchAnalytics = async()=>{

try{

const res = await API.get("/admin/analytics");
setData(res.data);

}catch(err){

console.log("Analytics load failed");

}

};

fetchAnalytics();

},[]);

return(

<div className="app-wrapper">

<div className="app-container">

{/* TOP BAR */}

<div
style={{
height:"55px",
background:"linear-gradient(90deg,#0f9d58,#128c7e)",
color:"white",
display:"flex",
alignItems:"center",
padding:"0 18px",
fontWeight:"600",
justifyContent:"space-between",
flexShrink:0
}}
>

<span
style={{fontSize:"22px",cursor:"pointer"}}
onClick={()=>setOpen(!open)}
>
☰
</span>

<span>Admin • Analytics</span>

<span
style={{cursor:"pointer",fontSize:"18px"}}
onClick={()=>navigate("/admin")}
>
🏠
</span>

</div>


{/* MAIN AREA */}

<div style={{display:"flex",flex:1,overflow:"hidden"}}>

<Sidebar
title="CampusCrave Admin"
isOpen={open}
setOpen={setOpen}
items={[
{label:"Dashboard",path:"/admin"},
{label:"Users",path:"/admin/users"},
{label:"Vendors",path:"/admin/vendors"},
{label:"Orders",path:"/admin/orders"},
{label:"Analytics",path:"/admin/analytics"}
]}
/>


{/* CONTENT AREA */}

<div
className="app-content"
style={{
overflowY:"auto"
}}
>

<div
className="container"
style={{
background:"#f7f9fb",
minHeight:"100%",
paddingBottom:"40px"
}}
>

<h2 style={{marginBottom:"22px"}}>
Analytics Overview
</h2>


{/* LOADING */}

{!data && (

<p style={{color:"#777"}}>Loading analytics...</p>

)}


{data && (

<>

{/* STATS */}

<div
style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"16px",
marginBottom:"28px"
}}
>

<div
style={{
background:"white",
borderRadius:"16px",
padding:"18px",
boxShadow:"0 6px 18px rgba(0,0,0,0.06)"
}}
>

<div style={{fontSize:"12px",color:"#777"}}>
Total Orders
</div>

<div
style={{
fontSize:"28px",
fontWeight:"700",
color:"#0f9d58"
}}
>
{data.totalOrders}
</div>

</div>


<div
style={{
background:"white",
borderRadius:"16px",
padding:"18px",
boxShadow:"0 6px 18px rgba(0,0,0,0.06)"
}}
>

<div style={{fontSize:"12px",color:"#777"}}>
Orders Today
</div>

<div
style={{
fontSize:"28px",
fontWeight:"700",
color:"#0f9d58"
}}
>
{data.todayOrders}
</div>

</div>

</div>


{/* VENDOR PERFORMANCE */}

<h3 style={{marginBottom:"14px"}}>
Vendor Performance
</h3>

<div
style={{
background:"white",
borderRadius:"16px",
padding:"16px",
marginBottom:"26px",
boxShadow:"0 6px 18px rgba(0,0,0,0.05)"
}}
>

{Object.entries(data.vendorStats).map(([vendor,count])=>{

const max = Math.max(...Object.values(data.vendorStats));
const width = (count/max)*100;

return(

<div
key={vendor}
style={{marginBottom:"14px"}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
fontSize:"13px",
marginBottom:"5px"
}}
>

<span>{vendor}</span>
<span>{count}</span>

</div>

<div
style={{
height:"8px",
background:"#eee",
borderRadius:"6px"
}}
>

<div
style={{
width:`${width}%`,
height:"8px",
background:"#0f9d58",
borderRadius:"6px",
transition:"width 0.5s"
}}
></div>

</div>

</div>

);

})}

</div>


{/* TOP ITEMS */}

<h3 style={{marginBottom:"10px"}}>
Top Selling Items
</h3>

<div
style={{
background:"white",
borderRadius:"16px",
padding:"16px",
boxShadow:"0 6px 18px rgba(0,0,0,0.05)"
}}
>

{data.topItems.map(([item,count])=>(

<div
key={item}
style={{
display:"flex",
justifyContent:"space-between",
padding:"10px 0",
borderBottom:"1px solid #eee"
}}
>

<span>{item}</span>
<span style={{color:"#0f9d58",fontWeight:"600"}}>
{count} sold
</span>

</div>

))}

</div>

</>

)}

</div>

</div>

</div>

</div>

</div>

);

}

export default AdminAnalytics;