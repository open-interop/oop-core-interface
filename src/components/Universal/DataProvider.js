import React, { useState, useEffect } from "react";
import { Error, GifSpinner } from ".";

const DataProvider = props => {
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        props
            .getData()
            .then(data => {
                setData(data);
                setLoaded(true);
            })
            .catch(err => {
                console.error(err);
                setError(err);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.renderKey]);

    if (error) {
        if (props.dataFallback) {
            return props.dataFallback;
        }

        return <Error />;
    } else if (loaded) {
        try {
            return props.renderData(data);
        } catch (e) {
            return (
                <div>
                    <Error message={String(e)} />
                </div>
            );
        }
    } else {
        return props.loadingFallback !== undefined ? (
            props.loadingFallback
        ) : (
            <GifSpinner />
        );
    }
};

export { DataProvider };
