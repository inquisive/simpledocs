//System.set("@loader", System.newModule({ default: System, __useDefault: true }));
//System.liveReloadPort = 9999; // This is optional, defaults to 8012

System
	.import('/_simpledocs-files_/config.js')
	.then(function() {
		System.import('dependencies').catch(console.error.bind(console));
		//System.import('client').catch(console.error.bind(console));	
		System.import('app/app').catch(console.error.bind(console));	
	})
	.catch(console.error.bind(console));
	
