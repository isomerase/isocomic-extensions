/**
 * type of source metadata, should be exported by index.ts
 */
declare type SMetadata = {
    /**
     * Unique identifier of the source, in lowercase
     */
    id: string;
    /**
     * the name displayed on the UI
     */
    name: string;
    /**
     * Semantically versioned string, used for version control.
     * like `a.b.c`, `a` and `b` is reserved for system update.
     * Extension should only use `c` for bug fix or new feature
     */
    version: string;
    /**
     * home page of the source
     */
    website?: string;
    /**
     * icon url of the source
     */
    iconUrl?: string;
    /**
     * language code, like, `en`, `ja`, etc. If multiple languages are supported, use `all`.
     */
    language?: string;
    /**
     * the url the source needs to connect with
     */
    baseUrl?: string;
    /**
     * the description of the source, displayed on the setting page
     */
    description?: string;
    /**
     * whether the request contains credentials
     * if is true, the request shouldn't be sent to untrusted proxy server
     * when it is set, APP will alert user if the request is sent to untrusted proxy server
     * default to be `false`
     */
    useCredentials?: boolean;
}
