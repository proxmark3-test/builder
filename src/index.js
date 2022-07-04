const Docker = require("dockerode");

const docker = new Docker();

const image = require("./image")(docker);

image.buildImage().then((data) => {
	console.log(data);
});
