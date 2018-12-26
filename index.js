const fs = require('fs');
var readline = require('readline');
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

function input(prompt, callback)
{
	let rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	
    rl.question(prompt, function (x) {
        rl.close();
        callback(x);
    });
}

function main()
{
	input("command: ", (param) => 
	{
		param = param.trim().split (" ");
		let cmd = param [0];
		let isQuit = false;
		switch (cmd)
		{
			case "upload":
				upload (config.src, "default");
				break;

			case "download":
				api.code.get('default').then(data=>console.log('code',data));
				break;

			case "info":
				api.me().then((user)=>console.log(user));
				break;

			case "quit":
				isQuit = true;
				break;

			default:
				console.log ("don't support cmd '" + cmd + "'");
				break;
		}

		if (isQuit)
			console.log ("service completed ...");
		else
			process.nextTick(() => main());
	});
}

main ();