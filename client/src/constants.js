export const THREE = "three";
export const TWO = "two";
export const FOUR = "four";
export const FIVE = "five";
export const SEVEN = "seven";
export const SIX = "six";
export const BLD = "bld";
export const FMC = "fmc";
export const OH = "oh";
export const CLOCK = "clock";
export const MEGAMINX = "megaminx";
export const PYRAMINX = "pyraminx";
export const SKEWB = "skewb";
export const SQUARE = "square1";
export const FOUR_BLD = "four_bld";
export const FIVE_BLD = "five_bld";
export const MULTI = "multi";
export const MULTI_UNPROCESSED = "MULTI_UNPROCESSED";
export const EMPTY_TIMER = "-:--:---";
export const DNF = "DNF";
export const TIMER_REFRESH_RATE = 50;
export const TIMEOUT_DELAY = 1000;
export const DESC = "desc";
export const ASC = "asc";
export const ID_KEY = "ID";
export const NAME_KEY = "NAME";
export const QUANTITY_KEY = "QUANTITY";
export const ACTIONS_KEY = "ACTIONS";
export const STRING = "string";
export const NUMBER = "number";
export const META = {
    KEYS: [ID_KEY, NAME_KEY, QUANTITY_KEY, ACTIONS_KEY],
    DATATYPE: {
        ID: NUMBER,
        NAME: STRING,
        QUANTITY: NUMBER,
        ACTIONS: STRING
    },
    VISIBLE: {
        ID: false,
        NAME: true,
        QUANTITY: true,
        ACTIONS: true
    },
    DISPLAY_NAME: {
        ID: "",
        NAME: "Name",
        QUANTITY: "Quantity",
        ACTIONS: ""
    },
    SORTABLE: {
        ID: true,
        NAME: true,
        QUANTITY: true,
        ACTIONS: false
    },
    FILTERABLE: {
        ID: true,
        NAME: true,
        QUANTITY: true,
        ACTIONS: false
    }
}
