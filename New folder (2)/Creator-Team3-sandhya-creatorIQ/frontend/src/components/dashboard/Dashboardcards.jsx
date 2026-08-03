import React from "react";

export default function DashboardCards() {

const cards=[

{title:"Followers",value:"120K"},

{title:"Views",value:"1.5M"},

{title:"Engagement",value:"8.6%"},

{title:"Posts",value:"245"}

];

return(

<div className="cards">

{cards.map((card,index)=>(

<div key={index} className="card">

<h4>{card.title}</h4>

<h2>{card.value}</h2>

</div>

))}

</div>

);

}