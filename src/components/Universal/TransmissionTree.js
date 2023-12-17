import * as React from "react";
import { Link } from "react-router-dom";
import {
    TreeView,
    TreeLabel,
    toggleIsExpanded,
} from "baseui/tree-view";

import { KIND, Button } from "baseui/button";
import { ListItem, ListItemLabel } from "baseui/list";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import { DatetimeTooltip, MaxCard } from "../Universal";

const TransmissionTree = props => {
    var emptyCounter = 0;
    const cleanData = props.initialData.map((node) => {
        if (!node) {
            emptyCounter++;
            return {id: emptyCounter, deleted:true}
        } else {
            return node
        }
    });

    const [data, setData] = React.useState(cleanData);

    const itemProps = {
        height: "scale1000",
        display: "flex",
    };

    const expandNode = (nodeId) => {
        var newData = toggleIsExpanded(data, nodeId);
        setData(newData);
    }

    const CustomLabel = (node) => {
        if (node.transmissionMade) {
            return (
                <div style={{width: '100%'}}>
                    <MaxCard>
                        <FlexGrid flexGridColumnCount={[1,1,2,3]} marginBottom="scale400" flexGridRowGap="scale1000">
                            <FlexGridItem {...itemProps}>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="UUID">
                                            {node.transmissionUuid ||
                                                "No data available"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                            </FlexGridItem>
                            <FlexGridItem {...itemProps}>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="Status">
                                            {node.status ||
                                      "Failed"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                            </FlexGridItem>
                            <FlexGridItem {...itemProps}>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="Tempr">
                                            {node.name ||
                                      "No data available"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                            </FlexGridItem>
                            <FlexGridItem {...itemProps}>
                                <ListItem>
                                    <div className="card-label">
                                        <ListItemLabel description="Transmitted At">
                                            {node.transmittedAt ?
                                                <DatetimeTooltip
                                                    time={node.transmittedAt}
                                                /> :
                                                "No data available"}
                                        </ListItemLabel>
                                    </div>
                                </ListItem>
                            </FlexGridItem>
                            <FlexGridItem {...itemProps}>
                                <Button
                                    kind={KIND.secondary}
                                    $as={Link}
                                    to={{pathname: `/transmissions/${node.transmissionId}`, state: { from: `/messages/${node.messageId}` }}}
                                >
                                    {"View Transmission Details"}
                                </Button>
                            </FlexGridItem>
                            {node.children && node.children.length && (
                                <FlexGridItem>
                                    <Button
                                        kind={KIND.minimal}
                                        onClick={() => {expandNode(node)}}
                                            overrides={{
                                                BaseButton: {
                                                    style: ({ $theme }) => {
                                                        return {
                                                        float: "right",
                                                    };
                                                },
                                            },
                                        }}
                                    >
                                    {node.isExpanded 
                                        ? <FontAwesomeIcon icon={faChevronUp}/>
                                        : <FontAwesomeIcon icon={faChevronDown}/>
                                        }
                                    </Button>
                                </FlexGridItem>)}
                        </FlexGrid>
                    </MaxCard>
                </div>
            );
        } else {
            return (
                <MaxCard>
                    <FlexGrid flexGridColumnCount={[1,1,2]} marginBottom="scale200">
                        <FlexGridItem {... {backgroundColor: 'mono300'}}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Tempr">
                                        {node.name ||
                                    "No data available"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                        <FlexGridItem {... {backgroundColor: 'mono300'}}>
                            <ListItem>
                                <div className="card-label">
                                    <ListItemLabel description="Status">
                                        {node.deleted ? "Origin/Tempr has been deleted"  
                                            : "No Transmission made for this tempr / Tempr no longer associated"}
                                    </ListItemLabel>
                                </div>
                            </ListItem>
                        </FlexGridItem>
                    </FlexGrid>
                </MaxCard>
            );
        }
    };

    const CustomTreeLabel = props => {
        return (
            <TreeLabel
                {...props}
                label={CustomLabel}
            />
        );
    };

    return (
        <TreeView
            data={data}
            overrides={{
                TreeLabel: {
                    component: CustomTreeLabel,
                },
                IconContainer: {
                    style: {
                        display: 'none',
                    },
                },
                LeafIconContainer: {
                    style: {
                        display: 'none',
                    },
                },
            }}
        />
    );
};

export { TransmissionTree };
