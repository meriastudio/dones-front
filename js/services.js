var DonesUrl = 'http://memset.Donessearch.com/nyt/api';
var baseUrl = './services/api.php';
var access_token = 'EV^>Ah0:!COMPSimon';

var loadingobj;
var loadingobj2;
var loadingobj3;
var loadingobj4;//key document neighbor document list
var loadingConfig = {
        container:jQuery(".results"),
        loadingtext: 'Loading...'
    };

//<!-- constant variable
var DEFUALT_META_NUM_TOPIC = 3;//
var DEFUALT_META_NUM_NEIGHBOR = 10;//
var DEFUALT_LIB_NUM_NEIGHBOR = 10;//

var META_TOPICS_VALUES = [];//META PAGE TAGS
var NEIGHBORS_ALL_VALUES = [];//META PAGE ALL NEIGHBORS
var NEIGHBORS_TOPIC_VALUES = [];//METADATA GENERATER PAGE/NEIGHBOR LIST
var DOC_CUSTOM_VALUES = [];//META PAGE, DL PAGE CUSTOMER DATA
var DL_NEIGHBORS_VALUES = [];//DIGITAL LIBRARY PAGE/NEIGHBORS LIST
var KS_RESULT_VALUES = [];//KEYWORD SEARCH RESULT LIST
var KS_RESULT_TAG_VALUES = [];//KEYWORD SEARCH RESULT LIST
var SE_RESULT_VALUES = [];//SEARCH BY EXAMPLE RESULT LIST
var SEARCH_NUM_CLUSTERS = 57;//'';//Keyword Search page result num
var SEARCH_NUM_DOCUMENTS = 47;//'';//Keyword Search page Related Documents num
var SEARCH_KS_NEIGHBOR_NUM = 10;//'';//Keyword Search page Neighbor Documents num

var KS_KEYDOC_VALUES = [];//Matched Document Infomation
var KS_RELDOC_VALUES = [];//Related Documetns Page

var KS_NEIGHBOR_VALUES = [];//Related Documetns Page
//-->
var monthNames = [
			  "January", "February", "March",
			  "April", "May", "June", "July",
			  "August", "September", "October",
			  "November", "December"
			];
var timerStart = Date.now();
function initStartTime(){timerStart = Date.now();}
function getElapsedTime(){return Date.now()-timerStart;}
//********
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;

var app = {
    initialize: function() {
    	/*
    	var pageID = $.cookie('pageID');
		if(pageID != "home"){
			var metaneighbor_option = '';
	    	for(var i=1; i<=30; i++){
	    		metaneighbor_option += '<option title="'+i+' neighbor" value="'+i+'" '
	    									+'data-content="<span class=\'topic-number\'>'+i+'</span>'
										  				  +'<span class=\'topic-hover\'>'
	    													+''
	    												  +'</span>">'
										+i+'</option>';
	    	}

	        $('select[id=metaneighbor]')
	        	.html(metaneighbor_option)
	        	.selectpicker('refresh');
		}
      	*/
    }
};

$(document).ready(function () {
	app.initialize();

	$('#fine-uploader-manual-trigger').fineUploader({
		template: 'qq-template-manual-trigger',
		autoUpload: true,
		multiple: false,
		interceptSubmit: false,
		debug: false,
		request: {
			endpoint: '/dones-front/services/api.php/base/upload',
			params: {access_token:access_token}
		},
		deleteFile: {
	        enabled: true, // defaults to false
	        forceConfirm: false,
	        endpoint: '/dones-front/services/api.php/base/delete',
	        method: 'POST',
	        params: {access_token:access_token, qqfile_url: $.cookie("qqfile_url")}
	    },
		callbacks: {
	        onSubmitted: function (id, name) {
	        	//console.log('onSubmitted>>>', id, name);
	        },
	        onUpload: function (id, name) {
				$.cookie("qqfile_url", null);
				$('#by-example .search-submit').attr('disabled', true);
	        },
		    onComplete: function(id, name, response, xhr) {
		        $.cookie("qqfile_url", response.qqfile_url);
		        $.cookie("qqfile_name", response.qqfile_name);
		        $.cookie("qqfile_size", response.qqfile_size);
		        $('#by-example .search-submit').attr('disabled', false);
		    },
		    onSubmitDelete: function(id) {
		    	this.setDeleteFileParams({access_token:access_token, qqfile_url: $.cookie("qqfile_url")}, id);
		    },
		    onDeleteComplete: function(id, xhr, isError) {
		        //console.log(xhr.response);
		        $.cookie("qqfile_url", null);
				$('#by-example .search-submit').attr('disabled', true);
		    },
		    onCancel: function(id, name) {
		        $.cookie("qqfile_url", null);
				$('#by-example .search-submit').attr('disabled', true);
		    },
		    onError: function(id, name, errorReason, xhrOrXdr) {
	            console.log(qq.format("File Upload Error on file number {} - {}.  Reason: {}", id, name, errorReason));
	            $.cookie("qqfile_url", null);
				$('#by-example .search-submit').attr('disabled', true);
	        }
		}
	});
	$('.search-submit').on('click', function(event){
		event.preventDefault();
		//initLocalStorage();
		initStartTime();
		
		var tabID = $('.tab-pane.fade.active.in').attr('id');
		var searchQuery = $.trim($('#' + tabID + ' .search-input').val());

		var metaNumTopic = $('select[id=metatopic]').val();
		var metaNumNeighbor = $('select[id=metaneighbor]').val();
		var libNumNeighbor = $('select[id=libneighbor]').val();
		
		$.cookie("access_token", access_token);
		$.cookie("pageID", tabID);
		$.cookie("searchQuery", searchQuery);
		
		switch (tabID) {
			case 'metadata':{
				$.cookie("searchMetaData", searchQuery);
				$.cookie("metaNumTopic", metaNumTopic);
				$.cookie("metaNumNeighbor", metaNumNeighbor);
				location.href = "metadata-results.html";
				break;
			}
			case 'keyword':{
				$.cookie("searchKeyword", searchQuery);
				location.href = "ks-results.html";
				break;
			}
			case 'by-example':{				
				$.cookie("searchExample", $.cookie("qqfile_url"));
				location.href = "ks-results.html";
				break;
			}
			case 'library':{
				$.cookie("libNumNeighbor", libNumNeighbor);
				if(!isNaN(searchQuery) && parseInt(searchQuery)>0){
					$.cookie("searchDLId", searchQuery);
					location.href = "dl-results.html";
				}
				else{
					$.alert({
					    title: 'Warning message',
					    content: 'Sorry, your query is invalid.',
					    confirm: function(){
					        $('#' + tabID + ' .search-input').focus();
					    }
					});

					$.cookie("searchDLId", null);
					$('#' + tabID + ' .search-input').val('');
					$('#library .search-submit').attr('disabled', true);
				}
				break;
			}
			default:{
				$.cookie('pageID', 'home');
				location.href = "index.html";
				break;
			}
		}
	})
 	$('.selectpicker').on('change', function(){
		var selID = $(this).attr('id');
	    var selected = $(this).find("option:selected").val();
	    var tabID = $('.tab-pane.fade.active.in').attr('id');
		if(tabID != $.cookie("pageID")){
			return false;
		}
		
		switch (tabID) {
			case 'metadata':{
				var metaNumTopic = $('select[id=metatopic]').val();
				var metaNumNeighbor = $('select[id=metaneighbor]').val();

				$.cookie("metaNumTopic", metaNumTopic);
				$.cookie("metaNumNeighbor", metaNumNeighbor);
				
				if(selID != "sortby")
					showResults();
				break;
			}
			case 'keyword':{
				
				break;
			}
			case 'by-example':{
				
				break;
			}
			case 'library':{
				$.cookie("libNumNeighbor", selected);

				//  neighbor items remove
				$('#neighbor_items').empty();
				$('#slide_wrapper').empty();
				if(parseInt($.cookie('searchDLId'))>0){
					getDLNeighborsList($.cookie('searchDLId'));
				}
				else{
					$.cookie("searchDLId", null);
				}
				break;
			}
			default:{
				break;
			}
		}
  	});
 	$(document).on('click', '.xml-link', function(event){
	    event.preventDefault();
	    var selected_member = '';
	    var pageID = $.cookie('pageID');
	    switch (pageID) {
			case 'metadata':{
				selected_member = pageID+'-xml-panel';
				break;
			}
			case 'keyword':{
				selected_member = 'ks'+'-xml-panel';
				break;
			}
			case 'by-example':{
				selected_member = 'ks'+'-xml-panel';
				break;
			}
			case 'library':{
				selected_member = pageID+'-xml-panel';
				break;
			}
		}
	    $('.sliding-panel.'+selected_member+'').addClass('slide-in');

	    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
	    if( is_firefox ) {
	      $('.wrapper').addClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
	        $('body').addClass('overflow-hidden');
	      });
	    } else {
	      $('.wrapper').addClass('slide-out');
	      $('body').addClass('overflow-hidden');
	    }
	});
	//show ks results document page
	$(document).on('click', '.ng-inner .ng-focus', function(event){
	    event.preventDefault();
	    var selected_type = $(this).data('type');
	    var selected_member = "ks-results-panel";
	    var cluster_id = selected_type.replace(selected_member+'-', '');
	    $.cookie('ksClusterId', cluster_id);
		
	    $('.sliding-panel.'+selected_member+'').addClass('slide-in');

	    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
	    if( is_firefox ) {
	      $('.wrapper').addClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
	        $('body').addClass('overflow-hidden');
	      });
	    } else {
	      $('.wrapper').addClass('slide-out');
	      $('body').addClass('overflow-hidden');
	    }
	    var ks_tab = $('.ks-results-panel ul.nav-tabs li.active>a').attr("href");
	    
	    showKSMatchedDOCPage(ks_tab);
	});
	//show ks related document page
	$('.ks-results-panel ul.nav-tabs li>a').click(function () {
		var ks_tab = $(this).attr("href");
		showKSMatchedDOCPage(ks_tab);
	});
	
	//************
	showResults();
});

function getLocalStorage(){
	META_TOPICS_VALUES = JSON.parse(localStorage.getItem('META_TOPICS_VALUES'));	
	NEIGHBORS_TOPIC_VALUES = JSON.parse(localStorage.getItem('NEIGHBORS_TOPIC_VALUES'));	
}
function initLocalStorage() {
    localStorage.setItem('META_TOPICS_VALUES', []);
    localStorage.setItem('NEIGHBORS_TOPIC_VALUES', []);
}
function printLocalStorage(){
	console.log('115:META_TOPICS_VALUES>>>'+META_TOPICS_VALUES);
	console.log('116:NEIGHBORS_TOPIC_VALUES>>>'+NEIGHBORS_TOPIC_VALUES);
}

//DIGITAL LIBRARY PAGE
function showDLPage(docId){
	$.cookie("searchDLId", docId);
	var libNumNeighbor = $('select[id=libneighbor]').val();
	$.cookie("libNumNeighbor", libNumNeighbor);
	location.href = "dl-results.html";
}
function deleteUploadFile(event){
	event.preventDefault();
	event.stopPropagation();

	var subUrl ='/base/delete';
	var apiUrl = baseUrl + subUrl;
	var jsonData = {
		access_token : access_token,
		qqfile_url : $.cookie("qqfile_url")
	};
	
	$.ajax({
		url: apiUrl,
		type: 'POST',
		dataType: 'json',
		data: jsonData,
		success: function(response){
			console.log(response);
			$.cookie("qqfile_url", null);
			$('#by-example .search-submit').attr('disabled', true);
			var $uploadFileList = $('.qq-upload-list-selector.qq-upload-list');
			$uploadFileList.empty();
		},
		error: function(response){
			console.log(response);
		}
    });
}
//KS RESULT/KEY&REL DOCUMENT PAGE
function showKSDocInfo(index, doc_type, doc_id){
	event.preventDefault();
    var selected_member = "ks-doc-panel";
	
    $('.sliding-panel.'+selected_member).addClass('slide-in');

    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
    if( is_firefox ) {
      $('.wrapper').addClass('slide-out2').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
      });
    } else {
      $('.wrapper').addClass('slide-out2');
    }
    
    displayKSDocInfo(index, doc_type, doc_id);
}
function openKSDocSRC(index, doc_type, doc_id){
	//console.log(KS_KEYDOC_VALUES[index])
	if( doc_type == "keydoc" && typeof KS_KEYDOC_VALUES[index] != "undefined"){
		srcDocId = KS_KEYDOC_VALUES[index].srcDocId;
	}
	else if( doc_type == "reldoc" && typeof KS_RELDOC_VALUES[index] != "undefined"){
		srcDocId = KS_RELDOC_VALUES[index].srcDocId;		
	}
	else if( doc_type == "neighbordoc" && typeof KS_NEIGHBOR_VALUES[doc_id][index] != "undefined"){
		srcDocId = KS_NEIGHBOR_VALUES[doc_id][index].srcDocId;		
	}
	else{
		console.log('KS_KEYDOC_VALUES index: '+index+' has no values');
		return;
	}

	openWindow(srcDocId);
}
function openWindow(srcDocId){
	window.open(srcDocId);
 	event.cancelBubble=true;
 	if (event.stopPropagation) event.stopPropagation();
}
//Show Results page
function showResults(){
	loadingobj = new loadingObject();
	loadingobj.show(loadingConfig);
	
	var pageID = $.cookie('pageID');
	var searchQuery = $.cookie('searchQuery');
	
	if(!$.cookie('metaNumTopic')) resetPickerNum();
	setPickerNum();
	
	console.log("52:pageID>>>" + pageID + ';' + ' searchQuery>>>'+searchQuery);
	
	switch (pageID) {
		case 'metadata':{
			$('#' + pageID + ' .search-input').val($.cookie('searchMetaData'));
			
			emptyMetaData();
			if(	!$.cookie('searchMetaData') ){
				setTimeout(function(){
					loadingobj.hide();
				},500);
				break;
			}
			getMetaData();
		    break;
		}
		case 'keyword':{
			$('#' + pageID + ' .search-input').val($.cookie('searchKeyword'));
			$('.nav-tabs a[href="#' + pageID + '"]').tab('show');
			
			emptyKSData();
			$.cookie('ksClusterId', null);
			$.cookie("isKSKeyDocDataExist", null);
			$.cookie("isKSRelDocDataExist", null);
			
			if(!$.cookie('searchKeyword')){
				setTimeout(function(){
					loadingobj.hide();
				},500);
				break;
			}
			getSearchData(pageID);
			break;
		}
		case 'by-example':{
			$.cookie("searchExample", $.cookie("qqfile_url"));

			//$('#' + pageID + ' .search-input').val($.cookie('searchExample'));
			$('.nav-tabs a[href="#' + pageID + '"]').tab('show');

			emptyKSData();
			$.cookie('ksClusterId', null);
			$.cookie("isKSKeyDocDataExist", null);
			$.cookie("isKSRelDocDataExist", null);
			
			if(!$.cookie('searchExample')){
				setTimeout(function(){
					loadingobj.hide();
				},500);
				break;
			}
			else{
				var $uploadFileList = $('.qq-upload-list-selector.qq-upload-list');
				var $fileContent = $('<li class="qq-upload-success">'           
      								    +'<span class="qq-upload-file-selector qq-upload-file" title="'+$.cookie('qqfile_name')+'">'+$.cookie('qqfile_name')+'</span>'
							            +'<span class="qq-upload-size-selector qq-upload-size">'+$.cookie('qqfile_size')+'</span>'
							            +'<button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete" '
							            	+' onClick="deleteUploadFile(event);">Delete</button>'
							        +'</li>');
				$uploadFileList.append($fileContent).trigger("create");

			}
			getSearchData(pageID);
			break;
		}
		case 'library':{
			emptyLibraryData();
			if(parseInt($.cookie('searchDLId'))>0){
				$('#' + pageID + ' .search-input').val($.cookie('searchDLId'));
			}
			else{
				$.cookie("searchDLId", null);
				setTimeout(function(){
					loadingobj.hide();
				},500);
				$('#' + pageID + ' .search-input').val('');
				break;
			}
			
			getDlTags($.cookie('searchDLId'));
			getCustomerMetaData($.cookie('searchDLId'), showCustomerMetaData);
			getDLNeighborsList($.cookie('searchDLId'));
			break;
		}
		default:{
			resetPickerNum();
			setPickerNum();
			emptyMetaData();
			emptyLibraryData();
			setTimeout(function(){
				loadingobj.hide();
			},500);
			break;
		}
	}
}
function resetPickerNum(){
	$.cookie('metaNumTopic', DEFUALT_META_NUM_TOPIC);
	$.cookie('metaNumNeighbor', DEFUALT_META_NUM_NEIGHBOR);
	$.cookie("libNumNeighbor", DEFUALT_LIB_NUM_NEIGHBOR);
}
function setPickerNum(){
	$('select[id=metatopic]').selectpicker('val', $.cookie('metaNumTopic'));
	$('select[id=metaneighbor]').selectpicker('val', $.cookie('metaNumNeighbor'));
	$('select[id=libneighbor]').selectpicker('val', $.cookie('libNumNeighbor'));
}

/***  Metadata Generator Datas  ***/
function emptyMetaData(){
	/*  menu topic add */
	var $menuTopicList = $('#sidebar_topics');
	$menuTopicList.empty();
	/*  doc tag add */
	var $docTagList = $('#document_tags');
	$docTagList.empty();
	/*  semantic tag add */
	var $semTagList = $('#semantic_tags');
	$semTagList.empty();
	
	/*  neighbor items add */
	var $neighborItemList = $('#neighbor_items');
	$neighborItemList.empty();
}
function getMetaData(){
	loadingobj = new loadingObject();
	loadingobj.show(loadingConfig);
	
	var subUrl ='/metadata/semanticProfile';	
	var localSubUrl ='/base/metadata';
	var apiUrl = baseUrl + localSubUrl;
	var jsonData = {
		access_token : access_token,
		numTopics : $.cookie('metaNumTopic'),
		numNeighbors : $.cookie('metaNumNeighbor'),
		query : $.cookie('searchMetaData')
	};
	
	$.ajax({
		url: apiUrl,
		type: 'POST',
		dataType: 'xml',
		data: JSON.stringify(jsonData),
		success: function(response){
			loadingobj.hide();
			calcMetaData(response);
		},
		error: function(response){
			loadingobj.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
function calcMetaData(xmlDoc){
	META_TOPICS_VALUES = [];
	NEIGHBORS_TOPIC_VALUES = [];
	NEIGHBORS_ALL_VALUES = [];
	
	console.log(xmlDoc);
	//display top xml
	var search_title = $.cookie("searchMetaData");
	var xml_formatted = formatXml(XMLToString(xmlDoc));
	item_xml = xml_formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');

	var $slideXMLContent = $('<div class="sliding-panel metadata-xml-panel">'
								+ '<div class="sp-inner">'
									+ '<div class="sp-inner-article">'
										/*
										+ '<div class="sp-top-nav no-display">'
											+ '<div class="sp-top-nav-left clearfix">'
												+ '<div class="neighbor-buttons pull-left">'
									    			+ '<a href="#0">XML</a>'
									    			+ '<a class="n-view disabled" href="#0"><img src="images/elements/icon-preview.png" alt=""></a>'
									    		+ '</div><!--neighbor-buttons-->'
											+ '</div>'
										+ '</div><!--sp-top-nav-->'
										*/
										+ '<article class="sp-article" id="slide_xml_library">'
											+ '<h1>' + search_title
												 + ' <a href="#0" class="no-display"><img src="images/elements/icon-source-dark.png" alt=""></a></h1>'
											+ '<p style="border:none; width:100%; max-width:100%; word-wrap:break-word;">'
												+ item_xml + '</p>'
										+ '</article>'
									+ '</div><!--sp-inner-article-->'
									+ '<a href="#0" class="close-sliding-panel visible-xs">Close</a>'
								+ '</div><!--sp-inner-->'

							+'</div><!--sliding-panel-->');

	$( ".metadata-xml-panel" ).replaceWith( $slideXMLContent );
	//
	if(typeof (error_tag=xmlDoc.getElementsByTagName("error")[0]) !="undefined"){
		var error_code = error_tag.attributes.getNamedItem("code").nodeValue;
		console.log('error_code >>> '+error_code);
		return false;
	}
	var meta_data_tag = xmlDoc.getElementsByTagName("meta-data")[0];
	
	if(typeof meta_data_tag != "undefined"){
		var allneighbors = meta_data_tag.getElementsByTagName("neighbors")[0].childNodes;// console.log(allneighbors);
		
		for(d=0; d<allneighbors.length;d++){
			docId = allneighbors[d].attributes.getNamedItem("id").nodeValue;
			item_dist = allneighbors[d].attributes.getNamedItem("dist").nodeValue;
			item_title = $(allneighbors[d].childNodes[0]).text();
			srcDocId = allneighbors[d].attributes.getNamedItem("srcDocId").nodeValue;

			NEIGHBORS_ALL_VALUES[d] = {
				docId:docId, item_dist:item_dist, item_title:item_title, srcDocId:srcDocId
			};
		}
	}

    var meta_topics = xmlDoc.getElementsByTagName("meta-topic");// console.log(meta_topics);
	for(t=0; t<meta_topics.length;t++){
		topic_id = meta_topics[t].childNodes[0].attributes.getNamedItem("id").nodeValue; //console.log(topic_id);
		topic_name = meta_topics[t].childNodes[0].attributes.getNamedItem("displayValue").nodeValue;
		topic_weight = meta_topics[t].childNodes[0].attributes.getNamedItem("weight").nodeValue;		
		
		meta_concepts = meta_topics[t].getElementsByTagName("meta-concepts")[0].childNodes; //console.log(meta_concepts);
		for(c=0; c<meta_concepts.length;c++){
			concept_name = meta_concepts[c].attributes.getNamedItem("value").nodeValue; //console.log(concept_name);
			concept_weight = meta_concepts[c].attributes.getNamedItem("weight").nodeValue;
		}
		
		var doc_tags_values = [];
		var sem_tags_values = [];
		if(typeof meta_topics[t].getElementsByTagName("meta-tags")[0] != "undefined"){
			meta_tags = meta_topics[t].getElementsByTagName("meta-tags")[0].childNodes; //console.log(semantic_tags);
			var dt=0; st=0;
			for(m=0; m<meta_tags.length;m++){
				value = meta_tags[m].attributes.getNamedItem("value").nodeValue; //console.log(semantic_name);
				weight = meta_tags[m].attributes.getNamedItem("weight").nodeValue;
				tagType = meta_tags[m].attributes.getNamedItem("tagType").nodeValue;
				if(tagType == "document"){
					doc_tags_values[dt] = {doc_name: value, doc_weight:weight};
					dt++;
				} 
				else if(tagType == "semantic"){
					sem_tags_values[st] = {semantic_name: value, semantic_weight:weight};
					st++;
				}				
			}
		}
		
		META_TOPICS_VALUES[t] = {
					topic_id:topic_id, topic_name:topic_name, topic_weight:topic_weight,
					doc_tags:doc_tags_values,
					sem_tags:sem_tags_values
			};
		
		//get topic neighbors
		var neighbors_values = [];
		if(typeof meta_topics[t].getElementsByTagName("neighbors")[0] != "undefined"){
			var neighbors = meta_topics[t].getElementsByTagName("neighbors")[0].childNodes; //console.log(neighbors);
			
			for(n=0; n<neighbors.length;n++){
				docId = neighbors[n].attributes.getNamedItem("id").nodeValue;
				item_dist = neighbors[n].attributes.getNamedItem("dist").nodeValue;
				item_title = $(neighbors[n].childNodes[0]).text();
				srcDocId = neighbors[n].attributes.getNamedItem("srcDocId").nodeValue;

				neighbors_values[n] = {
					docId:docId, item_dist:item_dist, item_title:item_title, srcDocId:srcDocId
				};
			}
		}
		NEIGHBORS_TOPIC_VALUES[t] = {
					topic_id:topic_id,
					neighbors:neighbors_values
			};
	}

	//localStorage.setItem('META_TOPICS_VALUES', JSON.stringify(META_TOPICS_VALUES));
	//localStorage.setItem('NEIGHBORS_TOPIC_VALUES', JSON.stringify(NEIGHBORS_TOPIC_VALUES));

	displayMetaData('all');
}
function displayMetaData(menu_topic_id){
	//console.log(META_TOPICS_VALUES);
	
	var $menuTopicList = $('#sidebar_topics');
	var $docTagList = $('#document_tags');
	var $semTagList = $('#semantic_tags');
	var $neighborItemList = $('#neighbor_items');
	emptyMetaData();
	//Meta Topic Select Option setting
	var metatopic_option = '';
	for (var to = 0; to < 10; to++){
		var ind = (to+1);
		if(ind>1) $suffix = "s";
		else $suffix = "";
		
		if(to<META_TOPICS_VALUES.length){
			topic_name = META_TOPICS_VALUES[to].topic_name;
			no_display = '';
		}
		else{
			topic_name = '';
			no_display = 'no-display';
		}
		metatopic_option += '<option title="'+ind+' topic'+$suffix+'" value="'+ind+'" '
									+'data-content="<span class=\'topic-number\'>'+ind+'</span>'
							  				  +'<span class=\'topic-hover '+no_display+'\'>'
												+topic_name
											  +'</span>">'
												+ind
								+'</option>';
	}
	$('select[id=metatopic]')
	        	.html(metatopic_option)
	        	.selectpicker('refresh');
	$('select[id=metatopic]').selectpicker('val', $.cookie('metaNumTopic'));
	
	//
	for (var t = 0; t < META_TOPICS_VALUES.length; t++){
		topic_id = META_TOPICS_VALUES[t].topic_id;
		topic_name = META_TOPICS_VALUES[t].topic_name;
		topic_weight = META_TOPICS_VALUES[t].topic_weight; topic_weight = parseInt(topic_weight/2);
		doc_tags = META_TOPICS_VALUES[t].doc_tags;
		sem_tags = META_TOPICS_VALUES[t].sem_tags;
		//menu topic add
		if(menu_topic_id == topic_id){
			opacity = " opacity-100";
		}
		else{
			opacity = "";
		}
		var $menuTopicContent = $('<div class="tag choose-topic-rel clearfix' + opacity + '" onClick="displayMetaData(\''+topic_id+'\')">'
									    //+'<span class="relevancy rel-' + topic_weight + '" style="display:none;">'
				  						//	+'<span class="overlay">' + topic_weight + '</span>'
										//+'</span>'
										+ topic_name
								 +'</div>');
		$menuTopicList.append($menuTopicContent).trigger("create");
				
		if(menu_topic_id == "all" || menu_topic_id == topic_id){
			//doc tag add
			for(var d = 0; d < doc_tags.length; d++){
				doc_name = doc_tags[d].doc_name;
				doc_weight = doc_tags[d].doc_weight; doc_weight = Math.round(doc_weight*100);
				if(doc_weight > 70){ opacity = ""; }
				else if(doc_weight > 40){ opacity = " opacity-70"; }
				else if(doc_weight > 20){ opacity = " opacity-40"; }
				else{ opacity = " opacity-20"; }
				var $docTagContent = $('<div class="tag' + opacity + '" href="#0">'
										+ doc_name
									+'</div>');
				$docTagList.append($docTagContent).trigger("create");
			}
			//semantic tag add
			for(var s = 0; s < sem_tags.length; s++){
				semantic_name = sem_tags[s].semantic_name;
				semantic_weight = sem_tags[s].semantic_weight; semantic_weight = Math.round(semantic_weight*100);
				if(semantic_weight > 70){ opacity = ""; }
				else if(semantic_weight > 40){ opacity = "opacity-70"; }
				else if(semantic_weight > 20){ opacity = "opacity-40"; }
				else{ opacity = "opacity-20"; }
				var $semTagContent = $('<div class="tag ' + opacity + '" href="#0">'
										+ semantic_name
									+'</div>');
				$semTagList.append($semTagContent).trigger("create");
			}
		}
	}

	/*** neighbor items add ***/
	if(menu_topic_id == "all"){
		var neighbors_values = NEIGHBORS_ALL_VALUES;
	}
	else {
		for (var nt = 0; nt < NEIGHBORS_TOPIC_VALUES.length; nt++){
			topic_id = NEIGHBORS_TOPIC_VALUES[nt].topic_id;
			if(menu_topic_id == topic_id){
				neighbors_values = NEIGHBORS_TOPIC_VALUES[nt].neighbors;
			}
		}
	}
	//Meta Neighbor Select Option setting
	var metaneighbor_option = '';
	for (var no = 0; no < 10; no++){
		var ind = (no+1);
		if(ind>1) $suffix = "s";
		else $suffix = "";
		
		if(no<neighbors_values.length){
			item_title = neighbors_values[no].item_title;
			no_display = '';
		}
		else{
			item_title = '';
			no_display = ' no-display';
		}
		if(item_title.length > 40){
			topic_small = ' topic-small';
		}
		else
			topic_small = '';
		
		metaneighbor_option += '<option title="'+ind+' neighbor'+$suffix+'" value="'+ind+'" '
									+'data-content="<span class=\'topic-number\'>'+ind+'</span>'
						  				  +'<span class=\'topic-hover'+no_display+''+topic_small+'\'>'
											+item_title
										  +'</span>">'
											+ind
							  +'</option>';
	}
	$('select[id=metaneighbor]')
	        	.html(metaneighbor_option)
	        	.selectpicker('refresh');
	$('select[id=metaneighbor]').selectpicker('val', $.cookie('metaNumNeighbor'));

	//
	DOC_CUSTOM_VALUES = [];
	
	for (var n = 0; n < neighbors_values.length; n++){
		item_title = neighbors_values[n].item_title;
		item_dist = neighbors_values[n].item_dist; item_weight = 5 - parseInt(item_dist*5);
		docId = neighbors_values[n].docId;

		var $neighborItemContent = $('<div class="neighbor-item clearfix">'
										+ '<span class="relevancy rel-' + item_weight + '" title="Distance: '+item_dist+'">'
											+ '<span class="overlay">' + item_weight + '</span>'
										+ '</span>'
										+ '<h3>' + item_title + '</h3>'
										
										+ '<div id="customer_generated_data_' + docId + '"></div>'
										
										+ '<div class="neighbor-buttons">'
											+ '<a href="#0" onClick="showDLPage(\''+docId+'\')">DL</a>'
											+ '<a class="n-xml" href="#0" onClick="showMetaDLXML('+n+', \''+menu_topic_id+'\')"><img src="images/elements/icon-xml-dark.png" alt=""></a>'
										+ '</div><!--neighbor-buttons-->'
								+'</div>');
		$neighborItemList.append($neighborItemContent).trigger("create");
		
		getCustomerMetaData(docId, showCustomerMetaData);
	}
}
function getCustomerMetaData(docId, callback){
	var customMetaDatas = {doc_xml:"",
							doc_date:"", doc_title:"", doc_cat:"",
							doc_text:"", doc_author:"", doc_type:"",
							doc_place:"", doc_scrId:"", doc_topic:""};
	
	var subUrl ='/dl/document/'+docId;
	var apiUrl = DonesUrl + subUrl;
	
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		success: function(xmlDoc){
			//console.log(xmlDoc);
			customMetaDatas['doc_xml'] = XMLToString(xmlDoc);

			var neighbor_doc = xmlDoc.getElementsByTagName("document")[0];
			
			doc_date = neighbor_doc.attributes.getNamedItem("date").nodeValue;
			var d = new Date(doc_date);			
			customMetaDatas['doc_date'] = monthNames[d.getMonth()] + ' ' + d.getDate()+", " + d.getFullYear();//doc date
			
			customMetaDatas['doc_title'] = neighbor_doc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
			
			if(typeof (src_categories = neighbor_doc.getElementsByTagName("src-categories")[0].childNodes[0]) != "undefined"){
				customMetaDatas['doc_cat'] = src_categories.nodeValue;
			}
			if(typeof (doc_body = neighbor_doc.getElementsByTagName("body")[0].childNodes[0]) != "undefined"){
				customMetaDatas['doc_text'] = doc_body.nodeValue;
			}
			if(typeof (doc_author = neighbor_doc.getElementsByTagName("authors")[0].childNodes[0]) != "undefined"){
				author_name = doc_author.nodeValue;
				customMetaDatas['doc_author'] = author_name.replace("By ", "");
			}
			customMetaDatas['doc_type'] = neighbor_doc.attributes.getNamedItem("type").nodeValue;
			customMetaDatas['doc_place'] = neighbor_doc.getElementsByTagName("place")[0].childNodes[0].nodeValue;
			customMetaDatas['doc_scrId'] = neighbor_doc.attributes.getNamedItem("srcDocId").nodeValue;
			customMetaDatas['doc_topic'] = neighbor_doc.getElementsByTagName("topic")[0].attributes.getNamedItem("value").nodeValue;
			customMetaDatas['doc_topicId'] = neighbor_doc.getElementsByTagName("topic")[0].attributes.getNamedItem("id").nodeValue;
			
			DOC_CUSTOM_VALUES[docId] = [];
			DOC_CUSTOM_VALUES[docId] = customMetaDatas;
			
			if(callback){
				callback(docId);
			}
		},
		error: function(response){			
			loadingobj.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
function showCustomerMetaData(docId){
	var pageID = $.cookie('pageID');
	var customMetaDatas = DOC_CUSTOM_VALUES[docId];

	//<!--CUSTOMER GENERATED METADATA content
	var customerMetaDataContent = '<div id="customer_generated_data_' + docId + '" class="neighbor-generated-data">'
									+'<h5>Customer generated metadata</h5>'
									+'<div class="ng-inner">'
										+'<div class="ng-item clearfix">'
											+'<div class="ng-title">'
												+'<div class="ng-img"><img src="images/elements/icon-cat.png" alt=""></div>'
												+'Categories'
											+'</div>'
											+'<div class="ng-data fsz14">'+customMetaDatas.doc_cat+'</div>'
										+'</div><!--ng-item-->'

										+'<div class="ng-item clearfix">'
											+'<div class="ng-title">'
												+'<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
												+'Date'
											+'</div>'
											+'<div class="ng-data">'+customMetaDatas.doc_date+'</div>'
										+'</div><!--ng-item-->'

										+'<div class="ng-item clearfix">'
											+'<div class="ng-title">'
												+'<div class="ng-img"><img src="images/elements/icon-doc.png" alt=""></div>'
												+'Doc Text'
											+'</div>'
											+'<div class="ng-data fsz13">'
												+customMetaDatas.doc_text
											+'</div>'
										+'</div><!--ng-item-->'

										+'<div class="ng-item clearfix">'
											+'<div class="ng-title">'
												+'<div class="ng-img"><img src="images/elements/icon-author.png" alt=""></div>'
												+'Author(s)'
											+'</div>'
											+'<div class="ng-data">'+customMetaDatas.doc_author+'</div>'
										+'</div><!--ng-item-->'

										+'<div class="ng-item clearfix">'
											+'<div class="ng-title">'
												+'<div class="ng-img"><img src="images/elements/icon-type.png" alt=""></div>'
												+'Type'
											+'</div>'
											+'<div class="ng-data">'+customMetaDatas.doc_type+'</div>'
										+'</div><!--ng-item-->'

										+'<div class="ng-item clearfix">'
											+'<div class="ng-title">'
												+'<div class="ng-img"><img src="images/elements/icon-place.png" alt=""></div>'
												+'Place'
											+'</div>'
											+'<div class="ng-data fsz13"><a class="link" href="#0"><span>'+customMetaDatas.doc_place+'</span></a></div>'
										+'</div><!--ng-item-->'

										+'<div class="ng-item clearfix">'
											+'<div class="ng-title">'
												+'<div class="ng-img"><img src="images/elements/icon-source.png" alt=""></div>'
												+'Source ID'
											+'</div>'
											+'<div class="ng-data fsz13"><a class="link" href="#0"><span>'+customMetaDatas.doc_scrId+'</span></a></div>'
										+'</div><!--ng-item-->'

										+'<div class="ng-item clearfix">'
											+'<div class="ng-title">'
												+'<div class="ng-img"><img src="images/elements/icon-topic.png" alt=""></div>'
												+'Topic'
											+'</div>'
											+'<div class="ng-data">'+customMetaDatas.doc_topic+'</div>'
										+'</div><!--ng-item-->'
									+'</div><!--ng-inner-->'
								+'</div><!--neighbor-generated-data-->';

	//CUSTOMER GENERATED METADATA content-->

	switch (pageID) {
		case 'metadata':{
			$( "#customer_generated_data_"+docId ).replaceWith( customerMetaDataContent );
			break;
		}
		case 'library':{
			showCustomerDocTitle(docId);			
			$( ".neighbor-generated-data" ).replaceWith( customerMetaDataContent );
			break;
		}
	}
}
//Metadata neighbor document xml sliding page
function showMetaDLXML(index, menu_topic_id){
	event.preventDefault();
    var selected_member = "metadl-xml-panel";
	
    $('.sliding-panel.'+selected_member).addClass('slide-in');
	
    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
    if( is_firefox ) {
      $('.wrapper').addClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        $('body').addClass('overflow-hidden');
      });
    } else {
      $('.wrapper').addClass('slide-out');
      $('body').addClass('overflow-hidden');
    }
    
    displayMetaDLXML(index, menu_topic_id);
}
function displayMetaDLXML(doc_index, menu_topic_id){
	if(menu_topic_id == "all"){
		var neighbors_values = NEIGHBORS_ALL_VALUES;
	}
	else {
		for (var nt = 0; nt < NEIGHBORS_TOPIC_VALUES.length; nt++){
			topic_id = NEIGHBORS_TOPIC_VALUES[nt].topic_id;
			if(menu_topic_id == topic_id){
				neighbors_values = NEIGHBORS_TOPIC_VALUES[nt].neighbors;
			}
		}
	}
	
	if(typeof neighbors_values[doc_index] != "undefined"){
		dlDocInfo = neighbors_values[doc_index];
		docLength = neighbors_values.length;

		var customMetaDatas = DOC_CUSTOM_VALUES[dlDocInfo.docId];
		var xml_formatted = formatXml(customMetaDatas.doc_xml);
		dlDocInfo.xmlContent = xml_formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');

	}
	else{
		console.log('Metadata DL XML Values >>> index: ' + doc_index + ' has no values');
		dlDocInfo = {docId:"", item_dist:1,
					item_title:"", srcDocId:"", xmlContent:""};
		docLength = 0;
	}
	item_weight = 5 - parseInt(dlDocInfo.item_dist*5);

	//
	prevDocIndex = doc_index - 1;
	nav_prev_class = "";
	if(prevDocIndex < 0){
		prevDocIndex = doc_index;
		nav_prev_class = "disabled";
	}
	
	nextDocIndex = doc_index + 1;
	nav_next_class = "";
	if(nextDocIndex == docLength){
		nextDocIndex = doc_index;
		nav_next_class = "disabled";
	}
	
	var $metaDLXMLPanel = $('.metadl-xml-panel');
	$metaDLXMLPanel.empty();
	var dlSlideXMLContent = '<div class="sp-inner">'
								+ '<div class="sp-inner-article">'
									+ '<div class="sp-top-nav">'
										+ '<div class="sp-top-nav-left clearfix">'
											+ '<span class="relevancy rel-' + item_weight + '" title="Distance: '+dlDocInfo.item_dist+'">'
												+ '<span class="overlay">' + item_weight + '</span>'
											+ '</span>'
											+ '<div class="neighbor-buttons pull-left">'
												+ '<a href="#0">XML</a>'
												+ '<a class="n-view disabled" href="#0"><img src="images/elements/icon-preview.png" alt=""></a>'
											+ '</div><!--neighbor-buttons-->'
										+ '</div>'
										+ '<div class="sp-top-nav-right">'
											+ '<div class="sp-top-nav-arrows">'
												+'<a href="#0" class="'+nav_prev_class+'" onClick="displayMetaDLXML('+prevDocIndex+', \''+menu_topic_id+'\')"><img src="images/elements/icon-arrow.png" alt=""></a>'
												+'<a href="#0" class="'+nav_next_class+'" onClick="displayMetaDLXML('+nextDocIndex+', \''+menu_topic_id+'\')"><img src="images/elements/icon-arrow.png" alt=""></a>'
											+ '</div>'
										+ '</div>'
									+ '</div><!--sp-top-nav-->'
									+ '<article class="sp-article">'
										+ '<h1>' + dlDocInfo.item_title + ' <a href="#0" onClick="openWindow(\''+dlDocInfo.srcDocId+'\')"><img src="images/elements/icon-source-dark.png" alt=""></a></h1>'
										+ '<p>' + dlDocInfo.xmlContent + '</p>'
									+ '</article>'
								+ '</div><!--sp-inner-article-->'
								+ '<a href="#0" class="close-sliding-panel visible-xs">Close</a>'
							+ '</div><!--sp-inner-->';

	$metaDLXMLPanel.append(dlSlideXMLContent).trigger("create");
}
/***  Display Digital Library Datas  ***/
function emptyLibraryData(){
	//  doc tag remove
	var $docTagList = $('#document_tags');
	$docTagList.empty();
	//  semantic tag add
	var $semTagList = $('#semantic_tags');
	$semTagList.empty();
	
	//  neighbor header remove
	var $neighborItemHeader = $('.results .container>h1');
	$neighborItemHeader.empty();
	
	//  neighbor items remove
	var $neighborItemList = $('#neighbor_items');
	$neighborItemList.empty();

	//  neighbor generated data remove
	var $neighborGeneratedData = $('.neighbor-generated-data');
	$neighborGeneratedData.empty();
}
function showCustomerDocTitle(docId){
	var customMetaDatas = DOC_CUSTOM_VALUES[docId];
	var doc_title = customMetaDatas.doc_title;
	var dl_topic_id = customMetaDatas.doc_topicId;
	var doc_scrId = customMetaDatas.doc_scrId;
	
	var xml_formatted = formatXml(customMetaDatas.doc_xml);
	item_xml = xml_formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');

	var $neighborItemHeader = $('.results .container>h1');
	$neighborItemHeader.empty();
	var $neighborItemHContent = doc_title + ' <a href="#0" onClick="openWindow(\''+doc_scrId+'\')"><img src="images/elements/icon-source-dark.png" alt=""></a>';
	
	$neighborItemHeader.append($neighborItemHContent).trigger("create");	

	//display top xml 
	var $slideXMLContent = $('<div class="sliding-panel library-xml-panel">'
								+ '<div class="sp-inner">'
									+ '<div class="sp-inner-article">'
										+ '<div class="sp-top-nav">'
											+ '<div class="sp-top-nav-left clearfix">'
												+ '<div class="neighbor-buttons pull-left">'
									    			+ '<a href="#0">XML</a>'
									    			+ '<a class="n-view disabled" href="#0"><img src="images/elements/icon-preview.png" alt=""></a>'
									    		+ '</div><!--neighbor-buttons-->'
											+ '</div>'
										+ '</div><!--sp-top-nav-->'
										+ '<article class="sp-article" id="slide_xml_library">'
											+ '<h1>' + $neighborItemHContent + '</h1>'
											+ '<p style="border:none; width:100%; max-width:100%; word-wrap:break-word;">'
												+ item_xml + '</p>'
										+ '</article>'
									+ '</div><!--sp-inner-article-->'
									+ '<a href="#0" class="close-sliding-panel visible-xs">Close</a>'
								+ '</div><!--sp-inner-->'

							+'</div><!--sliding-panel-->');

	$( ".library-xml-panel" ).replaceWith( $slideXMLContent );
}
//Digital Libraryta neighbor item document & xml sliding page
function showSlidingDLPage(doc_index, view_type, docId){
	event.preventDefault();
	//
	$('.sliding-panel').removeClass('slide-in');

    if( is_firefox ) {
      $('.wrapper').removeClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        $('body').removeClass('overflow-hidden');
      });
    } else {
      $('.wrapper').removeClass('slide-out');
      $('body').removeClass('overflow-hidden');
    }
    //
	if( typeof DL_NEIGHBORS_VALUES[doc_index] != "undefined"){
   	 	docId = DL_NEIGHBORS_VALUES[doc_index].docId;
		docLength = DL_NEIGHBORS_VALUES.length;
		docDist = DL_NEIGHBORS_VALUES[doc_index].docDist;
		docWeight = 5 - parseInt(docDist*5);
	}
	else{
		docId = docId;
		docLength = 0;
		docWeight = 1;
	}

	if(view_type == "dl"){
		selected_member = 'dl-panel-' + docId;
		typeStr = "DL";
	}
	else if(view_type == "xml"){
		selected_member = 'xml-panel-' + docId;
		typeStr = "XML";
	}
	//
	prevDocIndex = doc_index - 1;
	nav_prev_class = "";
	if(prevDocIndex < 0){
		prevDocIndex = doc_index;
		nav_prev_class = "disabled";
	}

	nextDocIndex = doc_index + 1;
	nav_next_class = "";
	if(nextDocIndex == docLength){
		nextDocIndex = doc_index;
		nav_next_class = "disabled";
	}

	var $slideDLXMLContent = $('<div class="sp-top-nav">'
								+ '<div class="sp-top-nav-left clearfix">'
									+ '<span class="relevancy rel-' + docWeight + '" title="Distance: '+docDist+'">'
										+ '<span class="overlay">' + docWeight + '</span>'
									+ '</span>'
									+ '<div class="neighbor-buttons pull-left">'
						    			+ '<a href="#0">'+typeStr+'</a>'
						    			+ '<a class="n-view disabled" href="#0"><img src="images/elements/icon-preview.png" alt=""></a>'
						    		+ '</div><!--neighbor-buttons-->'
								+ '</div>'
								+ '<div class="sp-top-nav-right">'
									+ '<div class="sp-top-nav-arrows">'
										+'<a href="#0" class="'+nav_prev_class+'" onClick="showSlidingDLPage('+prevDocIndex+', \''+view_type+'\''+', \'\')"><img src="images/elements/icon-arrow.png" alt=""></a>'
										+'<a href="#0" class="'+nav_next_class+'" onClick="showSlidingDLPage('+nextDocIndex+', \''+view_type+'\''+', \'\')"><img src="images/elements/icon-arrow.png" alt=""></a>'
									+ '</div>'
								+ '</div>'
							+ '</div><!--sp-top-nav-->');

	$('.sliding-panel.'+selected_member+' .sp-top-nav').replaceWith( $slideDLXMLContent );

    $('.sliding-panel.'+selected_member).addClass('slide-in');

    // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
    if( is_firefox ) {
      $('.wrapper').addClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        $('body').addClass('overflow-hidden');
      });
    } else {
      $('.wrapper').addClass('slide-out');
      $('body').addClass('overflow-hidden');
    }
}
function getDlTags(docId){

	var subUrl ='/dl/document/'+docId+'/documentTags';
	var apiUrl = DonesUrl + subUrl;
	var jsonData = '';
	
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		data: jsonData,
		success: function(xmlDoc){
			var $docTagList = $('#document_tags');
			var $semTagList = $('#semantic_tags');

			if(typeof xmlDoc.getElementsByTagName("document-tags")[0] != "undefined"){
				var doc_tags = xmlDoc.getElementsByTagName("document-tags")[0].childNodes;// console.log(meta_topics);
				var dt=0; st=0;
				for(t=0; t<doc_tags.length;t++){
					displayValue = doc_tags[t].attributes.getNamedItem("displayValue").nodeValue;
					tagType = doc_tags[t].attributes.getNamedItem("tagType").nodeValue;
					value = doc_tags[t].attributes.getNamedItem("value").nodeValue;
					
					tag_weight = 100;
					if(tag_weight > 70){ opacity = ""; }
					var $tagContent = $('<div class="tag ' + opacity + '" href="#0">'
											+ displayValue
										+'</div>');

					if(tagType == "document"){
						$docTagList.append($tagContent).trigger("create");
					} 
					else if(tagType == "semantic"){
						$semTagList.append($tagContent).trigger("create");
					}
				}
			}
		},
		error: function(response){
			loadingobj.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
function getDLNeighborsList(docId){
	loadingobj = new loadingObject();
	loadingobj.show(loadingConfig);
	
	var subUrl ='/dl/document/'+docId+'/neighbors';
	var apiUrl = DonesUrl + subUrl;
	var jsonData = { numNeighbors : $.cookie('libNumNeighbor') };

	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		data: jsonData,
		success: function(xmlDoc){
			console.log(xmlDoc);
			DL_NEIGHBORS_VALUES = [];
			
			var neighbors = xmlDoc.getElementsByTagName("neighbors")[0].childNodes;
			
			var $neighborItemList = $('#neighbor_items');
			var $slide_wrapper = $('#slide_wrapper');
			for (var n = 0; n < neighbors.length; n++){
				docId = neighbors[n].attributes.getNamedItem("id").nodeValue;
				docDist = neighbors[n].attributes.getNamedItem("dist").nodeValue;
				docWeight = 5 - parseInt(docDist*5);

				docTitle = '';
				docContent = '';
				xmlContent = '';
				DL_NEIGHBORS_VALUES[n] = {
						docId:docId, docDist:docDist
				};

				var $neighborItemContent = $('<div class="neighbor-item clearfix">'
												+ '<span class="relevancy rel-' + docWeight + '" title="Distance: '+docDist+'">'
													+ '<span class="overlay">' + docWeight + '</span>'
												+ '</span>'
												+ '<h3 id="dl_item_title_' + docId + '">' + docTitle + '</h3>'
												
												+ '<div class="neighbor-buttons">'
									    			+ '<a href="#0" onClick="showDLPage(\''+docId+'\')">DL</a>'
									    			+ '<a class="n-view" href="#0" data-type="dl-panel-' + docId + '" onClick="showSlidingDLPage('+n+', \'dl\', \''+docId+'\')">'
									    				+'<img src="images/elements/icon-preview.png" alt=""></a>'
									    			+ '<a class="n-xml" href="#0" data-type="xml-panel-' + docId + '" onClick="showSlidingDLPage('+n+', \'xml\', \''+docId+'\')">'
									    				+'<img src="images/elements/icon-xml-dark.png" alt=""></a>'
									    		+ '</div><!--neighbor-buttons-->'												
											+'</div>');
				$neighborItemList.append($neighborItemContent).trigger("create");

				var $slideDlContent = $('<div class="sliding-panel dl-panel-' + docId + '">'
											+ '<div class="sp-inner">'
												+ '<div class="sp-inner-article">'
													+ '<div class="sp-top-nav">'
														+ '<div class="sp-top-nav-left clearfix">'
															+ '<span class="relevancy rel-' + docWeight + '" title="Distance: '+docDist+'">'
																+ '<span class="overlay">' + docWeight + '</span>'
															+ '</span>'
															+ '<div class="neighbor-buttons pull-left">'
												    			+ '<a href="#0">DL</a>'
												    			+ '<a class="n-view disabled" href="#0"><img src="images/elements/icon-preview.png" alt=""></a>'
												    		+ '</div><!--neighbor-buttons-->'
														+ '</div>'
														+ '<div class="sp-top-nav-right">'
															+ '<div class="sp-top-nav-arrows">'
																+ '<a href="#0"><img src="images/elements/icon-arrow.png" alt=""></a>'
																+ '<a href="#0"><img src="images/elements/icon-arrow.png" alt=""></a>'
															+ '</div>'
														+ '</div>'
													+ '</div><!--sp-top-nav-->'
													+ '<article class="sp-article" id="slide_dl_item_' + docId + '">'
														+ '<h1>' + docTitle + ' <a href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a></h1>'
														+ '<p>' + docContent + '</p>'
													+ '</article>'
												+ '</div><!--sp-inner-article-->'
												+ '<a href="#0" class="close-sliding-panel visible-xs">Close</a>'
											+ '</div><!--sp-inner-->'

										+'</div><!--sliding-panel-->');
				$slide_wrapper.append($slideDlContent).trigger("create");

				var $slideXMLContent = $('<div class="sliding-panel xml-panel-' + docId + '">'
											+ '<div class="sp-inner">'
												+ '<div class="sp-inner-article">'
													+ '<div class="sp-top-nav">'
														+ '<div class="sp-top-nav-left clearfix">'
															+ '<span class="relevancy rel-' + docWeight + '" title="Distance: '+docDist+'">'
																+ '<span class="overlay">' + docWeight + '</span>'
															+ '</span>'
															+ '<div class="neighbor-buttons pull-left">'
												    			+ '<a href="#0">XML</a>'
												    			+ '<a class="n-view disabled" href="#0"><img src="images/elements/icon-preview.png" alt=""></a>'
												    		+ '</div><!--neighbor-buttons-->'
														+ '</div>'
														+ '<div class="sp-top-nav-right">'
															+ '<div class="sp-top-nav-arrows">'
																+ '<a href="#0"><img src="images/elements/icon-arrow.png" alt=""></a>'
																+ '<a href="#0"><img src="images/elements/icon-arrow.png" alt=""></a>'
															+ '</div>'
														+ '</div>'
													+ '</div><!--sp-top-nav-->'
													+ '<article class="sp-article" id="slide_xml_item_' + docId + '">'
														+ '<h1>' + docTitle + ' <a href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a></h1>'
														+ '<p>' + xmlContent + '</p>'
													+ '</article>'
												+ '</div><!--sp-inner-article-->'
												+ '<a href="#0" class="close-sliding-panel visible-xs">Close</a>'
											+ '</div><!--sp-inner-->'

										+'</div><!--sliding-panel-->');
				$slide_wrapper.append($slideXMLContent).trigger("create");
			}

			for(var d=0; d<DL_NEIGHBORS_VALUES.length; d++){
				getCustomerMetaData(DL_NEIGHBORS_VALUES[d].docId, showDLNaborListItemTitle);
			}			
		},
		error: function(response){
			loadingobj.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
function showDLNaborListItemTitle(docId){
	var customMetaDatas = DOC_CUSTOM_VALUES[docId];
	
	var item_title = customMetaDatas.doc_title;
	var doc_scrId = customMetaDatas.doc_scrId;
	var item_content = customMetaDatas.doc_text;
	var xml_formatted = formatXml(customMetaDatas.doc_xml);
	item_xml = xml_formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');

	var dlDataContent = '<h3>' + item_title + '</h3>';
	$( "#dl_item_title_"+docId ).replaceWith( dlDataContent );

	var $neighborItemHContent = item_title + ' <a href="#0" onClick="openWindow(\''+doc_scrId+'\')"><img src="images/elements/icon-source-dark.png" alt=""></a>';
	var dlSlideContent = '<article class="sp-article" id="slide_dl_item_' + docId + '">'
							+ '<h1>' + $neighborItemHContent + '</h1>'
							+ '<p>' + item_content + '</p>'
						+ '</article>';
	$( "#slide_dl_item_"+docId ).replaceWith( dlSlideContent );

	var xmlSlideContent = '<article class="sp-article" id="slide_xml_item_' + docId + '">'
							+ '<h1>' + $neighborItemHContent + '</h1>'
							+ '<p style="border:none; width:100%; max-width:100%; word-wrap:break-word;">'
								+ item_xml + '</p>'
						+ '</article>';
	$( "#slide_xml_item_"+docId ).replaceWith( xmlSlideContent );
	
	var ngLen = DL_NEIGHBORS_VALUES.length-1;
	if(DL_NEIGHBORS_VALUES[ngLen].docId == docId){
		loadingobj.hide();
		//select menu title add
		var getDocDetailFlag = true;
		for (var no = 0; no < DL_NEIGHBORS_VALUES.length; no++){
			neighbor_docId = DL_NEIGHBORS_VALUES[no].docId;
			var customMetaDatas = DOC_CUSTOM_VALUES[neighbor_docId];
			
			if(typeof customMetaDatas == "undefined"){
				getDocDetailFlag = false;
			}
		}
		if(getDocDetailFlag)
			setDLNeighborMenuTitle();
		else{
			setTimeout(function(){
				setDLNeighborMenuTitle();
			},1000);
		}
	}
}
//DL Neighbor Select Option setting
function setDLNeighborMenuTitle(){
	var dlneighbor_option = '';
	for (var no = 0; no < 10; no++){
		var ind = (no+1);
		if(ind>1) $suffix = "s";
		else $suffix = "";
		
		if(no<DL_NEIGHBORS_VALUES.length){
			neighbor_docId = DL_NEIGHBORS_VALUES[no].docId;
			var customMetaDatas = DOC_CUSTOM_VALUES[neighbor_docId];
			if(typeof customMetaDatas != "undefined"){
				item_title = customMetaDatas.doc_title;
			}
			else
				item_title = '';
			no_display = '';
		}
		else{
			item_title = '';
			no_display = ' no-display';
		}
		
		if(item_title.length > 40){
			topic_small = ' topic-small';
		}
		else
			topic_small = '';
		
		dlneighbor_option += '<option title="'+ind+' neighbor'+$suffix+'" value="'+ind+'" '
									+'data-content="<span class=\'topic-number\'>'+ind+'</span>'
						  				  +'<span class=\'topic-hover'+no_display+''+topic_small+'\'>'
											+item_title
										  +'</span>">'
											+ind
							  +'</option>';
	}
	$('select[id=libneighbor]')
	        	.html(dlneighbor_option)
	        	.selectpicker('refresh');
	$('select[id=libneighbor]').selectpicker('val', $.cookie('libNumNeighbor'));
}
/***  Keyword search & Example search Datas  ***/
function emptyKSData(){
	setKSLoadInfo(0, 0);
	
	//  neighbor generated data remove
	var $ksGeneratedData = $('.keyword-generated .neighbor-generated-data');
	$ksGeneratedData.empty();

	var $dataPagination = $('.data-pagination');
	$dataPagination.empty();
}
function setKSLoadInfo(relevant_count, load_time ){
	load_time = load_time/1000;
	var $loadInfo = $('.main-results>h5');
	$loadInfo.empty();
	var $loadInfoContent = $('<span><i><img src="images/elements/icon-doc-dark.png" alt=""></i>'
							      	+relevant_count+' relevant documents</span>'
							+'<span><i><img src="images/elements/icon-clock.png" alt=""></i>'
									+load_time+' Sec.</span>');
	$loadInfo.append($loadInfoContent).trigger("create");
}
function getSearchData(pageID){
	if(pageID == 'keyword'){
		query = encodeURIComponent($.cookie('searchKeyword'));
		xml_title = $.cookie('searchKeyword');

		type = 'GET';
		var subUrl ='/search/Dones-DB/clusters/'+query+'?numClusters='+SEARCH_NUM_CLUSTERS;
		apiUrl = DonesUrl + subUrl;
		var jsonData = '';
	}
	else if(pageID == 'by-example'){
		query = $.cookie('searchExample');
		xml_title = query;
		
		type = 'POST';
		var subUrl ='/base/example';
		var apiUrl = baseUrl + subUrl;
		var jsonData = {
			access_token : access_token,
			numClusters : SEARCH_NUM_CLUSTERS,
			query : query
		};
	}

	$.ajax({
		url: apiUrl,
		type: type,
		dataType: 'xml',
		data: jsonData,
		success: function(xmlDoc){
			//console.log(xmlDoc);
			if(!xmlDoc){
				loadingobj.hide();
				console.log('invalid response');
				return;
			}
			
			clusterXML = XMLToString(xmlDoc);
			var xml_formatted = formatXml(clusterXML);
			item_xml = xml_formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');

			//display top xml
			var $slideXMLContent = $('<div class="sliding-panel ks-xml-panel">'
										+ '<div class="sp-inner">'
											+ '<div class="sp-inner-article">'
												+ '<div class="sp-top-nav">'
													+ '<div class="sp-top-nav-left clearfix">'
														+ '<div class="neighbor-buttons pull-left">'
											    			+ '<a href="#0">XML</a>'
											    			+ '<a class="n-view disabled" href="#0"><img src="images/elements/icon-preview.png" alt=""></a>'
											    		+ '</div><!--neighbor-buttons-->'
													+ '</div>'
												+ '</div><!--sp-top-nav-->'
												+ '<article class="sp-article" id="slide_xml_library">'
													+ '<h1>' + xml_title + ' <a href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a></h1>'
													+ '<p style="border:none; width:100%; max-width:100%; word-wrap:break-word;">'
														+ item_xml + '</p>'
												+ '</article>'
											+ '</div><!--sp-inner-article-->'
											+ '<a href="#0" class="close-sliding-panel visible-xs">Close</a>'
										+ '</div><!--sp-inner-->'

									+'</div><!--sliding-panel-->');
			
			$( ".ks-xml-panel" ).replaceWith( $slideXMLContent );

			var $ksGeneratedData = $('.keyword-generated .neighbor-generated-data');

			var clusters = xmlDoc.getElementsByTagName("cluster");
			setKSLoadInfo(clusters.length, getElapsedTime());
			//ks_main_pg pagination setting
			selected_pg = 'ks_main_pg';
			pageOptions = DonesPages.ks_main_pg;

			pageOptions.pageItemCount = clusters.length;
			pageOptions.totalPages = parseInt((pageOptions.pageItemCount-1)/pageOptions.pageItemNum) + 1;
			paginationSet(pageOptions, selected_pg);
			
			for (var cl = 0; cl < clusters.length; cl++){
				cluster_id = clusters[cl].attributes.getNamedItem("id").nodeValue;
				if(cl >= pageOptions.pageItemNum){
					displaystatus = 'none';
				}
				else{
					displaystatus = 'block';
				}
				var $ngItemContent = $('<div class="ng-inner" id="ks_cl_item_' + cl + '" style="display:'+ displaystatus +';">'
										+ '<div class="ng-count">' + (cl+1) + '</div>'
										+ '<a class="ng-collapse collapsed" href="#keywordblock-' + cl + '" data-toggle="collapse" aria-expanded="false" aria-controls="#keywordblock-' + cl + '"></a>'
										
										+ '<a class="ng-focus" href="#0" data-type="ks-results-panel-' + cluster_id + '"><img src="images/elements/icon-focus.png" alt=""></a>'												
									+'</div>');
				$ksGeneratedData.append($ngItemContent).trigger("create");

				getClusterInfo(cluster_id, cl, clusters.length);
			}
		},
		error: function(response){
			loadingobj.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
var ksRelevantDocuments = 0;
function getClusterInfo(cluster_id, index, length){

	var subUrl ='/search/cluster/'+cluster_id;
	var apiUrl = DonesUrl + subUrl;

	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		success: function(xmlDoc){
			cluster = xmlDoc.getElementsByTagName("cluster")[0];
			descr = cluster.getElementsByTagName("descr")[0];
			var numKeyDocuments = descr.attributes.getNamedItem("numKeyDocuments").nodeValue;
			ksRelevantDocuments += parseInt(numKeyDocuments);
			
			var descr_title_text = []; article_content = '';
			title_tag = descr.getElementsByTagName("descr-titles")[0];
			if(typeof title_tag !="undefined"){
				descr_titles = title_tag.childNodes;					
			}
			else{
				descr_titles = [];
			}			
			for(var dt=0; dt<descr_titles.length; dt++){
				title_tag = descr_titles[dt].getElementsByTagName("descr-title-text")[0].childNodes[0];
				if(typeof title_tag !="undefined"){
					descr_title_text[dt] = title_tag.nodeValue;					
					article_content += '<li><a href="#0">'+descr_title_text[dt]+'</a></li>';
				}
			}

			var descr_tag_text = []; descr_tag_score = []; tag_content = '';
			descr_tag = descr.getElementsByTagName("descr-tags")[0];
			if(typeof descr_tag !="undefined"){
				descr_tags = descr_tag.childNodes;					
			}
			else{
				descr_tags = [];
			}
			for(dg=0; dg<descr_tags.length; dg++){
				descr_tag_text[dg] = descr_tags[dg].getElementsByTagName("descr-tag-text")[0].childNodes[0].nodeValue;
				descr_tag_score[dg] = descr_tags[dg].getElementsByTagName("descr-tag-score")[0].childNodes[0].nodeValue;
				
				tag_weight = descr_tag_score[dg]; tag_weight = Math.round(tag_weight*1);
				if(tag_weight > 10000){ opacity = ""; }
				else if(tag_weight > 3000){ opacity = "opacity-70"; }
				else if(tag_weight > 2000){ opacity = "opacity-40"; }
				else{ opacity = "opacity-20"; }
				
				tag_content += '<a class="tag ' + opacity + '" href="#0">'+descr_tag_text[dg]+'</a>';
			}
			
			var descr_window_text = []; excerpts_content = '';
			descr_windows_tag = descr.getElementsByTagName("descr-windows")[0];
			if(typeof descr_windows_tag !="undefined"){
				descr_windows = descr_windows_tag.childNodes;					
			}
			else{
				descr_windows = [];
			}
			for(dw=0; dw<descr_windows.length; dw++){
				descr_window_text[dw] = descr_windows[dw].getElementsByTagName("descr-window-text")[0].childNodes[0].nodeValue;
				
				excerpts_content += '<p>... ' + descr_window_text[dw] + '" ...</p>';
			}
			
			var pageOptions = DonesPages.ks_main_pg;
			var startItemNum = (pageOptions.currentPage-1)*pageOptions.pageItemNum;
			if(length < pageOptions.pageItemNum){
				if((index+1) == length){
					loadingobj.hide();
				}
			}else{
				if((index+1) == pageOptions.pageItemNum){
					loadingobj.hide();				
				}
			}

			if((index >= startItemNum) && index < (startItemNum + pageOptions.pageItemNum) ){
		      displaystatus = 'block';
		    }
		    else{
		      displaystatus = 'none';
		    }
		    setKSLoadInfo(ksRelevantDocuments, getElapsedTime());

			var clusterInfoContent = '<div class="ng-inner" id="ks_cl_item_' + index + '" style="display:'+ displaystatus +';">'
										+ '<div class="ng-count">' + (index+1) + '</div>'
										+ '<a class="ng-collapse collapsed" href="#keywordblock-' + index + '" data-toggle="collapse" aria-expanded="false" aria-controls="#keywordblock-' + index + '"></a>'
										
										+ '<a class="ng-focus" href="#0" data-type="ks-results-panel-' + cluster_id + '"><img src="images/elements/icon-focus.png" alt=""></a>'

										+ '<div class="ng-item clearfix">'
											+ '<div class="ng-title">'
												+ '<div class="ng-img"><img src="images/elements/icon-article.png" alt=""></div>'
												+ 'Articles'
											+ '</div>'
											+ '<div class="ng-data">'
												+ '<ul class="ng-article-list">'
													+ article_content
												+ '</ul>'
											+ '</div>'
										+ '</div><!--ng-item-->'

										+ '<div class="collapse" id="keywordblock-' + index + '">'
											+ '<div class="ng-item clearfix">'
												+ '<div class="ng-title">'
													+ '<div class="ng-img"><img src="images/elements/icon-tag.png" alt=""></div>'
													+ 'Theme Tags'
												+ '</div>'
												+ '<div class="ng-data">'
													+ tag_content
												+ '</div>'
											+ '</div><!--ng-item-->'

											+ '<div class="ng-item clearfix">'
												+ '<div class="ng-title">'
													+ '<div class="ng-img"><img src="images/elements/icon-topic.png" alt=""></div>'
													+ 'Document Excerpts'
												+ '</div>'
												+ '<div class="ng-data">'
													+ excerpts_content						
												+ '</div>'
											+ '</div><!--ng-item-->'

											+ '<div class="ng-item clearfix">'
												+ '<div class="ng-title">'
													+ '<div class="ng-img"><img src="images/elements/icon-article.png" alt=""></div>'
													+ 'Number of Key Documents'
												+ '</div>'
												+ '<div class="ng-data"><a class="ng-keydoc-link" href="#0">'+numKeyDocuments+'</a></div>'
											+ '</div><!--ng-item-->'
										+ '</div><!--collapse-->'
									+ '</div><!--ng-inner-->';

			$( "#ks_cl_item_"+index ).replaceWith( clusterInfoContent );
			
			KS_RESULT_VALUES[index] = {
						cluster_id:cluster_id, numKeyDocuments:numKeyDocuments,
						descr_title_text:descr_title_text, descr_tag_text:descr_tag_text, descr_window_text:descr_window_text
				};
			KS_RESULT_TAG_VALUES[cluster_id] = descr_tag_text;
		},
		error: function(response){
			loadingobj.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
//Show KS matched Documents page
function showKSMatchedDOCPage(ks_tab){
	if(ks_tab == "#sp-key-docs"){
		if($.cookie('ksClusterId') != $.cookie("isKSKeyDocDataExist")){
			emptyKSKeyDocData();
			$.cookie("isKSKeyDocDataExist", null);
			showKSKeyDOCPage();
		}
		else{
		}
	}
	else if(ks_tab == "#sp-related-docs"){
		if($.cookie('ksClusterId') != $.cookie("isKSRelDocDataExist")){
			emptyKSRelDocData();
			$.cookie("isKSRelDocDataExist", null);
			showKSRelDOCPage();
		}
		else{
		}
	}
}
//Key Documents page
function emptyKSKeyDocData(){
	//  sidebar tags remove
	var $kdSideBarTags = $('#sp-key-docs .sidebar-tags');
	$kdSideBarTags.empty();
	$kdSideBarTags.hide();
	
	//  neighbor generated data remove
	var $ksKeyDocGeneratedData = $('#sp-key-docs .neighbor-generated-data');
	$ksKeyDocGeneratedData.empty();
	
	$('#ks_keydoc_pagination').empty();
}
function emptyKSRelDocData(){
	//  neighbor generated data remove
	var $ksRelDocGeneratedData = $('#sp-related-docs .neighbor-generated-data');
	$ksRelDocGeneratedData.empty();
	
	$('#ks_reldoc_pagination').empty();
}
function showKSKeyDOCPage(){
	if(loadingobj2) loadingobj2.hide();
	loadingobj2 = new loadingObject();
	loadingConfig2 = {
        container:jQuery("#sp-key-docs"),
        loadingtext: 'Loading...'
    };
	
	loadingobj2.show(loadingConfig2);
	
	var cluster_id = $.cookie('ksClusterId');
	
	//<!--KEY DOCUMENTS tags
	/*
	var $kdSideBarTags = $('#sp-key-docs .sidebar-tags');
	var descr_tags = KS_RESULT_TAG_VALUES[cluster_id];
	for(dg=0; dg<descr_tags.length; dg++){
		tag_name = descr_tags[dg];
		var tag_opacity = 100;
		if(tag_opacity > 70){ opacity_str = ""; }
		else if(tag_opacity > 40){ opacity_str = "opacity-70"; }
		else if(tag_opacity > 20){ opacity_str = "opacity-40"; }
		else{ opacity_str = "opacity-20"; }
		var $kdTagContent = $('<div class="tag ' + opacity_str + '" href="#0">'
								+ tag_name
								+ ' <a class="tag-del" href="#0"></a>'
							+'</div>');
		
		$kdSideBarTags.append($kdTagContent).trigger("create");
	}
	*/
	//KEY DOCUMENTS tags -->
	$.cookie("isKSKeyDocDataExist", cluster_id);
	
	var subUrl ='/search/documents/matches/'+cluster_id+'/0';
	var apiUrl = DonesUrl + subUrl;

	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		success: function(xmlDoc){			
			
			var $ksKeyDocGeneratedData = $('#sp-key-docs .neighbor-generated-data');

			var seeds = xmlDoc.getElementsByTagName("seed");
			//ks_keydoc_pg pagination setting
			selected_pg = 'ks_keydoc_pg';
			pageOptions = DonesPages.ks_keydoc_pg;
			pageOptions.startPage = 1;
			pageOptions.currentPage = 1;
			pageOptions.pageItemCount = seeds.length;
			pageOptions.totalPages = parseInt((pageOptions.pageItemCount-1)/pageOptions.pageItemNum) + 1;
			paginationSet(pageOptions, selected_pg);

			for (var sd = 0; sd < seeds.length; sd++){
				doc_id = seeds[sd].getElementsByTagName("document")[0].attributes.getNamedItem("id").nodeValue;
				if(sd >= pageOptions.pageItemNum){
					displaystatus = 'none';
				}
				else{
					displaystatus = 'block';
				}
				var $docItemContent = $('<div class="ng-inner" id="ks_kd_item_' + sd + '" style="display:'+ displaystatus +';">'
										+ '<div class="ng-heading clearfix">'
											+ '<div class="ng-heading-count">' + (sd+1) + '</div>'
											+ '<div class="neighbor-buttons">'
												+ '<a class="n-expand collapsed" href="#kskdblock-' + doc_id + '" data-toggle="collapse" aria-expanded="false" aria-controls="#kskdblock-' + doc_id + '" onClick="showKSNeighbors('+cluster_id+','+doc_id+','+(sd+1)+', \'keydoc\')"></a>'
												+ '<a href="#0">DL</a>'
												+ '<a class="n-source" href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a>'
								    		+ '</div><!--neighbor-buttons-->'
											+ '<h3></h3>'
										+ '</div><!--ng-heading-->'
										+ '<div class="ng-item clearfix">'
											+ '<div class="ng-title">'
												+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
												+ 'Summary'
											+ '</div>'
											+ '<div class="ng-data">'
												+ '<p></p>'
											+ '</div>'
										+ '</div><!--ng-item-->'

										+ '<div class="ng-item clearfix">'
											+ '<div class="ng-title">'
												+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
												+ 'Date'
											+ '</div>'
											+ '<div class="ng-data"></div>'
										+ '</div><!--ng-item-->'
										
										+ '<div class="collapse" id="kskdblock-' + doc_id + '" aria-expanded="false" data-type="neighboritem-' + '' + '">'
											+ '<div class="ng-inner inside">'
												+ '<div class="ng-heading clearfix">'
													+ '<div class="ng-heading-count">' + (sd+1) + '.1</div>'
													+ '<div class="neighbor-buttons">'
														+ '<a href="#0">DL</a>'
														+ '<a class="n-source" href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a>'
													+ '</div><!--neighbor-buttons-->'
													+ '<h3></h3>'
												+ '</div><!--ng-heading-->'
											+ '</div><!--ng-inner-->'
										+ '</div>'
									+ '</div><!--ng-inner-->');
				$ksKeyDocGeneratedData.append($docItemContent).trigger("create");
				
				getMatchDocInfo(cluster_id, doc_id, sd, seeds.length);
			}

		},
		error: function(response){			
			loadingobj2.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
function getMatchDocInfo(cluster_id, doc_id, index, length){

	var subUrl ='/search/document/match/'+cluster_id+'/'+doc_id;
	var apiUrl = DonesUrl + subUrl;
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		success: function(xmlDoc){
			match_doc = xmlDoc.getElementsByTagName("document")[0];
			var title = match_doc.getElementsByTagName("title")[0].childNodes[0].nodeValue;

			var doc_content = '';
			var body_tag = match_doc.getElementsByTagName("body")[0];
			if(typeof body_tag != "undefined"){
				doc_content = body_tag.childNodes[0].nodeValue;
			}

			var summary_extract_text = []; summary_content = '';
			summary_extracts = match_doc.getElementsByTagName("summary")[0].getElementsByTagName("summary-extracts")[0].childNodes;
			for(var se=0; se<summary_extracts.length; se++){
				summary_extract_text[se] = summary_extracts[se].getElementsByTagName("summary-extract-text")[0].childNodes[0].nodeValue;
				summary_content +='<p>... '+summary_extract_text[se] + ' ...</p>';
			}
			var match_doc_date = match_doc.getElementsByTagName("date")[0].childNodes[0].nodeValue;
			var d = new Date(match_doc_date);
			if(isNaN(d.getFullYear())){//if  dd/mm/yyyy
				var dates = match_doc_date.split("/");
				var mm = parseInt(dates[1])-1;
				match_doc_date = monthNames[mm] + ' ' + dates[0] + ", " + dates[2];//doc date
			}
			else{//if  mm/dd/yyyy
				match_doc_date = monthNames[d.getMonth()] + ' ' + d.getDate() + ", " + d.getFullYear();//doc date
			}			

			var authors='';
			authors_tag = match_doc.getElementsByTagName("authors")[0];
			if(typeof authors_tag !="undefined"){
				author_name = authors_tag.childNodes[0].nodeValue;
				authors = author_name.replace("By ", "");
			}
			var place = match_doc.attributes.getNamedItem("href").nodeValue;
			var srcDocId = match_doc.getElementsByTagName("url")[0].childNodes[0].nodeValue;
			
			var pageOptions = DonesPages.ks_keydoc_pg;
			var startItemNum = (pageOptions.currentPage-1)*pageOptions.pageItemNum;
			if(length < pageOptions.pageItemNum){
				if((index+1) == length){
					loadingobj2.hide();
				}
			}else{
				if((index+1) == pageOptions.pageItemNum){
					loadingobj2.hide();				
				}
			}

			if((index >= startItemNum) && index < (startItemNum + pageOptions.pageItemNum) ){
		      displaystatus = 'block';
		    }
		    else{
		      displaystatus = 'none';
		    }

		    var docInfoContent = '<div class="ng-inner" id="ks_kd_item_' + index + '" style="display:'+ displaystatus +';">'
									+ '<div class="ng-heading clearfix">'
										+ '<div class="ng-heading-count">' + (index+1) + '</div>'
										+ '<div class="neighbor-buttons">'
								    		+ '<a class="n-expand collapsed" href="#kskdblock-' + doc_id + '" data-toggle="collapse" aria-expanded="false" aria-controls="#kskdblock-' + doc_id + '" onClick="showKSNeighbors('+cluster_id+','+doc_id+','+(index+1)+', \'keydoc\')" data-type="neighboritem-' + doc_id + '"></a>'
						    				+ '<a href="#0" onClick="showKSDocInfo('+index+', \'keydoc\')">DL</a>'
						    				+ '<a class="n-source" href="#0" onClick="openKSDocSRC('+index+', \'keydoc\')">'
						    				+'<img src="images/elements/icon-source-dark.png" alt=""></a>'
							    		+ '</div><!--neighbor-buttons-->'
										+ '<h3>'+title+'</h3>'
									+ '</div><!--ng-heading-->'
									+ '<div class="ng-item clearfix">'
										+ '<div class="ng-title">'
											+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
											+ 'Summary'
										+ '</div>'
										+ '<div class="ng-data">'
											+ summary_content
										+ '</div>'
									+ '</div><!--ng-item-->'
									
									+ '<div class="ng-item clearfix">'
										+ '<div class="ng-title">'
											+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
											+ 'Date'
										+ '</div>'
										+ '<div class="ng-data">'+match_doc_date+'</div>'
									+ '</div><!--ng-item-->'
									
									+ '<div class="collapse" id="kskdblock-' + doc_id + '" aria-expanded="false">'
										+ '<div class="ng-inner inside">'
											+ '<div class="ng-heading clearfix">'
												+ '<div class="ng-heading-count">' + index + '.1</div>'
												+ '<div class="neighbor-buttons">'
													+ '<a href="#0">DL</a>'
													+ '<a class="n-source" href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a>'
												+ '</div><!--neighbor-buttons-->'
												+ '<h3></h3>'
											+ '</div><!--ng-heading-->'
										+ '</div><!--ng-inner-->'
									+ '</div>'
								+ '</div><!--ng-inner-->';
			
		    $( "#ks_kd_item_"+index ).replaceWith( docInfoContent );
			
			KS_KEYDOC_VALUES[index] = {
						cluster_id:cluster_id, doc_id:doc_id, title:title,
						summary_content:summary_content, match_doc_date:match_doc_date,
						authors:authors, place:place, srcDocId:srcDocId,
						title:title,
						doc_content:doc_content
				};
		},
		error: function(response){
			loadingobj2.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
//Related Documents page
function showKSRelDOCPage(){
	if(loadingobj3) loadingobj3.hide();
	loadingobj3 = new loadingObject();
	loadingConfig3 = {
        container:jQuery("#sp-related-docs"),
        loadingtext: 'Loading...'
    };
	loadingobj3.show(loadingConfig3);
	
	var cluster_id = $.cookie('ksClusterId');
	$.cookie("isKSRelDocDataExist", cluster_id);
	
	var subUrl ='/search/documents/others/'+cluster_id;//+'/'+SEARCH_NUM_DOCUMENTS;
	var apiUrl = DonesUrl + subUrl;
	
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		success: function(xmlDoc){
			//console.log(apiUrl);
			var $ksRelDocGeneratedData = $('#sp-related-docs .neighbor-generated-data');
			
			var seeds = xmlDoc.getElementsByTagName("seed");
			//ks_keydoc_pg pagination setting
			selected_pg = 'ks_reldoc_pg';
			pageOptions = DonesPages.ks_reldoc_pg;
			pageOptions.startPage = 1;
			pageOptions.currentPage = 1;
			pageOptions.pageItemCount = seeds.length;
			pageOptions.totalPages = parseInt((pageOptions.pageItemCount-1)/pageOptions.pageItemNum) + 1;
			paginationSet(pageOptions, selected_pg);

			for (var sd = 0; sd < seeds.length; sd++){
				doc_id = seeds[sd].getElementsByTagName("document")[0].attributes.getNamedItem("id").nodeValue;
				if(sd >= pageOptions.pageItemNum){
					displaystatus = 'none';
				}
				else{
					displaystatus = 'block';
				}
				var $docItemContent = $('<div class="ng-inner" id="ks_rd_item_' + sd + '" style="display:'+ displaystatus +';">'
											+ '<div class="ng-heading clearfix">'
												+ '<div class="ng-heading-count">' + (sd+1) + '</div>'
												+ '<div class="neighbor-buttons">'
												+ '<a class="n-expand collapsed" href="#kskdblock-' + doc_id + '" data-toggle="collapse" aria-expanded="false" aria-controls="#kskdblock-' + doc_id + '" onClick="showKSNeighbors('+cluster_id+','+doc_id+','+(sd+1)+', \'reldoc\')"></a>'
												+ '<a href="#0">DL</a>'
												+ '<a class="n-source" href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a>'
								    		+ '</div><!--neighbor-buttons-->'
								    		+ '<h3></h3>'
											+ '</div><!--ng-heading-->'
											+ '<div class="ng-item clearfix">'
												+ '<div class="ng-title">'
													+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
													+ 'Summary'
												+ '</div>'
												+ '<div class="ng-data">'
													+ '<p></p>'
												+ '</div>'
											+ '</div><!--ng-item-->'

											+ '<div class="ng-item clearfix">'
												+ '<div class="ng-title">'
													+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
													+ 'Date'
												+ '</div>'
												+ '<div class="ng-data"></div>'
											+ '</div><!--ng-item-->'

											+ '<div class="collapse" id="kskdblock-' + doc_id + '" aria-expanded="false" data-type="neighboritem-' + '' + '">'
												+ '<div class="ng-inner inside">'
													+ '<div class="ng-heading clearfix">'
														+ '<div class="ng-heading-count">' + (sd+1) + '.1</div>'
														+ '<div class="neighbor-buttons">'
															+ '<a href="#0">DL</a>'
															+ '<a class="n-source" href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a>'
														+ '</div><!--neighbor-buttons-->'
														+ '<h3></h3>'
													+ '</div><!--ng-heading-->'
												+ '</div><!--ng-inner-->'
											+ '</div>'
										+ '</div><!--ng-inner-->');
				$ksRelDocGeneratedData.append($docItemContent).trigger("create");

				getOtherDocInfo(cluster_id, doc_id, sd, seeds.length);
			}

		},
		error: function(response){
			loadingobj3.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
function getOtherDocInfo(cluster_id, doc_id, index, length){

	var subUrl ='/search/document/other/'+cluster_id+'/'+doc_id;
	var apiUrl = DonesUrl + subUrl;
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		success: function(xmlDoc){
			match_doc = xmlDoc.getElementsByTagName("document")[0];
			var title = match_doc.getElementsByTagName("title")[0].childNodes[0].nodeValue;

			var doc_content = '';
			var body_tag = match_doc.getElementsByTagName("body")[0];
			if(typeof body_tag != "undefined"){
				doc_content = body_tag.childNodes[0].nodeValue;
			}			

			var summary_extract_text = []; summary_content = '';
			summary_extracts = match_doc.getElementsByTagName("summary")[0].getElementsByTagName("summary-extracts")[0].childNodes;
			for(var se=0; se<summary_extracts.length; se++){
				summary_extract_text[se] = summary_extracts[se].getElementsByTagName("summary-extract-text")[0].childNodes[0].nodeValue;
				summary_content +='<p>... '+summary_extract_text[se] + ' ...</p>';
			}
			var match_doc_date = match_doc.getElementsByTagName("date")[0].childNodes[0].nodeValue;
			var d = new Date(match_doc_date);
			if(isNaN(d.getFullYear())){//if  dd/mm/yyyy
				var dates = match_doc_date.split("/");
				var mm = parseInt(dates[1])-1;
				match_doc_date = monthNames[mm] + ' ' + dates[0] + ", " + dates[2];//doc date
			}
			else{//if  mm/dd/yyyy
				match_doc_date = monthNames[d.getMonth()] + ' ' + d.getDate() + ", " + d.getFullYear();//doc date
			}

			var authors='';
			authors_tag = match_doc.getElementsByTagName("authors")[0];
			if(typeof authors_tag !="undefined"){
				author_name = authors_tag.childNodes[0].nodeValue;
				authors = author_name.replace("By ", "");
			}
			var place = match_doc.attributes.getNamedItem("href").nodeValue;
			var srcDocId = match_doc.getElementsByTagName("url")[0].childNodes[0].nodeValue;

			var pageOptions = DonesPages.ks_reldoc_pg;
			var startItemNum = (pageOptions.currentPage-1)*pageOptions.pageItemNum;
			
			if(length < pageOptions.pageItemNum){
				if((index+1) == length){
					loadingobj3.hide();
				}
			}else{
				if((index+1) == pageOptions.pageItemNum){
					loadingobj3.hide();
				}
			}

			if((index >= startItemNum) && index < (startItemNum + pageOptions.pageItemNum) ){
		      displaystatus = 'block';
		    }
		    else{
		      displaystatus = 'none';
		    }
		    var docInfoContent = '<div class="ng-inner" id="ks_rd_item_' + index + '" style="display:'+ displaystatus +';">'
									+ '<div class="ng-heading clearfix">'
										+ '<div class="ng-heading-count">' + (index+1) + '</div>'
										+ '<div class="neighbor-buttons">'
								    		+ '<a class="n-expand collapsed" href="#kskdblock-' + doc_id + '" data-toggle="collapse" aria-expanded="false" aria-controls="#kskdblock-' + doc_id + '" onClick="showKSNeighbors('+cluster_id+','+doc_id+','+(index+1)+', \'reldoc\')" data-type="neighboritem-' + doc_id + '"></a>'
						    				+ '<a href="#0" onClick="showKSDocInfo('+index+', \'reldoc\')">DL</a>'
						    				+ '<a class="n-source" href="#0" onClick="openKSDocSRC('+index+', \'reldoc\')">'
						    				+'<img src="images/elements/icon-source-dark.png" alt=""></a>'
							    		+ '</div><!--neighbor-buttons-->'
										+ '<h3>'+title+'</h3>'
									+ '</div><!--ng-heading-->'
									+ '<div class="ng-item clearfix">'
										+ '<div class="ng-title">'
											+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
											+ 'Summary'
										+ '</div>'
										+ '<div class="ng-data">'
											+ summary_content
										+ '</div>'
									+ '</div><!--ng-item-->'

									+ '<div class="ng-item clearfix">'
										+ '<div class="ng-title">'
											+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
											+ 'Date'
										+ '</div>'
										+ '<div class="ng-data">'+match_doc_date+'</div>'
									+ '</div><!--ng-item-->'
							
									+ '<div class="collapse" id="kskdblock-' + doc_id + '" aria-expanded="false">'
										+ '<div class="ng-inner inside">'
											+ '<div class="ng-heading clearfix">'
												+ '<div class="ng-heading-count">' + index + '.1</div>'
												+ '<div class="neighbor-buttons">'
													+ '<a href="#0">DL</a>'
													+ '<a class="n-source" href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a>'
												+ '</div><!--neighbor-buttons-->'
												+ '<h3></h3>'
											+ '</div><!--ng-heading-->'
										+ '</div><!--ng-inner-->'
									+ '</div>'
								+ '</div><!--ng-inner-->';

		    $( "#ks_rd_item_"+index ).replaceWith( docInfoContent );
			
			KS_RELDOC_VALUES[index] = {
					cluster_id:cluster_id, doc_id:doc_id, title:title,
					summary_content:summary_content, match_doc_date:match_doc_date,
					authors:authors, place:place, srcDocId:srcDocId,
					doc_content:doc_content
				};
		},
		error: function(response){
			loadingobj3.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}

function displayKSDocInfo(doc_index, doc_type, doc_id){
	//console.log(KS_NEIGHBOR_VALUES[doc_id])
	if( doc_type == "keydoc" && typeof KS_KEYDOC_VALUES[doc_index] != "undefined"){
		ksDocInfo = KS_KEYDOC_VALUES[doc_index];
		docLength = KS_KEYDOC_VALUES.length;
	}
	else if( doc_type == "reldoc" && typeof KS_RELDOC_VALUES[doc_index] != "undefined"){
		ksDocInfo = KS_RELDOC_VALUES[doc_index];
		docLength = KS_RELDOC_VALUES.length;
	}
	else if( doc_type == "neighbordoc" && typeof KS_NEIGHBOR_VALUES[doc_id][doc_index] != "undefined"){
		ksDocInfo = KS_NEIGHBOR_VALUES[doc_id][doc_index];
		docLength = KS_NEIGHBOR_VALUES[doc_id].length;
	}
	else{
		console.log('KS_KEYDOC_VALUES index: ' + doc_index + ' has no values');
		ksDocInfo = {match_doc_date:"", authors:"",
					place:"", srcDocId:"", title:"",
					doc_content:""};
		docLength = 0;
	}
	//
	prevDocIndex = doc_index - 1;
	nav_prev_class = "";
	if(prevDocIndex < 0){
		prevDocIndex = doc_index;
		nav_prev_class = "disabled";
	}

	nextDocIndex = doc_index + 1;
	nav_next_class = "";
	if(nextDocIndex == docLength){
		nextDocIndex = doc_index;
		nav_next_class = "disabled";
	}

	var $ksDocPanel = $('.ks-doc-panel');
	$ksDocPanel.empty();
	var ksDocInfoContent = '<div class="sp-inner">'
				+'<div class="sp-inner-article ks-doc">'
					+'<div class="sp-top-nav">'
						+'<div class="sp-top-nav-right">'
							+'<div class="sp-top-nav-arrows">'
								+'<a href="#0" class="'+nav_prev_class+'" onClick="displayKSDocInfo('+prevDocIndex+', \''+doc_type+'\''+', '+doc_id+')"><img src="images/elements/icon-arrow.png" alt=""></a>'
								+'<a href="#0" class="'+nav_next_class+'" onClick="displayKSDocInfo('+nextDocIndex+', \''+doc_type+'\''+', '+doc_id+')"><img src="images/elements/icon-arrow.png" alt=""></a>'
							+'</div>'
						+'</div>'
					+'</div><!--sp-top-nav-->'
					+'<div class="customer-generetad-data">'
						+'<div class="neighbor-generated-data">'
							+'<h5>Customer generated metadata</h5>'
							+'<div class="ng-inner">'
								+'<div class="ng-item clearfix">'
									+'<div class="ng-title">'
										+'<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
										+'Date'
									+'</div>'
									+'<div class="ng-data">'+ksDocInfo.match_doc_date+'</div>'
								+'</div><!--ng-item-->'

								+'<div class="ng-item clearfix">'
									+'<div class="ng-title">'
										+'<div class="ng-img"><img src="images/elements/icon-author.png" alt=""></div>'
										+'Author(s)'
									+'</div>'
									+'<div class="ng-data">'+ksDocInfo.authors+' <sup>(NYT)</sup></div>'
								+'</div><!--ng-item-->'

								+'<div class="ng-item clearfix">'
									+'<div class="ng-title">'
										+'<div class="ng-img"><img src="images/elements/icon-place.png" alt=""></div>'
										+'Place'
									+'</div>'
									+'<div class="ng-data"><a class="link" href="#0"><span>'+ksDocInfo.place+'</span></a></div>'
								+'</div><!--ng-item-->'

								+'<div class="ng-item clearfix">'
									+'<div class="ng-title">'
										+'<div class="ng-img"><img src="images/elements/icon-source.png" alt=""></div>'
										+'Source ID'
									+'</div>'
									+'<div class="ng-data"><a class="link" href="#0"><span>'+ksDocInfo.srcDocId+'</span></a></div>'
								+'</div><!--ng-item-->'
							+'</div><!--ng-inner-->'
						+'</div><!--neighbor-generated-data-->'
					+'</div><!--customer-generated-data-->'
					+'<article class="sp-article">'
						+'<h1>'+ksDocInfo.title+' <a href="#0" onClick="openWindow(\''+ksDocInfo.srcDocId+'\')"><img src="images/elements/icon-source-dark.png" alt=""></a></h1>'
						+'<p>'+ksDocInfo.doc_content+'</p>'
					+'</article>'
				+'</div><!--sp-inner-article-->'
				+'<a href="#0" class="close-sliding-panel2 visible-xs">Close</a>'
			+'</div><!--sp-inner-->';

	$ksDocPanel.append(ksDocInfoContent).trigger("create");
}

function showKSNeighbors(cluster_id, parent_doc_id, parent_doc_index, doc_type){
	var $ksKDBlock = $('#kskdblock-'+parent_doc_id);
	
	var aria_expanded = $ksKDBlock.attr('aria-expanded');
	if(aria_expanded == "false"){//open
		var neighbordata_id = "neighboritem-" + parent_doc_id;
		if($ksKDBlock.data('type') != neighbordata_id){
			$ksKDBlock.empty();
			
			getKSNeighborsList(cluster_id, parent_doc_id, parent_doc_index, doc_type);
		}
	}
}

function getKSNeighborsList(cluster_id, parent_doc_id, parent_doc_index, doc_type){

	if(loadingobj4) loadingobj4.hide();
	loadingobj4 = new loadingObject();
	loadingConfig4 = {
        container:jQuery(".ks-results-panel"),
        loadingtext: 'Loading...'
    };
	
	loadingobj4.show(loadingConfig4);
	
	if(doc_type == "keydoc" ){
		apitype="matches";
	}
	else {
		apitype="others";
	}
	
	var subUrl ='/search/neighbors/'+apitype+'/'+cluster_id+'/'+parent_doc_id;
	var apiUrl = DonesUrl + subUrl;
	var jsonData = { numNeighbors : SEARCH_KS_NEIGHBOR_NUM };
	
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		data: jsonData,
		success: function(xmlDoc){
			//console.log(xmlDoc);
			KS_NEIGHBOR_VALUES[parent_doc_id] = [];
			
			var $neighborItemList = $('#kskdblock-'+parent_doc_id);			
			
			var neighbors = xmlDoc.getElementsByTagName("document");			
			for (var n = 0; n < neighbors.length; n++){
				doc_id = neighbors[n].attributes.getNamedItem("id").nodeValue;
				
				docWeight = neighbors[n].attributes.getNamedItem("dist").nodeValue;
				docWeight = 5 - parseInt(docWeight*5);
				
				var $neighborItemContent = $('<div class="ng-inner inside" id="ks_neighbor_item_' + parent_doc_id +"_"+n+ '">'
										+ '<div class="ng-heading clearfix">'
											+ '<div class="ng-heading-count">' + parent_doc_index + '.'+(n+1)+'</div>'
											+ '<div class="neighbor-buttons">'
												+ '<a href="#0">DL</a>'
												+ '<a class="n-source" href="#0"><img src="images/elements/icon-source-dark.png" alt=""></a>'
								    		+ '</div><!--neighbor-buttons-->'
											+ '<h3></h3>'
										+ '</div><!--ng-heading-->'
										+ '<div class="ng-item clearfix">'
											+ '<div class="ng-title">'
												+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
												+ 'Summary'
											+ '</div>'
											+ '<div class="ng-data">'
												+ '<p></p>'
											+ '</div>'
										+ '</div><!--ng-item-->'

										+ '<div class="ng-item clearfix">'
											+ '<div class="ng-title">'
												+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
												+ 'Date'
											+ '</div>'
											+ '<div class="ng-data"></div>'
										+ '</div><!--ng-item-->'
									+ '</div><!--ng-inner-->');
				$neighborItemList.append($neighborItemContent).trigger("create");

				getNeighborDocInfo(parent_doc_id, doc_id, parent_doc_index, n, neighbors.length);				
				
			}		
		},
		error: function(response){
			loadingobj4.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}
function getNeighborDocInfo(parent_doc_id, doc_id, parent_doc_index, neighborIndex, length){	
	
	var subUrl ='/dl/document/'+doc_id;
	var apiUrl = DonesUrl + subUrl;
	
	$.ajax({
		url: apiUrl,
		type: 'GET',
		dataType: 'xml',
		success: function(xmlDoc){
			var $ksKDBlock = $('#kskdblock-'+parent_doc_id);
			
			//console.log(xmlDoc);
			var neighborDocData = {doc_id:doc_id, match_doc_date:"", title:"",
							doc_content:"", authors:"",
							place:"", srcDocId:""};
			
			var neighbor_doc = xmlDoc.getElementsByTagName("document")[0];
			
			doc_date = neighbor_doc.attributes.getNamedItem("date").nodeValue;
			var d = new Date(doc_date);
			neighborDocData['match_doc_date'] = monthNames[d.getMonth()] + ' ' + d.getDate()+", " + d.getFullYear();//doc date
			
			neighborDocData['title'] = neighbor_doc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
			
			if(typeof (doc_body = neighbor_doc.getElementsByTagName("body")[0].childNodes[0]) != "undefined"){
				neighborDocData['doc_content'] = doc_body.nodeValue;
			}
			if(typeof (authors = neighbor_doc.getElementsByTagName("authors")[0].childNodes[0]) != "undefined"){
				author_name = authors.nodeValue;
				neighborDocData['authors'] = author_name.replace("By ", "");
			}
			neighborDocData['place'] = neighbor_doc.getElementsByTagName("place")[0].childNodes[0].nodeValue;
			neighborDocData['srcDocId'] = neighbor_doc.attributes.getNamedItem("srcId").nodeValue;
			
			var summary_abstract_text = []; summary_content = '';
			summary_abstracts = neighbor_doc.getElementsByTagName("abstracts")[0].childNodes;
			for(var se=0; se<summary_abstracts.length; se++){
				if(se>2) break;
				summary_abstract_text[se] = summary_abstracts[se].childNodes[0].nodeValue
				summary_content +='..'+summary_abstract_text[se] + '..';
			}
			summary_content = '.'+summary_content.substr(0,370)+'..';
			
			var pageItemNum = 5;
			if(length < pageItemNum ){
				if((neighborIndex+1) == length){
					loadingobj4.hide();
					$ksKDBlock.attr('data-type', "neighboritem-" + parent_doc_id);
				}
			}
			else{
				if((neighborIndex+1) == pageItemNum){
					loadingobj4.hide();
					$ksKDBlock.attr('data-type', "neighboritem-" + parent_doc_id);
				}
				
			}
			
			var docInfoContent = '<div class="ng-inner inside" id="ks_neighbor_item_' + parent_doc_id +"_"+neighborIndex + '">'
									+ '<div class="ng-heading clearfix">'
										+ '<div class="ng-heading-count">'
												+ parent_doc_index + '.'+(neighborIndex+1)+'</div>'
										+ '<div class="neighbor-buttons">'
											+ '<a href="#0" onClick="showKSDocInfo('+neighborIndex+', \'neighbordoc\', '+parent_doc_id+')">DL</a>'
											+ '<a class="n-source" href="#0" onClick="openKSDocSRC('+neighborIndex+', \'neighbordoc\', '+parent_doc_id+')">'
												+'<img src="images/elements/icon-source-dark.png" alt=""></a>'
										+ '</div><!--neighbor-buttons-->'
										+ '<h3>'+neighborDocData['title']+'</h3>'
										+ '</div><!--ng-heading-->'
										+ '<div class="ng-item clearfix">'
											+ '<div class="ng-title">'
												+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
												+ 'Summary'
											+ '</div>'
											+ '<div class="ng-data">'
												+ summary_content
											+ '</div>'
										+ '</div><!--ng-item-->'
										
										+ '<div class="ng-item clearfix">'
											+ '<div class="ng-title">'
												+ '<div class="ng-img"><img src="images/elements/icon-date.png" alt=""></div>'
												+ 'Date'
											+ '</div>'
											+ '<div class="ng-data">'+neighborDocData['match_doc_date']+'</div>'
										+ '</div><!--ng-item-->'
									+ '</div><!--ng-inner-->';
			
			$( "#ks_neighbor_item_"+parent_doc_id+"_"+neighborIndex ).replaceWith( docInfoContent );
	
			KS_NEIGHBOR_VALUES[parent_doc_id][neighborIndex] = neighborDocData;
			
			
		},
		error: function(response){			
			loadingobj4.hide();
			console.log('An error occurred. Please connect to your provider for this search.');
		}
    });
}


























