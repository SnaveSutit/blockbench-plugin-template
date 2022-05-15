import * as events from './events'
import './mods'
const PACKAGE = require('../package.json')

BBPlugin.register(PACKAGE.name, {
	title: PACKAGE.title,
	author: PACKAGE.author,
	description: PACKAGE.description,
	icon: 'create_session',
	variant: 'desktop',
	// @ts-ignore // Blockbench types are outdated >:I
	version: PACKAGE.version,
	min_version: PACKAGE.min_blockbench_version,
	tags: ['Tag 1', 'Tag 2', 'Tag 3'],
	onload() {
		devlog(`${PACKAGE.name} loaded!`)
		events.load.trigger()
	},
	onunload() {
		devlog(`${PACKAGE.name} unloaded!`)
		events.unload.trigger()
	},
	oninstall() {
		devlog(`${PACKAGE.name} installed!`)
		events.install.trigger()
	},
	onuninstall() {
		devlog(`${PACKAGE.name} uninstalled!`)
		events.uninstall.trigger()
	},
})
