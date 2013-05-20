require('buster').spec.expose();

var _ = require('underscore'),
	Dependencies = require('./lib/networkcommunication-dependencies').Dependencies,
	NetworkCommunication = require('./../lib/networkcommunication');

describe("NetworkCommunication", function() {
	beforeAll(function() {
		this.timeout = 1000 * 5;
	});

	before(function() {
		var self = this;

		this.dependencies = new Dependencies();

		this.network = this.dependencies.network;
		this.dgram = this.dependencies.dgram;

		this.ip  = function(ip) {
			return '192.168.0.' + ip;
		};

		this.node = function(address) {
			return new NetworkCommunication({
				dgram: self.dgram(self.ip(address)),
				ip: self.ip(address)
			});
		};
	});

	it("should act server, if the only node in network", function(done) {
		var node_1 = this.node(1);
	
		node_1.listen();

		setTimeout(function() {
			expect(node_1.isServer()).toBeTrue();

			node_1.close();
			done();
		}, 250);
	});

	it("should choose the node with highest ip as server, if more nodes are present in network", function(done) {
		var node_1 = this.node(1);
		var node_2 = this.node(2);
		var node_3 = this.node(3);

		node_1.listen();
		node_2.listen();
		node_3.listen();

		setTimeout(function() {
			expect(node_1.isServer()).toBeFalse();
			expect(node_2.isServer()).toBeFalse();
			expect(node_3.isServer()).toBeTrue();

			node_1.close();
			node_2.close();
			node_3.close();

			done();
		}, 250);
	});

	it("should perform reelection of server, when nodes gets added and removed in network", function(done) {
		var node_1 = this.node(1);
		var node_2 = this.node(2);
		var node_4 = this.node(4);
		var node_3 = this.node(3);

		node_1.listen();

		setTimeout(function() {
			expect(node_1.isServer()).toBeTrue();

			node_2.listen();

			setTimeout(function() {
				expect(node_1.isServer()).toBeFalse();
				expect(node_2.isServer()).toBeTrue();

				node_4.listen();

				setTimeout(function() {
					expect(node_1.isServer()).toBeFalse();
					expect(node_2.isServer()).toBeFalse();
					expect(node_4.isServer()).toBeTrue();

					node_3.listen();

					setTimeout(function() {
						expect(node_1.isServer()).toBeFalse();
						expect(node_2.isServer()).toBeFalse();
						expect(node_3.isServer()).toBeFalse();
						expect(node_4.isServer()).toBeTrue();

						node_4.close();

						setTimeout(function() {
							expect(node_1.isServer()).toBeFalse();
							expect(node_2.isServer()).toBeFalse();
							expect(node_3.isServer()).toBeTrue();

							node_2.close();

							setTimeout(function() {
								expect(node_1.isServer()).toBeFalse();
								expect(node_3.isServer()).toBeTrue();

								node_3.close();

								setTimeout(function() {
									expect(node_1.isServer()).toBeTrue();

									node_1.close();

									done();
								}, 500);
							}, 500);
						}, 500);
					}, 500);
				}, 500);
			}, 500);
		}, 500);
	});

	it("should emit promoted callbacks when node is elected server", function(done) {
		var node_1 = this.node(1);

		var after = _.after(2, function() {
			node_1.close();
			done();
		});

		node_1.on('promoted', function() {
			expect(true).toEqual(true);
			after();
		});
		node_1.on('promoted', function() {
			expect(true).toEqual(true);
			after();
		});

		node_1.listen();
	});

	it("should emit demoted callbacks when node is server, and then another node is elected server", function(done) {
		var node_1 = this.node(1);
		var node_2 = this.node(2);

		var after = _.after(2, function() {
			node_1.close();
			node_2.close();

			done();
		});

		node_1.on('demoted', function() {
			expect(true).toEqual(true);
			after();
		});

		node_1.on('demoted', function() {
			expect(true).toEqual(true);
			after();
		});

		node_1.listen();

		setTimeout(function() {
			node_2.listen();
		}, 250);
	});

	it("should emit added callbacks when a node is added to the network", function(done) {
		var node_1 = this.node(1);
		var node_2 = this.node(2);
		var node_3 = this.node(3);

		var after = _.after(8, function() {
			node_1.close();
			node_2.close();
			node_3.close();

			done();
		});

		node_1.on('added', function() {
			expect(true).toEqual(true);
			after(); // should be called 3 times (1, 2, and 3)
		});

		node_1.on('added', function() {
			expect(true).toEqual(true);
			after(); // should be called 3 times (1, 2, and 3)
		});

		node_2.on('added', function() {
			expect(true).toEqual(true);
			after(); // should be called 2 times (2 and 3)
		});

		node_1.listen();

		setTimeout(function() {
			node_2.listen();

			setTimeout(function() {
				node_3.listen();
			}, 250);
		}, 250);
	});

	it("should emit removed callbacks when a node is removed from the network", function(done) {
		var node_1 = this.node(1);
		var node_2 = this.node(2);
		var node_3 = this.node(3);

		var after = _.after(5, function() {
			done();
		});

		node_1.on('removed', function(adr) {
			expect(true).toEqual(true);
			after(); // should be called 2 times (3 and 2)
		});

		node_1.on('removed', function(adr) {
			expect(true).toEqual(true);
			after(); // should be called 2 times (3 and 2)
		});

		node_2.on('removed', function(adr) {
			expect(true).toEqual(true);
			after(); // should be called 1 times (3)
		});

		node_1.listen();
		node_2.listen();
		node_3.listen();

		setTimeout(function() {
			node_3.close();

			setTimeout(function() {
				node_2.close();

				setTimeout(function() {
					node_1.close();
				}, 500);
			}, 500);
		}, 500);
	});

	it("a server node should be able to receive a message from a client", function(done) {
		var client = this.node(1);
		var server = this.node(10);

		client.listen();
		server.listen();

		server.on('clientMessage', function(message) {
			expect(message).toEqual("hi from client");

			client.close();
			server.close();

			done();
		});

		setTimeout(function() {
			client.sendMessageToServer("hi from client");
		}, 250);
	});

	it("a server node should be able to receive messages from more clients", function(done) {
		var server = this.node(10);
		var client_1 = this.node(1);
		var client_2 = this.node(2);

		var after = _.after(2, function() {
			server.close();
			client_1.close();
			client_2.close();

			done();
		});

		server.listen();
		client_1.listen();
		client_2.listen();

		server.on('clientMessage', function(message) {
			expect(message).toMatch(/hi from client (1|2)/);
			after();
		});

		setTimeout(function() {
			client_1.sendMessageToServer("hi from client 1");

			setTimeout(function() {
				client_2.sendMessageToServer("hi from client 2");
			}, 250);
		}, 250);
	});

	it("a server node should be able to send itself a client message", function(done) {
		var node = this.node(1);

		node.on('serverMessage', function(message) {
			expect(message).toEqual('hi from server');

			node.close();

			done();
		});

		node.listen();

		setTimeout(function() {
			node.sendMessageToClients('hi from server');
		}, 250);
	});

	it("a server node should be able to send messages to multiple clients", function(done) {
		var client_1 = this.node(1);
		var client_2 = this.node(2);
		var server = this.node(10);

		var after = _.after(4, function() {
			client_1.close();
			client_2.close();
			server.close();

			done();
		});

		client_1.on('serverMessage', function(message) {
			expect(message).toEqual('hi from server');
			after();
		});

		client_1.on('serverMessage', function(message) {
			expect(message).toEqual('hi from server');
			after();
		});

		client_2.on('serverMessage', function(message) {
			expect(message).toEqual('hi from server');
			after();
		});

		server.on('serverMessage', function(message) {
			expect(message).toEqual('hi from server');
			after();
		});

		client_1.listen();
		client_2.listen();
		server.listen();

		setTimeout(function() {
			server.sendMessageToClients('hi from server');
		}, 250);
	});
});