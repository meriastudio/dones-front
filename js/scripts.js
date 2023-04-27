//Select Styling
$('.selectpicker').selectpicker({
  width: '100%'
});

//Disabling Search Button
$(document).ready(function () {
   $('.search-input').keyup(function () {
      if ($.trim($(this).val()).length != 0) {
         $(this).parent().next('.search-submit').attr('disabled', false);
     } else {
         $(this).parent().next('.search-submit').attr('disabled', true);
     }
   })
});

//Textarea Auto Height
autosize($('textarea'));

//Sidebar Topic Selection
$(document).ready(function () {
   $('.choose-topic-rel').click(function () {
    $(this).addClass("opacity-100").siblings().removeClass("opacity-100");
   })
});

//Sliding Panel
jQuery(document).ready(function($){
  var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;

  $(document).on('click', '.neighbor-buttons .n-view', function(event){
    event.preventDefault();
    var selected_member = $(this).data('type');
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

  $(document).on('click', '.wrap-overlay, .close-sliding-panel', function(event){
    event.preventDefault();
    $('.sliding-panel').removeClass('slide-in');

    if( is_firefox ) {
      $('.wrapper').removeClass('slide-out').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        $('body').removeClass('overflow-hidden');
      });
    } else {
      $('.wrapper').removeClass('slide-out');
      $('body').removeClass('overflow-hidden');
    }
  });
  $(document).on('click', '.wrap-overlay2, .close-sliding-panel2', function(event){
    event.preventDefault();
    $('.sliding-panel2').removeClass('slide-in');

    if( is_firefox ) {
      $('.wrapper').removeClass('slide-out2').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
      });
    } else {
      $('.wrapper').removeClass('slide-out2');
    }
  });
  //Tag Activate
  $(document).on('click', '.sp-ks-tabs .tag', function(event){
    event.preventDefault();
    $(this).toggleClass("active");
  });
  //Tag Remove
  $(document).on('click', '.tag-del', function(event){
    event.preventDefault();
    $(this).closest(".tag").remove();
  });
  
});

//<!-- Format XML Start
function XMLToString(oXML){
  //code for IE
  if (window.ActiveXObject) {
    var oString = oXML.xml; return oString;
  } 
  // code for Chrome, Safari, Firefox, Opera, etc.
  else {
    return (new XMLSerializer()).serializeToString(oXML);
  }
 }
function StringToXML(oString) {
  //code for IE
  if (window.ActiveXObject) { 
    var oXML = new ActiveXObject("Microsoft.XMLDOM");
    oXML.loadXML(oString);
    return oXML;
  }
  // code for Chrome, Safari, Firefox, Opera, etc. 
  else {
    return (new DOMParser()).parseFromString(oString, "text/xml");
  }
 }
function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}
//Format XML End -->

//<!-- Pagination Start
var defaultPGOptions = {
        totalPages: 20,
        startPage: 1,
        visiblePages: 10,
        currentPage: 1,
        pageItemNum: 5,
        pageItemCount: 100
	};

var DonesPages = {
    ks_main_pg : {
        totalPages: 20,
        startPage: 1,
        visiblePages: 10,
        currentPage: 1,
        pageItemNum: 5,
        pageItemCount: 100
  },
    ks_keydoc_pg : {
        totalPages: 15,
        startPage: 1,
        visiblePages: 10,
        currentPage: 1,
        pageItemNum: 3,
        pageItemCount: 100
  },
    ks_reldoc_pg : {
        totalPages: 25,
        startPage: 1,
        visiblePages: 10,
        currentPage: 1,
        pageItemNum: 4,
        pageItemCount: 100
  }
};

$(document).ready(function () {
	$(document).on('click', '#ks_main_pagination li>a', function(event){
		event.preventDefault();
		var selected_pg = "ks_main_pg";
		clickedPage = $(this).attr("href").replace("#", '');
		pageAction(clickedPage, selected_pg);    
	});
	$(document).on('click', '#ks_keydoc_pagination li>a', function(event){
		event.preventDefault();
		var selected_pg = "ks_keydoc_pg";
		clickedPage = $(this).attr("href").replace("#", '');
		pageAction(clickedPage, selected_pg);    
	});
	$(document).on('click', '#ks_reldoc_pagination li>a', function(event){
		event.preventDefault();
		var selected_pg = "ks_reldoc_pg";
		clickedPage = $(this).attr("href").replace("#", '');
		pageAction(clickedPage, selected_pg);    
	});

	function pageAction(clickedPage, selected_pg){
		if(clickedPage == "prev"){
		  prevPage(selected_pg);
		}
		else if(clickedPage == "next"){
		  nextPage(selected_pg);
		}
		else if(parseInt(clickedPage)>0){
		  goToPage(parseInt(clickedPage), selected_pg);
		}
	}
	function prevPage(selected_pg){
		var pageOptions =[];
		if(selected_pg == "ks_main_pg"){
		  pageOptions = DonesPages.ks_main_pg;
		}
		else if(selected_pg == "ks_keydoc_pg"){
		  pageOptions = DonesPages.ks_keydoc_pg;
		}
		else if(selected_pg == "ks_reldoc_pg"){
		  pageOptions = DonesPages.ks_reldoc_pg;
		}

		pageOptions.startPage -= pageOptions.visiblePages;
		if(pageOptions.startPage<0) pageOptions.startPage = 1;
		pageOptions.currentPage = pageOptions.startPage;
		
		paginationSet(pageOptions, selected_pg);
		loadPageContent(pageOptions, selected_pg);
	}
	function nextPage(selected_pg){
		var pageOptions =[];
		if(selected_pg == "ks_main_pg"){
		  pageOptions = DonesPages.ks_main_pg;
		}
		else if(selected_pg == "ks_keydoc_pg"){
		  pageOptions = DonesPages.ks_keydoc_pg;
		}
		else if(selected_pg == "ks_reldoc_pg"){
		  pageOptions = DonesPages.ks_reldoc_pg;
		}

		pageOptions.startPage += pageOptions.visiblePages;
		if(pageOptions.startPage>=pageOptions.totalPages) pageOptions.startPage -= pageOptions.visiblePages;
		pageOptions.currentPage = pageOptions.startPage;
		
		paginationSet(pageOptions, selected_pg);
		loadPageContent(pageOptions, selected_pg);
	}
	function goToPage(clickedPage, selected_pg){
		var pageOptions =[];
		if(selected_pg == "ks_main_pg"){
		  pageOptions = DonesPages.ks_main_pg;
		  pagination_id = 'ks_main_pagination';
		}
		else if(selected_pg == "ks_keydoc_pg"){
		  pageOptions = DonesPages.ks_keydoc_pg;
		  pagination_id = 'ks_keydoc_pagination';
		}
		else if(selected_pg == "ks_reldoc_pg"){
		  pageOptions = DonesPages.ks_reldoc_pg;
		  pagination_id = 'ks_reldoc_pagination';
		}
		
		if( (clickedPage == pageOptions.totalPages) 
				&& (pageOptions.startPage < pageOptions.totalPages-pageOptions.visiblePages)){
				
			pageOptions.startPage = pageOptions.totalPages - (pageOptions.totalPages%pageOptions.visiblePages) + 1;
			if(pageOptions.startPage >= pageOptions.totalPages) {
			   pageOptions.startPage = pageOptions.startPage - pageOptions.visiblePages;
			}
			
		  paginationSet(pageOptions, selected_pg);
		}
		$('#'+pagination_id+' li').find("a").parent().removeClass("active");
		$('#'+pagination_id+' li>a[href="#'+clickedPage+'"]').parent().addClass("active");
		pageOptions.currentPage = clickedPage;
		loadPageContent(pageOptions, selected_pg);
	}
});

function paginationSet(pageOptions, selected_pg){
  //console.log(pageOptions)
  var $dataPagination = $('.data-pagination');
  if(selected_pg == "ks_main_pg"){
    $dataPagination = $('#ks_main_pagination');
  }
  else if(selected_pg == "ks_keydoc_pg"){
    $dataPagination = $('#ks_keydoc_pagination');
  }
  else if(selected_pg == "ks_reldoc_pg"){
    $dataPagination = $('#ks_reldoc_pagination');
  }
  
  $dataPagination.empty();
  var pageinationContent = '';
  var pageEnd = pageOptions.startPage+pageOptions.visiblePages;
  if(pageEnd >= pageOptions.totalPages){
    pageEnd = pageOptions.totalPages;
  }
  for(var pageInd = pageOptions.startPage; pageInd < pageEnd; pageInd++){
    if(pageInd == pageOptions.currentPage){
      activeClass = "active";
    }
    else
      activeClass = '';
    pageinationContent+='<li class="'+activeClass+'"><a href="#'+ pageInd+'">'+pageInd+'</a></li>';

  }
  if(pageInd<pageOptions.totalPages){
    pageinationContent+='<li class="disabled"><a href="#more">• • •</a></li>';
    pageinationContent+='<li><a href="#'+pageOptions.totalPages+'">'+pageOptions.totalPages+'</a></li>';
  }
  else{
    pageinationContent+='<li><a href="#'+pageOptions.totalPages+'">'+pageOptions.totalPages+'</a></li>';
  }
  //narrow button
  if(pageOptions.startPage == 1){
    pageinationContent+='<li class="data-nav previous disabled"><a href="#prev"><img src="images/elements/dropdown-arrow.png" alt=""></a></li>';
  }
  else{
    pageinationContent+='<li class="data-nav previous"><a href="#prev"><img src="images/elements/dropdown-arrow.png" alt=""></a></li>';
  }
  if(pageEnd == pageOptions.totalPages){
    pageinationContent+='<li class="data-nav next disabled"><a href="#next"><img src="images/elements/dropdown-arrow.png" alt=""></a></li>';
  }
  else{
    pageinationContent+='<li class="data-nav next"><a href="#next"><img src="images/elements/dropdown-arrow.png" alt=""></a></li>';
  }

  $dataPagination.append(pageinationContent);
}
function loadPageContent(pageOptions, selected_pg){
  var startItemNum = (pageOptions.currentPage-1)*pageOptions.pageItemNum;
  for (var pInd = 0; pInd < pageOptions.pageItemCount; pInd++){

    if((pInd >= startItemNum) && pInd < (startItemNum + pageOptions.pageItemNum) ){
      displaystatus = 'block';
    }
    else{
      displaystatus = 'none';
    }

    if(selected_pg == "ks_main_pg"){
      $( "#ks_cl_item_"+pInd ).css("display", displaystatus);
    }
    else if(selected_pg == "ks_keydoc_pg"){
      $( "#ks_kd_item_"+pInd ).css("display", displaystatus);
    }
    else if(selected_pg == "ks_reldoc_pg"){
      $( "#ks_rd_item_"+pInd ).css("display", displaystatus);
    }
  }
}
//Pagination End -->