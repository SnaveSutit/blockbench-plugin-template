import { Plugin } from 'esbuild'
import * as pathjs from 'path'
import * as fs from 'fs'
import * as svelteCompiler from 'svelte/compiler'
import * as svelteInternal from 'svelte/internal'

const PACKAGE = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const PLUGIN_PACKAGE_PATH = './src/package/'
const SVELTE_FILE = './src/package/about.svelte'
const README_DIST_PATH = './dist/package/about.md'
const DIST_PATH = './dist/'
const DIST_PACKAGE_PATH = './dist/package/'

function createPackage() {
	fs.rmSync(DIST_PACKAGE_PATH, { recursive: true, force: true })
	fs.cpSync(PLUGIN_PACKAGE_PATH, DIST_PACKAGE_PATH, { recursive: true })
	fs.copyFileSync(
		`./dist/${PACKAGE.name}.js`,
		pathjs.join(DIST_PACKAGE_PATH, PACKAGE.name + '.js')
	)
	const svelteResult = svelteCompiler.compile(fs.readFileSync(SVELTE_FILE, 'utf-8'), {
		generate: 'ssr',
		cssHash({ name, filename, hash, css }) {
			return `${PACKAGE.name}-plugin-page-${hash(css)}`
		},
	})
	const component = new Function(
		'svelteInternal',
		svelteResult.js.code
			.replace(/from "svelte\/internal"/g, ' = svelteInternal')
			.replace('export default', 'return')
			.replace('import', 'const')
	)
	const result = component(svelteInternal).render()
	const html = `${result.html}\n<style>${result.css.code}</style>`
	fs.writeFileSync(README_DIST_PATH, html)
	if (fs.existsSync(pathjs.join(DIST_PACKAGE_PATH, 'about.svelte')))
		fs.unlinkSync(pathjs.join(DIST_PACKAGE_PATH, 'about.svelte'))
}

function plugin(): Plugin {
	return {
		name: 'packagerPlugin',
		setup(build) {
			build.onEnd(() => {
				if (process.env.NODE_ENV === 'production') {
					console.log('📦 Packaging...')
					const label = '📦 Package built in'
					console.time(label)
					createPackage()
					console.timeEnd(label)
				}
			})
		},
	}
}

export default plugin
