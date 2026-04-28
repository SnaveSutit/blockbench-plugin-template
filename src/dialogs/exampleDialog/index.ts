import { SvelteDialog } from 'svelte-patching-tools/blockbench'
import PACKAGE from '../../../package.json'
import ExampleSvelteComponent from './exampleDialog.svelte'

export function openExampleDialog() {
	new SvelteDialog({
		id: `${PACKAGE.name}:example_dialog`,
		title: 'Example Dialog',
		width: 400,
		component: ExampleSvelteComponent,
		props: {},
	}).show()
}
