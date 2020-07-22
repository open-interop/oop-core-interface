import React from "react";
import { Pagination as PaginationUI } from "baseui/pagination";
import { useStyletron } from "baseui";
import { Select } from "baseui/select";

const pageSizeOptions = [
    { id: 10 },
    { id: 20 },
    { id: 40 },
    { id: 60 },
    { id: 80 },
    { id: 100 },
];

const StyledSelect = props => {
    return <Select
        {...props}
        overrides={{
            ControlContainer: {
                style: ({$theme, $disabled, $isOpen, $error}) => ({
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderTopColor: 'transparent',
                    borderBottomColor: 'transparent',
                    boxShadow: 'none',
                    backgroundColor: $disabled
                        ? $theme.colors.buttonDisabledFill
                        : $isOpen
                            ? $theme.colors.buttonTertiaryHover
                            : $error
                                ? $theme.colors.negative50
                                : $theme.colors.buttonTertiaryFill,
                                ':hover': {
                                    backgroundColor: $theme.colors.buttonTertiaryHover,
                                },
                }),
            },
            InputContainer: {
                style: {
                    marginLeft: 0,
                },
            },
            ValueContainer: {
                style: ({$theme}) => ({
                    flexBasis: 'auto',
                }),
            },
            SingleValue: {
                style: ({$theme}) => ({
                    position: 'relative',
                    paddingTop: '0',
                    paddingBottom: '0',
                    paddingLeft: $theme.sizing.scale200,
                    paddingRight: $theme.sizing.scale500,
                    color: $theme.colors.buttonTertiaryText,
                    ...$theme.typography.font350,
                    lineHeight: 'unset',
                }),
            },
            SelectArrow: {
                style: ({$theme}) => ({
                    width: '24px',
                    height: '24px',
                    color: $theme.colors.buttonTertiaryText,
                }),
            },
        }}
    />;
};

const Pagination = props => {
    const [css, theme] = useStyletron();

    const Centered = props => {
        return (
            <div className={css({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: theme.sizing.scale100,
                ...theme.typography.font350,
            })}>
                {props.children}
            </div>
        );
    };

    return (
        <div className={css({ display: "flex", flexDirection: "row", justifyContent: "space-between" })}>
            <div className={css({ display: "flex", flexDirection: "row" })}>
                <div>
                    <StyledSelect
                        options={pageSizeOptions}
                        labelKey="id"
                        valueKey="id"
                        searchable={false}
                        clearable={false}
                        onChange={value => {
                            props.updatePageSize(value.option.id);
                        }}
                        value={
                            [pageSizeOptions.find(
                                option => option.id === props.currentPageSize,
                            ) || {
                                id: 20,
                            }]
                        }
                    />
                </div>
                <Centered>
                    Items per page
                </Centered>
            </div>
            <Centered>
                {props.totalRecords || 1}
                {props.totalRecords > 1 || props.totalRecords === 0
                    ? " records"
                    : " record"}
            </Centered>
            <div>
                <PaginationUI
                    numPages={props.numberOfPages}
                    currentPage={props.currentPage}
                    onPageChange={event => {
                        props.updatePageNumber(event.nextPage);
                    }}
                />
            </div>
        </div>
    );
};

export { Pagination };
