import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminUsers() {

const navigate = useNavigate();

const [users,setUsers] = useState([]);
const [open,setOpen] = useState(false);

const [roleFilter,setRoleFilter] = useState("student");
const [departmentFilter,setDepartmentFilter] = useState("");
const [yearFilter,setYearFilter] = useState("");

/* NEW STATES FOR POPUP */
const [showSuccessPopup,setShowSuccessPopup] = useState(false);
const [generatedCredentials,setGeneratedCredentials] = useState([]);

const departments = [...new Set(
    users
        .filter(u => u.role === "student")
        .map(u => u.department)
)];

useEffect(()=>{
fetchUsers();
},[]);

const fetchUsers = async()=>{
try{
const res = await API.get("/admin/users");
setUsers(res.data);
}catch(err){
console.log("Failed to load users");
}
};

const toggleUser = async(id)=>{
try{
await API.put(`/admin/disable-user/${id}`);
fetchUsers();
}catch(err){
console.log("Failed to update user");
}
};


/* FILTER USERS */

const filteredUsers = users.filter(user=>{

if(roleFilter && user.role !== roleFilter) return false;

if(roleFilter==="student"){

if(
departmentFilter &&
user.department?.trim().toLowerCase() !== departmentFilter.trim().toLowerCase()
) return false;

if(
yearFilter &&
String(user.year) !== yearFilter
) return false;

}

return true;

});


/* CSV UPLOAD */

const handleFileUpload = async (e)=>{

const file = e.target.files[0];
if(!file) return;

const formData = new FormData();
formData.append("file",file);

try{

const res = await API.post("/admin/bulk-students",formData,{
headers:{
"Content-Type":"multipart/form-data"
}
});

/* SHOW POPUP INSTEAD OF ALERT */

setGeneratedCredentials(res.data.credentials);
setShowSuccessPopup(true);

fetchUsers();

/* reset file input */
e.target.value = "";

}catch(err){

alert("Upload failed");

}

};


/* EXPORT CSV */

const downloadCredentials = (credentials)=>{

let csv = "UserID,Password\n";

credentials.forEach(c=>{
csv += `${c.userId},${c.password}\n`;
});

const blob = new Blob([csv],{type:"text/csv"});
const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "student_credentials.csv";

document.body.appendChild(a);
a.click();
document.body.removeChild(a);

};


return (

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

<span>Admin • Users</span>

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


<div className="app-content">

<div
className="container"
style={{
background:"#f7f9fb",
minHeight:"100%"
}}
>

{/* BACK BUTTON */}

<div
onClick={()=>navigate("/admin")}
style={{
cursor:"pointer",
color:"#0f9d58",
fontWeight:"600",
marginBottom:"12px"
}}
>
← Back
</div>


{/* HEADER */}

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:"18px"
}}
>

<h2>User Management</h2>

<div style={{display:"flex",gap:"8px"}}>

<input
type="file"
accept=".csv"
onChange={handleFileUpload}
style={{display:"none"}}
id="csvUpload"
/>

<label
htmlFor="csvUpload"
style={{
padding:"6px 12px",
background:"#0f9d58",
color:"white",
borderRadius:"8px",
cursor:"pointer",
fontSize:"13px"
}}
>
Upload CSV
</label>

<button
onClick={()=>navigate("/admin/create-user")}
style={{
width:"36px",
height:"36px",
borderRadius:"10px",
border:"none",
background:"#0f9d58",
color:"white",
fontSize:"20px",
cursor:"pointer"
}}
>
+
</button>

</div>

</div>


{/* ROLE FILTER */}

<div
style={{
display:"flex",
gap:"10px",
marginBottom:"18px"
}}
>

<button
onClick={()=>setRoleFilter("student")}
style={{
padding:"8px 14px",
borderRadius:"8px",
border:"1px solid #ddd",
background:roleFilter==="student"?"#0f9d58":"white",
color:roleFilter==="student"?"white":"#333",
cursor:"pointer"
}}
>
Students
</button>

<button
onClick={()=>setRoleFilter("vendor")}
style={{
padding:"8px 14px",
borderRadius:"8px",
border:"1px solid #ddd",
background:roleFilter==="vendor"?"#0f9d58":"white",
color:roleFilter==="vendor"?"white":"#333",
cursor:"pointer"
}}
>
Vendors
</button>

<button
onClick={()=>{
setDepartmentFilter("");
setYearFilter("");
}}
style={{
padding:"8px 14px",
borderRadius:"8px",
border:"1px solid #ddd",
background:"white",
cursor:"pointer"
}}
>
Clear Filters
</button>

</div>


{/* STUDENT FILTERS */}

{roleFilter==="student" &&(

<div
style={{
display:"flex",
gap:"12px",
marginBottom:"20px"
}}
>

<select
value={departmentFilter}
onChange={(e)=>setDepartmentFilter(e.target.value)}
style={{
padding:"8px",
borderRadius:"8px",
border:"1px solid #ddd",
background:"white"
}}
>

<option value="">All Departments</option>

{departments.map((dept)=>(
<option key={dept} value={dept}>
{dept}
</option>
))}

</select>


<select
value={yearFilter}
onChange={(e)=>setYearFilter(e.target.value)}
style={{
padding:"8px",
borderRadius:"8px",
border:"1px solid #ddd",
background:"white"
}}
>

<option value="">All Years</option>
<option value="1">1st Year</option>
<option value="2">2nd Year</option>
<option value="3">3rd Year</option>

</select>

</div>

)}


{/* USERS */}

{filteredUsers.length===0 &&(
<p style={{color:"#777"}}>No users match the selected filters</p>
)}


{filteredUsers.map(user=>(

<div
key={user._id}
style={{
background:user.isActive ? "white" : "#f1f5f9",
borderRadius:"16px",
padding:"16px",
marginBottom:"12px",
boxShadow:"0 6px 18px rgba(0,0,0,0.05)",
opacity:user.isActive ? 1 : 0.7
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<div>

<div style={{fontWeight:"600"}}>
{user.name || user.vendorName || user.userId}
</div>

<div style={{fontSize:"13px",color:"#666"}}>
ID : {user.userId}
</div>

{user.role==="student" &&(
<div style={{fontSize:"13px",color:"#777"}}>
{user.department} • Year {user.year}
</div>
)}

{user.role==="vendor" &&(
<div style={{fontSize:"13px",color:"#777"}}>
Vendor ID : {user.vendorId}
</div>
)}

</div>


<div style={{textAlign:"right"}}>

<div
style={{
fontSize:"12px",
marginBottom:"6px",
fontWeight:"600",
color:user.isActive ? "#0f9d58" : "#888"
}}
>
{user.isActive ? "Active" : "Disabled"}
</div>

<button
onClick={()=>toggleUser(user._id)}
style={{
padding:"6px 12px",
borderRadius:"8px",
border:"1px solid #ddd",
background:user.isActive ? "#fff" : "#e2e8f0",
cursor:"pointer"
}}
>
{user.isActive ? "Disable" : "Enable"}
</button>

</div>

</div>

</div>

))}

</div>

</div>

</div>

</div>


{/* SUCCESS POPUP */}

{showSuccessPopup && (

<div
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.3)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:1000
}}
>

<div
style={{
background:"white",
padding:"24px",
borderRadius:"16px",
width:"260px",
textAlign:"center",
boxShadow:"0 10px 25px rgba(0,0,0,0.15)"
}}
>

<h3>Students Added Successfully 🎉</h3>

<p style={{fontSize:"13px",color:"#555"}}>
{generatedCredentials.length} students created
</p>

<button
onClick={()=>downloadCredentials(generatedCredentials)}
style={{
padding:"8px 16px",
borderRadius:"8px",
border:"none",
background:"#0f9d58",
color:"white",
cursor:"pointer",
marginTop:"10px"
}}
>
Export Credentials
</button>

<br/><br/>

<button
onClick={()=>setShowSuccessPopup(false)}
style={{
padding:"6px 12px",
borderRadius:"8px",
border:"1px solid #ddd",
background:"white",
cursor:"pointer"
}}
>
Close
</button>

</div>

</div>

)}

</div>

);

}

export default AdminUsers;