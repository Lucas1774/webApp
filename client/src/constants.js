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
export const REMOVE_KEY = "REMOVE";
export const STRING = "string";
export const NUMBER = "number";
export const ICON = "icon";
export const META = {
    KEYS: [ID_KEY, NAME_KEY, QUANTITY_KEY, REMOVE_KEY],
    DATATYPE: {
        [ID_KEY]: NUMBER,
        [NAME_KEY]: STRING,
        [QUANTITY_KEY]: NUMBER,
        [REMOVE_KEY]: ICON
    },
    VISIBLE: {
        [ID_KEY]: false,
        [NAME_KEY]: true,
        [QUANTITY_KEY]: true,
        [REMOVE_KEY]: true
    },
    DISPLAY_NAME: {
        [ID_KEY]: "",
        [NAME_KEY]: "Name",
        [QUANTITY_KEY]: "Quantity",
        [REMOVE_KEY]: ""
    },
    SORTABLE: {
        [ID_KEY]: true,
        [NAME_KEY]: true,
        [QUANTITY_KEY]: true,
        [REMOVE_KEY]: false
    },
    FILTERABLE: {
        [ID_KEY]: true,
        [NAME_KEY]: true,
        [QUANTITY_KEY]: true,
        [REMOVE_KEY]: false
    }
}
