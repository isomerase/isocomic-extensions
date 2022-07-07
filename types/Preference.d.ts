declare type Preference = {
    type: "EDITTEXT" | "SWITCH" | "SELECTLIST";
    /**
     * key used to store preference
     */
    key: string;
    /**
     * label displayed in the preference screen
     */
    label: string;
    /**
     * a short description about the preference, displayed as helper text
     */
    description?: string;
}

declare type EditTextPreference = Preference & {
    type: "EDITTEXT";
    /**
     * whether enable the textfield multiline property, default to be `false`
     */
    multiline?: boolean;
}

declare type SwitchPreference = Preference & {
    type: "SWITCH";
    /**
     * default value. if not set, it will be false
     */
    defaultValue?: boolean;
}

declare type SelectListPreference = Preference & {
    type: "SELECTLIST";
    entryValues: string[];
    entryLabels: string[];
}
