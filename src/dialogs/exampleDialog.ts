import PACKAGE from '../../package.json'
import ExampleSvelteComponent from '../components/exampleComponent.svelte'
import { SvelteDialog } from '../util/svelteDialog'

new SvelteDialog({
	id: `${PACKAGE.name}:example_dialog`,
	title: 'Example Dialog',
	width: 400,
	svelteComponent: ExampleSvelteComponent,
	svelteComponentProps: {},
})
