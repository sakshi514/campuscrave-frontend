import { useState, useEffect } from "react"; // NEW
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion"; // NEW

function AdminCreateUser(){

const navigate = useNavigate();

const [open,setOpen] = useState(false);

const [role,setRole] = useState("student");

const [name,setName] = useState("");
const [userId,setUserId] = useState("");
const [vendorName,setVendorName] = useState("");

const [department,setDepartment] = useState("");
const [customDept, setCustomDept] = useState("");
const [year,setYear] = useState("");

const [message,setMessage] = useState("");

// ✅ NEW: users state
const [users, setUsers] = useState([]);

// ✅ NEW: fetch users
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log("Error fetching users");
    }
  };
  fetchUsers();
}, []);

// ✅ NEW: dynamic departments (same logic as AdminUsers)
const departments = [...new Set(
  users
    .filter(u => u.role === "student")
    .map(u => u.department)
    .filter(Boolean)
)];

const generatePassword = ()=>{
return "CC"+Math.floor(1000 + Math.random()*9000);
};

const handleCreate = async(e)=>{

e.preventDefault();

const password = generatePassword();

try{

const payload = {
userId,
password,
role
};

if(role==="student"){
payload.name = name;
payload.department = department === "Other" ? customDept : department;
payload.year = year;
}

if(role==="vendor"){
payload.vendorName = vendorName;
payload.vendorId = userId;
}

await API.post("/admin/create-user",payload);

setMessage(`User created successfully. Password: ${password}`);

setName("");
setUserId("");
setVendorName("");
setDepartment("");
setYear("");

}catch(err){

setMessage("User creation failed");

}

};

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

<span>Create User</span>

<span
style={{cursor:"pointer",fontSize:"18px"}}
onClick={()=>navigate("/admin")}
>
🏠
</span>

</div>


{/* MAIN */}

<div style={{display:"flex",flex:1,overflow:"hidden"}}>

<Sidebar
title="CampusCrave"
isOpen={open}
setOpen={setOpen}
items={[
{label:"Dashboard",path:"/admin"},
{label:"Users",path:"/admin/users"},
{label:"Create User",path:"/admin/create-user"},
{label:"Analytics",path:"/admin/analytics"}
]}
/>


{/* ✅ NEW: Animated container */}
<motion.div
className="app-content"
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
>

<div className="container" style={{background:"#f7f9fb"}}>

<div
onClick={()=>navigate("/admin/users")}
style={{
cursor:"pointer",
color:"#0f9d58",
fontWeight:"600",
marginBottom:"14px"
}}
>
← Back
</div>


<h2 style={{marginBottom:"20px"}}>Create New User</h2>


{/* ROLE SELECT */}

<div
style={{
display:"flex",
gap:"10px",
marginBottom:"20px"
}}
>

<button
onClick={()=>setRole("student")}
style={{
padding:"8px 14px",
borderRadius:"8px",
border:"1px solid #ddd",
background:role==="student"?"#0f9d58":"white",
color:role==="student"?"white":"#333",
cursor:"pointer"
}}
>
Student
</button>

<button
onClick={()=>setRole("vendor")}
style={{
padding:"8px 14px",
borderRadius:"8px",
border:"1px solid #ddd",
background:role==="vendor"?"#0f9d58":"white",
color:role==="vendor"?"white":"#333",
cursor:"pointer"
}}
>
Vendor
</button>

</div>


<form onSubmit={handleCreate}>

{/* STUDENT FORM */}

{role==="student" &&(

<>

<input
className="login-input"
placeholder="Student Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

<div style={{height:"10px"}}/>

<input
className="login-input"
placeholder="Register Number"
value={userId}
onChange={(e)=>setUserId(e.target.value)}
required
/>

<div style={{height:"10px"}}/>

{/* ✅ FIXED DROPDOWN */}
<select
className="login-input"
value={department}
onChange={(e)=>setDepartment(e.target.value)}
required
>

<option value="">Select Department</option>

{departments.map(dept=>(
<option key={dept} value={dept}>{dept}</option>
))}

<option value="Other">Other</option>

</select>

{department === "Other" && (
<>
<div style={{height:"10px"}}/>
<input
className="login-input"
placeholder="Enter new department"
value={customDept}
onChange={(e)=>setCustomDept(e.target.value)}
required
/>
</>
)}

<div style={{height:"10px"}}/>

<select
className="login-input"
value={year}
onChange={(e)=>setYear(e.target.value)}
required
>

<option value="">Select Year</option>
<option value="1">1st Year</option>
<option value="2">2nd Year</option>
<option value="3">3rd Year</option>

</select>

</>

)}


{/* VENDOR FORM */}

{role==="vendor" &&(

<>

<input
className="login-input"
placeholder="Vendor Name"
value={vendorName}
onChange={(e)=>setVendorName(e.target.value)}
required
/>

<div style={{height:"10px"}}/>

<input
className="login-input"
placeholder="Vendor ID"
value={userId}
onChange={(e)=>setUserId(e.target.value)}
required
/>

</>

)}

<div style={{height:"20px"}}/>

<button className="login-btn">
Create User
</button>

</form>


{message &&(

<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
style={{
marginTop:"15px",
background:"#e8f5e9",
padding:"10px",
borderRadius:"8px",
fontSize:"13px"
}}
>
{message}
</motion.div>

)}

</div>

</motion.div>

</div>

</div>

</div>

);

}

export default AdminCreateUser;