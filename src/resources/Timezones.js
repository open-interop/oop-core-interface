const Timezones = [
    "International Date Line West",
    "Midway Island",
    "American Samoa",
    "Hawaii",
    "Alaska",
    "Pacific Time (US & Canada)",
    "Tijuana",
    "Mountain Time (US & Canada)",
    "Arizona",
    "Chihuahua",
    "Mazatlan",
    "Central Time (US & Canada)",
    "Saskatchewan",
    "Guadalajara",
    "Mexico City",
    "Monterrey",
    "Central America",
    "Eastern Time (US & Canada)",
    "Indiana (East)",
    "Bogota",
    "Lima",
    "Quito",
    "Atlantic Time (Canada)",
    "Caracas",
    "La Paz",
    "Santiago",
    "Newfoundland",
    "Brasilia",
    "Buenos Aires",
    "Montevideo",
    "Georgetown",
    "Puerto Rico",
    "Greenland",
    "Mid-Atlantic",
    "Azores",
    "Cape Verde Is.",
    "Dublin",
    "Edinburgh",
    "Lisbon",
    "London",
    "Casablanca",
    "Monrovia",
    "UTC",
    "Belgrade",
    "Bratislava",
    "Budapest",
    "Ljubljana",
    "Prague",
    "Sarajevo",
    "Skopje",
    "Warsaw",
    "Zagreb",
    "Brussels",
    "Copenhagen",
    "Madrid",
    "Paris",
    "Amsterdam",
    "Berlin",
    "Bern",
    "Zurich",
    "Rome",
    "Stockholm",
    "Vienna",
    "West Central Africa",
    "Bucharest",
    "Cairo",
    "Helsinki",
    "Kyiv",
    "Riga",
    "Sofia",
    "Tallinn",
    "Vilnius",
    "Athens",
    "Istanbul",
    "Minsk",
    "Jerusalem",
    "Harare",
    "Pretoria",
    "Kaliningrad",
    "Moscow",
    "St. Petersburg",
    "Volgograd",
    "Samara",
    "Kuwait",
    "Riyadh",
    "Nairobi",
    "Baghdad",
    "Tehran",
    "Abu Dhabi",
    "Muscat",
    "Baku",
    "Tbilisi",
    "Yerevan",
    "Kabul",
    "Ekaterinburg",
    "Islamabad",
    "Karachi",
    "Tashkent",
    "Chennai",
    "Kolkata",
    "Mumbai",
    "New Delhi",
    "Kathmandu",
    "Astana",
    "Dhaka",
    "Sri Jayawardenepura",
    "Almaty",
    "Novosibirsk",
    "Rangoon",
    "Bangkok",
    "Hanoi",
    "Jakarta",
    "Krasnoyarsk",
    "Beijing",
    "Chongqing",
    "Hong Kong",
    "Urumqi",
    "Kuala Lumpur",
    "Singapore",
    "Taipei",
    "Perth",
    "Irkutsk",
    "Ulaanbaatar",
    "Seoul",
    "Osaka",
    "Sapporo",
    "Tokyo",
    "Yakutsk",
    "Darwin",
    "Adelaide",
    "Canberra",
    "Melbourne",
    "Sydney",
    "Brisbane",
    "Hobart",
    "Vladivostok",
    "Guam",
    "Port Moresby",
    "Magadan",
    "Srednekolymsk",
    "Solomon Is.",
    "New Caledonia",
    "Fiji",
    "Kamchatka",
    "Marshall Is.",
    "Auckland",
    "Wellington",
    "Nuku'alofa",
    "Tokelau Is.",
    "Chatham Is.",
    "Samoa",
];

const TimeDiff = {
    'International Date Line West': "-12",
    'American Samoa': "-11",
    "Midway Island": "-11",
    "Hawaii": "-10",
    "Alaska": "-9",
    "Pacific Time (US & Canada)": "-8",
    "Tijuana": "-8",
    "Arizona": "-7",
    "Chihuahua": "-7",
    "Mazatlan": "-7",
    "Mountain Time (US & Canada)": "-7",
    "Central America": "-6",
    "Central Time (US & Canada)": "-6",
    "Guadalajara": "-6",
    "Mexico City": "-6",
    "Monterrey": "-6",
    "Saskatchewan": "-6",
    "Bogota": "-5",
    "Eastern Time (US & Canada)": "-5",
    "Indiana (East)": "-5",
    "Lima": "-5",
    "Quito": "-5",
    "Atlantic Time (Canada)": "-4",
    "Caracas": "-4",
    "Georgetown": "-4",
    "La Paz": "-4",
    "Puerto Rico": "-4",
    "Santiago": "-4",
    "Newfoundland": "-4",
    "Brasilia": "-3",
    "Buenos Aires": "-3",
    "Greenland": "-3",
    "Montevideo": "-3",
    "Mid-Atlantic": "-2",
    "Azores": "-1",
    "Cape Verde Is.": "-1",
    "Edinburgh": "+0",
    "Lisbon": "+0",
    "London": "+0",
    "Monrovia": "+0",
    "UTC": "+0",
    "Amsterdam": "+1",
    "Belgrade": "+1",
    "Berlin": "+1",
    "Bern": "+1",
    "Bratislava": "+1",
    "Brussels": "+1",
    "Budapest": "+1",
    "Casablanca": "+1",
    "Copenhagen": "+1",
    "Dublin": "+1",
    "Ljubljana": "+1",
    "Madrid": "+1",
    "Paris": "+1",
    "Prague": "+1",
    "Rome": "+1",
    "Sarajevo": "+1",
    "Skopje": "+1",
    "Stockholm": "+1",
    "Vienna": "+1",
    "Warsaw": "+1",
    "West Central Africa": "+1",
    "Zagreb": "+1",
    "Zurich": "+1",
    "Athens": "+2",
    "Bucharest": "+2",
    "Cairo": "+2",
    "Harare": "+2",
    "Helsinki": "+2",
    "Jerusalem": "+2",
    "Kaliningrad": "+2",
    "Kyiv": "+2",
    "Pretoria": "+2",
    "Riga": "+2",
    "Sofia": "+2",
    "Tallinn": "+2",
    "Vilnius": "+2",
    "Baghdad": "+3",
    "Istanbul": "+3",
    "Kuwait": "+3",
    "Minsk": "+3",
    "Moscow": "+3",
    "Nairobi": "+3",
    "Riyadh": "+3",
    "St. Petersburg": "+3",
    "Tehran": "+3",
    "Abu Dhabi": "+4",
    "Baku": "+4",
    "Muscat": "+4",
    "Samara": "+4",
    "Tbilisi": "+4",
    "Volgograd": "+4",
    "Yerevan": "+4",
    "Kabul": "+4",
    "Ekaterinburg": "+5",
    "Islamabad": "+5",
    "Karachi": "+5",
    "Tashkent": "+5",
    "Chennai": "+5",
    "Kolkata": "+5",
    "Mumbai": "+5",
    "New Delhi": "+5",
    "Sri Jayawardenepura": "+5",
    "Kathmandu": "+5",
    "Almaty": "+6",
    "Astana": "+6",
    "Dhaka": "+6",
    "Urumqi": "+6",
    "Rangoon": "+6",
    "Bangkok": "+7",
    "Hanoi": "+7",
    "Jakarta": "+7",
    "Krasnoyarsk": "+7",
    "Novosibirsk": "+7",
    "Beijing": "+8",
    "Chongqing": "+8",
    "Hong Kong": "+8",
    "Irkutsk": "+8",
    "Kuala Lumpur": "+8",
    "Perth": "+8",
    "Singapore": "+8",
    "Taipei": "+8",
    "Ulaanbaatar": "+8",
    "Osaka": "+9",
    "Sapporo": "+9",
    "Seoul": "+9",
    "Tokyo": "+9",
    "Yakutsk": "+9",
    "Adelaide": "+9",
    "Darwin": "+9",
    "Brisbane": "+10",
    "Canberra": "+10",
    "Guam": "+10",
    "Hobart": "+10",
    "Melbourne": "+10",
    "Port Moresby": "+10",
    "Sydney": "+10",
    "Vladivostok": "+10",
    "Magadan": "+11",
    "New Caledonia": "+11",
    "Solomon Is.": "+11",
    "Srednekolymsk": "+11",
    "Auckland": "+12",
    "Fiji": "+12",
    "Kamchatka": "+12",
    "Marshall Is.": "+12",
    "Wellington": "+12",
    "Chatham Is.": "+12",
    "Nuku'alofa": "+13",
    "Samoa": "+13",
    "Tokelau Is.": "+13",
};

export { Timezones, TimeDiff };
