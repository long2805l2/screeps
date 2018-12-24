const fs = require('fs');
const { ScreepsAPI } = require('screeps-api');

const TOKEN = require('./token');
const config = require('./config');

const api = new ScreepsAPI(
{
	token: TOKEN,
	protocol: 'https',
	hostname: 'screeps.com',
	port: 443,
	path: '/'
});

// api.me().then((user)=>console.log(user));

// api.code.get('default').then(data=>console.log('code',data));

function upload (path, branch)
{
	let list = fs.readdirSync (path + "/" + branch);
	let src = {};

	for (let f in list)
	{
		let file = list [f];
		let content = fs.readFileSync (path + "/" + branch + "/" + file, "utf8");

		let key = file.replace (/\.js/, "");
		src [key] = content;
	}
	api.code.set(branch, src).then ((data) => console.log (JSON.stringify (data)));
}

upload (config.src, "default");