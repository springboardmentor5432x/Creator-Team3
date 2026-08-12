import React, { useEffect, useState } from "react";

export default function TrendingContent() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/analytics/trending",
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
    fetchTrending();
  }, []);

  return (
    <div className="trending-card">
      <h3 className="section-title">🔥 Trending Content</h3>
      {posts.map((post) => (
        <div className="trend-item" key={post.title}>
          <div>
            <h4>{post.title}</h4>
            <small>{post.platform}</small>
          </div>
          <span>{post.views} Views</span>
        </div>
      ))}
    </div>
  );
}
