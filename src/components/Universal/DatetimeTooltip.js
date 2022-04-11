import React from "react";

import { StatefulTooltip } from "baseui/tooltip";

import parseISO from "date-fns/parseISO";

import moment from "moment";

const DatetimeTooltip = props => {
    const formatISODate = date => {
        const d = new Date();
        const dtf = Intl.DateTimeFormat(undefined, { timeZoneName: "short" });
        const timezone =
            " " + dtf.formatToParts(d).find(part => part.type === "timeZoneName").value;

        if (date) {
            const dateObj = parseISO(date);
            return moment(dateObj).format("YYYY-MM-DD HH:mm:ss") + timezone;
        } else {
            return null;
        }
    };

    return (
        <StatefulTooltip
            accessibilityType={"tooltip"}
            content={props.time || ""}
            showArrow={true}
            placement="right"
            overrides={{
                Body: {
                    style: ({ $theme }) => ({
                        backgroundColor: $theme.colors.black,
                        borderTopLeftRadius: $theme.borders.radius200,
                        borderTopRightRadius: $theme.borders.radius200,
                        borderBottomRightRadius: $theme.borders.radius200,
                        borderBottomLeftRadius: $theme.borders.radius200,
                    }),
                },
                Inner: {
                    style: ({ $theme }) => ({
                        backgroundColor: $theme.colors.black,
                        borderTopLeftRadius: $theme.borders.radius200,
                        borderTopRightRadius: $theme.borders.radius200,
                        borderBottomRightRadius: $theme.borders.radius200,
                        borderBottomLeftRadius: $theme.borders.radius200,
                        color: $theme.colors.white,
                        fontSize: "14px",
                    }),
                },
            }}
        >
            {formatISODate(props.time) || "No data available"}
        </StatefulTooltip>
    );
};

export { DatetimeTooltip };
