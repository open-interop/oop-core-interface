import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useStyletron } from "baseui";
import { Button, KIND } from "baseui/button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircle,
    faEdit,
    faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Page, MaxCard, InPlaceGifSpinner, DatetimeTooltip } from "../Universal";
import { ListItem, ListItemLabel } from "baseui/list";
import { Chart, Pie } from "react-chartjs-2";
import styles from "./../../styles/_variables.scss";
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
    const { schedule } = props;

    if (!(schedule && schedule.id)) {
        return <Waiting title="Details" />;
    }

    return (
        <MaxCard>
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Name">
                        {schedule.name}
                    </ListItemLabel>
                </div>
            </ListItem>
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Created At">
                        <DatetimeTooltip time={schedule.createdAt}></DatetimeTooltip>
                    </ListItemLabel>
                </div>
            </ListItem>
            <ListItem>
                <div className="card-label">
                    <ListItemLabel description="Schedule Temprs">
                        {
                            schedule.scheduleTemprs
                                ? schedule.scheduleTemprs
                                : "No"
                        }{" "}
                        schedule temprs associated
                    </ListItemLabel>
                </div>
            </ListItem>
        </MaxCard>
    );
};

const UserAuditLogs = props => {
    const logs = props.logs;

    if (logs === null) {
        return <Waiting title="User's Audit Logs" />;
    }

    console.log(logs);

    if (!(logs && logs.length)) {
        return (
            <MaxCard title="User's Audit Logs">
                No audit logs available
            </MaxCard>
        );
    }
    return (
        <MaxCard
            title={
                <>
                    Latest Audits
                    <Button
                        $as={Link}
                        kind={KIND.secondary}
                        to={{pathname: `/users/${props.userId}/audit-logs`, state: {from: `/users/${props.userId}`}}}
                        aria-label="History for this user"
                        $style={{ float: "right" }}
                    >
                        View All
                    </Button>
                </>
            }
        >
            <Table
                data={logs}
                mapFunction={(
                    columnName,
                    content,
                ) => {
                    if (columnName === "auditedChanges") {
                        return Object.keys(content).length;
                    }
                    return content;
                }}
                columns={[
                    {
                        id: "id",
                        name: "ID",
                    },
                    {
                        id: "auditableType",
                        name: "Component Type",
                    },
                    {
                        id: "action",
                        name:
                            "Action",
                    },
                    {
                        id: "auditedChanges",
                        name:
                            "No. of Changes",
                    },
                ]}
            />
        </MaxCard>
    );
};


const UserDashboard = props => {
    const userId = props.match.params.userId;
    const [user, setUser] = useState(null);
    const [logs, setLogs] = useState(null);
    const allUsersPath = props.location.pathname.substr(
        0,
        props.location.pathname.lastIndexOf("/"),
    );

    useEffect(() => {
        Promise.all([
            OopCore.getUser(userId),
            OopCore.getGlobalHistory({
                filter: { userId: userId },
                "page[size]": 15
            })
        ])
            .then(([
                user,
                logs,
            ]) => {
                setUser(user);
                setLogs(logs.data);
            });
    }, [userId]);

    return (
        <Page
            title="User Dashboard | Open Interop"
            heading="User Dashboard"
            backlink={allUsersPath}
            actions={
                <>
                    <Button
                        $as={Link}
                        kind={KIND.minimal}
                        to={`/users/${props.match.params.userId}/edit`}
                        endEnhancer={() => <FontAwesomeIcon icon={faEdit} />}
                        aria-label="Edit this user"
                    >
                        Edit
                    </Button>
                </>
            }
        >
            <Grid behavior={BEHAVIOR.fluid} gridGaps={[32]} gridColumns={[5,5,14]} >
                <Cell span={5}>
                    <UserDetails user={user} />
                </Cell>
                <Cell span={[5,5,9]}>
                    <UserAuditLogs logs={logs} userId={userId} />
                </Cell>
            </Grid>
        </Page>
    );
};

export default UserDashboard;
