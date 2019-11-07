import React from "react";

const Spinner = () => {
    return (
        <div className="loading-overlay">
            <img alt="loading-spinner" src="loading.gif" />
        </div>
    );
};

const InPlaceSpinner = () => {
    return (
        <div className="icon">
            <img alt="loading-spinner" src="loading.gif" />
        </div>
    );
};

export { Spinner, InPlaceSpinner };
