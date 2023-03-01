import { consoleGroupCollapsed } from './console'
import { Subscribable } from './subscribable'
import * as PACKAGE from '../../package.json'

export class PluginEvent<T = void> extends Subscribable<T> {
	protected static events: Record<string, PluginEvent<any>> = {}

	constructor(public name: string) {
		super()
		PluginEvent.events[name] = this
	}
}

export const load = new PluginEvent('load')
export const unload = new PluginEvent('unload')
export const install = new PluginEvent('install')
export const uninstall = new PluginEvent('uninstall')

export const injectMods = new PluginEvent('injectMods')
export const extractMods = new PluginEvent('extractMods')

const injectHandler = consoleGroupCollapsed(
	`Injecting BlockbenchMods added by ${PACKAGE.name}`,
	() => injectMods.dispatch()
)
const extractHandler = consoleGroupCollapsed(
	`Extracting BlockbenchMods added by ${PACKAGE.name}`,
	() => extractMods.dispatch()
)
load.subscribe(injectHandler)
unload.subscribe(extractHandler)
install.subscribe(injectHandler)
uninstall.subscribe(extractHandler)
