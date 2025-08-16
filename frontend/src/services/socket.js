import { io } from "socket.io-client";

class SocketService {
	constructor() {
		this.socket = null;
	}

	connect() {
		if (!this.socket) {
			this.socket = io(import.meta.env.VITE_API_URL);
		}
		return this.socket;
	}

	disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	getSocket() {
		return this.socket;
	}
}

export default new SocketService();
