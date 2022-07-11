const fs = require("fs")


const index = {
  url: "https://raw.githubusercontent.com/isomerase/isocomic-extensions/repo/index.json",
  extensions: {}
}

const ids = process.argv.slice(2)

for (const sourceId of ids) {
  try {
    const { metadata } = require(`../dist/${sourceId}.min`)
    index.extensions[sourceId] = {
      url: `./dist/${sourceId}.min.js`,
      metadata,
    }
  } catch {
    console.warn(`No metadata found for ${sourceId}`)
  }
}
fs.writeFileSync("index.json", JSON.stringify(index, null, 2))
