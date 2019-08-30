var fs = require('fs')
var path = require('path')

/**
 * 返回传入目录的子文件数据
 * @param {Object} param0 {String} folderPath 文件夹路径
 */
async function scan ({
	folderPath
}) {
	let result = []
	const files = await fs.readdirSync(folderPath)
	for (const filename of files) {
		const fileDirFull = path.join(folderPath, filename)
		const stat = await fs.statSync(fileDirFull)
		const isFile = stat.isFile()
		const isDirectory = stat.isDirectory()
		result.push({
			nameFull: filename,
			name: path.parse(filename).name,
			isFile,
			ext: isFile ? path.extname(filename) : '',
			isDirectory,
			size: stat.size,
			children: isDirectory ? await scan({
				folderPath: fileDirFull
			}) : []
		})
	}
	return result
}

function saveFile (fileName = '', text = '') {
	const writeData = new Uint8Array(Buffer.from(text))
	fs.writeFile(`./${fileName}`, writeData, (err) => {
		if (err) throw err
		console.log('文件已被保存')
	})
}

// ;(async function () {
// 	saveFile('数据.txt', JSON.stringify(await scan(path.resolve('/Users/liyang/Documents/code/blog')), null, 2))
// })()

export default scan