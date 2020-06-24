import React, { useState, useEffect } from "react";
import { Select } from "baseui/select";

import OopCore from "../../OopCore";

const TemprSelector = props => {
    const [temprs, setTemprs] = useState([]);

    useEffect(() => {
        const deviceGroupId = props.deviceGroup;
        OopCore.getTemprs({ pageSize: -1, deviceGroupId }).then(temprs => {
            setTemprs(temprs.data);
        });
    }, [props.deviceGroup]);

    return (
        <Select
            {...props}
            labelKey="name"
            valueKey="id"
            options={temprs}
            value={temprs.filter(item => item.id === props.value)}
        />
    );
};

export { TemprSelector };
