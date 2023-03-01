if (process.argv.includes('--mode=dev')) {
	process.env.NODE_ENV = 'development'
} else {
	process.env.NODE_ENV = 'production'
}

import * as fs from 'fs'
import * as esbuild from 'esbuild'

const PACKAGE = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

let infoPlugin: esbuild.Plugin = {
	name: 'infoPlugin',
	/**
	 *
	 * @param {esbuild.PluginBuild} build
	 */
	setup(build) {
		let start = Date.now()
		build.onStart(() => {
			console.log('\u{1F528} Building...')
			start = Date.now()
		})

		build.onEnd(result => {
			let end = Date.now()
			const diff = end - start
			console.log(
				`\u{2705} Build completed in ${diff}ms with ${result.warnings.length} warnings and ${result.errors.length} errors.`
			)
		})
	},
}

function createBanner() {
	const LICENSE = fs.readFileSync('./LICENSE').toString()

	let lines = [
		`[ ${PACKAGE.title} ]`,
		`${PACKAGE.description}`,
		`Created by ${PACKAGE.author.name}`,
		`(${PACKAGE.author.email}) [${PACKAGE.author.url}]`,
		``,
		`[ SOURCE ]`,
		`${PACKAGE.repository.url}`,
		``,
		`[ LICENSE ]`,
		...LICENSE.split('\n').map(v => v.trim()),
	]

	let maxLength = Math.max(...lines.map(line => line.length))
	const leftBuffer = Math.floor(maxLength / 2)
	const rightBuffer = Math.ceil(maxLength / 2)

	let header = '╭' + `─`.repeat(maxLength + 2) + '╮'
	let footer = '╰' + `─`.repeat(maxLength + 2) + '╯'

	lines = lines.map(v => {
		const div = v.length / 2
		const l = Math.floor(leftBuffer - div)
		const r = Math.ceil(rightBuffer - div)
		return '│ ' + ' '.repeat(l) + v + ' '.repeat(r) + ' │'
	})

	let banner = '\n' + [header, ...lines, footer].map(v => `// ${v}`).join('\n') + '\n'

	return {
		js: banner,
	}
}

async function buildDev() {
	const ctx = await esbuild.context({
		entryPoints: ['./src/index.ts'],
		outfile: `./dist/${PACKAGE.name}.js`,
		bundle: true,
		minify: false,
		platform: 'node',
		sourcemap: true,
		plugins: [infoPlugin],
		format: 'iife',
	})
	ctx.watch()
}

async function buildProd() {
	esbuild.build({
		entryPoints: ['./src/index.ts'],
		outfile: `./dist/${PACKAGE.name}.js`,
		bundle: true,
		minify: true,
		platform: 'node',
		sourcemap: false,
		plugins: [infoPlugin],
		banner: createBanner(),
		drop: ['debugger'],
		format: 'iife',
	})
}

function main() {
	if (process.argv.includes('--mode=dev')) {
		buildDev()
		return
	}
	buildProd()
}

main()
