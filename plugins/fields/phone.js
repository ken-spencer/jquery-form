$(document).ready(function()
{
    $('.phone-field input[maxlength="3"]').on('keyup', function(evt)
    {
        if ($(this).getRange().end == 3) {
            $(this).next('input').focus().select();
        }
    });

    $('.phone-field-prefix, .phone-field-number').on('keyup', function(evt)
    {
        if ($(this).getRange().end == 0 && (evt.keyCode == 8 || evt.keyCode == 37)) {
            $(this).prev('input').focus().select();
        }
    });

    $('.phone-field input').on('keypress', function(evt)
    {
        if (!evt.charCode || evt.ctrlKey || evt.altKey || evt.metaKey) {
            return;
        }

        // Not a number
        if (evt.charCode < 48 || evt.charCode > 57) {
            evt.preventDefault();
        }
    });

});

