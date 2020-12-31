import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button, KIND } from "baseui/button";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Card } from "baseui/card";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit,
    faChevronCircleDown,
    faListUl
} from "@fortawesome/free-solid-svg-icons";
import { Page, MaxCard, InPlaceGifSpinner, DatetimeTooltip } from "../Universal";
import { ListItem, ListItemLabel } from "baseui/list";
import OopCore from "../../OopCore";
import { Grid, Cell, BEHAVIOR } from "baseui/layout-grid";

const Waiting = props => {
    return (
        <MaxCard title={props.title}>
            <InPlaceGifSpinner />
        </MaxCard>
    );
};

const UserDetails = props => {
    const { user } = props;

    if (!(user && user.id)) {
        return <Waiting title="Details" />;
    }

    const formatDate = d => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
        const parts = d.split("-");
        return `${parts[2]} ${months[parseInt(parts[1])-1]} ${parts[0]}`
    }

    return (
        <MaxCard title="Details">
            <FlexGrid
                flexGridColumnCount={[1,1,2,3]}
                flexGridColumnGap="scale200"
                flexGridRowGap="scale200"
            >
                <FlexGridItem {...{display: 'flex'}}>
                    <ListItem>
                        <div className="card-label">
                            <ListItemLabel description="Full Name">
                                {user.firstName && user.lastName
                                    ? user.firstName + " " + user.lastName
                                    : "Not available"
                                }
                            </ListItemLabel>
                        </div>
                    </ListItem>
                </FlexGridItem>
                <FlexGridItem {...{display: 'flex'}}>
                    <ListItem>
                        <div className="card-label">
                            <ListItemLabel description="Email Address">
                                {user.email} 
                            </ListItemLabel>
                        </div>
                    </ListItem>
                </FlexGridItem>
                <FlexGridItem {...{display: 'flex'}}>
                    <ListItem>
                        <div className="card-label">
                            <ListItemLabel description="Timezone">
                                {user.timeZone || "Not available"} 
                            </ListItemLabel>
                        </div>
                    </ListItem>
                </FlexGridItem>
                <FlexGridItem {...{display: 'flex'}}>
                    <ListItem>
                        <div className="card-label">
                            <ListItemLabel description="Date of Birth">
                                {user.dob ? formatDate(user.dob)
                                : "Not available"}
                            </ListItemLabel>
                        </div>
                    </ListItem>
                </FlexGridItem>
                <FlexGridItem {...{display: 'flex'}}>
                    <ListItem>
                        <div className="card-label">
                            <ListItemLabel description="Job Title">
                                {user.jobTitle || "Not available"} 
                            </ListItemLabel>
                        </div>
                    </ListItem>
                </FlexGridItem>
                <FlexGridItem {...{display: 'flex'}}>
                    <ListItem>
                        <div className="card-label">
                            <ListItemLabel description="Days since creation">
                                {Math.floor((Date.now() - Date.parse(user.createdAt)) / (1000 * 60 * 60 * 24))}
                            </ListItemLabel>
                        </div>
                    </ListItem>
                </FlexGridItem>
            </FlexGrid>
        </MaxCard>
    );
};

const UserAuditLogs = props => {
    const logs = props.logs;

    if (logs === null) {
        return <Waiting title="Recent Audit History" />;
    }

    if (!(logs && logs.length)) {
        return (
            <MaxCard title="Recent Audit History">
                No audit logs available
            </MaxCard>
        );
    }

    const itemProps = {
        display: "flex",
    };

    const children = props.logs.map((item, index) => (
        <FlexGridItem {...itemProps} key={item.id}>
            <Card title={`${item.action.charAt(0).toUpperCase() + item.action.slice(1)} ${item.auditableType}`} $style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}>
                <FlexGrid
                    flexGridColumnCount={[1,2,2]}
                    flexGridColumnGap="scale200"
                    flexGridRowGap="scale200"
                >
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description="Audit Log ID">
                                    {item.id ||
                                        "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description="Timestamp">
                                    {item.createdAt ? <DatetimeTooltip time={item.createdAt} /> :
                                        "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <ListItemLabel description={`${item.auditableType} ID`}>
                                    {item.auditableId ||
                                        "No data available"}
                                </ListItemLabel>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                    <FlexGridItem {...itemProps}>
                        <ListItem>
                            <div className="card-label">
                                <Button
                                    $as={Link}
                                    kind={KIND.secondary}
                                    to={{pathname: `/audit-logs/${item.id}`, state: {from: `/users/${props.userId}`}}}
                                    endEnhancer={() => <FontAwesomeIcon icon={faListUl} />}
                                >
                                    More Details
                                </Button>
                            </div>
                        </ListItem>
                    </FlexGridItem>
                </FlexGrid>
            </Card>
        </FlexGridItem>
    ));

    return (
        <MaxCard
            title={
                <>
                    Recent Audit History
                    <Button
                        $as={Link}
                        kind={KIND.secondary}
                        to={`/global-history?filter=userId-${props.userId}`}
                        aria-label="History for this user"
                        $style={{ float: "right" }}
                    >
                        View All
                    </Button>
                </>
            }
        >   
            <FlexGrid
                flexGridColumnCount={[1,1,1,2]}
                flexGridColumnGap="scale800"
                flexGridRowGap="scale800"
                marginBottom="scale400"
            >
                {children}
            </FlexGrid>
            {props.arrowEnabled &&
                <Button
                    kind={KIND.minimal}
                    onClick={props.more}
                    $style={{ fontSize: "50px" }}
                >
                    <FontAwesomeIcon
                        icon={faChevronCircleDown}
                    />
                </Button>
            }
        </MaxCard>
    );
};


const UserDashboard = props => {
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [logs, setLogs] = useState(null);
    const allUsersPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );
    const [logsDisplayed, setLogsDisplayed] = useState(4);

    useEffect(() => {
        if (props.user) {
            Promise.all([
                OopCore.getUser(props.user.id),
                OopCore.getGlobalHistory({
                    filter: { userId: props.user.id },
                    "page[size]": logsDisplayed
                })
            ])
                .then(([
                    user,
                    logs,
                ]) => {
                    setUser(user);
                    setLogs(logs.data);
                    setUserId(user.id);
                });
        } else {
            Promise.all([
                OopCore.getUser(props.match.params.userId),
                OopCore.getGlobalHistory({
                    filter: { userId: props.match.params.userId },
                    "page[size]": logsDisplayed
                })
            ])
                .then(([
                    user,
                    logs,
                ]) => {
                    setUser(user);
                    setLogs(logs.data);
                    setUserId(user.id);
                });
        }
        
    }, [userId, logsDisplayed]);

    const moreLogs = () => {
        Promise.resolve(
            OopCore.getGlobalHistory({
                filter: { userId: userId },
                "page[size]": logsDisplayed + 4
            })
        ).then(logs => {
            setLogs(logs.data);
            setLogsDisplayed(logsDisplayed + 4);
        });
    }

    const lessLogs = () => {
        Promise.resolve(
            OopCore.getGlobalHistory({
                filter: { userId: userId },
                "page[size]": logsDisplayed - 4
            })
        ).then(logs => {
            setLogs(logs.data);
            setLogsDisplayed(logsDisplayed - 4);
        });
    }

    return (
        <Page
            title={props.user ? "Current User Profile | Open Interop" : "User Profile | Open Interop"}
            heading={props.user ? "Current User Profile" : "User Profile"}
            backlink={props.user ? null : allUsersPath}
            actions={
                <>
                    <Button
                        $as={Link}
                        kind={KIND.minimal}
                        to={`/users/${userId}/edit`}
                        endEnhancer={() => <FontAwesomeIcon icon={faEdit} />}
                        aria-label="Edit this user"
                    >
                        Edit
                    </Button>
                </>
            }
        >
            <Grid behavior={BEHAVIOR.fluid} gridGaps={[32]} gridColumns={[1]} >
                <Cell span={1}>
                    <UserDetails user={user} />
                </Cell>
                <Cell span={1}>
                    <UserAuditLogs logs={logs} userId={userId} more={moreLogs} arrowEnabled={logs ? logs.length === logsDisplayed : true} />
                </Cell>
            </Grid>
        </Page>
    );
};

export default UserDashboard;
