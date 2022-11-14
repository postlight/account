const fs = require('fs')

const TEXTS_DIR = './src/texts'
const filenames = fs.readdirSync(TEXTS_DIR)

const data = Object.fromEntries(
  filenames
    .filter(f => f.endsWith('.txt'))
    .map((filename) => ([
      filename.replace(/\.txt$/, ''),
      fs.readFileSync(`${TEXTS_DIR}/${filename}`).toString()
    ]))
)

fs.writeFileSync(`${TEXTS_DIR}/compiled.json`, JSON.stringify(data))

console.log('Wrote src/texts/*.txt to src/texts/compiled.json')
