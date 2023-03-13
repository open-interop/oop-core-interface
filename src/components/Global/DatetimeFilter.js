import React, { useState } from "react";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { Datepicker } from 'baseui/datepicker';
import {TimePicker} from 'baseui/timepicker';

const DatetimeFilter = props => {
    const splitValue = props.value?.split("#");

    const [greaterThan, setGreaterThan] = useState(splitValue[0] === "lt" ? false : true);
    const [dateSelected, setDateSelected] = useState(splitValue?.length > 0 && splitValue[1] ? splitValue[1].split(" ")[0] : null);
    const [timeSelected, setTimeSelected] = useState(splitValue?.length > 0 && splitValue[1] ? splitValue[1].split(" ")[1] : null);
    const [datePick, setDatePick] = useState(null);
    const [timePick, setTimePick] = useState(null);

    function toggleGreaterThan() {
        props.setValue(`${!greaterThan ? "gt" : "lt"}#${dateSelected} ${timeSelected}`);
        setGreaterThan(!greaterThan);
    }

    function setDate(d) {
        if (d !== null) {
            setDateSelected(d.toISOString().slice(0,10).replaceAll("-", "/"));
            props.setValue(`${greaterThan ? "gt" : "lt"}#${d.toISOString().slice(0,10).replaceAll("-", "/")} ${timeSelected}`);
            setDatePick(d);
        }
    }

    function setTime(t) {
        if (t !== null) {
            setTimeSelected(t.toISOString().slice(11,19));
            props.setValue(`${greaterThan ? "gt" : "lt"}#${dateSelected} ${t.toISOString().slice(11,19)}`);
            setTimePick(t);
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
            <TimePicker
              value={timePick}
              onChange={time => setTime(time)}
              format="24"
              step={1800}
            />
        </div>
    );
};

export { DatetimeFilter };
