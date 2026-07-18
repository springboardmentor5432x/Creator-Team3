import React, { useEffect, useState } from "react";
export default function TopContentTable() {

    const [posts, setPosts] = useState([]);
    useEffect(() => {

    const fetchTopContent = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/api/analytics/top-content",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setPosts(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error(error);

        }

    };

    fetchTopContent();

}, []);

    return (

        <div className="top-content-table">

            <h3 className="section-title">
    📊 Top Performing Content
</h3>

            <table>

                <thead>

                    <tr>
                        <th>#</th>
                        <th>Content</th>
                        <th>Platform</th>
                        <th>Views</th>
                        <th>Engagement</th>
                    </tr>

                </thead>

                <tbody>

                    {posts.map((post,index)=>(

                        <tr key={index}>

                            <td>{index+1}</td>
                            <td>{post.title}</td>
                            <td>{post.platform}</td>
                            <td>{post.views}</td>
                            <td>{post.engagement}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}