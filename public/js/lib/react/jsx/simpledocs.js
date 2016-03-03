/**
 * @jsx React.DOM
 */
 
React.initializeTouchEvents(true);

var yes = true, no = false;

snowUI.UI = {}

var UI = snowUI.UI;

UI.Interval = {
	  intervals: [],
	  setInterval: function() {
		return this.intervals.push(setInterval.apply(null, arguments));
	  },
	  clearIntervals: function(who) {
		who = who - 1;
		if(UI.Interval.intervals.length === 1) {
			//snowlog.log('clear all intervals',this.intervals)
			UI.Interval.intervals.map(clearInterval);
			UI.Interval.intervals = [];
		} else if(who && UI.Interval.intervals[who]) {
			//snowlog.log('clear intervals',who,this.intervals[who])
			clearInterval(UI.Interval.intervals[who]);
		} else {
			//snowlog.log('map intervals',this.intervals)
			UI.Interval.intervals.map(clearInterval);
			UI.Interval.intervals = [];
		}
	  }
};


var Alert = ReactBootstrap.Alert;

UI.Alert = React.createClass({
	getInitialState: function() {
		return {
			isVisible: true
		};
	},
	getDefaultProps: function() {
		return ({showclass:'info'});
	},
	render: function() {
		if(!this.state.isVisible)
		    return null;

		var message = this.props.children;
		return (
		    <Alert bsStyle={this.props.showclass} onDismiss={this.dismissAlert}>
			<p>{message}</p>
		    </Alert>
		);
	},

	dismissAlert: function() {
		this.setState({isVisible: false});
		if(this.props.clearintervals instanceof Array)this.props.clearintervals.map(Link.Interval.clearIntervals);
		if(this.props.cleartimeouts instanceof Array)this.props.cleartimeouts.map(clearTimeout);
	}
});

UI.Man = React.createClass({
	getDefaultProps: function() {
		return ({divstyle:{float:'right',}});
	},
	
	render: function() {
	    
	    return this.transferPropsTo(
		<div style={this.props.divstyle} dangerouslySetInnerHTML={{__html: snowText.logoman}} />
	    );
	}
});

//connect error component
UI.messageDisplay = React.createClass({
	componentDidMount: function() {
		//snowUI.loaderRender();
	},
	componentDidUpdate: function() {
		
	},
	componentDidMount: function() {
		this.componentDidUpdate()
	},	
	render: function() {
	    
	    snowlog.log('warning message component')
	    
	    return (<div  style={{padding:'5px 20px'}} >
			<div className={this.props.type}>
				<span> {this.props.title || 'I have an important message for you.'}</span>
				<div className="message">
					<p>{this.props.message}</p>
				</div>
			</div>
			
		</div>);
	}
});
UI.displayMessage = UI.messageDisplay

/* main content */
UI.Content = React.createClass({
	getInitialState: function() {
		return {ready: yes,register: no,mounted: no,response:no,data:{}};
	},
	componentWillReceiveProps: function(props) {
		snowlog.log(props)
	},
	render: function() {
		
		var renderMe,
			showcomp = this.props.config.page || 'home'
		
		snowlog.log('content component')
		
		if(this.state.error ) {
			
			 renderMe = (<UI.displayMessage   message ={this.state.message} type = 'warning' />)
			
			
		} else if(!this.state.ready) {
			snowlog.warn('empty render for content')
			return (<div />)
		
		} else if(UI[showcomp]) {
			
			var po = UI[showcomp]
			renderMe = (<po config={this.props.config} />)
		
		} else {
			
			renderMe = (<UI.displayMessage  title = '404 Not Found' message = 'I could not find the page you are looking for. ' type = 'requesterror' />)
			 
		}     
		return renderMe;
	},
	componentDidMount: function() {
		// When the component is added let me know
		this.setState({mounted: yes})
	},
	
}); 

/* home content */
UI.home = React.createClass({
	getInitialState: function() {
		return {
			ready: no,
			register: no,
			mounted: no,
			response:no,
			page: false,
			data:{},
		};
		this._update = false;
	},
	componentWillReceiveProps: function(props) {
		snowlog.log('home got props', props)
		if(props.contents.slug || props.contents.ok || props.contents.length || props.config.allinone) {
			var page = this.state.page;
			if(props.page !== this.state.page) {
				this._update = true;
				page = props.page;
			}
			this.setState({ ready: yes, page: page });
		} else {
			this.setState({ ready: no });
		}
	},
	componentDidMount: function() {
		// When the component is added let me know
		this.setState({mounted: yes})
		
	},
	componentDidUpdate: function() {
		if(this._update && this.props.moon !== snowUI.singlePage) {
			
			this._update = false;
		}
	},
	render: function() {
		var _this = this;
		var printMenu = function(pages) {
			//snowlog.log('print menu', pages);
			var list = pages.map(function(v) {
				var onclick = (!_this.props.config.allinone) ?
					_this.props.getPage
				:
					function(e) {
						e.preventDefault();
						_this.props.goToAnchor(v.slug);
					
					}
				return (<div key={v.slug} className="link">
					<a onClick={onclick} href={snowUI.path.root + '/' + v.slug}>{v.title}</a>
					<div className="link">
						{v.documents.length > 0  ? printMenu(v.documents): ''}
					</div>
				</div>)
			});
			return list;
		}
		
		var doc = this.props.contents
		//console.log(this.state.ready,this.props.contents);
		if(this.state.ready && this.props.contents) {
			var doc = this.props.contents;
			var fullpage = [];
			if(doc.length > 1) {
				doc.forEach(function(v) {
					fullpage.push(displayDoc(v, true));
				});
			} else {
				fullpage.push(displayDoc(doc));
			}
			return (<div>
				{fullpage}
			</div>);
			
		} else {
			var menu;
			if(snowUI.tree>0) {
				menu = snowUI.tree.map(function(v) {
					
					return (<div className="" key={v.slug}>
							
							<a className="" onClick={_this.props.getPage} href={snowUI.path.root + '/' + v.slug}>{v.title}</a>
							
							{v.documents.length > 0  ? printMenu(v.documents): ''}
						</div>
					);
					
				});
			}
			return ( <div id=""> 
				<UI.AppInfo  />
				{menu}
			</div>);
		}
		
		function displayDoc( doc, allinone ) {
			if(doc.ok) {
				/* search results */
				var search = true;
				var prev;
				var next;
				var results = doc.results.length;
				if(results > 0) {
					var display = doc.results.map(function(result) {
						var score = result.score;
						var page = result.obj;
						var content = 
							page.display === 1 ? 
								page.markdown ? 
									(<div key="fullcontent"><div dangerouslySetInnerHTML={{__html: page.markdown.html}} /> </div>)
									: <span /> 
								: page.display === 2 ? 
									(<div key="fullcontent" ><div dangerouslySetInnerHTML={{__html:page.html}} /> </div>)
									: page.display === 3 ? 
										(<div key="fullcontent"> <div key="fullcontentB"  dangerouslySetInnerHTML={{__html: page.html}} /><div  key="fullcontentA"  dangerouslySetInnerHTML={{__html: page.html}} /></div>) 
										: page.display === 4 ? 
											(<div key="fullcontent"> <div key="fullcontentA"  dangerouslySetInnerHTML={{__html: page.html}} /><div  key="fullcontentB"  dangerouslySetInnerHTML={{__html: page.markdown.html}} /></div>)
											: <span />  
						return (<div key={score} className="search-result item">
							<div className="title"><h3><a href={snowUI.path.root + '/' + page.slug} className="sdlink" >{page.title}</a></h3></div>
							<div className="score" style={{width:(parseFloat(score)*100) + '%'}} />
							<div className="blurb">{content}</div>
						</div>);
					});
				} else {
					var display = <h4>No results</h4>;
				}
				
			} else {
				/* page data */
				var search = false;
				if(typeof doc !== 'object')doc = {}
				if(typeof doc.parent !== 'object')doc.parent = {}
				var content = 
					doc.display === 1 ? 
						doc.markdown ? 
							(<div key="fullcontent"><div dangerouslySetInnerHTML={{__html: doc.markdown.html}} /> </div>)
							: <span /> 
						: doc.display === 2 ? 
							(<div key="fullcontent" ><div dangerouslySetInnerHTML={{__html: doc.html}} /> </div>)
							: doc.display === 3 ? 
								(<div key="fullcontent"> <div key="fullcontentB"  dangerouslySetInnerHTML={{__html: doc.markdown.html}} /><div  key="fullcontentA"  dangerouslySetInnerHTML={{__html: doc.html}} /></div>) 
								: doc.display === 4 ? 
									(<div key="fullcontent"> <div key="fullcontentA"  dangerouslySetInnerHTML={{__html: doc.html}} /><div  key="fullcontentB"  dangerouslySetInnerHTML={{__html: doc.markdown.html}} /></div>)
									: <span />  
				
				var newcontent = [];
				newcontent.push(<input type="hidden" value={doc.slug} className="hiddenTitle" />)
				newcontent.push(content);
				
				if(doc.type === 1) {
					/* show the content only */
					var display = newcontent;
					
				} else if(doc.type === 2) {
					/* show list of child root documents */
					if(snowUI.menu[doc._id]) {
						var list = snowUI.menu[doc._id].docs;
						var display = printMenu(list)			
					}
					
				} else {
					/* show the contents then a list of child root documents */
					//snowlog.info('show content and child doc list',snowUI.menu,doc._id);
					var display = [];
					if(snowUI.menu[doc._id]) {
						var list = snowUI.menu[doc._id].docs;
						var display = printMenu(list)			
					}
					display.unshift(<div key="dualpage">{newcontent}</div>);
				}
				var prev;
				var next;
				if(snowUI.menu[doc._id]) {
					prev = snowUI.menu[doc.parent._id] ? 
						typeof snowUI.menu[doc.parent._id].docs[doc.order-2] === 'object' ? 
							(<li className="previous"><a href={snowUI.path.root + '/' + snowUI.menu[doc.parent._id].docs[doc.order-2].slug}  onClick={_this.props.getPage}  >&larr; {snowUI.menu[doc.parent._id].docs[doc.order-2].title}</a></li>) 
							: <span /> 
						: <span />;
					next = snowUI.menu[doc._id] ? 
						typeof snowUI.menu[doc._id].docs[0] === 'object' ? 
							(<li className="next"><a href={snowUI.path.root + '/' + snowUI.menu[doc._id].docs[0].slug}  onClick={_this.props.getPage}  >&rarr; {snowUI.menu[doc._id].docs[0].title}</a></li>) 
							: <span /> 
						: <span />;
				} else if(doc.parent) {
					prev = snowUI.menu[doc.parent._id] ?
						typeof snowUI.menu[doc.parent._id].docs[doc.order-2] === 'object' ?
							(<li className="previous"><a href={snowUI.path.root + '/' + snowUI.menu[doc.parent._id].docs[doc.order-2].slug}  onClick={_this.props.getPage}  >&larr; {snowUI.menu[doc.parent._id].docs[doc.order-2].title}</a></li>) 
							:  snowUI.menu[doc.parent.parent] ?
								typeof snowUI.menu[doc.parent.parent].docs[doc.parent.order-1] === 'object' ?
									(<li className="previous"><a href={snowUI.path.root + '/' + snowUI.menu[doc.parent.parent].docs[doc.parent.order-1].slug}  onClick={_this.props.getPage}  >&larr; {snowUI.menu[doc.parent.parent].docs[doc.parent.order-1].title}</a></li>) 
									: <span />
								: <span /> 
						: <span />;
					next = snowUI.menu[doc.parent._id] ?
						typeof snowUI.menu[doc.parent._id].docs[doc.order] === 'object' ? 
							(<li className="next"><a href={snowUI.path.root + '/' + snowUI.menu[doc.parent._id].docs[doc.order].slug}  onClick={_this.props.getPage}  >&rarr;  {snowUI.menu[doc.parent._id].docs[doc.order].title}</a></li>) 
							: snowUI.menu[doc.parent.parent] ?
								typeof snowUI.menu[doc.parent.parent].docs[doc.parent.order] === 'object' ? 
									(<li className="next"><a href={snowUI.path.root + '/' + snowUI.menu[doc.parent.parent].docs[doc.parent.order].slug}  onClick={_this.props.getPage}  >&rarr;  {snowUI.menu[doc.parent.parent].docs[doc.parent.order].title}</a></li>) 
									: <span />
								: <span />
						: <span />;
				}
			}
			var related = []; 
			if(Object.prototype.toString.call(doc.links) !== '[object Array]')
			{
				doc.links=[];
			}
			if(doc.links.length > 0) {
				related = doc.links.map(function(v){
					return (<div className="related-bubble" key={v.slug + 'related'} ><a className="badge bg-primary" onClick={_this.props.getPage} href={snowUI.path.root + '/' + v.slug}>{v.title}</a></div>);
				});
			}
			if(doc.externalLinks) {
				var ll = doc.externalLinks.replace(',',' ').split(' ');
				ll.forEach(function(v){
					related.push(<div className="related-bubble" key={v + 'linksE'}><a  className="badge bg-primary" target="_blank" href={v}>{v}</a></div>);
				});
			}
			if(related.length>0) {
				related.unshift(<div className="related" key="related">Related</div>);
			}
			if(!allinone) {
				var navLinks = (<div className="clearfix linkPager">
					<nav className="">
						<ul className="pager">
							{prev}
							<li><a href={snowUI.path.root + '/'} onClick={_this.props.getPage}><span className="glyphicon glyphicon-home" /></a></li>
							{next}
							
						</ul>
					</nav>
				</div>)
			} else {
				var navlinks = <span />;
			}
			return ( <div id="showconent" key={doc._id}> 
					<UI.AppInfo  />
				{display}
				<div className="clearfix ">
					{related}
				</div>
				{navLinks}
			</div>);
			
		}
	},
	
});

/* shortcut content */
UI.Menu = React.createClass({
	getInitialState: function() {
		return {
			ready: yes,
			register: no,
			mounted: no,
			response:no,
			data:{}
		};
	},
	componentWillReceiveProps: function(props) {
		snowlog.log('menu', props);
	},
	componentDidMount() {
		
	},
	render: function() {
		snowlog.info('menu tree',snowUI.tree);
		var _this = this;
		var propPage = this.props.page;
		var runTree = function(slug, children) {
			/* run through the kids and see if one of them is active so we can show the kid links */
			if(Object.prototype.toString.call( children ) === '[object Array]' ) {
				return children.reduce(function(runner, current) {
					//snowlog.log(current.slug,slug);
					if(runner) {
						return runner;
					}
					if(current.slug === slug || (snowUI.menu[current.parent] && snowUI.menu[current.parent].slug === slug)) {
						snowlog.log(true, current.slug, slug);
						runner = true
						return runner;
					}
					return runTree(slug, current.documents); 
				},false); 
				
			} else {
				return false;
			}
		};
		var printMenu = function(pages, skiptree) {
			var list = pages.map(function(v) {
				var active = propPage === v.slug ? 'active' : '';
				var rantree = active === 'active' && !snowUI.singleBranch 
					? true 
					: skiptree === undefined 
						? runTree(propPage, v.documents) 
						: skiptree;
				var collapse = snowUI.collapse ? rantree === true || active === 'active' ? ' ': ' hidden' : ' ';
				//snowlog.log('should menu list be open', collapse, snowUI.collapse, rantree, active, snowUI.singleBranch, v.slug, _this.props.page);

				if(_this.props.config.allinone) {
					var linkto = <a 
						className={"list-group-item " + active}
						onClick={function(e) {
							e.preventDefault();
							_this.props.goToAnchor(v.slug);
						}} 
						href={"#" + v.slug}
					>{v.menuTitle || v.title}</a>;
				} else {
					var linkto = <a className={"list-group-item " + active} onClick={_this.props.hrefRoute} href={snowUI.path.root + '/' + v.slug}>{v.menuTitle || v.title}</a>;
				}
				return (<div key={v.slug} className="">
						{linkto}
						<div className={"link " + collapse}>
							{printMenu(v.documents )}
						</div>
					</div>)
			});
			return list;
		}
		
		var menu = snowUI.tree.map(function(v) {
			var active = propPage === v.slug ? 'active' : '';
			/* our first entry is the root document
			 * printMenu takes care of the children
			* */
			var allinone = !snowUI.allinone || v.documents.length < 1 ?
				<span />
			:
				(_this.props.config.allinone) ?
					<a className={"list-group-item " + active} onClick={_this.props.hrefRoute} href={snowUI.path.root + '/' + v.slug }>method view</a>
				:
					<a className="list-group-item" onClick={_this.props.hrefRoute} href={snowUI.path.root + '/' + snowUI.singlePage }>single page view</a>
			if(_this.props.config.allinone) {
				var linkto = <a className={"list-group-item " + active} onClick={function(e) {
							e.preventDefault();
							_this.props.goToAnchor(v.slug);
						}} 
					href={"#" + v.slug}>{v.menuTitle || v.title}</a>;
			} else {
				var linkto = <a className={"list-group-item " + active} onClick={_this.props.hrefRoute} href={snowUI.path.root + '/' + v.slug}>{v.menuTitle || v.title}</a>;
			}
			return (<div className="list-group" key={v.slug}>
					
					<div className="search-slider">
						<input className="form-control" placeholder="Search" title="Press Enter to submit search" />
					</div>
					<div style={{position:'relative'}}>
						<a className="list-group-item head" onClick={_this.props.toggleMenu} >{snowText.menu}</a>
					</div>
					<div key={v.slug} style={{position:'relative'}}>
						{linkto}
						<span className="glyphicon glyphicon-search searchToggle"  onClick={_this.searchToggle} />
					</div>
					<div style={{position:'relative'}}>
						{allinone}
					</div>
					{printMenu(v.documents)}
				</div>
			);
		});
		return (
			<div> 
				{menu}
			</div>
		);
	},
	searchToggle: function(e) {
		$(e.target).parent().prev().prev().toggleClass('open');
		var $input = $(e.target).parent().prev().prev().find('input');
		$input.val('');
		$input.focus();
		$input.keypress(function( event ) {
			if ( event.which == 13 ) {
				event.preventDefault();
				bone.router.navigate("search:doc/" + $input.val(), {trigger:true});
			}
		});
	}
});

/* main banner */
UI.Banner = React.createClass({
	getInitialState: function() {
		var now = new Date();
		return {mounted: false};
	},
	openEgg: function() {
		$('#easter-egg').slideToggle();
		$("#simpledocs").animate({ scrollTop: 0 }, 200);
		return false;
	},
	render: function() {
		var banner =	<div className="banner-inside" >
					<div id="name" className="col-xs-4 col-sm-4 col-md-3 col-lg-2">
						<div className="inside">{snowUI.name}</div>
					</div>
					<div id="title" className="col-xs-6 col-sm-4 col-md-9 col-lg-10">
						<div className="inside">{typeof this.props.page === 'object' && this.props.page.term ? 'search: ' + this.props.page.term : this.props.title}</div>
					</div>
					<div id="logo">
						<a onClick={this.openEgg} />
					</div>
				</div>;
			   
		return ( <div id="banner" > {banner} </div>);
	},
	componentDidMount: function() {
		// When the component is added, turn it into a modal
		this.setState({mounted: !this.state.mounted});
	}
});
	

/* main div */
UI.UI = React.createClass({
	getInitialState: function() {
		return { 
			pagedata: false,
			allinone: false
		};
	},
	componentDidMount: function() {
		this.componentWillReceiveProps(this.props);
		snowlog.log('did mount')
		snowUI.loadApiCode();
		var $menu = $('#menu');
		var $home = $('#home');
		var clientHeight = document.documentElement.clientHeight;
		var appbar = document.getElementById('banner');
		$menu.css('height', clientHeight - appbar.clientHeight);
		$menu.css('marginTop',appbar.clientHeight);
		$home.css('maxHeight', clientHeight - appbar.clientHeight);
		$home.css('marginTop',appbar.clientHeight);
		snowlog.log('menu', menu.style.height , clientHeight - appbar.clientHeight);
	},
	componentDidUpdate() {
		
	},
	componentWillReceiveProps: function(props) {
		snowlog.log('update props',props)
		var _this = this;
		
		if(props.moon === snowUI.singlePage) {
			return;
		}
		
		this.getPage(props.page, props.moon);
		return;
	},
	getPage: function(getpage, moon) {
		this.setState({
			connecting:true,
			pagedata: false,
			searchdata: false,
		});
		var page = getpage ? getpage : snowUI.homepage;
		if(page === snowUI.singlePage) {
			page = 'allinone';
			var root = snowUI.api.allinone;
		} else if(moon === 'search:doc') {
			var root = snowUI.api.search;
		} else {
			var root = snowUI.api.page;
		}
		var _this = this,
			url = root + '/' + page
			data = {};
		
		
		var showLoadingIfTimer = setTimeout(function(){snowUI.flash('message','Loading ' + page,10000)},500);
		
		//snowlog.log('target',$(e.target)[0].dataset.snowslug);
		snowUI.ajax.GET(url, data, function(resp) {
			clearTimeout(showLoadingIfTimer);
			snowlog.info('page', resp)
			snowUI.killFlash('message');
			if(resp.search) {
				
				//console.log('got search results',resp);
				if(!_this.state.ready)snowUI.flash('message','Welcome to '+snowText.build.name+'.',8888);
				var _state={
					allinone: false
				}
				_state.searchdata = resp.search;
				_state.pagedata = false;
				_state.connecting = false;
				_state.ready = true; 
				document.title = 'Search Results';
				_this.setState(_state);
				
				var selector = $("#menu");
				if(selector.css('height') !== '45px' && selector.find('.dropdown').css('display') === 'block')_this.toggleMenu();
			
			} else if(resp.page) {

				if(!_this.state.ready) {
					snowUI.flash('message', 'Welcome to '+snowText.build.name+'.', 1000);
				}
				var _state={
					allinone: _this.props.allinone
				}
					
				_state.pagedata = resp.page;
				_state.searchdata = false;
				_state.connecting = false;
				_state.ready = true;
				document.title = resp.page.title || _this.props.page || snowUI.name;
				_this.setState(_state, function() {
					snowlog.log('### run new page js ###############################S');
					snowUI.apiCode();
					Prism.highlightAll();
				});
				bone.router.navigate(getpage, {trigger:false});
				var selector = $("#menu");
				if(selector.css('height') !== '45px' && selector.find('.dropdown').css('display') === 'block') {
					_this.toggleMenu();
				}
			} else {
				snowlog.error(resp);
				if(!getpage || !_this.state.ready) {
					snowUI.flash('message','Welcome to '+snowText.build.name+'. Please select a document.',8888);
				} else {
					snowUI.flash('error','' + resp.error) ;
				}
				var _state={}
				_state.connecting = false;
				_state.pagedata = {};
				_state.searchdata = false;
				_state.ready = true;
				_this.setState(_state);
			}
			return false;
		});
		
	},
	handleBannerChange: function(e) {
		e.preventDefault();
	},
	handleActionChange: function(e) {
		e.preventDefault();
	},
	hrefRoute: function(route) {
		route.preventDefault();
		var _this = this;
		var newroute = $(route.target);
		
		snowlog.log('href loader route',snowUI.path.root,newroute);
		var moon =  newroute[0] ? newroute.closest('a')[0].pathname : false;
		if(moon) {
			moon = moon.replace((snowUI.path.root + "/"), '');
			snowlog.log('moon owner', moon);
			bone.router.navigate(moon, {trigger:true});
		} else {
			snowUI.flash('error','Link error',2000);
			_this.setState({showErrorPage:false});
		}		
		
		return false
	},
	goToAnchor: function(route) {
		//$('#simpledocs').scrollTo('#' + route,{duration:'slow', offsetTop : '50'});		
		var simple = document.getElementById("simpledocs");
		var goto = document.getElementById(route).offsetTop;
		simple.scrollTop = goto - 20;
		bone.router.navigate(snowUI.singlePage + '/' + route, {trigger: false});
		snowlog.log('gotoanchor', route);
		this.setProps({
			page: route,
			moon: snowUI.singlePage,
			allinone: true,
		});
		return false
	},
	_toggled: false,
	toggleMenu: function(e) {
		if(e)e.stopPropagation();
		var _this = this;
		var selector = $("#menu");
		if(parseFloat($(document).width()) > snowUI.breaks.small.width) return false; 
		if(!this._toggled) {
			selector
				.data('oHeight',selector.height())
				.css('height','auto')
				.data('nHeight',selector.height())
				.height(selector.data('oHeight'))
				.animate({height: selector.data('nHeight')+50},400, function() {
					selector.find('.dropdown').addClass('open');
					selector.find('.dropspan').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
					selector.css('overflow','auto');
					_this._toggled = true;
				})
				
			
		} else {
			selector.animate({height: 45}, 'slow', function(){ 
				snowlog.info('Slide Up Transition Complete');
				selector.css("height","");
				selector.find('.dropdown').removeClass('open');
				selector.find('.dropspan').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
				selector.css('overflow','hidden');
				_this._toggled = false;
			});
			
		}
		return false;	
	},	
	render: function() {
		snowlog.log('state',this.state)
		var page = this.state.searchdata || this.state.pagedata || {};
		return (
			<div>
				<UI.Banner title={page.title || this.props.page} page={page} onActionChange={this.handleBannerChange} />
				<div id="menuspy" />
				<div className="col-xs-12 col-sm-4 col-md-3 col-lg-2"  id="menu" >
					<div className="dropdown" onClick={this.toggleMenu}><span className="dropspan glyphicon glyphicon-chevron-down" /></div>
					<UI.Menu config={this.state} hrefRoute={this.hrefRoute} goToAnchor={this.goToAnchor}  getPage={this.getPage} toggleMenu={this.toggleMenu} page={this.props.page} moon={this.props.moon} />
				</div>
				<div className="col-xs-12 col-sm-offset-4 col-sm-8 col-md-offset-3 col-md-9 col-lg-offset-2 col-lg-10"  id="home">
					<UI.home config={this.state} goToAnchor={this.goToAnchor} getPage={this.hrefRoute} contents={this.state.searchdata || this.state.pagedata} page={this.props.page} moon={this.props.moon} />
				</div>
				
				
			</div>	
		);
	}
});	

//app info
UI.AppInfo = React.createClass({
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



	
