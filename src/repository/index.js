const path = require("path");

const tmp = require("tmp");
const git = require("simple-git")();

tmp.setGracefulCleanup();

module.exports = (url) => {
	const repository = {
		_tmp: undefined,
		clone: () => {
			repository._tmp = tmp.dirSync({
				unsafeCleanup: true,
				prefix: "proxmark3-builder-repo-"
			});

			return git.clone(url, path.join(repository._tmp.name, "git"));
		},
		cleanup: () => {
			repository._tmp.removeCallback();
		},

		getPath: () => {
			return repository._tmp.name;
		}
	};

	return repository;
};
