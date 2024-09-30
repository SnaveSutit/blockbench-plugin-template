import { events } from './util/events'

declare global {
	// Replace BlockbenchPluginTemplate with the name of your plugin.
	const BlockbenchPluginTemplate: {
		events: typeof events
	}
}
