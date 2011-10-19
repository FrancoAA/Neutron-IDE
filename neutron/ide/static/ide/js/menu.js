
function about () {
  alert('Neutron IDE v11.11 by Paul M Bailey - paul.m.bailey@gmail.com\n\nneutronide.com\n\nLicense: BSD');
  hide_menu();
}

function show_menu () {
  var offset = $("#menu_button").offset();
  $("#main_menu").css('display', 'block');
  $("#main_menu").offset({top: offset.top + 7, left: offset.left + 7});
}

function hide_menu () {
  $("#main_menu").css('display', 'none');
}

function CloseAll () {
  if (confirm('Are you sure you wish to close all tabs?')) {
    $('#tabs span.ui-icon-close').click();
  }
}

function SaveAll () {
  $( "#saveall" ).dialog({
  	title: 'Save All',
    modal: true,
    closeOnEscape: false,
    open: function(event, ui) {
      $(this).parent().children().children('.ui-dialog-titlebar-close').hide();
    },
	});
  
  for (dp in tab_paths) {
    var contents = tab_paths[dp].editor.getSession().getValue();
    
    $("#saveall").empty();
    $("#saveall").append('<p id="saveall_' + tab_paths[dp].uid + '">Saving ' + tab_paths[dp].filename + ' ...</p>');
    
    $.ajax({
      type: 'POST',
      url: '/filesave/',
      data: {'path': dp, 'contents': contents},
      success: function (data, textStatus, jqXHR) {
        $("#saveall_" + data.uid).remove();
        if (data.result == 'bad') {
          alert(data.error);
        }
        
        if ($('#saveall').children().size() == 0) {
          $("#saveall").dialog('close');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) { alert('Error Saving: ' + dp); $("#status").html(''); },
    });
  }
}

canon.addCommand({
    name: 'SaveFile',
    bindKey: {
      win: 'Ctrl-shift-S',
      mac: 'Command-shift-S',
      sender: 'editor'
    },
    exec: function(env, args, request) { SaveAll(); }
});
