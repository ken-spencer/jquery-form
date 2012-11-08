function sb_tags(cont)
{
    var self = this;
    this.input = $(".tag-input", cont);
    this.hidden = $(".tag-hidden", cont);

    this.post = null; // XHR post obj

    this.addPath = null;
    this.removePath = null;
    this.saytPath = null;
    this.recordId = null;

    $(cont).on("click", function()
    {
        self.input.focus();
    });
    
    $(cont).on("click", ".tag-delete", function(evt)
    {
        if (self.post) {
            self.post.abort();
        }
        
        var remove = $(this);
        var tag = remove.closest(".tag-display");
        var id = tag.data('tag_id');
        evt.stopPropagation();
        
        self.setHidden();
        self.calculateWidth();
        self.input.focus();

        if (!id) {
            tag.remove();
            return;
        }
        
        tag.css('opacity', '.5');
        remove.hide();
        
        var data = {
            'tag_id' : id,
            'recordId' : self.recordId
        };

        $.post(self.removePath, data, function(data)
        {
            if (data.type == 'success') {
                tag.remove();
            } else if (data.type == 'error') {
                self.error(data.message);
            }
        })
        .error(function(obj, status)
        {
            if (status == 'abort') {
                return;
            }

            tag.css('opacity', '1');
            remove.show();
            alert("Error deleting tag");
        });
    });

    this.input.on('keypress', function(evt)
    {
        var code = evt.which;
        if (
            code == 13 // Enter Key
            || code == 32 // Spece Key
        ) {
            evt.preventDefault();
            if (this.value.length > 1)
            {
                var span = self.addTag(this.value);
            }
            return;
        }
    });


    this.addTag = function(title, id)
    {
        $(".tag-display", cont).each(function()
        {
        });

        var spans = $(".tag-display", cont);
        for (var i = 0, span; span = spans[i]; i++) {
            if ($(span).text().toLowerCase() == title.toLowerCase()) {
                this.input.val('');
                return;
            }
        }

      //  this.input.before('<span class="tag-display">' + title + '<a class="tag-delete"></a></span>');
        var tag = $('<span class="tag-display">' + title + '<a class="tag-delete"></a></span>').insertBefore(this.input);

        this.input.val('');
        this.calculateWidth();
        this.input.focus();

    /*
        if (new_entry) {
            return false;
        }
    */
        if (!this.addPath) {
            return;
        }

        var data = {
            'tag' : title,
            'recordId' : this.recordId
        };

        this.post = $.post(this.addPath, data, function(data)
        {
            self.post = null;

            if (data.type == 'success') {
                tag.data('tag_id', data.tag_id);
                self.setHidden();
            } else if (data.type == 'error') {
                self.error(data.message);
            }
 //           alert(data.type);
        })
        .error(function(obj, status)
        {
            if (status == 'abort') {
                return;
            }
            self.post = null;
            self.input.val(tag.text());
            tag.remove();
            alert('Error Saving tag');
        });
    }

    this.error = function(message)
    {

        $("#error-bubble").remove();
        
        var input = self.input;
        var bubble = $('<div id="error-bubble"><div class="stem"></div><div class="stem-border"></div>' + message + '</div>').appendTo(document.body);

        var pos = input.offset();
        var height = input.outerHeight();

        $("#error-bubble").css({
            'top' : (pos.top + height) + 'px',
            'left' : pos.left + 'px'
        })
        .data('field', input)
        .fadeIn();
        this.input.focus();

        setTimeout(function()
        {
            bubble.fadeOut(function()
            {
                bubble.remove();
            });
        }, 5000);
    
    }

    this.setHidden = function()
    {
        var data = [];
        
        $(".tag-display", cont).each(function()
        {
            data.push($(this).data('tag_id'));
        });
        
        self.hidden.val(data.join(','));
    }

    this.calculateWidth = function()
    {
        var width = cont.width();
        var total = 0;
        
        var spans = $(".tag-display", cont);
        
        if (spans.length == 0) {
            this.input.css('width', '100%');
        }

        spans.each(function(i)
        {
            total += $(this).outerWidth(true);
            var next = spans[i + 1];
            if (next && (total + $(next).outerWidth(true)) >= width) {
                total = 0;
            }
        });

        var offset = total;

        if (width - offset > 50) {
            this.input.css('width', width - offset - 12 + 'px');
        } else {
            this.input.css('width', '100%');
        }
    }

    this.append = function()
    {
        var sayt = new SAYT(cont, this.saytPath);

        $(sayt).on('click', function(evt, node)
        {
            var result;
            if (result = $(node).data('result')) {
                var span = self.addTag(result.title, result.id);
            }
        });

        this.calculateWidth();

    }
}

