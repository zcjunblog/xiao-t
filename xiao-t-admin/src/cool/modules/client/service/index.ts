import ClientCli from "./cli"
import ClientPlugin from "./plugin"

export default {
	client: {
		cli: new ClientCli(),
		plugin: new ClientPlugin()
	}
}
