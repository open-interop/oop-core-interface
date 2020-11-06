import React, { useState, useEffect } from "react";

import { useStyletron } from "baseui";
import { StyledTitle } from "baseui/card";

import { ListItem, ListItemLabel } from "baseui/list";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";

import JSONPretty from "react-json-pretty";

import { PageNotFound } from "../View";
import { DataProvider, Page, DatetimeTooltip, MaxCard } from "../Universal";
import OopCore from "../../OopCore";

import { InPlaceGifSpinner, Table, ExpandModal } from "../Universal";

const formatValue = (val, field) => {
    if (typeof val != 'string') {
        val = JSON.stringify(val);
    }

    if (val.length > 40) {
        return <ExpandModal content={val} title={field}/> 
    }

    return val;
}

const CenteredTitle = props => {
    const [css, theme] = useStyletron();

    return <StyledTitle className={css({ textAlign: "center", marginBottom: theme.sizing.scale500 })} >
        {props.children}
    </StyledTitle>
};

const scriptedFields = [
    'exampleTransmission',
    'script',
    'authenticationHeaders',
    'authenticationQuery',
];

const itemProps = {
    height: "scale1000",
    display: "flex",
};

const AuditLog = props => {
    const [auditLog, setAuditLog] = useState({});
    const [user, setUser] = useState({});
    const [notFound, setNotFound] = useState(null);
    const [noUser, setNoUser] = useState(null);

    const previousPath = (props.location.state && props.location.state.from) ? props.location.state.from
        : props.location.pathname.replace(props.params.match.auditLogId,'');
    
    const getData = (pagination) => {
        return OopCore.getAuditLog(
            props.match.params.auditLogId
        ).then(auditLog => {
            setAuditLog(auditLog);
            OopCore.getUser(
                auditLog.userId
            ).then(user => {
                setUser(user);
                return auditLog;
            }).catch(e => {
                setNoUser(true);
            });
        }).catch(e => {
            setNotFound(true);
        });
    };

    const getBody = () => {
        var updateBool = auditLog.action === 'update' ? true : false;
        var changes = auditLog.auditedChanges;

        const title = updateBool 
                        ? <CenteredTitle>Update {auditLog.auditableType}</CenteredTitle>
                        : <CenteredTitle>Create {auditLog.auditableType}</CenteredTitle>;

        const changesArray = [];
        for (const property in changes) {
            if (updateBool) {
                changesArray.push({
                    desc: property, 
                    initial: formatValue(changes[property][0], property),
                    current: formatValue(changes[property][1], property)
                });
            } else {
                changesArray.push({
                    desc: property,
                    current: formatValue(changes[property], property),
                });
            }
        }

        if (changesArray.length < 1) {
            return <InPlaceGifSpinner />
        }

        return (
            <>
                <FlexGrid
                    flexGridColumnCount={[1,1,2]}
                    flexGridColumnGap="scale400"
                    flexGridRowGap="scale1000"
                    marginBottom="scale1000"
                >
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description="Audit Log ID">
                                    {auditLog.id ||
                                        "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description="Version">
                                    {auditLog.version ||
                                        "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description="User ID">
                                    {user.id ||
                                        "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description="User Email">
                                    {user.email ||
                                        "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description="User Type">
                                    {auditLog.userType ||
                                        "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description="Created At">
                                    {auditLog.createdAt 
                                        ? <DatetimeTooltip time={auditLog.createdAt}></DatetimeTooltip>
                                        : "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                </FlexGrid>
                <MaxCard title={title}>
                    {updateBool 
                        ? 
                            <Table
                                data={changesArray}
                                mapFunction={(
                                    columnName,
                                    content,
                                ) => {
                                    return content;
                                }}
                                columns={[
                                    {
                                        id:
                                            "desc",
                                        name:
                                            "Field",
                                        width:
                                            "200px",
                                    },
                                    {
                                        id: "initial",
                                        name: "Old Value",
                                    },
                                    {
                                        id: "current",
                                        name:
                                            "New Value",
                                    },
                                ]}
                            />
                        :
                            <Table
                                data={changesArray}
                                mapFunction={(
                                    columnName,
                                    content,
                                ) => {
                                    return content;
                                }}
                                columns={[
                                    {
                                        id:
                                            "desc",
                                        name:
                                            "Field",
                                        width:
                                            "200px",
                                    },
                                    {
                                        id: "current",
                                        name:
                                            "New Value",
                                    },
                                ]}
                            />
                    }
                </MaxCard>
            </>
        );
    };

    if (notFound) {
        return <PageNotFound item="Audit Log"/>
    }

    return (
        <Page
            title="Audit Log | Open Interop"
            heading="Audit Log"
            backlink={previousPath}
        >
            <DataProvider
                getData={getData}
                renderData={getBody}
            />
        </Page>
    );
};

export { AuditLog };
