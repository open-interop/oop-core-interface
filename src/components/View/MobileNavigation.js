import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { NavigationGroup, NavigationItem } from "../Global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCogs,
    faNetworkWired,
} from "@fortawesome/free-solid-svg-icons";

const MobileNavigation = props => {
    const [settingsAccordionOpen, setSettingsAccordionOpen] = useState(false);

    const history = useHistory();

    return (
        <div className="mobile-nav">
            <NavigationItem
                path="/devices"
                pathName="&nbsp;&nbsp;Devices"
                icon={<FontAwesomeIcon icon={faNetworkWired} />}
            />
            <NavigationGroup
                pathName="&nbsp;&nbsp;Settings"
                isOpen={settingsAccordionOpen}
                setOpen={setSettingsAccordionOpen}
                icon={<FontAwesomeIcon icon={faCogs} />}
            >
                <NavigationItem
                    path="/users"
                    pathName="Users"
                    onClick={() => {
                        setSettingsAccordionOpen();
                        history.push("/users");
                    }}
                />
                <NavigationItem
                    path="/sites"
                    pathName="Sites"
                    onClick={() => {
                        setSettingsAccordionOpen();
                        history.push("/sites");
                    }}
                />
                <NavigationItem
                    path="/temprs"
                    pathName="Temprs"
                    onClick={() => {
                        setSettingsAccordionOpen();
                        history.push("/temprs");
                    }}
                />
                <NavigationItem
                    path="/device-groups"
                    pathName="Device Groups"
                    onClick={() => {
                        setSettingsAccordionOpen();
                        history.push("/device-groups");
                    }}
                />
                <NavigationItem
                    path="/schedules"
                    pathName="Schedules"
                    onClick={() => {
                        setSettingsAccordionOpen();
                        history.push("/schedules");
                    }}
                />
                <NavigationItem
                    path="/layers"
                    pathName="Layers"
                    onClick={() => {
                        setSettingsAccordionOpen();
                        history.push("/layers");
                    }}
                />
                <NavigationItem
                    path="/blacklist-entries"
                    pathName="Blacklist"
                    onClick={() => {
                        setSettingsAccordionOpen();
                        history.push("/blacklist-entries");
                    }}
                />
                <NavigationItem
                    path="/transmissions"
                    pathName="Transmissions"
                    onClick={() => {
                        setSettingsAccordionOpen();
                        history.push("/transmissions");
                    }}
                />
                <NavigationItem
                    path="/global-history"
                    pathName="Global History"
                    onClick={() => {
                        setSettingsAccordionOpen();
                        history.push("/global-history");
                    }}
                />
            </NavigationGroup>
        </div>
    );
};

export { MobileNavigation };
