import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import { useStyletron } from "baseui";
import { Spinner } from "baseui/spinner";

const GifSpinner = () => {
    return (
        <div className="loading-overlay">
            <img alt="loading-spinner" src="/loading.gif" />
        </div>
    );
};

const InPlaceGifSpinner = () => {
    const [css] = useStyletron();

    return (
        <div className={css({ margin: "0 auto" })}>
            <img alt="loading-spinner" src="/loading.gif" className={css({ display: "block", margin: "0 auto" })} />
        </div>
    );
};

const IconSpinner = () => {
    return <FontAwesomeIcon spin icon={faCircleNotch} />;
};

const BaseuiSpinner = () => {
    return <Spinner />;
};

export { BaseuiSpinner, GifSpinner, IconSpinner, InPlaceGifSpinner };
