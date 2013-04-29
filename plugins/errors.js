jqueryForm.addEnhancement(function()
{
    var handler = new errorHandler(this);
    handler.modernize();

    this.errorHandler = handler;
});

function errorHandler(jqueryForm)
{
    this.jqueryForm = jqueryForm;
    this.form = jqueryForm.form;

    // Form is set not to validate
/*
    if (this.form.prop('noValidate') || this.form.attr('novalidate')) {
        return;
    }
*/

    var self = this;
    this._validities = [];

    this.submitPressed = false;
    
    this.messages = {
        'required' : 'Please fill out this field',
        'email' : 'Please provide a valid email address',
        'date' : 'Date must be in YYYY-MM-DD Format',
        'pattern' : 'Please match the required format'
    };


    // Prevent browser based form validation
//    this.form.prop('noValidate', true);

    // checkValidity()
    // setCustomValidity()
    var input = document.createElement('input');
    try {
        input.type = 'date';
    } catch (e) {}
    this.hasDate = input.type == 'date' ? true : false;

    this.form.on('blur', ':input', function(evt)
    {
        $(this).data('userInteraction', true).addClass('user-interacted');
        self.validate(this);
        if ($(this).hasDialog('#form-error-dialog')) {
            $(this).dialogClose();
        }
    })
    .on('focus', ':input', function()
    {
        self.validate(this);
        if ($(this).hasClass('user-error')) {
            self.errorMessage(this);
        }
    });


    // Browser does not support oninvalid polyfill it
    this.form.on('input keyup click', ':input', function(evt)
    {
        /* Support for browsers that don't have a oninput event
        *  IE doesn't properly support oninput on delete / back space
        */
        if (evt.type == 'input') {
            $(this).data('_input', true);
        } else if ($(this).data('_input') == true && evt.which != 8 && evt.which != 46) {
            return;
        }

        self.checkValidity(this);

    });

    this.form.on('click', 'input[type="checkbox"], input[type="radio"]', function()
    {
        self.checkValidity(this);
    });

    this.hasOnInvalid = this.supportsValidity();

    // Required Error for older browsers
    this.addCustomValidity('required', function(input, value)
    {
        if (!$(input).attr('required')) {
            return null;
        }

        var test = document.createElement(input.nodeName);
        if (value.length == 0 && typeof(test.required) == "undefined") {
            return false
        } else {
            return true;
        }

    }, this.messages.required);

    // min
    this.addCustomValidity('min', function(input, value, validity)
    {
        var min = $(input).attr('min');
        if ($(input).attr('type') != "number") {
            return null;
        }

        if (!min && min != "0") {
            return null;
        }

        min = parseFloat(min);

    /*  // Deed to find a test that works in FF. 
        var test = document.createElement(input.nodeName);
        if (typeof(test.min) != "undefined") {
            return true;
        }
    */

        if (value.length == 0) {
            return true;
        }

        value = parseFloat(value);

        if (value >= min) { 
            return true;
        } else {
            validity.message = validity.message.replace("%s", min);
            return false
        }

    }, "This field must be above %s in value");

    // max
    this.addCustomValidity('max', function(input, value, validity)
    {
        var max = $(input).attr('max');
        if ($(input).attr('type') != "number") {
            return null;
        }

        if (!max && max != "0") {
            return null;
        }

        max = parseFloat(max);

        if (value.length == 0) {
            return true;
        }

        value = parseFloat(value);

        if (value <= max) { 
            return true;
        } else {
            validity.message = validity.message.replace("%s", max);
            return false
        }

    }, "This field must be below %s in value");


    // Email Matching for browsers that don't support it
    this.addCustomValidity('email', function(input, value)
    {
        if ($(input).attr('type') != 'email') {
            return null;
        }

        if (
            value.length 
            && $(input).prop('type') == 'text'
            && !value.match(/.+@.+\..+/)
        ) {
            return false
        } else {
            return true;
        }

    }, this.messages.email);

    // Pattern Matching for browsers that don't support it
    this.addCustomValidity('pattern', function(input, value)
    {
        var pattern = $(input).attr('pattern');

        if (!pattern) {
            return null;
        }

        if (input.value.length == 0) {
            return true;
        }

        var test = document.createElement(input.nodeName);
        if (typeof(test.pattern) == "undefined" && !input.value.match(new RegExp(pattern))) {
            return false
        } else {
            return true;
        }

    }, this.messages.pattern);

    // Value must match value of a different field
    this.addCustomValidity('match', function(input, value)
    {
        var id, field, inverse;

        /* Check match on inverse field
        */
        if (inverse = $(input).data('matched_by')) {
            this.checkValidity(inverse);
        }

        if (!(id = $(input).data('error-match'))) {
            return null;
        }
        
        field = $('#' + id);

        if (field.length == 0) {
            return null;
        }

        field.data('matched_by', input);

        if ($(input).val() != field.val()) {
            return false
        } else {
            return true;
        }

    }, "Field value does not match");


    // Date Matching for browsers that don't support it
    this.addCustomValidity('date', function(input, value)
    {
        if ($(input).attr('type') != 'date') {
            return null;
        }

        if (
            value.length 
            && $(input).prop('type') == 'text'
            && !value.match(/^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$/)
        ) {
            return false
        } else {
            return true;
        }
    }, this.messages.date);


    this.validate();

};

/* Safari has partial support for HTML5 validation. This allows us to test for actual support of the
*  oninvalid method so we can trigger it manually. 
*/
errorHandler.prototype.supportsValidity = function()
{
    var supported = false;
    var form = $('<form id="fake-form" style="display: none;"><input required="required"/><button type="submit"></form>').appendTo(document.body);

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

errorHandler.prototype.checkValidity = function(input)
{
    if (this.form.prop('noValidate') || this.form.attr('novalidate')) {
        return;
    }

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

/*
    if (!input.name) {
        return true;
    }
*/

    if ($(input).attr('novalidate')) {
        return true;        
    }
            
    var value = this.getValue(input);

    var isValid = true;
    var type = 'unknown';

    var hasValidity = false;
    for (var i = 0, validity; validity = this._validities[i]; i++) {
        var valid = validity.callback.call(this, input, value, validity);

        hasValidity |= valid !== null;

        if (valid === true) {
            this.removeValidity(input);
        } else if (valid === false){
            this.setValidity(input, validity.message, validity.name);
            isValid = false;
            break;
        }
    }
    
    if (hasValidity) {
        $(input).addClass('has-validity');        
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
            message = this.messages[type] ? this.messages[type] : 'Please fill out this field correctly';
        }

        $(input).data('_error_type', type);
        $(input).data('_error_message', message);
    }

    // to handle fileds linke radio buttons that have multiple inputs with same name
    if (input.name) {
        var list = $(':input[name="' + input.name + '"]', input.form);
    } else {
        var list = $(input);
    }

    if (isValid == true) {
        if ($(input).hasDialog('#form-error-dialog')) {
            $(input).dialogClose();
        }
        list.removeClass('user-error invalid');
        list.addClass('valid');

        return true;
    } else {
        // Manually Trigger oninvalid event for browsers that don't support it
        if (false == self.hasOnInvalid) {
            list.trigger('invalid');
        }

        list.removeClass('valid');
        list.addClass('invalid');

        if (this.submitPressed || $(input).data('userInteraction')) {
            list.addClass('user-error');
        }

        return false;        
    }
}

errorHandler.prototype.validate = function()
{
    if (this.form.prop('noValidate') || this.form.attr('novalidate')) {
        return true;
    }

    var self = this;
    var valid = true;
    var checked = {};
    $(':input',  this.form).each(function()
    {
        // We only want to check fields with same name once
        if (checked[this.name]) {
            return true;
        }
        checked[this.name] = true; 

        valid &= self.checkValidity(this);
    });

    return valid;
}

errorHandler.prototype.modernize = function()
{
    // Add Calendar Controls if not supported
    if (this.hasDate == false) {
        $('input[type="date"]', this.form).addClass('date-emulation');
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
    if (input.setCustomValidity) {
        input.setCustomValidity(message);
    }
}

errorHandler.prototype.removeValidity = function(input)
{
    if (input.setCustomValidity) {
        input.setCustomValidity(null);
    }
    $(input).removeData('_error_type');
    $(input).removeData('_error_message');
}

errorHandler.prototype.errorMessage = function(input)
{
    var input = $(input);
    if (jQuery.fn.dialogOpen) {
        $(input).dialogOpen("<span>" + input.data('_error_message') + "</span>", {'stem' : true, 'id' : 'form-error-dialog'});
    } else {
    }    

}

errorHandler.prototype.getValue = function(input)
{
    var type = input.type;
    
    if (input.name) {
        var query = $(':input[name="' + input.name + '"]', input.form);
    } else {
        var query = $(input);
    }

    var value = '';
    switch (type) {
    case 'radio':
    case 'checkbox':
        // last() only applies to checkboxes
        value = query.filter(':checked').last().val();
        break;
    case 'select-one': 
    case 'select-multiple':
    default:
        value = query.last().val();
    /*
        value = query.filter(function()
        {
            return $this.value.length ? true : false;
        })
    */

        break;        
    }

    return typeof(value) == 'undefined' ? '' : value;      
}

/* Notes: 

input.validationMessage - get the browser default validation message lame in Safari

*/

jQuery.fn.checkValidity = function(trigger, focus)
{
    var node = this.first();
    var form = node.prop('nodeName') == 'FORM' ? node : node.closest('form');

    if (form.prop('noValidate') || form.attr('novalidate')) {
        return true;
    }

    var self = form.data('jqueryForm');

    if (!self) {
        return true;
    }

    var handler = self.errorHandler;
    if (node.prop('nodeName') == 'FORM') {
        var retval = handler.validate()
        if (retval == false && trigger) {
            $(":input.invalid", form).addClass('user-error');
            var input = $('.invalid', form).first();
            if (focus) {
                input.focus();
            }
        }
    } else {
        var retval = handler.checkValidity(node[0]);
        if (retval == false && trigger) {
            node.addClass('user-error');
            if (focus) {
                node.focus();
            }
        }
    }

    return retval;    
}


/* Detect button press and submit form
*/
//$(document).on("click", 'button[type="submit"]:not([form]), button[type=""]:not([form]), button:not([type]):not([form]), input[type="submit"]:not([form]), input[type="image"]', function(evt)
$(document).on("click", 'button, input[type="image"], input[type="image"]', function(evt)
{
    var self;
    var form;
    var button = $(this);
    if (button.attr('form')) {
        form = $("#" + $(button).attr('form'));
    } else {
        form = button.closest('form');
    }

    if (this.type && this.type != "submit") {
        return;
    }

    if (!form.length || !(self = form.data('jqueryForm'))) {
        return;
    }

    var handler = self.errorHandler;

    handler.submitPressed = true;

    if (button.attr('novalidate') || button.prop('noValidate')) {
        return true;
    }

    if (handler.validate()) {
        form.data('submitting-form', true);
        var input = document.createElement('button');
        if (button.attr("formaction") && typeof(input.formaction) == "undefined") {
            // Polyfill formaction attribute
            form.prop("action", button.attr("formaction"));
        }

        if (button.attr('form') &&  button.prop('form') != form[0]) {
            form.submit();
        }

        return true;
    }

    $(":input.invalid", form).addClass('user-error').first().focus();
    evt.preventDefault();    
});

