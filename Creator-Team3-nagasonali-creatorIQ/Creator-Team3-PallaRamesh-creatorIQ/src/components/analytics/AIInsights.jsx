import React, { useEffect, useState } from "react";
export default function AIInsights() {

    const [insights, setInsights] = useState([]);
    useEffect(() => {

    const fetchInsights = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:8000/api/analytics/insights",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            setInsights(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error(error);

        }

    };

    fetchInsights();

}, []);

    return (

        <div className="ai-card">

            <h3 className="section-title">
    🤖 AI Insights
</h3>

            <ul>

                {insights.map((item, index) => (

                    <li key={index}>
                        {item}
                    </li>

                ))}

            </ul>

        </div>

    );

}