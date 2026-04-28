# Blockbench Plugin Template

A TypeScript-first Blockbench plugin template with ESBuild, Svelte, and plugin packaging utilities preconfigured.

## Included tooling

- TypeScript 5 + `blockbench-types`
- ESBuild bundling with watch/dev and production modes
- Svelte support via `svelte-patching-tools` + `esbuild-plugin-svelte`
- Blockbench patch workflow via `blockbench-patch-manager`
- YAML language file loading (`src/lang/*.yml`) through build plugins
- ESLint (TypeScript + Svelte) and Prettier
- Vitest config (tests expected in `src/tests`)
- A pluginPackage build step that generates all of the necessary files for publishing a plugin to the Blockbench plugin repository.

## Quick start

1. Use this template to create your repository.
2. Install dependencies:
    - `bun install`
3. Update plugin metadata in `package.json` (`name`, `title`, `author`, versions, tags).
4. Edit plugin registration and lifecycle in `src/index.ts`.
5. Rename your global plugin type in `src/global.d.ts` to match your plugin name.

## Commands

- `bun dev` - Development build with file watching
- `bun build` - Production build
- `bun test` - Run tests
- `bun format` - Format all files with Prettier

## Build output

- Main bundle: `dist/<package.name>.js`
- Plugin Package: `dist/pluginPackage/<package.name>.bbpack`
- Production metadata: `dist/meta.json`

## Notes

- The plugin is registered from `src/plugin.ts` and has a global object on `window[PACKAGE.name]` for inter-plugin integrations.
- The build uses environment defines (`process.env.*`) and defaults `FLAVOR=local` when not set.
