import { MODULE } from '../constants.js'

export function patchD20Roll () {
    libWrapper.register(MODULE.ID, 'CONFIG.Dice.D20Roll.fromConfig', fromConfigPatch, 'OVERRIDE')
    libWrapper.register(MODULE.ID, 'CONFIG.Dice.D20Roll.prototype.validD20Roll', validD20RollPatch, 'OVERRIDE')
}

function fromConfigPatch (config, process) {
    const baseDie = config.options?.customDie || new CONFIG.Dice.D20Die().formula
    const formula = [baseDie].concat(config.parts ?? []).join(' + ')
    config.options.target ??= process.target
    return new this(formula, config.data, config.options)
}

function validD20RollPatch () {
    return !!this.options.customDie || ((this.d20 instanceof CONFIG.Dice.D20Die) && this.d20.isValid)
}

function createD20DiePatch () {
    if (this.options.customDie) return
    if (this.terms[0] instanceof CONFIG.Dice.D20Die) return
    if (!(this.terms[0] instanceof foundry.dice.terms.Die)) return
    const { number, faces, ...data } = this.terms[0]
    this.terms[0] = new CONFIG.Dice.D20Die({ ...data, number, faces })
}
