module.exports = (docker) => {
	const container = {
		build: (url, tag) => {
			return new Promise((resolve, reject) => {
				docker.run("proxmark3-builder", [
					"bash",
					"-c",
					"make -j 8"
				], process.stdout, {
					WorkingDir: "/proxmark3/git",
					NetworkDisabled: true,
					HostConfig: {
						Mounts: [
							{
								Target: "/proxmark3",
								Type: "bind",
								Source: url
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
