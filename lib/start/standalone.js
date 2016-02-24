var	dashes = '\n------------------------------------------------\n';

module.exports = function(keystone, callback) {
	
	var simpledocs = this;
	
	var page = simpledocs.get('route');
	
	var config = {};
	
	keystone.init({
	
		'name': config.name || simpledocs.get('name') || 'simple documentation',
		'brand': config.brand || simpledocs.get('brand') || 'inquisive',

		'favicon': config.favicon || simpledocs.get('favicon') || '/snowdocs/favicon.ico',
		'less': config.less || simpledocs.get('less') || false,
		'static': config.static || simpledocs.get('static') || simpledocs.get('moduleDir') + "/public",

		'views': config.views ||  simpledocs.get('views') || simpledocs.get('moduleDir') + '/templates/views',
		'view engine': config.viewengine || simpledocs.get('view engine') || 'jade',
				
		'signin redirect': config.redirect || simpledocs.get('signin redirect') ||  '/',
		
		'auto update': false,
		
		'mongo': config.mongo ||  process.env.MONGO_URI || simpledocs.get('mongo') ,
		
		'port': config.port || simpledocs.get('port') || 12111,
		
		'ssl': config.ssl || simpledocs.get('ssl') || false,
		'ssl port': config.sslport || simpledocs.get('ssl port') || 12222,
		'ssl key': config.sslkey || simpledocs.get('ssl key') || false,
		'ssl cert': config.sslcert || simpledocs.get('ssl cert') || false,
		
		'session': config.session || simpledocs.get('session') || true,
		'session store': config.sessionstore || simpledocs.get('session store') || 'mongo',
		'session options': {
			key: config.sessionkey || simpledocs.get('session key') || 'simpledocs.sid',
		},
		'auth': config.auth || simpledocs.get('auth') || true,
		
		'user model': simpledocs.get('model user')  || 'User',
		
		'cookie secret': config.cookiesecret ||  process.env.COOKIE_SECRET || simpledocs.get('cookie secret') || 'oi87BTI6R(^*%$89r9C55ER8658E6w5754wsv754csw75',
		
		'trust proxy': config.trustproxy || simpledocs.get('trust proxy') || true,
		
		'allow register': config.register || simpledocs.get('allow register') || true,
				
		// the default mandrill api key is a *test* key. it will 'work', but not send emails.
		'mandrill api key': config.mandrill || process.env.MANDRILL_KEY || simpledocs.get('mandrill api key') || 'v17RkIoARDkqTqPSbvrmkw',

		'wysiwyg override toolbar': false,
		'wysiwyg menubar': true,
		'wysiwyg skin': 'keystone',
		'wysiwyg images': true,
		'wysiwyg cloudinary images': false,
		'wysiwyg additional buttons': 'searchreplace visualchars,'
		 + ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
		 +' emoticons media, preview print ',
		'wysiwyg additional plugins': 'example, table, advlist, anchor,'
		 + '  autosave, bbcode, charmap, contextmenu, '
		 + ' directionality, emoticons, fullpage, hr, media, pagebreak,'
		 + ' paste, preview, print, searchreplace, textcolor,'
		 + ' visualblocks, visualchars, wordcount',
	});

	keystone.set('locals', {
		
		env: simpledocs.get('env'),
		ssl: simpledocs.get('ssl'),
		sslport: simpledocs.get('ssl port'),
		sslhost: simpledocs.get('ssl host'),
		host: simpledocs.get('host'),
		title: config.title || simpledocs.get('name') || 'simple documentation',
		
	});
	
	keystone.set('routes', callback);
	
	/* emit an event for you to add your own keystone */
	simpledocs.emit('keystone', keystone);
	
	keystone.start({
		onMount: function() {
			
		},
		onStart: function() {
			/* add the sockets for material-ui pages */
			simpledocs.sockets();
		}
	});
}
/**
 * 2014 snowkeeper
 * github.com/snowkeeper
 * npmjs.org/snowkeeper
 * 
 * Peace :0)
 * 
 * */
