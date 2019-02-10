!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.Datafeeds={})}(this,function(e){"use strict";function t(e,t){function r(){this.constructor=e}u(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}function r(e){if(c){var t=new Date;console.log(t.toLocaleTimeString()+"."+t.getMilliseconds()+"> "+e)}}function s(e){return void 0===e?"":"string"==typeof e?e:e.message}function o(e,t){return 24*("D"===e?t:"M"===e?31*t:"W"===e?7*t:t*parseInt(e)/1440)*60*60}function i(e,t,r){var s=e[t];return Array.isArray(s)?s[r]:s}function n(e,t){return void 0!==e?e:t}function a(e,t,r){var s=e[t];return Array.isArray(s)?s[r]:s}var u=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])},c=!1,l=function(){function e(e,t){this._datafeedUrl=e,this._requester=t}return e.prototype.getBars=function(e,t,r,o){var i=this,n={symbol:void 0!==e.ticker?e.ticker.toUpperCase():"",resolution:t,from:r,to:o};return new Promise(function(e,t){i._requester.sendRequest(i._datafeedUrl,"history",n).then(function(r){if("ok"===r.s||"no_data"===r.s){var s=[],o={noData:!1};if("no_data"===r.s)o.noData=!0,o.nextTime=r.nextTime;else for(var i=void 0!==r.v,n=void 0!==r.o,a=0;a<r.t.length;++a){var u={time:1e3*r.t[a],close:Number(r.c[a]),open:Number(r.c[a]),high:Number(r.c[a]),low:Number(r.c[a])};n&&(u.open=Number(r.o[a]),u.high=Number(r.h[a]),u.low=Number(r.l[a])),i&&(u.volume=Number(r.v[a])),s.push(u)}e({bars:s,meta:o})}else t(r.errmsg)}).catch(function(e){var r=s(e);console.warn("HistoryProvider: getBars() failed, error="+r),t(r)})})},e}(),h=function(){function e(e,t){this._subscribers={},this._requestsPending=0,this._historyProvider=e,setInterval(this._updateData.bind(this),t)}return e.prototype.subscribeBars=function(e,t,s,o){this._subscribers.hasOwnProperty(o)?r("DataPulseProvider: already has subscriber with id="+o):(this._subscribers[o]={lastBarTime:null,listener:s,resolution:t,symbolInfo:e},r("DataPulseProvider: subscribed for #"+o+" - {"+e.name+", "+t+"}"))},e.prototype.unsubscribeBars=function(e){delete this._subscribers[e],r("DataPulseProvider: unsubscribed for #"+e)},e.prototype._updateData=function(){var e=this,t=this;if(!(this._requestsPending>0)){this._requestsPending=0;var o=this;for(var i in e._subscribers)!function(e){o._requestsPending+=1,o._updateDataForSubscriber(e).then(function(){t._requestsPending-=1,r("DataPulseProvider: data for #"+e+" updated successfully, pending="+t._requestsPending)}).catch(function(o){t._requestsPending-=1,r("DataPulseProvider: data for #"+e+" updated with error="+s(o)+", pending="+t._requestsPending)})}(i)}},e.prototype._updateDataForSubscriber=function(e){var t=this,r=this._subscribers[e],s=parseInt((Date.now()/1e3).toString()),i=s-o(r.resolution,10);return this._historyProvider.getBars(r.symbolInfo,r.resolution,i,s).then(function(r){t._onSubscriberDataReceived(e,r)})},e.prototype._onSubscriberDataReceived=function(e,t){if(this._subscribers.hasOwnProperty(e)){var s=t.bars;if(0!==s.length){var o=s[s.length-1],i=this._subscribers[e];if(!(null!==i.lastBarTime&&o.time<i.lastBarTime)){if(null!==i.lastBarTime&&o.time>i.lastBarTime){if(s.length<2)throw new Error("Not enough bars in history for proper pulse update. Need at least 2.");var n=s[s.length-2];i.listener(n)}i.lastBarTime=o.time,i.listener(o)}}}else r("DataPulseProvider: Data comes for already unsubscribed subscription #"+e)},e}(),f=function(){function e(e){this._subscribers={},this._requestsPending=0,this._quotesProvider=e,setInterval(this._updateQuotes.bind(this,1),1e4),setInterval(this._updateQuotes.bind(this,0),6e4)}return e.prototype.subscribeQuotes=function(e,t,s,o){this._subscribers[o]={symbols:e,fastSymbols:t,listener:s},r("QuotesPulseProvider: subscribed quotes with #"+o)},e.prototype.unsubscribeQuotes=function(e){delete this._subscribers[e],r("QuotesPulseProvider: unsubscribed quotes with #"+e)},e.prototype._updateQuotes=function(e){var t=this,o=this;if(!(this._requestsPending>0)){var i=this;for(var n in t._subscribers)!function(t){i._requestsPending++;var n=i._subscribers[t];i._quotesProvider.getQuotes(1===e?n.fastSymbols:n.symbols).then(function(s){o._requestsPending--,o._subscribers.hasOwnProperty(t)&&(n.listener(s),r("QuotesPulseProvider: data for #"+t+" ("+e+") updated successfully, pending="+o._requestsPending))}).catch(function(i){o._requestsPending--,r("QuotesPulseProvider: data for #"+t+" ("+e+") updated with error="+s(i)+", pending="+o._requestsPending)})}(n)}},e}(),d=function(){function e(e,t,r){this._exchangesList=["NYSE","FOREX","AMEX"],this._symbolsInfo={},this._symbolsList=[],this._datafeedUrl=e,this._datafeedSupportedResolutions=t,this._requester=r,this._readyPromise=this._init(),this._readyPromise.catch(function(e){console.error("SymbolsStorage: Cannot init, error="+e.toString())})}return e.prototype.resolveSymbol=function(e){var t=this;return this._readyPromise.then(function(){var r=t._symbolsInfo[e];return void 0===r?Promise.reject("invalid symbol"):Promise.resolve(r)})},e.prototype.searchSymbols=function(e,t,r,s){var o=this;return this._readyPromise.then(function(){var i=[],n=0===e.length;e=e.toUpperCase();for(var a=0,u=o._symbolsList;a<u.length;a++)!function(s){var a=o._symbolsInfo[s];if(void 0===a)return"continue";if(r.length>0&&a.type!==r)return"continue";if(t&&t.length>0&&a.exchange!==t)return"continue";var u=a.name.toUpperCase().indexOf(e),c=a.description.toUpperCase().indexOf(e);if((n||u>=0||c>=0)&&!i.some(function(e){return e.symbolInfo===a})){var l=u>=0?u:8e3+c;i.push({symbolInfo:a,weight:l})}}(u[a]);var c=i.sort(function(e,t){return e.weight-t.weight}).slice(0,s).map(function(e){var t=e.symbolInfo;return{symbol:t.name,full_name:t.full_name,description:t.description,exchange:t.exchange,params:[],type:t.type,ticker:t.name}});return Promise.resolve(c)})},e.prototype._init=function(){for(var e=this,t=this,s=[],o={},i=0,n=this._exchangesList;i<n.length;i++){var a=n[i];o[a]||(o[a]=!0,s.push(e._requestExchangeData(a)))}return Promise.all(s).then(function(){t._symbolsList.sort(),r("SymbolsStorage: All exchanges data loaded")})},e.prototype._requestExchangeData=function(e){var t=this;return new Promise(function(o,i){t._requester.sendRequest(t._datafeedUrl,"symbol_info",{group:e}).then(function(r){try{t._onExchangeDataReceived(e,r)}catch(e){return void i(e)}o()}).catch(function(t){r("SymbolsStorage: Request data for exchange '"+e+"' failed, reason="+s(t)),o()})})},e.prototype._onExchangeDataReceived=function(e,t){var r=this,s=0;try{for(var o=t.symbol.length,a=void 0!==t.ticker;s<o;++s){var u=t.symbol[s],c=i(t,"exchange-listed",s),l=i(t,"exchange-traded",s),h=l+":"+u,f=a?i(t,"ticker",s):u,d={ticker:f,name:u,base_name:[c+":"+u],full_name:h,listed_exchange:c,exchange:l,description:i(t,"description",s),has_intraday:n(i(t,"has-intraday",s),!1),has_no_volume:n(i(t,"has-no-volume",s),!1),minmov:i(t,"minmovement",s)||i(t,"minmov",s)||0,minmove2:i(t,"minmove2",s)||i(t,"minmov2",s),fractional:i(t,"fractional",s),pricescale:i(t,"pricescale",s),type:i(t,"type",s),session:i(t,"session-regular",s),timezone:i(t,"timezone",s),supported_resolutions:n(i(t,"supported-resolutions",s),r._datafeedSupportedResolutions),force_session_rebuild:i(t,"force-session-rebuild",s),has_daily:n(i(t,"has-daily",s),!0),intraday_multipliers:n(i(t,"intraday-multipliers",s),["1","5","15","30","60"]),has_weekly_and_monthly:i(t,"has-weekly-and-monthly",s),has_empty_bars:i(t,"has-empty-bars",s),volume_precision:n(i(t,"volume-precision",s),0)};r._symbolsInfo[f]=d,r._symbolsInfo[u]=d,r._symbolsInfo[h]=d,r._symbolsList.push(u)}}catch(r){throw new Error("SymbolsStorage: API error when processing exchange "+e+" symbol #"+s+" ("+t.symbol[s]+"): "+r.message)}},e}(),p=function(){function e(e,t,r,s){void 0===s&&(s=1e4);var o=this;this._configuration={supports_search:!1,supports_group_request:!0,supported_resolutions:["1","5","15","30","60","1D","1W","1M"],supports_marks:!1,supports_timescale_marks:!1},this._symbolsStorage=null,this._datafeedURL=e,this._requester=r,this._historyProvider=new l(e,this._requester),this._quotesProvider=t,this._dataPulseProvider=new h(this._historyProvider,s),this._quotesPulseProvider=new f(this._quotesProvider),this._configurationReadyPromise=this._requestConfiguration().then(function(e){null===e&&(e={supports_search:!1,supports_group_request:!0,supported_resolutions:["1","5","15","30","60","1D","1W","1M"],supports_marks:!1,supports_timescale_marks:!1}),o._setupWithConfiguration(e)})}return e.prototype.onReady=function(e){var t=this;this._configurationReadyPromise.then(function(){e(t._configuration)})},e.prototype.getQuotes=function(e,t,r){this._quotesProvider.getQuotes(e).then(t).catch(r)},e.prototype.subscribeQuotes=function(e,t,r,s){this._quotesPulseProvider.subscribeQuotes(e,t,r,s)},e.prototype.unsubscribeQuotes=function(e){this._quotesPulseProvider.unsubscribeQuotes(e)},e.prototype.calculateHistoryDepth=function(e,t,r){},e.prototype.getMarks=function(e,t,o,i,n){if(this._configuration.supports_marks){var u={symbol:void 0!==e.ticker?e.ticker.toUpperCase():"",from:t,to:o,resolution:n};this._send("marks",u).then(function(e){if(!Array.isArray(e)){for(var t=[],r=0;r<e.id.length;++r)t.push({id:a(e,"id",r),time:a(e,"time",r),color:a(e,"color",r),text:a(e,"text",r),label:a(e,"label",r),labelFontColor:a(e,"labelFontColor",r),minSize:a(e,"minSize",r)});e=t}i(e)}).catch(function(e){r("UdfCompatibleDatafeed: Request marks failed: "+s(e)),i([])})}},e.prototype.getTimescaleMarks=function(e,t,o,i,n){if(this._configuration.supports_timescale_marks){var u={symbol:void 0!==e.ticker?e.ticker.toUpperCase():"",from:t,to:o,resolution:n};this._send("timescale_marks",u).then(function(e){if(!Array.isArray(e)){for(var t=[],r=0;r<e.id.length;++r)t.push({id:a(e,"id",r),time:a(e,"time",r),color:a(e,"color",r),label:a(e,"label",r),tooltip:a(e,"tooltip",r)});e=t}i(e)}).catch(function(e){r("UdfCompatibleDatafeed: Request timescale marks failed: "+s(e)),i([])})}},e.prototype.getServerTime=function(e){this._configuration.supports_time&&this._send("time").then(function(t){var r=parseInt(t);isNaN(r)||e(r)}).catch(function(e){r("UdfCompatibleDatafeed: Fail to load server time, error="+s(e))})},e.prototype.searchSymbols=function(e,t,o,i){if(this._configuration.supports_search){var n={limit:30,query:e.toUpperCase(),type:o,exchange:t};this._send("search",n).then(function(e){if(void 0!==e.s)return r("UdfCompatibleDatafeed: search symbols error="+e.errmsg),void i([]);i(e)}).catch(function(t){r("UdfCompatibleDatafeed: Search symbols for '"+e+"' failed. Error="+s(t)),i([])})}else{if(null===this._symbolsStorage)throw new Error("UdfCompatibleDatafeed: inconsistent configuration (symbols storage)");this._symbolsStorage.searchSymbols(e,t,o,30).then(i).catch(i.bind(null,[]))}},e.prototype.resolveSymbol=function(e,t,o){function i(e){r("Symbol resolved: "+(Date.now()-n)+"ms"),t(e)}r("Resolve requested");var n=Date.now();if(this._configuration.supports_group_request){if(null===this._symbolsStorage)throw new Error("UdfCompatibleDatafeed: inconsistent configuration (symbols storage)");this._symbolsStorage.resolveSymbol(e).then(i).catch(o)}else{var a={symbol:e.toUpperCase()};this._send("symbols",a).then(function(e){void 0!==e.s?o("unknown_symbol"):i(e)}).catch(function(e){r("UdfCompatibleDatafeed: Error resolving symbol: "+s(e)),o("unknown_symbol")})}},e.prototype.getBars=function(e,t,r,s,o,i){this._historyProvider.getBars(e,t,r,s).then(function(e){o(e.bars,e.meta)}).catch(i)},e.prototype.subscribeBars=function(e,t,r,s,o){this._dataPulseProvider.subscribeBars(e,t,r,s)},e.prototype.unsubscribeBars=function(e){this._dataPulseProvider.unsubscribeBars(e)},e.prototype._requestConfiguration=function(){return this._send("config").catch(function(e){return r("UdfCompatibleDatafeed: Cannot get datafeed configuration - use default, error="+s(e)),null})},e.prototype._send=function(e,t){return this._requester.sendRequest(this._datafeedURL,e,t)},e.prototype._setupWithConfiguration=function(e){if(this._configuration=e,void 0===e.exchanges&&(e.exchanges=[]),!e.supports_search&&!e.supports_group_request)throw new Error("Unsupported datafeed configuration. Must either support search, or support group request");!e.supports_group_request&&e.supports_search||(this._symbolsStorage=new d(this._datafeedURL,e.supported_resolutions||[],this._requester)),r("UdfCompatibleDatafeed: Initialized with "+JSON.stringify(e))},e}(),_=function(){function e(e,t){this._datafeedUrl=e,this._requester=t}return e.prototype.getQuotes=function(e){var t=this;return new Promise(function(o,i){t._requester.sendRequest(t._datafeedUrl,"quotes",{symbols:e}).then(function(e){"ok"===e.s?o(e.d):i(e.errmsg)}).catch(function(e){var t=s(e);r("QuotesProvider: getQuotes failed, error="+t),i("network error: "+t)})})},e}(),m=function(){function e(e){e&&(this._headers=e)}return e.prototype.sendRequest=function(e,t,s){if(void 0!==s){var o=Object.keys(s);0!==o.length&&(t+="?"),t+=o.map(function(e){return encodeURIComponent(e)+"="+encodeURIComponent(s[e].toString())}).join("&")}r("New request: "+t);var i={};return void 0!==this._headers&&(i.headers=this._headers),fetch(e+"/"+t,i).then(function(e){return e.text()}).then(function(e){return JSON.parse(e)})},e}(),b=function(e){function r(t,r){void 0===r&&(r=1e4);var s=new m,o=new _(t,s);return e.call(this,t,o,s,r)||this}return t(r,e),r}(p);e.UDFCompatibleDatafeed=b,Object.defineProperty(e,"__esModule",{value:!0})});
