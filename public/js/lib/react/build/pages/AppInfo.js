module.exports = React.createClass({
	render: function() {
		return (
			<div id="easter-egg" style={{display:'none'}} >
				<div className="col-xs-offset-1 col-md-offset-1">
					<div className="col-xs-10 col-md-5">
						<h4>Get SimpleDocs</h4>
						<div className="row">
							<div className="col-sm-offset-1 col-sm-11">GitHub &nbsp;&nbsp;&nbsp;<a href="https://github.com/inquisive/simpledocs" target="_blank">source</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="https://github.com/inquisive/simpledocs/archive/latest.zip" target="_blank">latest.zip</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="https://github.com/inquisive/simpledocs/archive/latest.tar.gz" target="_blank">latest.tar.gz</a></div>
							<div className="col-sm-offset-1 col-sm-11">NPM &nbsp;&nbsp;&nbsp;<a href="https://npmjs.org/package/simpledocs" target="_blank">Package Info</a></div>
							<div className="col-sm-offset-1 col-sm-11">Standalone <a href="https://github.com/inquisive/simpledocs-standalone" target="_blank">source</a>&nbsp;|&nbsp;<a href="https://github.com/inquisive/simpledocs-standalone/archive/latest.zip" target="_blank">zip</a>&nbsp;|&nbsp;<a href="https://github.com/inquisive/simpledocs-standalone/archive/latest.tar.gz" target="_blank">gz</a></div>
							
						</div>
						<div style={{borderBottom:'transparent 15px solid'}} />
					</div>
					<div className="col-xs-11 col-md-5">
						<h4>About</h4>
						<div className="row">
							<div className="col-sm-offset-1"><a href="http://simpledocs.inquisive.com/" target="_blank">About / Documents / Demo</a></div>
						</div>
					</div>
					<div className="clearfix" />
					<div className="col-xs-11 col-md-5">
						<h4>Built With</h4>
						<div className="row">
							<div className="col-xs-6 col-sm-4 col-md-3"><a href="http://nodejs.org" target="_blank">nodejs</a></div>
							<div className="col-xs-6 col-sm-4 col-md-3"><a href="http://keystonejs.com" target="_blank">KeystoneJS</a></div>
							<div className="col-xs-6 col-sm-4 col-md-3"><a href="http://getbootstrap.com/" target="_blank">Bootstrap</a></div>
							<div className="col-xs-6 col-sm-4 col-md-3"><a href="http://facebook.github.io/react/docs/thinking-in-react.html" target="_blank">ReactJS</a></div>
							
						</div>
					   
						<div style={{borderBottom:'transparent 15px solid'}} />
					</div>
					<div className="clearfix" style={{borderBottom:'transparent 15px solid'}} />
					<div className="col-xs-11 col-md-10">
						<h4>Theme</h4>
						<div className="row">
							<div title="change theme" className="col-sm-6"> <a style={{cursor:'pointer'}} onClick={snowUI.toggleTheme}>Switch theme</a></div>
							<div title="change ui" className="col-sm-6"> <a style={{cursor:'pointer'}} href={snowUI.path.material}>material-ui</a></div>
							<div className="clearfix" />
							<br />
						</div>
					</div>
					<div className="clearfix" style={{borderBottom:'transparent 15px solid'}} />
			      </div>
			</div>
		);
	}
});
