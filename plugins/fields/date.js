    this.calendar = function()
    {
        this.forms.on('click', ".date-field-calendar-button", function(evt)
        {
            var button = this;

            $(document.body).append('<div class="date-field-calendar"></div>');
            var div = $('.date-field-calendar:last', document.body);
            var calendar = new sw_calendar();
            calendar.append(div);

            var input = $(this).prev('input');

            var maxWidth = $(document.body).outerWidth();

            evt.stopPropagation();
            
            var pos = $(this).offset();
            var width = this.offsetWidth;
            $('.date-field-calendar').fadeIn()
            .clearable()
            .each(function()
            {
                var maxed = (pos.left + width + 10) > maxWidth;
                if (maxed) {
                    var left = pos.left - this.offsetWidth - 5;
                    if (left < 5) {
                        left = 5;
                    }
                } else {
                    var left = pos.left + width + 5;
                } 
            
                if (pos.top + this.offsetHeight > document.body.offsetHeight) {
                    var top = pos.top - this.offsetHeight + button.offsetHeight;
                } else {
                    var top = pos.top;
                }

                $(this).css({
                    'top' : top + 'px',
                    'left' : left + 'px'
                });
            });

            $(div).on('click', 'tbody td', function()
            {
                var oldValue = $(input).prop('value');
                var date = new Date($(this).data('date'))
                var year  = date.getFullYear();
                var month = date.getMonth() + 1;
                var day   = date.getDate();
                var iso =  year + '-' + (month <= 9 ? '0' : '' ) + month 
                iso += '-' + (day <= 9 ? '0' : '') + day;
                if (iso != oldValue) {
                    input.prop('value', iso);
                    $(input).trigger('change');
                }
                $(div).clearer();
            });
        });
    }

