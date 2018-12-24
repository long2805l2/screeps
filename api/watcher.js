const fs = require ('fs');


function watcher ()
{
	var private = {};

	private.watchDir = "";
	
	private.thread = null;

	private.init = function ()
	{
	};

	private.cache = function (file)
	{
		// cache is the file, who save last line watcher ready parse
		// fs.writeFileSync(private.cacheDir + "/" + file.cache, JSON.stringify (file));
	};

	private.addFile = function (fileName)
	{
		let path = private.watchDir + "/" + fileName;
		private.files [fileName] = {
			dir: private.watchDir
		,	name: fileName
		,	path: path
		,	cache: crypto.createHash('md5').update(path).digest("hex")
		,	last: 0
		,	fd: -1
		,	lock: false
		};
	}

	private.watchFile = function (event, fileName)
	{
		console.log ("watcher", fileName);
		private.addFile (fileName);
	};

	var public = {};
	public.init = (wacthDirPath, screepsApi) =>
	{
		private.watchDir = wacthDirPath;
	};

	public.start = () =>
	{
		private.thread = fs.watch(private.watchDir, (event, fileName) => private.watchFile(event, fileName));
	}

	public.stop = () =>
	{
		private.thread.close();
	}

	return public;
}

module.exports = watcher;