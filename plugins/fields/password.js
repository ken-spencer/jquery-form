$(document).ready(function()
{
    $('input[type="password"]').on('change', function()
    {
        var name;
        if (name = $(this).data('name')) {
            this.name = name;
        }
    });

    $('.change-password-button').on('click', function()
    {
        $(this).fadeOut(200, function()
        {
            $(this).next('.change-password-fields').fadeIn(200);
            $(this).next('.change-password-fields').find('input').first().focus();
        });
    });

});

