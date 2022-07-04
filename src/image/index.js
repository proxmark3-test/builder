const path = require("path");

module.exports = (docker) => {
	const image = {
		_buildImage: (name) => {
			name = name || "proxmark3-builder";

			return new Promise((resolve, reject) => {
				docker.buildImage({
					context: path.join(__dirname, "../../environment"),
					src: ["Dockerfile"]
				}, {
					t: name
				}, function (err, stream) {
					if(err) {
						return reject(err);
					}

					resolve(stream);
				});
			});
		},

		buildImage: (name) => {
			return new Promise((resolve, reject) => {
				image._buildImage(name).then(stream => {
					docker.modem.followProgress(stream, (err, response) => {
						if(err) {
							return reject(err);
						}

						resolve(response);
					});
				}).catch(reject);
			});
		}
	};

	return image;
};
