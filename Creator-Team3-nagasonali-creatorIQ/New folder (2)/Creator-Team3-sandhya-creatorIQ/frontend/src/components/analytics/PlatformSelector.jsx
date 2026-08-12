import React from "react";

export default function PlatformSelector({
  selectedPlatform,
  onSelectPlatform,
}) {
  const platforms = [
    {
      name: "All",
      icon: "🌐",
    },
    {
      name: "YouTube",
      icon: "▶️",
    },
    {
      name: "Instagram",
      icon: "📸",
    },
    {
      name: "LinkedIn",
      icon: "💼",
    },
    {
      name: "Twitch",
      icon: "🎮",
    },
  ];

  return (
    <div className="platform-selector">

      {platforms.map((platform) => (

        <button
          key={platform.name}
          type="button"
          className={
            selectedPlatform === platform.name
              ? "platform-button active"
              : "platform-button"
          }
          onClick={() =>
            onSelectPlatform(platform.name)
          }
        >

          <span>
            {platform.icon}
          </span>

          <span>
            {platform.name}
          </span>

        </button>

      ))}

    </div>
  );
}