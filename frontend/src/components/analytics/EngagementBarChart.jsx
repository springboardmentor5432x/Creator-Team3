import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


const defaultData = [
  {
    platform: "Instagram",
    likes: 0,
    comments: 0,
    shares: 0,
  },
  {
    platform: "YouTube",
    likes: 0,
    comments: 0,
    shares: 0,
  },
  {
    platform: "Twitter",
    likes: 0,
    comments: 0,
    shares: 0,
  },
];



const formatNumber = (num) => {

  if (!num || isNaN(num)) return "0";


  if (num >= 1000000) {
    return (
      (num / 1000000)
        .toFixed(1)
        .replace(".0", "") + "M"
    );
  }


  if (num >= 1000) {
    return (
      (num / 1000)
        .toFixed(1)
        .replace(".0", "") + "K"
    );
  }


  return num;

};




function CustomTooltip({
active,
payload,
label
}) {


if(!active || !payload || !payload.length)
return null;



return (

<div
style={{
background:"#0f172a",
border:"1px solid rgba(255,255,255,0.15)",
borderRadius:"10px",
padding:"12px",
color:"#fff"
}}
>


<p
style={{
color:"#94a3b8",
marginBottom:"8px",
fontWeight:600
}}
>
{label}
</p>



{
payload.map((item)=>(

<p
key={item.name}
style={{
color:item.color,
margin:"5px 0",
display:"flex",
justifyContent:"space-between",
gap:"20px"
}}
>

<span>
{item.name}
</span>


<b>
{
item.value?.toLocaleString() || 0
}
</b>


</p>

))
}



</div>

);

}





export default function EngagementBarChart({
data=[]
}) {


const chartData =
data && data.length
?
data
:
defaultData;



return (

<div
className="
bg-slate-800/80
border
border-slate-700
rounded-xl
p-6
shadow-lg
w-full
"
>





<div
style={{
width:"100%",
height:300
}}
>


<ResponsiveContainer
width="100%"
height="100%"
>


<BarChart
data={chartData}
margin={{
top:10,
right:10,
left:0,
bottom:0
}}
>


<CartesianGrid
strokeDasharray="3 3"
stroke="rgba(255,255,255,0.05)"
vertical={false}
/>



<XAxis
dataKey="platform"
stroke="#64748b"
fontSize={12}
tickLine={false}
axisLine={false}
/>



<YAxis
stroke="#64748b"
fontSize={12}
tickLine={false}
axisLine={false}
tickFormatter={formatNumber}
/>



<Tooltip
content={<CustomTooltip />}
/>



<Legend
verticalAlign="bottom"
height={40}
/>




<Bar
name="Likes"
dataKey="likes"
fill="#ec4899"
radius={[5,5,0,0]}
/>



<Bar
name="Comments"
dataKey="comments"
fill="#06b6d4"
radius={[5,5,0,0]}
/>



<Bar
name="Shares"
dataKey="shares"
fill="#10b981"
radius={[5,5,0,0]}
/>



</BarChart>


</ResponsiveContainer>


</div>


</div>

);

}