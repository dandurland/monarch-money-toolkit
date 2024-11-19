
const settingsLut = {
  "ReadyToAssignFeature": {
    "name": "ReadyToAssignFeature",
    "default": { "enabled" :false },
    "title": "Ready To Assign",
    "description": "Rolls up reamining, unspent budgeted and unbudgeted dollars into a rollover category.",
    "settings": {
      "component": "ReadyToAssignSettings"
    }
  },
  "EffectiveBalanceFeature": {
    "name": "EffectiveBalanceFeature",
    "default": { "enabled" :false },
    "title": "Effective Balance",
    "description": "Current credit card balance(s) against depoitory acocunt balance(s).",
    "settings": {
      "component": "EffectiveBalanceSettings"
    }
  },
  "OverBudgetFeature": {
    "name": "OverBudgetFeature",
    "default": { "enabled" :false },
    "title": "Over Budget Categories",
    "description": "Current credit card balance(s) against depoitory acocunt balance(s).",
    "settings": {
      "component": "OverBudgetSettings"
    }
  },
  "ColorOverspentCategoriesFeature": {
    "name": "ColorOverspentCategoriesFeature",
    "default": { "enabled" :false },
    "title": "Highlight Overspent Categories",
    "description": "Current credit card balance(s) against depoitory acocunt balance(s).",
    "settings": {
      "component": "Color"
    }
  },
}

export const allSettingsLut = Object.values(settingsLut);

