export enum ConnectionStatus {
    Pending = 1,
    Success,
    Failed
};

export enum CommonLocalStorageKeys {
    RedirectURI = "redirectURI"
};

export const HttpSignatureKey: string = "od360-request-signature";

export const DefaultAppIcon: string = "/assets/images/default-microapp-ico-50x50.png";

export const CustomEventListeners = {
    OnHttpRequestEvent: "onHttpRequest",
    OnStateChangeEvent: "onStateChange",
    OnAppLaunchRequestEvent: "onAppLaunchRequest",
    OnSharedWidgetCacheWrite: "onSharedWidgetCacheWrite",
    OnHttpAbortEvent: "onAbortHttpRequest",
    OnUserStateCallback: "onUserStateCallback",
    OnResizeCallback: "onResizeCallback",
    OnWidgetCacheCallback: "onWidgetCacheCallback",
    OnInitCallback: "onInitCallback"
};

export const AppWidgetAttributes = {
    IsInit: "isinit"
};