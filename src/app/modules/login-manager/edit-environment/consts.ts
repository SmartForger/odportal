import { ListItemIcon } from "src/app/models/list-item-icon.model";

export const _pageTabs: ListItemIcon[] = [
  {
    label: "Appearance",
    value: "appearance"
  },
  {
    label: "Configuration",
    value: "configuration"
  },
  {
    label: "Analytics",
    value: "analytics"
  },
  {
    label: "Preview",
    value: "preview"
  }
];

export const _pageSidebarItems = {
  appearance: [
    {
      label: "General",
      value: "appearance_general",
      icon: "image"
    },
    {
      label: "Classification Banner",
      value: "classification_banner",
      icon: "image"
    },
    {
      label: "Info Banner",
      value: "info_banner",
      icon: "image"
    },
    {
      label: "Landing Header",
      value: "landing_header",
      icon: "image"
    },
    {
      label: "Landing Buttons",
      value: "landing_buttons",
      icon: "image"
    },
    {
      label: "System Consent",
      value: "system_consent",
      icon: "image"
    },
    {
      label: "Custom CSS",
      value: "custom_css",
      icon: "image"
    }
  ],
  configuration: [
    {
      label: "General",
      value: "config_general",
      icon: "settings"
    },
    {
      label: "SMTP Relay",
      value: "smtp_relay",
      icon: "settings"
    },
    {
      label: "Support Systems",
      value: "support_systems",
      icon: "settings"
    },
    {
      label: "Third Parties",
      value: "third_parties",
      icon: "settings"
    }
  ],
  analytics: [
    {
      label: "Overview",
      value: "analytics_overview",
      icon: "settings"
    },
    {
      label: "Data Mapping",
      value: "data_mapping",
      icon: "settings"
    },
    {
      label: "RCS Integration",
      value: "rcs_integration",
      icon: "settings"
    }
  ]
};