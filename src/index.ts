import * as PACKAGE from '../package.json'
import { consoleGroupCollapsed } from './util/console'
import * as events from './util/events'
import './util/mods'

// Expose this plugin's events to other plugins
// @ts-ignore
globalThis[PACKAGE.name].events = events

BBPlugin.register(PACKAGE.name, {
	title: PACKAGE.title,
	author: PACKAGE.author.name,
	description: PACKAGE.description,
	icon: 'create_session',
	variant: 'desktop',
	version: PACKAGE.version,
	min_version: PACKAGE.min_blockbench_version,
	tags: PACKAGE.tags as [string, string, string],
	onload: consoleGroupCollapsed(`${PACKAGE.name}:onload`, () => {
		events.load.dispatch()
	}),
	onunload: consoleGroupCollapsed(`${PACKAGE.name}:onunload`, () => {
		events.unload.dispatch()
	}),
	oninstall: consoleGroupCollapsed(`${PACKAGE.name}:oninstall`, () => {
		events.install.dispatch()
	}),
	onuninstall: consoleGroupCollapsed(`${PACKAGE.name}:onuninstall`, () => {
		events.uninstall.dispatch()
	}),
})
