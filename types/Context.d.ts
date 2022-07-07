
declare type Preferences = Record<string, string | boolean | undefined | unknown>

declare type Context = {
    /**
     * A persistent store for getting user preferences and storing private data,
     * similar to SharedPreferences in android.
     */
    prefs: Preferences;
    /**
     * fetch without cross origin and forbidden headers
     */
    xfetch: (url: string, init?: RequestInit) => Promise<Response>;
    /**
     * an instance of the dom parser
     */
    domParser: DOMParser;
}
