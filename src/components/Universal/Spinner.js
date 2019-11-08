import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Spinner = () => {
    return (
        <div className="loading-overlay">
            <img alt="loading-spinner" src="loading.gif" />
        </div>
    );
};

const InPlaceSpinner = () => {
    return (
        <div className="fa-spin">
            <FontAwesomeIcon icon={faSpinner} />
        </div>
    );
};

export { Spinner, InPlaceSpinner };
