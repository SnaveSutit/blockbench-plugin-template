import * as PACKAGE from '../package.json'
import { events } from './util/events'
import './util/moddingTools'

//-------------------------------
// Import your source files here
//-------------------------------
// Dialogs
import { openExampleDialog } from './dialogs/exampleDialog'
// Mods
import './mods/exampleMod'

// Provide a global object for other plugins to interact with
// @ts-expect-error
window[PACKAGE.name] = {
	events: events,
	openExampleDialog,
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
