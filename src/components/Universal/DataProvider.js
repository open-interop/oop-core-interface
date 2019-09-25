import React, { useState, useEffect } from "react";
import { Error, Spinner } from ".";

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
                console.log(err);
                setError(err);
            });
    }, [props.renderKey]);

    if (error) {
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
        return <Spinner />;
    }
};

export { DataProvider };
