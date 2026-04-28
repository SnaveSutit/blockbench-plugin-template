import * as PACKAGE from '../package.json'

//-------------------------------
// Import your source files here
//-------------------------------

// Blockbench Patches
import 'import_folder_recursive:./patches'
// Misc imports
import { openExampleDialog } from './dialogs/exampleDialog'

// Provide a global object for other plugins to interact with
// @ts-expect-error
window[PACKAGE.name] = {
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
	onload() {},
	onunload() {},
	oninstall() {},
	onuninstall() {},
})
