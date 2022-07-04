const os = require("os");
const path = require("path");

module.exports = (docker) => {
	const container = {
		build: (url, tag) => {
			return new Promise((resolve, reject) => {
				docker.run("proxmark3-builder", [
					"bash",
					"/env/build.sh"
				], process.stdout, {
					WorkingDir: "/proxmark3/git",
					NetworkDisabled: true,
					Env: [
						`TAG=${tag}`,
						`CPUS=${os.cpus().length}`
					],
					HostConfig: {
						Mounts: [
							{
								Target: "/proxmark3",
								Type: "bind",
								Source: url
							},
							{
								Target: "/env",
								Type: "bind",
								Source: path.join(__dirname, "../../environment")
							}
						]
					}
				}, {}, function (err, data) {
					if(err || data.StatusCode != 0) {
						return reject(err);
					}

					resolve();
				});
			});
		}
	};

	return container;
};
