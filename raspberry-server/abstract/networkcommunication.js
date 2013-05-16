nodes <- hashmap
tick <- 0
server <- null

Function onHeartbeat returns void
	if not nodes.contains(ip) then
		node.add(ip, tick)
		chooseServer()
	else
		node.add(ip, tick)

	return void

Function checkIfServersExist returns void
	foreach ip in nodes do
		if nodes.get(ip) < tick then
			nodes.remove(ip)
			chooseServer()

	tick <- tick + 1

	return void

Function chooseServer returns void
	server_ip <- 0

	foreach ip in nodes do
		if ip > server_ip then
			server_ip = ip

	server = server_ip

	return void

self.heartbeat_socket.on('message', function(message, remote) {
	if (self.nodes[remote.address] === undefined) {
		self.nodes[remote.address] = self.tick;

		for (var x in (self.callbacks['added'] || [])) {
			self.callbacks['added'][x].call(self, remote.address);
		}

		self.chooseServer();
	} else {
		self.nodes[remote.address] = self.tick;
	}
});

// check if servers still exists
self.interval_check = setInterval(function() {
	// console.log("check if servers still exist");
	// console.log(self.nodes);
	for (var address in self.nodes) {
		if (self.nodes[address] < self.tick) {
			delete self.nodes[address];

			for (var x in (self.callbacks['removed'] || [])) {
				self.callbacks['removed'][x].call(self, address);
			}

			self.chooseServer();
		}
	}

	self.tick++;
}, self.HEARTBEAT_TIMEOUT_INTERVAL);

var self = this,
	max = 0,
	addr = null,
	oldIsServer = this.isServer();

for (var address in self.nodes) {
	var ip = ipToInt(address);

	if (ip > max) {
		max = ip;
		addr = address;
	}
}

this.server = addr;

// if it was not server before, but is now, then run assign
if (oldIsServer === false && this.isServer()) {
	for (var x in (self.callbacks['promoted'] || [])) {
		self.callbacks['promoted'][x].call(self);
	}
// if it was server before, but not now, then run deprive
} else if (oldIsServer === true && !this.isServer()) {
	for (var x in (self.callbacks['demoted'] || [])) {
		self.callbacks['demoted'][x].call(self);
	}
}