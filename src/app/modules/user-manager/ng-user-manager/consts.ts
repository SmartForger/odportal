import { KeyValue } from "src/app/models/key-value.model";
import { ListItemIcon } from "src/app/models/list-item-icon.model";

export const _statusOptions: KeyValue[] = [
  {
    value: "active",
    display: "Active"
  },
  {
    value: "suspended",
    display: "Suspended"
  },
  {
    value: "disabled",
    display: "Disabled"
  }
];

export const _menuOptions: KeyValue[] = [
  {
    value: "view",
    display: "View profile"
  },
  {
    value: "delete",
    display: "Delete user"
  }
];

export const _pageTabs: ListItemIcon[] = [
  {
    label: "Account",
    value: "account",
    icon: "account_box"
  },
  {
    label: "Achievements",
    value: "achievements",
    icon: "emoji_events"
  },
  {
    label: "Participation",
    value: "participation",
    icon: "people_alt"
  },
  {
    label: "History",
    value: "history",
    icon: "timeline"
  }
];

export const _pageSidebarItems = {
  account: [
    {
      label: "Personal Information",
      value: "personal_info",
      icon: "account_box"
    },
    {
      label: "Security & Access",
      value: "security_access",
      icon: "account_box"
    },
    {
      label: "Affiliations",
      value: "affiliations",
      icon: "account_box"
    },
    {
      label: "RedHat SSO",
      value: "sso",
      icon: "account_box"
    },
    {
      label: "Role Mappings",
      value: "roles",
      icon: "account_box"
    },
    {
      label: "Custom Attributes",
      value: "custom_attributes",
      icon: "account_box"
    },
    {
      label: "Microapps",
      value: "microapps",
      icon: "account_box"
    },
    {
      label: "Simspace",
      value: "simspace",
      icon: "account_box"
    },
    {
      label: "Mattermost",
      value: "mattermost",
      icon: "account_box"
    },
    {
      label: "Jira",
      value: "jira",
      icon: "account_box"
    }
  ],
  achievements: [
    {
      label: "Overview",
      value: "achievements_overview",
      icon: "emoji_events"
    },
    {
      label: "Certifications",
      value: "certifications",
      icon: "emoji_events"
    },
    {
      label: "Schoolhouse",
      value: "schoolhouse",
      icon: "emoji_events"
    },
    {
      label: "Academy",
      value: "academy",
      icon: "emoji_events"
    }
  ],
  participation: [
    {
      label: "Overview",
      value: "participation_overview",
      icon: "people_alt"
    },
    {
      label: "Events",
      value: "events",
      icon: "people_alt"
    },
    {
      label: "CEUs",
      value: "ceus",
      icon: "people_alt"
    },
    {
      label: "Surveys",
      value: "surveys",
      icon: "people_alt"
    },
    {
      label: "Classes",
      value: "classes",
      icon: "people_alt"
    }
  ],
  history: [
    {
      label: "Overview",
      value: "history_overview",
      icon: "timeline"
    },
    {
      label: "Registration",
      value: "registration",
      icon: "timeline"
    },
    {
      label: "Sessions",
      value: "sessions",
      icon: "timeline"
    },
    {
      label: "Hardhat",
      value: "hardhat",
      icon: "timeline"
    }
  ]
};