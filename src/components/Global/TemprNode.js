import React, { memo } from "react";
import { Handle } from "react-flow-renderer";

const TemprNode = memo(({ data }) => {
    const qRes = data.tempr.queueResponse ? 'green' : 'red';
    const qReq = data.tempr.queueRequest ? 'green' : 'red';
    const fs = data.primary ? 'large' : 'small';
    return (
        <>
            {data.tempr.temprId ? (
                <Handle
                    type="target"
                    position="top"
                  style={{ width: '8px', height: '8px', top: '-5px' }}
                    id={`Xtop-${data.tempr.id}`}
                  onConnect={(params) => console.log('handle onConnect', params)}
                />
            ) : (
              <Handle
                    type="target"
                    position="top"
                  style={{ background: 'green', width: '8px', height: '8px', top: '-5px' }}
                    id={`Ytop-${data.tempr.id}`}
                  onConnect={(params) => console.log('handle onConnect', params)}
                />
          )
            {
                <div
                    style={{
                        fontSize: fs,
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "column",
                        textAlign: "center",
                    }}
                >
              <p style={{ margin: '0' }}><strong>{data.tempr.name} - </strong><a href={`/temprs/${data.tempr.id}`}>{data.tempr.id}</a></p>
              <div style={{ fontSize: 'small', flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ margin: '4px', fontSize: 'x-small', color: qReq }}><b>Queue Response</b></p>
                  <p style={{ margin: '4px', fontSize: 'x-small', color: qRes }}><b>Queue Request</b></p>
                  <p style={{ margin: '2px' }}>{`${data.tempr.endpointType}`}</p>
                    </div>
                </div>
            }

            <Handle
                type="source"
                position="bottom"
          style={{ background: 'green', width: '8px', height: '8px', bottom: '-5px' }}
                id={`bottom-${data.tempr.id}`}
            />
        </>
    );
});

export { TemprNode };
