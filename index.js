#!/usr/bin/env node
'use strict';

const walkSync = require('walk-sync');
const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const path = require('path')
const argv = yargs(hideBin(process.argv)).argv
const dir = argv.dir || 'src'
const pathsRaw = walkSync(dir)
const paths = pathsRaw.filter(o => !o.endsWith('/') && !o.startsWith('.'))
const re = /'(.*?::.*?)'/igm
const result = []
paths.map(o => {
	const content = fs.readFileSync(path.resolve(dir, o))
	const matches = content.toString().match(re)
	if (!matches || matches.length === 0) {
		return
	}
	matches.map(x => {
		if (result.indexOf(x) === -1) {
			result.push(x)
		}
	})
})

const ngTranslate = {
	"Culture": "en",
	"Texts": {}
}
result.map(o => {
	const key = o.replace(/'::/igm, "'").replace(/'/igm, '')
	ngTranslate.Texts[key] = ""
})
if (argv.file) {
	fs.writeFileSync(argv.file, JSON.stringify(ngTranslate))
} else {
	console.log(ngTranslate)
}
