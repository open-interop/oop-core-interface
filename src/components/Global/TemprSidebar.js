import React from "react";

const TemprSidebar = props => {
    const onDragStart = (event, id) => {
        event.dataTransfer.setData("application/reactflow", id);
        event.dataTransfer.effectAllowed = "move";
    };

    const temprNodes = props.temprs.map(tempr => {
        return (
            <div
                className="dndnode"
                key={tempr.id}
                onDragStart={event => onDragStart(event, tempr.id)}
                draggable
            >
                {tempr.name}
            </div>
        );
    });

    return (
        <>
            <aside style={{ overflowY: "scroll" }}>
                <div>{temprNodes}</div>
            </aside>
        </>
    );
};

export { TemprSidebar };
