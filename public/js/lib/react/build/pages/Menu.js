module.exports = React.createClass({
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
