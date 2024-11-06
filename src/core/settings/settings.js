
const settingsLut = {
  "ReadyToAssignFeature": {
    "name": "ReadyToAssignFeature",
    "default": false,
    "title": "Ready To Assign",
    "description": "Rolls up reamining, unspent budgeted and unbudgeted dollars into a rollover category.",
    "settings": {
      "component": "ReadyToAssignSettings"
    }
  },
  "EffectiveBalanceFeature": {
    "name": "EffectiveBalanceFeature",
    "default": false,
    "title": "Effective Balance",
    "description": "Current credit card balance(s) against depoitory acocunt balance(s).",
    "settings": {
      "component": "EffectiveBalanceSettings"
    }
  },
  "ColorOverspentCategoriesFeature": {
    "name": "ColorOverspentCategoriesFeature",
    "default": true,
    "title": "Highlight Overspent Categories",
    "description": "Current credit card balance(s) against depoitory acocunt balance(s).",
    "settings": {
      "component": "Color"
    }
  },
}

export const allSettingsLut = Object.values(settingsLut);

