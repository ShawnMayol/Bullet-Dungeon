import React from "react";

const DamageOverlay = () => {
    return (
        <div
            className="absolute fixed inset-0 pointer-events-none"
            style={{
                backgroundColor: "rgba(255, 0, 0, 1)",
                animation: "fadeOut 1s forwards",
            }}
        ></div>
    );
};

export default DamageOverlay;