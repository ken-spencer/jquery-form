jqueryForm.addEnhancement(function()
{
    if (!window.jqueryCalendar || !window.jqueryDialog) {
        return;
    }

    var input = document.createElement('input');
    try {
        input.type = 'date';
    } catch (e) {}
   
    /* Date is already supported no need to pollyfill
    */
    if (input.type == 'date') {
        return;
    }

    $('input[type="date"]', this.form).each(function()
    {
        var id = $(this).prop('id');
        $(this).after('<span class="form-date-calendar-button" data-for="' + id + '"></span>');
    });

    this.form.on('click', '.form-date-calendar-button', function(evt)
    {
        var button = $(this);
        var input = button.data('for') ? $('#' +  button.data('for')) : button.prev('input');
    
        if (!input.length) {
            return;
        }

        var offset = button.height() / 2;
        button.dialogOpen('', {
            'stem' : [offset - 5, 5, 5, 10],
            'position' : 'right-top',
            'id' : 'form-date-picker'
        }).afterOpen(function(body)
        {
            var calendar = new jqueryCalendar(body);
            calendar.append();        

            calendar.node.on('click', 'tbody td', function()
            {
                var oldValue = input.prop('value');

                var date = new Date($(this).data('date'))
                var year  = date.getFullYear();
                var month = date.getMonth() + 1;
                var day   = date.getDate();

                var iso =  year + '-' + (month <= 9 ? '0' : '' ) + month 
                iso += '-' + (day <= 9 ? '0' : '') + day;

                if (iso != oldValue) {
                    input.prop('value', iso);
                    input.trigger('input');
                    input.trigger('change');
                }
                input.focus().select();

                button.dialogClose();
            });

        });

    });
});
