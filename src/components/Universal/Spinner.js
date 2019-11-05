import React from "react";

const Spinner = () => {
    return (
        <div className="loading-overlay">
            <img alt="loading-spinner" src="loading.gif" />
        </div>
    );
};

export { Spinner };
