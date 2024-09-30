// A MODIFIED VERSION OF THE SVELTE PLUGIN FOR ESBUILD (esbuild-plugin-svelte)

// CHANGELOG:

// made it so that css can be emmitted directly as js instead of as an import

'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
import { readFile } from 'fs/promises'
import { preprocess, compile } from 'svelte/compiler'
import { relative } from 'path'
import { Plugin } from 'esbuild'
import type { CompileOptions } from 'svelte/types/compiler'
import { PreprocessorGroup } from 'svelte-preprocess/dist/types'
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
export type SveltePluginOptions = {
	compilerOptions?: CompileOptions
	transformCssToJs?: (css: string) => string
	preprocess?: PreprocessorGroup | PreprocessorGroup[]
}
function esbuildPluginSvelte(
	opts: SveltePluginOptions = {}
): Plugin {
	// moving this out of the initializer to allow ommitting it from the options.
	const completeOptions = Object.assign({ transformCssToJs: (css: string) => css }, opts)
	return {
		name: 'esbuild-plugin-svelte',
		setup(build) {
			/** A cache of the compiled CSS. */
			const cache = new Map()
			// Register loader for the 'fake' CSS files that we import from
			// the compiled Javascript.
			build.onLoad({ filter: /\.svelte\.css$/ }, ({ path }) => {
				const contents = cache.get(path)
				return contents ? { contents, loader: 'css' } : null
			})
			// Register loader for all .svelte files.
			//
			build.onLoad({ filter: /\.svelte$/ }, async ({ path }) => {
				let source = await readFile(path, 'utf-8')
				const filename = relative(process.cwd(), path)
				if (completeOptions.preprocess) {
					const processed = await preprocess(source, completeOptions.preprocess, {
						filename,
					})
					source = processed.code
				}
				const compilerOptions = {
					css: false,
					...completeOptions.compilerOptions,
				}
				let res
				try {
					res = compile(source, { ...compilerOptions, filename })
				} catch (err) {
					return { errors: [convertWarning(source, err as any)] }
				}
				const { js, css, warnings } = res
				let code = `${js.code as string}\n//# sourceMappingURL=${js.map.toUrl() as string}`
				// Emit CSS, otherwise it will be included in the JS and injected at runtime.
				if (css.code && completeOptions.transformCssToJs) {
					code = `${code}\n${completeOptions.transformCssToJs(css.code as string)}`
				} else if (css.code && !compilerOptions.css) {
					const cssPath = `${path}.css`
					cache.set(
						cssPath,
						`${css.code as string}/*# sourceMappingURL=${css.map.toUrl() as string}*/`
					)
					code = `${code}\nimport ${JSON.stringify(cssPath)}`
				}
				return {
					contents: code,
					warnings: warnings.map(w => convertWarning(source, w)),
				}
			})
		},
	}
}
export default esbuildPluginSvelte
