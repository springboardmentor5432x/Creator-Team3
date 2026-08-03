import React from "react";

export default function RecentPosts(){

const posts=[

{
title:"Summer Reel",
platform:"Instagram",
views:"15K",
likes:"2200"
},

{
title:"Python Tips",
platform:"YouTube",
views:"45K",
likes:"6300"
},

{
title:"Travel Vlog",
platform:"Facebook",
views:"12K",
likes:"1700"
}

];

return(

<table>

<thead>

<tr>

<th>Post</th>

<th>Platform</th>

<th>Views</th>

<th>Likes</th>

</tr>

</thead>

<tbody>

{posts.map((post,index)=>(

<tr key={index}>

<td>{post.title}</td>

<td>{post.platform}</td>

<td>{post.views}</td>

<td>{post.likes}</td>

</tr>

))}

</tbody>

</table>

);

}