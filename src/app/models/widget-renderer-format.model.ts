export class WidgetRendererFormat{
    cardClass: string;
    widgetBodyClass: string;
    leftBtn: WidgetRendererBtnFormat;
    middleBtn: WidgetRendererBtnFormat;
    rightBtn: WidgetRendererBtnFormat;
}

export class WidgetRendererBtnFormat{
    class: string;
    icon: string;
    disabled: boolean;
}