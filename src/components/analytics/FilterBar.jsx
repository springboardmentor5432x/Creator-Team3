import React from "react";

export default function FilterBar({
    selectedPlatform,
    setSelectedPlatform
}) {

    const platforms = [
        "All",
        "YouTube",
        "Instagram",
        "LinkedIn",
        "Twitch"
    ];

    return (

        <div className="filter-bar">

            <div className="filter-group">

                {platforms.map(platform => (

                    <button
                        key={platform}
                        className={`filter-btn ${
                            selectedPlatform === platform ? "active" : ""
                        }`}
                        onClick={() => setSelectedPlatform(platform)}
                    >
                        {platform}
                    </button>

                ))}

            </div>

        </div>

    );
}