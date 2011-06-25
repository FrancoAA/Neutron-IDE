$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

var tab_counter = 0;
var $tabs = null;
var load_data = "";
var tab_paths = {};
var tab_counts = {};

function CurrentTab () {
  var href = $("ul.ui-tabs-nav li.ui-tabs-selected a").attr('href');
  var cnt = split_href(href);
  return tab_counts[cnt];
}

function SaveCurrentTab () {
  var dp = CurrentTab();
  var contents = tab_paths[dp].editor.getSession().getValue();
  
  $("#status").html('Saving ' + tab_paths[dp].filename);
  
  $.ajax({
    type: 'POST',
    url: '/filesave/',
    data: {'path': dp, 'contents': contents},
    success: function (data, textStatus, jqXHR) {
      $("#status").html('');
      if (data.result == 'bad') {
        alert(data.error);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) { alert('Error Saving: ' + dp); $("#status").html(''); },
  });
}

function create_tab (data) {
  if (data.path in tab_paths) {
    $tabs.tabs('select', "#tabs-" + tab_paths[data.path].tab);
  }
  
  else {
    if (data.fileType == 'text') {
      load_data = data.data;
      $tabs.tabs("add", "#tabs-" + tab_counter, data.filename);
      $tabs.tabs('select', "#tabs-" + tab_counter);
      
      var editor = ace.edit("editor_" + tab_counter);
      
      if (data.mode) {
        var Mode = require("ace/mode/" + data.mode).Mode;
        editor.getSession().setMode(new Mode());
      }
      
      var h = $("#tabs").height() - 29;
      $("#editor_" + tab_counter).css('height', h + 'px');
      editor.resize();
      
      
      tab_paths[data.path] = {tab: tab_counter, editor: editor, filename: data.filename}
      tab_counts[tab_counter] = data.path
      
      tab_counter++;
    }
    
    else if (data.fileType == 'binary') {
      alert('binary file');
    }
  }
}

function split_href (href) {
  var cnt = href.split('-');
  return cnt[cnt.length - 1];
}

function remove_tab (ui) {
  var cnt = split_href(ui.tab.href);
  var dp = tab_counts[cnt];
  delete tab_paths[dp];
  delete tab_counts[cnt];
}

$(document).ready( function() {
    $('#file_browser').fileTree({ root: '', script: '/filetree/', expandSpeed: 200, collapseSpeed: 200 }, function(file) {
        $.post('/fileget/', {f: file}, create_tab);
    });
    
    $tabs = $("#tabsinner").tabs({
      tabTemplate: "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui) {
        $(ui.panel).append( "<div class=\"editor\" id=\"editor_" + tab_counter + "\">" + load_data + "</div>" );
      },
      remove: function (event, ui) { remove_tab(ui); }
    });
    $tabs.find( ".ui-tabs-nav" ).sortable({ axis: "x" });
    $( "#tabs span.ui-icon-close" ).live( "click", function() {
      var p = $(this).parent();
      var index = $( "li", $tabs ).index(p);
      $tabs.tabs( "remove", index );
    });
});

var myLayout;
  
$(document).ready(function () {
  myLayout = $('body').layout({north__resizable: false, north__closable: false});
});
