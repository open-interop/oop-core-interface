import React, { useState, useEffect } from "react";

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
        return <div>error </div>;
    } else if (loaded) {
        try {
            return props.renderData(data);
        } catch (e) {
            return (
                <div>
                    {String(e)}
                    <div>error</div>
                </div>
            );
        }
    } else {
        return <div> loading</div>;
    }
};

export { DataProvider };
