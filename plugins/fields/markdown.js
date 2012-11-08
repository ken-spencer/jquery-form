function sb_markdown()
{
    var head = '<div class="markdown-head">';
    head += '<button type="button" data-action="strong" tabindex="-1"> Bold </button>';
    head += '<button type="button" data-action="em" tabindex="-1"> Italic </button>';
    head += '<button type="button" data-action="link" tabindex="-1"> Link </button>';
    head += '<button type="button" data-action="image" tabindex="-1"> Image </button>';
    head += '</div>';
     var foot = '<div class="markdown-preview">';
    foot += '</div>';

    var node = $(this)
    .wrap('<div class="markdown-field"></div>')
    .before(head)
    .after(foot);

    var parent = $(node).parent();
        
    $(".markdown-head", parent).on('click', 'button', function(evt)
    {

        var range = node.getRange();
        var text = node.val().substring(range.start, range.end);

        switch ($(this).data('action')) {
        case 'strong':
            tag('**', range, text || 'Bolded Text');
            break;
        case 'em':
            tag('*', range, text || 'Emphasized Text');
            break;
        case 'link':
            linkWindow(evt, range, text);
            break;
        case "image":
            imageWindow(evt, range, text);
            break;
        }
    });

    $(node).on('change keyup blur', function(evt)
    {
        var converter = new Showdown.converter();
        var html = converter.makeHtml(node.val());

        $('.markdown-preview', parent).html(html);
    })
    .trigger('change');
 

    var tag = function (tag, range, text, end)
    {
        if (!end) {
            end = tag;
        }
        var offset = tag.length;
        var offset2 = end.length;

        var length = text.length;
        text = tag + text + end;
        
        $(node).val(
            $(node).val().substring(0, range.start)+
            text+
            $(node).val().substring(range.end)
        );

        $(node)
        .setRange(range.start + offset, range.start + offset2 + length)
        .trigger('change');
        
    }

    var linkWindow = function(evt, range, text)
    {
        var html = '<div id="markdown-window">';
        html += '<div class="field">';
        html += '<label for="markdown-url" class="field-label">URL</label>';
        html += '<div><input id="markdown-url"/></div>';
        html += '</div>';
        
        html += '<br />';
        html += '<div class="markdown-window-buttons">';
        html += '<button type="button" data-action="ok"> OK </button>';
        html += '<button type="button" data-action="cancel"> Cancel </button>';
        html += '</div>';
        html += '</div>';

        var win = $(evt.target).window("Link", html);    

        var input = win.find('input').focus();

        win.on('click', 'button', function()
        {
            if ($(this).data('action') == 'ok') {
                var value = $.trim(input.val());
                if (value.length) {
                    if (value.length && value.substring(0, 1) != '/' && !value.match(/[a-zA-Z]+:\/\//)) {
                        value = 'http://' + value;
                    }

                    if (text.length) {
                        tag('[' + text + '](', range, value, ')');
                    } else {
                        tag('<', range, value, '>');
                    }
                } else {
                    alert("Invalid URL");
                    win.find('input').focus();
                    return;
                }
            }
            win.clearer();
        });
    }

    var imageWindow = function(evt, range, text)
    {
        var html = '<div id="markdown-window">';
        html += '<div class="field">';
        html += '<label for="markdown-url" class="field-label">Image URL</label>';
        html += '<div><input id="markdown-url"/></div>';
        html += '</div>';
        html += '<br />';

        html += '<div class="field">';
        html += '<label for="markdown-alt" class="field-label">Alt Text</label>';
        html += '<div><input id="markdown-alt"/></div>';
        html += '</div>';

        html += '<br />';
        html += '<div class="markdown-window-buttons">';
        html += '<button type="button" data-action="ok"> OK </button>';
        html += '<button type="button" data-action="cancel"> Cancel </button>';
        html += '</div>';
        html += '</div>';

        var win = $(evt.target).window("Image", html);    

        var input = win.find('#markdown-url').focus();
        var alt = win.find('#markdown-alt');

        win.on('click', 'button', function()
        {
            if ($(this).data('action') == 'ok') {
                var value = $.trim(input.val());
                if (value.length) {
                    if (value.length && value.substring(0, 1) != '/' && !value.match(/[a-zA-Z]+:\/\//)) {
                        value = 'http://' + value;
                    }

                    tag('![' + alt.val() + '](', range, value, ')');
                } else {
                    alert("Invalid Image URL");
                    win.find('input').focus();
                    return;
                }
            }
            win.clearer();
        });
    }
}
