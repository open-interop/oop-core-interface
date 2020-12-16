import React, { useState } from "react";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { Datepicker } from 'baseui/datepicker';

const DatetimeFilter = props => {
    const [greaterThan, setGreaterThan] = useState(props.value['gt'] || true);
    const [dateSelected, setDateSelected] = useState(props.value['val']);
    const [datePick, setDatePick] = useState(null);

    function toggleGreaterThan() {
        props.setValue({'gt': !greaterThan, 'val': dateSelected});
        setGreaterThan(!greaterThan);
    }

    function setDate(d) {
        if (d !== null) {
            setDateSelected(d.toISOString().slice(0,10));
            props.setValue({'gt': greaterThan, 'val': d.toISOString().slice(0,10)});
            setDatePick(d);
        }
    }

    return (
        <div>  
            <div style={{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center'}}>
                <p>Less Than</p>
                <Checkbox
                    checked={greaterThan}
                    onChange={() => toggleGreaterThan()}
                    checkmarkType={STYLE_TYPE.toggle_round}
                />
                <p style={{'paddingLeft': '4px'}}>Greater Than</p>
            </div>
            <Datepicker
              aria-label="Select a date"
              value={datePick}
              onChange={({date}) => setDate(date)}
              formatString="yyyy-MM-dd"
              placeholder="YYYY-MM-DD"
              mask="9999-99-99"
            />
        </div>
    );
};

export { DatetimeFilter };
