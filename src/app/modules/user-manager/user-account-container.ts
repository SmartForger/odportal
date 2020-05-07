import { Container } from "src/app/models/container.model";
import { AppIconType } from "src/app/models/app.model";

export const userAccountContainer: Container = {
    branches: [
        {
            apps: ['personal-information', 'security-and-access', 'role-mappings', 'temp-mm-wrapper'],
            icon: 'account_box',
            iconType: AppIconType.ICON,
            title: "Account"
        }
    ],
    root: null
};

//c96f291e-8e18-45e9-afbf-5d8de7d0ef60 Assessment Manager
//33f0b7b7-c796-4bcc-86fc-ac01d3cfec48 Certification Manager
//9870272c-e4aa-4492-abe2-0de301f5cc8b My Certifications
//9104af7f-fc56-41f9-bedf-22e4469ae30b My CEUS
//a4fdaccf-768e-4bbe-93e8-44ba1d367195 My Surveys
//eb96fb26-88fb-4c3b-8ca6-ef13f609f770 Schedule Manager
//03172482-a496-4e6e-8c85-2b4143100a4e Survey Manager

// {
//     apps: ['94e9df02-66f3-44b9-abdc-da605878af07'],
//     icon: 'emoji_events',
//     iconType: AppIconType.ICON,
//     title: "Achievements"
// },
// {
//     apps: [],
//     icon: 'alarm_on',
//     iconType: AppIconType.ICON,
//     title: "Branch C"
// }