jqueryForm.addEnhancement(function()
{
    var handler = new errorHandler(this);
    handler.modernize();

    this.errorHandler = handler;
});

function errorHandler(form)
{
    // Form is set not to validate
    if (form.forms.prop('noValidate')) {
        return;
    }

    var self = this;
    this.form = form;
    this.forms = form.forms;
    this._validities = [];

    this.submitPressed = false;
    
    var messages = {
        'required' : 'Please fill out this field',
        'email' : 'Please provide a valid email address',
        'date' : 'Date must be in YYYY-MM-DD Format',
        'pattern' : 'Please match the required format'
    };


    // Prevent browser based form validation
//    form.forms.prop('noValidate', true);

    // checkValidity()
    // setCustomValidity()
    var input = document.createElement('input');
    input.type = 'date';
    this.hasDate = input.type == 'date' ? true : false;

    this.forms.on('blur', ':input', function(evt)
    {
        $(this).data('userInteraction', true).addClass('user-interacted');
        self.validate(this);

        $(this).dialogClose();
    })
    .on('focus', ':input', function()
    {
        self.validate(this);
        if ($(this).hasClass('user-error')) {
            self.errorMessage(this);
        }
    });

    $(':input', form.forms).each(function()
    {
        this.addEventListener('invalid', function(evt)
        {
        }, false);    
    });

    this.checkValidity = function(input)
    {
    /*
        // Has Native Support
        if (this.validity) {
            var validity = this.validity;        
        } else {
            var validity = {
                customError : false,
                patternMismatch : false,
                rangeOverflow : false,
                rangeUnderflow : false,
                stepMismatch : false, 
                tooLong : false,
                typeMismatch : false,
                valid : true,
                valueMissing : false
            }

            this.validity = validity;
        }

        */

        var isValid = true;
        var type = 'unknown';

        for (var i = 0, validity; validity = this._validities[i]; i++) {
            if (validity.callback.call(this, input)) {
                this.removeValidity(input);
            } else {
                this.setValidity(input, validity.message, validity.name);
                isValid = false;
                break;
            }
        }
    
        if (isValid == true && input.checkValidity && input.checkValidity() == false) {
            isValid = false;
            var validity = input.validity;

            if (validity.patternMismatch) {
                type = 'pattern';
            } else if (validity.valueMissing) {
                type = 'required';
            } else if (validity.typeMismatch) {
                type = input.type;
            }
            
            var message = $(input).data('error-message');

            if (!message) {
                message = messages[type] ? messages[type] : 'Please fill out this field correctly';
            }

            $(input).data('_error_type', type);
            $(input).data('_error_message', message);
        }

        if (isValid == true) {
            $(input).removeClass('user-error invalid');
            $(input).addClass('valid');

            return true;
        } else {
            // Manually Trigger oninvalid event for browsers that don't support it
            if (false == self.hasOnInvalid) {
                $(input).trigger('invalid');
            }

            $(input).removeClass('valid');
            $(input).addClass('invalid');

            if (this.submitPressed || $(input).data('userInteraction')) {
                $(input).addClass('user-error');
            }

            return false;        
        }
    };

    // Browser does not support oninvalid polyfill it
//    if (false == this.hasOnInvalid) {
        form.forms.on('input', ':input', function()
        {
            self.checkValidity(this);
        });
//    }

    /* Safari has partial support for HTML5 validation. This allows us to test for actual support of the
    *  oninvalid method so we can trigger it manually. 
    */
    var supportsValidity = function()
    {
        var supported = false;
        var form = $('<form style="display: none;"><input required="required"/><button type="submit"></form>').appendTo(document.body);

        $('input', form).on('invalid', function(evt)
        {
            supported = true;
            evt.preventDefault();
        });

        form.on('submit', function(evt)
        {
            evt.preventDefault();
        });

        $('button', form).trigger('click');
        form.remove();

        return supported;
    }
    this.hasOnInvalid = supportsValidity();


    // Required Error for older browsers
    this.addCustomValidity('required', function(input)
    {
        if (
            input.value.length == 0 
            && !('required' in input)
            && $(input).attr('required')
        ) {
            return false
        } else {
            return true;
        }

    }, messages.required);

    // Email Matching for browsers that don't support it
    this.addCustomValidity('email', function(input)
    {
        if (
            input.value.length 
            && $(input).prop('type') == 'text'
            && $(input).attr('type') == 'email'
            && !input.value.match(/.+@.+\..+/)
        ) {
            return false
        } else {
            return true;
        }

    }, messages.email);

    // Pattern Matching for browsers that don't support it
    this.addCustomValidity('pattern', function(input)
    {
        if (input.value.length == 0) {
            return true;
        }

        var pattern = $(input).attr('pattern');

        if (
            pattern
            && !$(input).prop('pattern')
            && !input.value.match(new RegExp(pattern))
        ) {
            return false
        } else {
            return true;
        }

    }, messages.pattern);


    // Date Matching for browsers that don't support it
    this.addCustomValidity('date', function(input)
    {
        if (
            input.value.length 
            && $(input).prop('type') == 'text'
            && $(input).attr('type') == 'date'
            && !input.value.match(/^[0-9]{4}-[0-1][0-9]-[0-1][0-9]$/)
        ) {
            return false
        } else {
            return true;
        }
    }, messages.date);


    var submit = function(evt)
    {
        self.submitPressed = true;

        if (self.validate()) {
            return true;
        }

        var form
        
        if (this.form) {
            form = this.form;
        } else if ($(this).attr('form')) {
            form = $('#' + $(this).attr('form'))[0];
        }
            
        if (!form) {
            return;
        }

        $(":input", form).addClass('user-interacted');

        var input = $('.invalid', form).first();
        input.focus();

        evt.preventDefault();    
    };


    /* Search for any button which might submit the form
     * we would like to detect if they are pressed so we can substitute our own form validation
    */
    this.forms.each(function()
    {
        var buttons = $('button[type="submit"]:not([form]), button[type=""]:not([form]), button:not([type]):not([form]), input[type="submit"]:not([form]), input[type="image"]', this);

        if (this.id) {
            buttons = $('button[form="' + this.id + '"][type="submit"]:not(form[id!="' + this.id + '"] button)').add(buttons);
        } 

        buttons.on('click', submit);
   });

    this.validate();

};

errorHandler.prototype.validate = function()
{
    var self = this;
    var valid = true;
    $(':input',  this.forms).each(function()
    {
        valid &= self.checkValidity(this);
    });

    return valid;
}

errorHandler.prototype.modernize = function()
{
    // Add Calendar Controls if not supported
    if (this.hasDate == false) {
        $('input[type="date"]', this.forms).addClass('date-emulation');
    }
}

errorHandler.prototype.addCustomValidity = function(name, callback, message)
{
    this._validities.push({
        'name' : name,
        'callback' : callback,
        'message' : message
    });
}

errorHandler.prototype.setValidity = function(input, message, type)
{
    var message = $(input).data('error-message') || message;
    $(input).data('_error_type', type);
    $(input).data('_error_message', message);
    input.setCustomValidity(message);
}

errorHandler.prototype.removeValidity = function(input)
{
    input.setCustomValidity(null);
    $(input).removeData('_error_type');
    $(input).removeData('_error_message');
}

errorHandler.prototype.errorMessage = function(input)
{
    var input = $(input);
    if (jQuery.fn.dialogOpen) {
        $(input).dialogOpen(input.data('_error_message'), {'stem' : true});
    } else {
    }    

}


/* Notes: 

input.validationMessage - get the browser default validation message lame in Safari

*/
