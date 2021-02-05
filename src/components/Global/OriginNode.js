import React, { memo } from "react";
import { Handle } from "react-flow-renderer";

const OriginNode = memo(({ data }) => {
    return (
        <>
            <Handle
                type="target"
                position={data.deviceGroupId ? "left" : "right"}
              style={{ width: '8px', height: '8px', top: '20px' }}
                id={`${data.deviceGroupId ? 'D' : 'S'}-${data.id}`}
              onConnect={(params) => console.log('handle onConnect', params)}
            />
            <p style={{ margin: '0' }}>
              <strong>{data.name}</strong>
            </p>
        </>
    );
});

export { OriginNode };
