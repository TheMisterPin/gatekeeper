export enum ButtonType {
  ICON = "icon",
  FULL = "full",
}

export enum ButtonAction {
  ADD = "add",
  EDIT = "edit",
  DELETE = "delete",
  SAVE = "save",
  CANCEL = "cancel",
  VIEW = "view",
  DOWNLOAD = "download",
  REFRESH = "refresh",
  FILTER = "filter",
  SEARCH = "search",
  SORT = "sort",
  COPY = "copy",
  SHARE = "share",
  SETTINGS = "settings",
  HELP = "help",
  CONFIRM = "confirm",
  SUBMIT = "submit",
  ASSIGN = "assign",
  COMPLETE = "complete",
  MOVE = "move",
  EXPORT = "export",
}

const buttonIconMap = {
  SAVE: "Save",
  DELETE: "Trash2",
  EDIT: "Pencil",
  ADD: "Plus",
  REFRESH: "RefreshCw",
  DOWNLOAD: "Download",
  VIEW: "Eye",
  SEARCH: "Search",
  FILTER: "Filter",
  SORT: "ArrowUpDown",
  COPY: "Copy",
  SHARE: "Share2",
  SETTINGS: "Settings",
  HELP: "HelpCircle",
  CHART_BAR: "BarChart3",
} as const;

export const ButtonIcon = buttonIconMap;

export type ButtonIcon = (typeof buttonIconMap)[keyof typeof buttonIconMap];
