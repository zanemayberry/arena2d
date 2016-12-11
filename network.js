var Network = {
	connections: [],
	peer: undefined,
	data_callback: Game.dataReceived
};

Network.broadcast = function (data) {
	for (var conn in Network.connections) {
		Network.connections[conn].send(data);
	}
};

Network.init_connection = function (conn) {
	Network.connections[conn.peer] = conn;
	conn.on('open', function() {
		conn.on('data', Network.data_callback);
	});
};

Network.client_joined = function (conn) {
	Network.init_connection(conn);
};

Network.join = function() {
	var my_peer_id = $('#my_peer_id').val();
	Network.peer = new Peer(my_peer_id, {key: 'fc8gc21axy7ujtt9'});
	var peer_to_join = $('#join_peer_id').val();
	var conn = Network.peer.connect(peer_to_join);
	Network.init_connection(conn);
};

Network.host = function () {
	var my_peer_id = $('#my_peer_id').val();
	Network.peer = new Peer(my_peer_id, {key: 'fc8gc21axy7ujtt9'});
	Game.id = my_peer_id;
	Network.peer.on('connection', Network.client_joined);
};

$(document).ready(function () {
	$('#init_btn').click(Network.host);
	$('#join_btn').click(Network.join);
});
