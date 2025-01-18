import PACKAGE from '../../../package.json'
import { SvelteDialog } from '../../util/svelteDialog'
import ExampleSvelteComponent from './exampleComponent.svelte'

export function openExampleDialog() {
	new SvelteDialog({
		id: `${PACKAGE.name}:example_dialog`,
		title: 'Example Dialog',
		width: 400,
		component: ExampleSvelteComponent,
		props: {},
	}).show()
}
