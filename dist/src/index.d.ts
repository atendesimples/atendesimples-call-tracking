declare type CallTrackingProps = {
    token: string;
    fallback?: any;
    html: {
        event: string;
        selector: string;
    };
};
declare class CallTracking {
    #private;
    constructor(props: CallTrackingProps);
    googleClientId(): string;
    run(): any;
}
declare const AtendeSimples: {
    CallTracking: typeof CallTracking;
};
export default AtendeSimples;
