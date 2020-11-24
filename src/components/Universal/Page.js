import React, { useEffect } from "react";
import { Link, Prompt } from "react-router-dom";

import { useStyletron } from "baseui";
import { Button, KIND } from "baseui/button";
import { Heading, HeadingLevel } from "baseui/heading";
import { Block } from 'baseui/block';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const Actions = props => {
    const [css] = useStyletron();

    if (!props.actions) {
        return null;
    }

    return (
        <span className={css({
            display: "inline-flex",
            marginLeft: "auto",
        })}>
            {props.actions}
        </span>
    );
};

const BackLink = props => {
    if (!props.backlink) {
        return null;
    }

    return (
        <Button
            $as={Link}
            kind={KIND.minimal}
            to={props.backlink}
            aria-label="Go back to all users"
        >
            <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
    );
};

const Page = props => {
    const title = props.title;
    const [css, theme] = useStyletron();

    useEffect(() => {
        document.title = title;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title]);

    const contentWrapper = css({
        background: theme.colors.white,
        padding: theme.sizing.scale800,
    });

    return (
        <div className={contentWrapper}>
            {props.alert && <Prompt message={props.alert} />}
            <HeadingLevel>
                <Block display={['block', 'block', 'none']}>
                    <Heading $style={{ display: "flex", fontSize: "8vmin", flexDirection: "row", alignItems: "center" }}>
                        <BackLink backlink={props.backlink} />
                        {props.heading}
                        <Actions actions={props.actions} />
                    </Heading>
                </Block>
                <Block display={['none', 'none', 'block']}>
                    <Heading $style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <BackLink backlink={props.backlink} />
                        {props.heading}
                        <Actions actions={props.actions} />
                    </Heading>
                </Block>
                {props.children}
            </HeadingLevel>
        </div>
    );
};

export { Page };
