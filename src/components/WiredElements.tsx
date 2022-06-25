import * as React from "react";
import { createComponent } from "@lit-labs/react";
import {
  WiredButton as _WiredButton,
  WiredCard as _WiredCard,
  WiredCheckbox as _WiredCheckbox,
  WiredCombo as _WiredCombo,
  WiredDialog as _WiredDialog,
  WiredDivider as _WiredDivider,
  WiredFab as _WiredFab,
  WiredIconButton as _WiredIconButton,
  WiredImage as _WiredImage,
  WiredInput as _WiredInput,
  WiredItem as _WiredItem,
  WiredLink as _WiredLink,
  WiredListbox as _WiredListbox,
  WiredProgress as _WiredProgress,
  WiredRadio as _WiredRadio,
  WiredRadioGroup as _WiredRadioGroup,
  WiredSearchInput as _WiredSearchInput,
  WiredSlider as _WiredSlider,
  WiredSpinner as _WiredSpinner,
  WiredTab as _WiredTab,
  WiredTabs as _WiredTabs,
  WiredTextarea as _WiredTextarea,
  WiredToggle as _WiredToggle,
  WiredVideo as _WiredVideo
} from "wired-elements";
import { WiredCalendar as _WiredCalendar } from "wired-elements/lib/wired-calendar.js";

export const WiredButton = createComponent(React, "wired-button", _WiredButton);
export const WiredCalendar = createComponent(
  React,
  "wired-calendar",
  _WiredCalendar
);
export const WiredCard = createComponent(React, "wired-card", _WiredCard);
export const WiredCheckbox = createComponent(
  React,
  "wired-checkbox",
  _WiredCheckbox,
  {
    onchange: "change",
    onChange: "change"
  }
);
export const WiredCombo = createComponent(React, "wired-combo", _WiredCombo, {
  onselected: "selected"
});
export const WiredDialog = createComponent(React, "wired-dialog", _WiredDialog);
export const WiredDivider = createComponent(
  React,
  "wired-divider",
  _WiredDivider
);
export const WiredFab = createComponent(React, "wired-fab", _WiredFab);
export const WiredIconButton = createComponent(
  React,
  "wired-icon-button",
  _WiredIconButton
);
export const WiredImage = createComponent(React, "wired-image", _WiredImage);
export const WiredInput = createComponent(React, "wired-input", _WiredInput, {
  onChange: "input",
  onchange: "input"
});
export const WiredItem = createComponent(React, "wired-item", _WiredItem);
export const WiredLink = createComponent(React, "wired-link", _WiredLink);
export const WiredListbox = createComponent(
  React,
  "wired-listbox",
  _WiredListbox,
  {
    onselected: "selected"
  }
);
export const WiredProgress = createComponent(
  React,
  "wired-progress",
  _WiredProgress
);
export const WiredRadio = createComponent(React, "wired-radio", _WiredRadio, {
  onchange: "change",
  onChange: "change"
});
export const WiredRadioGroup = createComponent(
  React,
  "wired-radio-group",
  _WiredRadioGroup,
  {
    onselected: "selected"
  }
);
export const WiredSearchInput = createComponent(
  React,
  "wired-search-input",
  _WiredSearchInput,
  {
    onChange: "input",
    onchange: "input"
  }
);
export const WiredSlider = createComponent(
  React,
  "wired-slider",
  _WiredSlider,
  {
    onchange: "change",
    onChange: "change"
  }
);
export const WiredSpinner = createComponent(
  React,
  "wired-spinner",
  _WiredSpinner
);
export const WiredTab = createComponent(React, "wired-tab", _WiredTab);
export const WiredTabs = createComponent(React, "wired-tabs", _WiredTabs);
export const WiredTextarea = createComponent(
  React,
  "wired-textarea",
  _WiredTextarea,
  {
    onChange: "input",
    onchange: "input"
  }
);
export const WiredToggle = createComponent(
  React,
  "wired-toggle",
  _WiredToggle,
  {
    onchange: "change",
    onChange: "change"
  }
);
export const WiredVideo = createComponent(React, "wired-video", _WiredVideo);
