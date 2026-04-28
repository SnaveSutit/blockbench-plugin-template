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

// This must be imported last.
import './plugin'
