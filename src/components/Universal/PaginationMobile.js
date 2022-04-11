import React, { memo } from "react";
import { useStyletron } from "baseui";
import { Button, KIND } from "baseui/button";
import { ArrowLeft, ArrowRight } from "baseui/icon";

const PaginationMobile = memo(props => {
    const [css, theme] = useStyletron();

    const Centered = props => {
        return (
            <div
                className={css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: theme.sizing.scale100,
                    ...theme.typography.font350,
                })}
            >
                {props.children}
            </div>
        );
    };

    const decPage = () => props.updatePageNumber(props.currentPage - 1);
    const incPage = () => props.updatePageNumber(props.currentPage + 1);

    const decDisabled = props.currentPage <= 1;
    const incDisabled = props.currentPage >= props.numberOfPages;

    return (
        <div
            className={css({
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            })}
        >
            <Button kind={KIND.tertiary} onClick={decPage} disabled={decDisabled}>
                <ArrowLeft size={24} />
            </Button>
            <Centered>
                Page: {props.currentPage}/{props.numberOfPages}
            </Centered>
            <Centered>
                ({props.totalRecords || 0}
                {props.totalRecords > 1 || props.totalRecords === 0 ? " records" : " record"})
            </Centered>
            <Button kind={KIND.tertiary} onClick={incPage} disabled={incDisabled}>
                <ArrowRight size={24} />
            </Button>
        </div>
    );
});

export { PaginationMobile };
