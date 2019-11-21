import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "baseui/spinner";

const GifSpinner = () => {
    return (
        <div className="loading-overlay">
            <img alt="loading-spinner" src="loading.gif" />
        </div>
    );
};

const IconSpinner = () => {
    return <FontAwesomeIcon spin icon={faCircleNotch} />;
};

const BaseuiSpinner = () => {
    return <Spinner className="poop" />;
};

export { BaseuiSpinner, GifSpinner, IconSpinner };
