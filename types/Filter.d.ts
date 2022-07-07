declare type Filter = {
    key: string;
    label: string;
    type: "SELECTLIST";
}

// use unknown to support future changes
declare type Filters = Record<string, string | unknown>


declare type SelectListFilter = Filter & {
    // by default, nothing is selected
    type: "SELECTLIST";
    entryValues: string[];
    entryLabels: string[];
}
