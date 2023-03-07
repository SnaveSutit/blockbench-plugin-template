import PACKAGE from '../package.json'
import { createBlockbenchMod } from './util/moddingTools'

// This is a simple example of how to use createBlockbenchMod.
// This mod will log 'Hello world!' to the console when you click the 'Add Cube' button.
createBlockbenchMod(
	// The mod name should be the plugin's name followed by a colon and the mod name and/or what it's doing.
	`${PACKAGE.name}:example_mod/add_cube_message`,
	{
		// We need to assert the type of BarItems.add_cube because BarItems assumes it's children are instances of BarItem.
		// Saving the Action itself to context is not necessary, but it removes a lot of type casting and saves on visual clutter.
		action: BarItems.add_cube as Action,
		// We save the original function to context so we can reference it later.
		original: (BarItems.add_cube as Action).click,
	},
	context => {
		// We replace the function with a new one that logs 'Hello world!' to the console.
		context.action.click = function (this: Action, event: Event) {
			console.log('Hello world!')
			// and then we call the original function with the same arguments.
			return context.original.call(this, event)
		}
		return context // Whatever is returned here will be passed to the extract function as the context.
	},
	context => {
		// On uninstall, we replace the custom function with the original one.
		context.action.click = context.original
	}
)
