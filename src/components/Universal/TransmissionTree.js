import * as React from 'react';
import { Link } from "react-router-dom";
import { TreeView, TreeLabel, toggleIsExpanded } from 'baseui/tree-view';

import { KIND, Button } from "baseui/button";
import { ListItem, ListItemLabel } from "baseui/list";
import { Card, StyledBody } from "baseui/card";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";

import { MaxCard } from "../Universal";

const itemProps = {
    height: "scale1000",
    display: "flex",
};

const CustomLabel = (node) => {
  if (node.transmissionMade) {
    return (
      <div style={{width: '100%', paddingLeft: `${node.depth*50}px`}}>
        <MaxCard>
            <FlexGrid flexGridColumnCount={[1,1,2,3]} marginBottom="scale400" flexGridRowGap="scale1000">
                <FlexGridItem {...itemProps}>
                    <ListItem>
                        <div className="card-label">
                            <ListItemLabel description="UUID">
                                {node.messageUuid ||
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
                                {node.transmittedAt ||
                                    "No data available"}
                            </ListItemLabel>
                        </div>
                    </ListItem>
                </FlexGridItem>
                <FlexGridItem>
                </FlexGridItem>
                <FlexGridItem {...itemProps}>
                    <Button
                        kind={KIND.secondary}
                        $as={Link}
                        to={`/transmissions/${node.transmissionId}`}
                    >
                        {"View Transmission Details"}
                    </Button>
                </FlexGridItem>
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
                              No Transmission made for this tempr
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
      overrides={{
        CollapseIcon: {
          props: {
            size: (10 - props.node.depth) * 6,
          },
        },
        ExpandIcon: {
          props: {
            size: (10 - props.node.depth) * 6,
          },
        },
      }}
    />
  );
};

const TransmissionTree = props => {
  const [data, setData] = React.useState(props.initialData);
  return (
    <TreeView
      data={data}
      onToggle={node =>
        setData(prevData => toggleIsExpanded(prevData, node))
      }
      overrides={{
        TreeLabel: {
          component: CustomTreeLabel,
        },
      }}
    />
  );
}

export { TransmissionTree };