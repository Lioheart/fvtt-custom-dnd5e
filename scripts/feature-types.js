import { CONSTANTS } from "./constants.js";
import { checkEmpty, registerMenu, registerSetting, resetDnd5eConfig } from "./utils.js";
import { FeatureTypesForm } from "./forms/feature-types-form.js";

const constants = CONSTANTS.FEATURE_TYPES;
const property = "featureTypes";

/**
 * Register settings.
 */
export function register() {
  registerSettings();
}

/* -------------------------------------------- */

/**
 * Register settings.
 */
function registerSettings() {
  registerMenu(
    constants.MENU.KEY,
    {
      hint: game.i18n.localize(constants.MENU.HINT),
      label: game.i18n.localize(constants.MENU.LABEL),
      name: game.i18n.localize(constants.MENU.NAME),
      icon: constants.MENU.ICON,
      type: FeatureTypesForm,
      restricted: true,
      scope: "world"
    }
  );

  registerSetting(
    constants.SETTING.KEY,
    {
      scope: "world",
      config: false,
      type: Object,
      default: foundry.utils.deepClone(CONFIG.CUSTOM_DND5E[property])
    }
  );
}

/* -------------------------------------------- */

/**
 * Set CONFIG.DND5E.featureTypes.
 * @param {object} data The data
 */
export function setConfig(data = null) {
  if ( checkEmpty(data) ) {
    if ( checkEmpty(CONFIG.DND5E[property]) ) {
      resetDnd5eConfig(property);
    }
    return;
  }

  const buildConfig = (keys, data) => Object.fromEntries(
    keys.filter(key => data[key].visible || data[key].visible === undefined)
      .map(key => [
        key,
        data[key].children
          ? {
            label: game.i18n.localize(data[key].label),
            children: buildConfig(Object.keys(data[key].children), data[key].children)
          }
          : game.i18n.localize(data[key]?.label || data[key])
      ])
  );

  const defaultConfig = foundry.utils.deepClone(CONFIG.CUSTOM_DND5E[property]);
  const config = buildConfig(Object.keys(data), foundry.utils.mergeObject(defaultConfig, data));

  if ( config ) {
    CONFIG.DND5E[property] = config;
  }
}
