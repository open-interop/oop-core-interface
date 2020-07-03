import { createTheme } from "baseui";

/*
$color-black: #303030;
$color-grey: #eee;
$color-dark-grey: lightgrey;
$color-white: #fff;
$color-orange: #db6a06;

$oop-dark-blue: #28364d; // Top nav bar, login background, base font colour
$oop-grey: #e6e8ec; // Body background, input background
$oop-teal: #177692; // Side nav bar background, link font colour, button background, line divider colours
$oop-light-blue: #19a5ce; // User avatar background, button background hover, link hover
$oop-active-teal: #166d87; // Side nav bar active item
$oop-dark-teal: #106781; // Side nav bar sub menu background
$oop-darker-teal: #0d5a71; // Side nav sub menu dvice group heading background

$oop-dark-grey: #939aa6; // Table header
$oop-lighter-grey: #f4f5f6; // Table odd row, code box tab switcher background
$oop-light-grey: #e9ebed; // Table even row

$oop-green-success: #187b50; // Success
$oop-red-failure: #c32b08; // Failure

$body-font-family: system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif;
$header-font-family: $body-font-family;
*/

const primitives = {
    primaryFontFamily: "system-ui, \"Helvetica Neue\", Helvetica, Arial, sans-serif",

    primary: '#177692',
    primaryA: '#303030',

    negative: "#c32b08",
    positive: "#187b50",

    black: "#303030",
};

const overrides = {
    grid: { margins: 0 },
    heading: {
        fontFamily: "system-ui, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    },
};

const theme = createTheme(primitives, overrides);

export default theme;
