const Docker = require("dockerode");

const config = require("./config");

const image = require("./image");
const repository = require("./repository");
const container = require("./container");

const builder = {
	_docker: undefined,

	_init: () => {
		builder._docker = new Docker();
	},

	_prepareEnvironment: [
		(docker) => {
			console.log("Building image...");
			return image(docker).buildImage().then(output => {
				output.filter(out => out.stream || out.errorDetail).forEach(out => {
					if(out.errorDetail) {
						console.error(out.error.trim());

						process.exit(out.errorDetail.code);
					}

					console.log(out.stream.trim());
				});
			});
		}
	],

	prepareEnvironment: () => {
		console.log("Preparing environment...");

		return builder._prepareEnvironment.reduce((prev, cur) => prev.then(() => cur(builder._docker)), Promise.resolve()).then(() => {
			console.log("Prepared environment... Ready to accept commands...");
		});
	},

	build: (url, tag) => {
		const repo = repository(url);

		console.log(`Cloning ${url}`);

		return repo.clone().then(() => {
			console.log(`Building ${url} ${tag}`);

			return container(builder._docker).build(repo.getPath(), tag).then(() => {
				repo.cleanup();
			});
		}).catch(err => {
			repo.cleanup();

			throw err;
		});
	}
};

builder._init();

module.exports = builder;
