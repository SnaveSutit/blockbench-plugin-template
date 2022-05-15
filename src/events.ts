type ListenerFunction = () => void

class BlockbenchPluginEvent {
	listeners: ListenerFunction[] = []
	constructor() {
		this.listeners = []
	}

	addListener(func: ListenerFunction) {
		this.listeners.push(func)
	}

	trigger() {
		this.listeners.forEach(v => v())
	}
}

export const load = new BlockbenchPluginEvent()
export const unload = new BlockbenchPluginEvent()
export const install = new BlockbenchPluginEvent()
export const uninstall = new BlockbenchPluginEvent()

export const loadMods = new BlockbenchPluginEvent()
export const unloadMods = new BlockbenchPluginEvent()

load.addListener(() => loadMods.trigger())
unload.addListener(() => unloadMods.trigger())
install.addListener(() => loadMods.trigger())
uninstall.addListener(() => unloadMods.trigger())
