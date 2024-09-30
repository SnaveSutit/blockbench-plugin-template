import * as PACKAGE from '../package.json'
import { events } from './util/events'
import './util/moddingTools'

//-------------------------------
// Import your source files here
//-------------------------------
import './dialogs/exampleDialog'

// Expose this plugin's events globally and to other plugins
// Replace 'BlockbenchPluginTemplate' here, and in globals.d.ts with the name of your plugin
// @ts-ignore
globalThis.BlockbenchPluginTemplate = {
	events: events,
}

BBPlugin.register(PACKAGE.name, {
	title: PACKAGE.title,
	author: PACKAGE.author.name,
	description: PACKAGE.description,
	icon: 'create_session',
	variant: 'desktop',
	version: PACKAGE.version,
	min_version: PACKAGE.min_blockbench_version,
	tags: PACKAGE.tags as [string, string, string],
	onload() {
		events.LOAD.dispatch()
	},
	onunload() {
		events.UNLOAD.dispatch()
	},
	oninstall() {
		events.INSTALL.dispatch()
	},
	onuninstall() {
		events.UNINSTALL.dispatch()
	},
})
