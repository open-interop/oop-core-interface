import React, { useEffect } from "react";

const Home = props => {
    useEffect(() => {
        document.title = "Home | Open Interop";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div>This is the main dashboard</div>
        </>
    );
};

export { Home };
