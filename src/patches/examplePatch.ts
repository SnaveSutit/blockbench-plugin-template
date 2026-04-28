import { registerPropertyOverridePatch } from 'blockbench-patch-manager'
import PACKAGE from '../../package.json'

registerPropertyOverridePatch({
	// The ID of your patch. This should ALWAYS start with the plugin's ID. If it does not, the patch manager will throw an error and refuse to apply the patch.
	// After the plugin's ID, you can add anything you want to make the ID unique.
	id: `${PACKAGE.name}:example_patch/add_cube_message`,
	// The object to patch. In this case, we're patching the 'Add Cube' action.
	target: BarItems.add_cube as Action,
	// They key of the property to patch. In this case, we're patching the 'click' function of the action.
	key: 'click',

	// The get function is called when the property is accessed. We can return a new function that wraps the original one.
	get(this: Action, originalValue) {
		// We return a new function that will be called instead of the original 'click' function.
		// This allows us to run our own code before or after the original function.
		return function (this: Action, ...args) {
			// Code we want to run before the original 'click' function. In this case, we're just logging a message to the console.
			console.log('Hello world!')
			// Run the original 'click' function with the correct 'this' context and arguments to ensure the original functionality is preserved.
			const result = originalValue?.apply(this, args)
			// Code we want to run after the original 'click' function. In this case, we're just logging a message to the console.
			console.log('Goodbye world!')
			return result
		}
	},
})
