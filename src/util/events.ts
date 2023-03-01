import { Subscribable } from './subscribable'

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

export const loadMods = new PluginEvent('loadMods')
export const unloadMods = new PluginEvent('unloadMods')

load.subscribe(loadMods.dispatch)
unload.subscribe(unloadMods.dispatch)
install.subscribe(loadMods.dispatch)
uninstall.subscribe(unloadMods.dispatch)
