import type { Plugin } from 'esbuild'
import * as fs from 'fs'
import { readFileSync, writeFileSync } from 'fs'
import { basename, join } from 'node:path'
import * as prettier from 'prettier'
import sveltePreprocess from 'svelte-preprocess'
// @ts-expect-error - Types are broken in nodenext for this package, but it works fine.
import { typescript } from 'svelte-preprocess-esbuild'
import type { CompileOptions, CompileResult } from 'svelte/compiler'
import { compile, preprocess } from 'svelte/compiler'
import { render } from 'svelte/server'
// @ts-expect-error - Svelte's internal server-side rendering API is not typed, but we need it to render the about.svelte file at build time.
import * as svelteInternalServer from 'svelte/internal/server'

const PACKAGE = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const PLUGIN_PACKAGE_PATH = './src/pluginPackage/'
const SVELTE_FILE = './src/pluginPackage/about.svelte'
const README_DIST_PATH = './dist/pluginPackage/about.md'
const DIST_PATH = './dist/'
const DIST_PACKAGE_PATH = './dist/pluginPackage/'
const PLUGIN_REPO_PATH = 'D:/github-repos/snavesutit/blockbench-plugins/plugins/animated_java'
const PLUGIN_MANIFEST_PATH = 'D:/github-repos/snavesutit/blockbench-plugins/plugins.json'
const CHANGELOG_PATH = './src/pluginPackage/changelog.json'
const RELEASE_NOTES_TEMPLATES = './.scripts/plugins/releaseNoteTemplates/'
const URL_REGEX =
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm

function replaceTemplateVars(str: string, items: Record<string, string>) {
	return str.replace(/\{(.+?)\}/g, str => items[str.replace(/[\{\}]/g, '')] ?? str)
}

const VERSION_REGEX = /(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9]+))?/

function getVersionNumbers(version: string) {
	const match = VERSION_REGEX.exec(version)
	if (!match) return null
	const major = parseInt(match[1])
	const minor = parseInt(match[2])
	const patch = parseInt(match[3])
	const preRelease = match[4] ?? null
	return { major, minor, patch, preRelease }
}

/**
 * Convert a warning or error emitted from the svelte compiler for esbuild.
 */
function convertWarning(source: any, { message, filename, start, end }: any) {
	if (!start || !end) {
		return { text: message }
	}
	const lines = source.split(/\r\n|\r|\n/)
	const lineText = lines[start.line - 1]
	const location = {
		file: filename,
		line: start.line,
		column: start.column,
		length: (start.line === end.line ? end.column : lineText.length) - start.column,
		lineText,
	}
	return { text: message, location }
}

async function renderSvelteFileToStaticHTML(path: string) {
	const filename = basename(path)
	const source = readFileSync(path, 'utf-8')
	const processed = await preprocess(
		source,
		[
			typescript({
				target: 'es2022',
				define: {
					'process.browser': 'true',
				},
			}),
			sveltePreprocess({
				typescript: false,
				sourceMap: process.env.NODE_ENV === 'development',
			}),
		],
		{ filename }
	)
	const compilerOptions: CompileOptions = {
		filename,
		sourcemap: processed.map,
		css: 'external',
		generate: 'server',
		cssHash() {
			return `animated-java-plugin-about-page`
		},
	}
	let res: CompileResult
	try {
		res = compile(processed.code, compilerOptions)
	} catch (err: any) {
		return { errors: [convertWarning(processed.code, err)] }
	}
	const component = new Function(
		'svelteInternalServer',
		res.js.code
			.replace('export default ', 'return ')
			.replace(
				`import * as $ from 'svelte/internal/server';`,
				'const $ = svelteInternalServer;'
			)
	)(svelteInternalServer)

	let contents = render(component, {}).body
	// Remove all comments
	contents = contents.replaceAll(/<!--.*?-->/gs, '')
	// Emit CSS, otherwise it will be included in the JS and injected at runtime.
	if (res.css?.code) {
		contents = `${contents}\n<style>${res.css.code}</style>`
	}

	return {
		contents,
		warnings: res.warnings.map(warning => convertWarning(source, warning)),
	}
}

function plugin(): Plugin {
	return {
		name: 'packagerPlugin',
		setup(build) {
			build.onEnd(async () => {
				console.log('📦 Packaging...')
				fs.rmSync(DIST_PACKAGE_PATH, { recursive: true, force: true })
				fs.cpSync(PLUGIN_PACKAGE_PATH, DIST_PACKAGE_PATH, { recursive: true })
				try {
					fs.copyFileSync(
						`./dist/${PACKAGE.name}.js`,
						join(DIST_PACKAGE_PATH, PACKAGE.name + '.js')
					)
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (e) {
					console.log('⚠️  Packaging failed, main plugin file not found in dist!')
					return
				}

				const svelteResult = await renderSvelteFileToStaticHTML(SVELTE_FILE)

				if (
					svelteResult.contents == undefined ||
					svelteResult.warnings.length > 0 ||
					svelteResult.errors != undefined
				) {
					return {
						errors: svelteResult.errors,
						warnings: svelteResult.warnings,
					}
				}

				const html = svelteResult.contents
				writeFileSync(README_DIST_PATH, html)
				if (fs.existsSync(join(DIST_PACKAGE_PATH, 'about.svelte')))
					fs.unlinkSync(join(DIST_PACKAGE_PATH, 'about.svelte'))

				console.log('✅ Packaging complete!')
			})
		},
	}
}

export default plugin
