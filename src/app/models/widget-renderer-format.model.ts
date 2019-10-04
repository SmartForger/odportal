export class WidgetRendererFormat{
    buttons: Array<WidgetRendererBtnFormat>;
    cardClass: string;
    widgetBodyClass: string;
}

export class WidgetRendererBtnFormat{
    class: string;
    disabled: boolean;
    icon: string;
    title: string;
}