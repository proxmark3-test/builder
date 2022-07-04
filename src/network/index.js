module.exports = (docker) => {
	const network = {
		_prefix: "proxmark3-builder-network-",

		listNetworks: () => {
			return new Promise((resolve, reject) => {
				docker.listNetworks({
					name: network._prefix,
				}, (err, networks) => {
					if(err) {
						return reject(err);
					}

					resolve(networks);
				});
			});
		},

		createNetwork: (networkName) => {
			return new Promise((resolve, reject) => {
				docker.createNetwork({
					Name: networkName,
					Driver: "bridge",
					Internal: true
				}, (err, response) => {
					if(err) {
						return reject(err);
					}

					console.log(`Created network ${networkName} with ID ${response.id}`);

					resolve(response);
				});
			});
		},
		createNetworks: (count) => {
			// TODO: make sure network props should not be changed

			const networks = Array(count).fill(true).map((_, i) => {
				return `${network._prefix}${i + 1}`;
			});

			return network.listNetworks().then(oldNetworks => {
				const existingNetworks = {};

				oldNetworks.forEach(net => existingNetworks[net.Name] = net);

				networks.filter(net => existingNetworks[net]).map(net => existingNetworks[net]).forEach(net => {
					console.log(`${net.Name} already exists with ID ${net.Id}`);
				});

				return Promise.all(networks.filter(net => existingNetworks[net] == undefined).map(networkName => {
					return network.createNetwork(networkName);
				}));
			});
		}
	};

	return network;
};
