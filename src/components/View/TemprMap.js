import React, { useState } from "react";
import { Redirect  } from 'react-router';

import ReactFlow, {
    ReactFlowProvider,
    removeElements,
    isNode,
    Controls,
    MiniMap,
    getBezierPath,
    getMarkerEnd,
} from "react-flow-renderer";

import { TemprSidebar, TemprNode } from "../Global";
import { DataProvider, Page, InPlaceGifSpinner } from "../Universal";

import OopCore from "../../OopCore";
import { useWindowDimensions } from "../../Utilities";

import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (elements) => {
  dagreGraph.setGraph({ rankdir: 'TB' });
  elements.forEach((el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: 250, height: 80 });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });
  dagre.layout(dagreGraph);
  return elements.map((el) => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);
      el.targetPosition = 'top';
      el.sourcePosition = 'bottom';
      // unfortunately we need this little hack to pass a slighltiy different position
      // in order to notify react flow about the change
      el.position = {
        x: nodeWithPosition.x + Math.random() / 1000,
        y: nodeWithPosition.y,
      };
    }
    return el;
  });
};

const ConnectionLine = ({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    connectionLineType,
    connectionLineStyle,
}) => {
    return (
      <g>
        <path
          fill="none"
          stroke="#222"
          strokeWidth={1.5}
          className="animated"
          d={`M${sourceX},${sourceY} C ${sourceX} ${targetY} ${sourceX} ${targetY} ${targetX},${targetY}`}
        />
        <circle cx={targetX} cy={targetY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
      </g>
    );
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  arrowHeadType,
  markerEndId,
}) => {
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      <circle 
        href={`#${id}`}
        style={{ cursor: 'pointer' }}
        onClick={() => data.onClick(id, data.els)} 
        cx={(sourceX+targetX) / 2} 
        cy={(sourceY+targetY) / 2} 
        r="6"
        fill="none"
      />
      <line
          strokeWidth="1"
          stroke="red"
          style={{ cursor: 'pointer' }}
          onClick={() => data.onClick(id, data.els)} 
          x1={((sourceX+targetX) / 2) - 6}
          x2={((sourceX+targetX) / 2) + 6}
          y1={((sourceY+targetY) / 2) - 6}
          y2={((sourceY+targetY) / 2) + 6}
       />
      <line
          strokeWidth="1"
          stroke="red"
          style={{ cursor: 'pointer' }}
          onClick={() => data.onClick(id, data.els)} 
          x1={((sourceX+targetX) / 2) + 6}
          x2={((sourceX+targetX) / 2) - 6}
          y1={((sourceY+targetY) / 2) - 6}
          y2={((sourceY+targetY) / 2) + 6}
       />
    </>
  );
}

const TemprMap = props => {
    const [noMap, setNoMap] = useState(false);

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const temprOriginPath = "/temprs/" + props.match.params.temprId;
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [elements, setElements] = useState([]);
    const [unusedTemprs, setUnusedTemprs] = useState([]);

    const { height, width } = useWindowDimensions();
    const noEdit = width < 1100 || height < 500;

    const nodeTypes = {
      temprNode: TemprNode,
    };

    const edgeTypes = {
      custom: CustomEdge,
    };

    async function onConnect(params) {
        if (params.source !== params.target && 
                params.targetHandle[0] === 'Y' && 
                    params.sourceHandle.split("-")[0] === 'bottom') {
            const newT = await OopCore.updateTempr(params.target, {temprId: params.source});
            if (newT.temprId === parseInt(params.source)) {
                refresh();
            }
        }
    };
    
    const onElementsRemove = elementsToRemove => {
        setElements(els => removeElements(elementsToRemove, els));
    };

    const onLoad = _reactFlowInstance => {
        setReactFlowInstance(_reactFlowInstance);
    };

    const onDragOver = event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    async function onDrop(event) {
        event.preventDefault();

        const id = event.dataTransfer.getData("application/reactflow");
        const position = reactFlowInstance.project({
            x: event.clientX - 175,
            y: event.clientY - 225,
        });

        setLoading(true);

        const tempr = await OopCore.getTempr(id);

        if (tempr.id) {
            const newNode = formatNode(tempr, position);
            var newElements = elements.concat(newNode);
            const layoutedEls = getLayoutedElements(newElements);

            setElements(layoutedEls);

            var remainingTemprs = unusedTemprs.filter(t => t.id !== id);

            setUnusedTemprs(remainingTemprs);
        }

        setLoading(false);
    };

    async function deletePath(edgeId, els) {
        var target = parseInt(edgeId.split("-")[1]);

        const newT = await OopCore.updateTempr(target, {temprId: null});
        if (newT.temprId === null) {
            refresh();
        }
    };

    async function refresh() {
        setLoading(true);
        const response = await getData(props.match.params.temprId);
        if (response) {
            const layoutedEls = getLayoutedElements(response.nodes);
            setElements(layoutedEls);
            setUnusedTemprs(response.remainingTemprs);
            setLoading(false);
            return response;
        } else {
            setNoMap(true);
            return false;
        }
    }

    const formatNode = (temprObj, pos) => {
        const primary = temprObj.id === parseInt(props.match.params.temprId);
        const position = pos || { x: 200, y: 50 }
        const border = primary ? '2px solid #177692' : '1px solid #777'
        return (
            {
                id: `${temprObj.id}`,
                type: 'temprNode',
                data: { tempr: temprObj, primary: primary },
                style: { border: border, borderRadius: '10px', padding: 10, backgroundColor: 'white' },
                position: position,
            }
        );
    };

    const formatPath = (sourceId, targetId) => {
        const type = noEdit ? 'bezier' : 'custom';
              return (
        {
          id: `${sourceId}-${targetId}`,
          source: `${sourceId}`,
          target: `${targetId}`,
          style: { stroke: '#777', strokeWidth: 1.5 },
          type: type,
          data: { onClick: deletePath }
        }
      );
    };

    async function getData(temprId) {
        var nodeData = [];
        var pathData = new Set();
        var tempr = await OopCore.getTempr(temprId);
        var allTemprs = await OopCore.getTemprs({
            filter: { deviceGroupId: tempr.deviceGroupId},
        });
        var children = await OopCore.getTemprs({
            filter: { temprId: temprId},
        });
        var childrenData = children.data;
        const titleNode = tempr.name;
        while (tempr) {
            if (!nodeData[tempr.id]) {
                nodeData[tempr.id] = formatNode(tempr);
            }
            if (tempr.temprId) {
                pathData.add(formatPath(tempr.temprId, tempr.id));
                if (nodeData[tempr.temprId]){
                    tempr = null;
                } else {
                    tempr = await OopCore.getTempr(tempr.temprId);
                    childrenData.push(tempr);
                }
            } else {
                tempr = null;
            }
        }
        while (childrenData.length > 0) {
            const c = childrenData.shift();
            if (!nodeData[c.id]) {
                nodeData[c.id] = formatNode(c);
                pathData.add(formatPath(c.temprId, c.id));
            }
            var new_children = await OopCore.getTemprs({
                filter: { temprId: c.id },
            });
            var filtered_children = new_children.data.filter(c => !nodeData[c.id]);
            childrenData.push(...filtered_children);
        }
        const pathArray = [...pathData];
        var filteredNodes = nodeData.filter(Boolean);
        var remainingTemprs = allTemprs.data.filter(t => !nodeData[t.id]);
        filteredNodes.push(...pathArray);
        return {title: titleNode, nodes: filteredNodes, remainingTemprs: remainingTemprs};
    };

    return (
        <DataProvider
            getData={() => {
                return getData(props.match.params.temprId).then(response => {
                    if (response) {
                        const layoutedEls = getLayoutedElements(response.nodes);
                        setElements(layoutedEls);
                        setTitle(response.title);
                        setUnusedTemprs(response.remainingTemprs);
                        return response;
                    } else {
                        setNoMap(true);
                        return false;
                    }
                });
            }}
            renderData={() =>
                !noMap ? (
                    <Page
                        title={"Tempr Map | Settings | Open Interop"}
                        heading={"Tempr: " + title + "'s map"}
                        backlink={props.location.prevPath || temprOriginPath}
                    >
                        <div className="dndflow">
                            <ReactFlowProvider>
                                <div className="reactflow-wrapper">
                                    {loading ? <InPlaceGifSpinner /> : (
                                        <ReactFlow
                                            elements={elements}
                                            onConnect={onConnect}
                                            onElementsRemove={onElementsRemove}
                                            onLoad={onLoad}
                                            onDrop={onDrop}
                                            onDragOver={onDragOver}
                                            nodeTypes={nodeTypes}       
                                            edgeTypes={edgeTypes}
                                            connectionLineComponent={ConnectionLine}
                                            nodesConnectable={!noEdit}
                                        >   
                                            <Controls />
                                            {!noEdit &&
                                                <MiniMap 
                                                    nodeStrokeColor={(n) => {
                                                        if (n.data.primary) return '#177692';
                                                        return 'black';
                                                    }}
                                                />
                                            }
                                        </ReactFlow>
                                    )}
                                </div>
                                {!noEdit && <TemprSidebar temprs={unusedTemprs}/>}
                            </ReactFlowProvider>
                        </div>
                    </Page>
                ) : (
                    <Redirect to={`/temprs/${props.match.params.temprId}`} />
                )
            }
        />
    );
};

export default TemprMap;
