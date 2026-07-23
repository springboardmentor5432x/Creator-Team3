import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


const defaultData = [
  {
    month:"Jan",
    views:0,
    likes:0
  },
  {
    month:"Feb",
    views:0,
    likes:0
  },
  {
    month:"Mar",
    views:0,
    likes:0
  }
];



const formatNumber = (num)=>{

  if(!num || isNaN(num))
    return "0";


  if(num >= 1000000){
    return (
      (num/1000000)
      .toFixed(1)
      .replace(".0","")
      +"M"
    );
  }


  if(num >= 1000){
    return (
      (num/1000)
      .toFixed(1)
      .replace(".0","")
      +"K"
    );
  }


  return num;

};





function CustomTooltip({
active,
payload,
label
}){


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
fontWeight:600,
marginBottom:"8px"
}}
>
{label}
</p>


{
payload.map((item)=>(

<p
key={item.name}
style={{
display:"flex",
justifyContent:"space-between",
gap:"20px",
color:item.color,
margin:"5px 0"
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






export default function ViewsChart({
data=[]
}){


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
height:300,
width:"100%"
}}
>


<ResponsiveContainer
width="100%"
height="100%"
>


<LineChart
data={chartData}
margin={{
top:10,
right:20,
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
dataKey="month"
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
content={<CustomTooltip/>}
/>




<Legend/>





<Line
type="monotone"
name="Views"
dataKey="views"
stroke="#8b5cf6"
strokeWidth={3}
dot={{
r:3
}}
activeDot={{
r:6
}}
/>





<Line
type="monotone"
name="Likes"
dataKey="likes"
stroke="#ec4899"
strokeWidth={2}
dot={{
r:3
}}
activeDot={{
r:5
}}
/>



</LineChart>


</ResponsiveContainer>


</div>


</div>


);

}