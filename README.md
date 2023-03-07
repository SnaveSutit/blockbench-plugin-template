# Blockbench Plugin Template
A TypeScript & ESBuild Blockbench plugin template.

Includes everything you need to get started and more with Blockbench plugin development!

## Utilities
- SnaveSutit/blockbench-types - The most up-to-date Blockbench types available, improvements and fixes almost every week!

- util/console - Adds a couple functions for wrapping the console output of a function in a console group without having to remember to open and close it properly.

- util/subscribable - A simple typed subscribable class.

- util/moddingTools - A library of tools that make modding Blockbench much easier. From the simple action of creating an .. Action, to the advanced trickery of injecting custom code into built-in class functions. This library will be super helpful to practically anyone attempting to build a plugin!

- util/events - A simple event manager. that provides much better type completion than the built-in one in Blockbench.

## Setup
- Create a new repo using this template
- Run `yarn` to initialize the development enviornment
- Configure the package.json to use your information
- Configure the plugin definition in `index.ts`
- Rename the global variable in `global.d.ts` to match your plugin's name

## Build commands
- `yarn build:dev` - Builds in dev mode and watches for file changes
- `yarn build:prod` - Builds a production version of the plugin and exits
- `yarn format` - Formats all of the source files using Prettier
