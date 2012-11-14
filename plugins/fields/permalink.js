    this.permalinks = function()
    {

        $('.permalink-field input', this.form).on('change', function()
        {
            this.value = $.trim(this.value)
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-zA-Z0-9-_]/g, '');;
        });
    
        $('.permalink-field input', this.form).each(function()
        {
            var id = $(this).data('title-id');

            if (this.defaultValue) {
                $(this).prop('disabled', true)
            }

        
            $(this).on('change', function(evt)
            {
                $(this).data('modified', true);
            });
    
            $('#' + id).on('keyup blur', this, function(evt)
            {
                var permalink = evt.data;
                var input = this;

                if (this.disabled) {
                    return;
                }

                if ($(permalink).data('modified')) {
                    return;
                }

                permalink.value = $.trim(input.value)
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-zA-Z0-9-_]/g, '');;
            });
        });
    }

