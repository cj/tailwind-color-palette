import chroma, { Color } from 'chroma-js'

import { PaletteOptions } from '../types'

export = function (color: string, options: PaletteOptions = {}) {
	if (!color || typeof color !== 'string') {
		throw new Error('Please provide a valid "color" string parameter')
	}
	const colorChroma = chroma(color)
	const { name = 'brand', ui = false, uiMix = 0.2, greyscale = false, greyscaleMix = 0.01, palette = {} } = options

	function mix (baseColor: Color | string, amount: number): string {
		return chroma.mix(baseColor, colorChroma, amount, 'lab').hex()
	}

	function addToPalette (name: string, value: string) {
		if (!palette[name]) {
			palette[name] = value
		}
	}

	function addScaleToPalette (name: string, baseColor: Color | string, suffixes: string[], padding: number) {
		const colorScale = chroma.scale([ 'black', baseColor, 'white' ]).padding(padding).colors(suffixes.length)
		suffixes.forEach((suffix, index) => addToPalette(`${name}${suffix}`, colorScale[index]))
	}

	// Primary color scale
	const colorScale = [ '-darkest', '-darker', '-dark', '', '-light', '-lighter', '-lightest' ]
	const colorInset = 0.4
	addScaleToPalette(name, colorChroma, colorScale, colorInset)

	// UI Colors https://github.com/adevade/color-scheme-generator
	if (ui) {
		const uiScale = [ '-dark', '', '-light' ]
		const uiLightDarkInset = 0.25
		addScaleToPalette('cta',     colorChroma.set('hsl.h', '+150'), uiScale, uiLightDarkInset)
		addScaleToPalette('info',    mix('#3df', uiMix),               uiScale, uiLightDarkInset)
		addScaleToPalette('warn', mix('#fd0', uiMix),               uiScale, uiLightDarkInset)
		addScaleToPalette('pass', mix('#3e4', uiMix),               uiScale, uiLightDarkInset)
		addScaleToPalette('dang',  mix('#f34', uiMix),               uiScale, uiLightDarkInset)
	}

	// Greyscale
	if (greyscale) {
		addToPalette('black',         mix('#292929', greyscaleMix))
		addToPalette('grey-darkest',  mix('#484848', greyscaleMix))
		addToPalette('grey-darker',   mix('#6f6f6f', greyscaleMix))
		addToPalette('grey-dark',     mix('#959595', greyscaleMix))
		addToPalette('grey',          mix('#c2c2c2', greyscaleMix))
		addToPalette('grey-light',    mix('#e1e1e1', greyscaleMix))
		addToPalette('grey-lighter',  mix('#f5f5f5', greyscaleMix))
		addToPalette('grey-lightest', mix('#fafafa', greyscaleMix))
		addToPalette('white',         '#ffffff')
		addToPalette('transparent',   'transparent')
	}

	return palette
}
