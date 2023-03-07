import * as events from './util/events'

declare global {
	const BlockbenchPluginTemplate: {
		events: typeof events
	}
}
