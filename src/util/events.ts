import { consoleGroupCollapsed } from './console'
import { Subscribable } from './subscribable'
import * as PACKAGE from '../../package.json'

export class PluginEvent<EventData = void> extends Subscribable<EventData> {
	protected static events: Record<string, PluginEvent<any>> = {}
	constructor(public name: string) {
		super()
		PluginEvent.events[name] = this
	}
}

// Plugin Events
export const LOAD = new PluginEvent('load')
export const UNLOAD = new PluginEvent('unload')
export const INSTALL = new PluginEvent('install')
export const UNINSTALL = new PluginEvent('uninstall')

export const INJECT_MODS = new PluginEvent('injectMods')
export const EXTRACT_MODS = new PluginEvent('extractMods')

const INJECT_HANDLER = consoleGroupCollapsed(
	`Injecting BlockbenchMods added by ${PACKAGE.name}`,
	() => INJECT_MODS.dispatch()
)
const EXTRACT_HANDLER = consoleGroupCollapsed(
	`Extracting BlockbenchMods added by ${PACKAGE.name}`,
	() => EXTRACT_MODS.dispatch()
)
LOAD.subscribe(INJECT_HANDLER)
UNLOAD.subscribe(EXTRACT_HANDLER)
INSTALL.subscribe(INJECT_HANDLER)
UNINSTALL.subscribe(EXTRACT_HANDLER)
