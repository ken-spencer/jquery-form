var Form = function(selector)
{
    this.forms = $(selector);

    this.enhance  = function()
    {
        for (var i = 0, enhancement; enhancement = Form.enhancements[i]; i++) {
            enhancement.call(this);       
        }

/*
        this.permalinks();
        this.calendar();
        
        if (window.sb_markdown) {
            this.forms.find('textarea.markdown').each(sb_markdown);
        }
        
        this.forms.each(function()
        {
            var e = new sbErrors(this);
            e.actions();
        });

        this.forms.find(":input[placeholder]").each(placeholders);
    */
    }
}

Form.enhancements = [];

Form.fn = Form.prototype;

Form.addEnhancement = function(enhancement)
{
    Form.enhancements.push(enhancement);
}


