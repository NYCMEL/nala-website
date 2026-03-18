function _t(key, fb) { return (window.i18n ? i18n.t(key) : null) || fb; }

const MTKGiftConfig = {
    gift: {
        id:       "mtk-gift-lockout-kit",
        title:    _t('gift.title',    'Your Free Lockout Kit'),
        subtitle: _t('gift.subtitle', "We'll ship it right to your door — completely free."),
        icon:     "card_giftcard",
        form: {
            addressLabel: _t('gift.addressLabel', 'Where do you want us to send your free Lockout Kit?'),
            fields: [
                { id: "full-name",     name: "fullName",     type: "text",   label: _t('gift.field.fullName', 'Full Name'),                  placeholder: " ", required: true,  autocomplete: "name",           icon: "person",        gridCol: "col-12" },
                { id: "address-line1", name: "addressLine1", type: "text",   label: _t('gift.field.address1', 'Street Address'),             placeholder: " ", required: true,  autocomplete: "address-line1",  icon: "home",          gridCol: "col-12" },
                { id: "address-line2", name: "addressLine2", type: "text",   label: _t('gift.field.address2', 'Apt, Suite, Unit (optional)'), placeholder: " ", required: false, autocomplete: "address-line2",  icon: "apartment",     gridCol: "col-12" },
                { id: "city",          name: "city",         type: "text",   label: _t('gift.field.city',    'City'),                        placeholder: " ", required: true,  autocomplete: "address-level2", icon: "location_city", gridCol: "col-12 col-md-6" },
                {
                    id: "state", name: "state", type: "select", label: _t('gift.field.state', 'State'),
                    placeholder: " ", required: true, autocomplete: "address-level1", icon: "map", gridCol: "col-12 col-md-6",
                    options: [
                        { value: "", label: _t('gift.field.state', 'State') },
                        { value: "AL", label: "AL" }, { value: "AK", label: "AK" }, { value: "AZ", label: "AZ" },
                        { value: "AR", label: "AR" }, { value: "CA", label: "CA" }, { value: "CO", label: "CO" },
                        { value: "CT", label: "CT" }, { value: "DE", label: "DE" }, { value: "FL", label: "FL" },
                        { value: "GA", label: "GA" }, { value: "HI", label: "HI" }, { value: "ID", label: "ID" },
                        { value: "IL", label: "IL" }, { value: "IN", label: "IN" }, { value: "IA", label: "IA" },
                        { value: "KS", label: "KS" }, { value: "KY", label: "KY" }, { value: "LA", label: "LA" },
                        { value: "ME", label: "ME" }, { value: "MD", label: "MD" }, { value: "MA", label: "MA" },
                        { value: "MI", label: "MI" }, { value: "MN", label: "MN" }, { value: "MS", label: "MS" },
                        { value: "MO", label: "MO" }, { value: "MT", label: "MT" }, { value: "NE", label: "NE" },
                        { value: "NV", label: "NV" }, { value: "NH", label: "NH" }, { value: "NJ", label: "NJ" },
                        { value: "NM", label: "NM" }, { value: "NY", label: "NY" }, { value: "NC", label: "NC" },
                        { value: "ND", label: "ND" }, { value: "OH", label: "OH" }, { value: "OK", label: "OK" },
                        { value: "OR", label: "OR" }, { value: "PA", label: "PA" }, { value: "RI", label: "RI" },
                        { value: "SC", label: "SC" }, { value: "SD", label: "SD" }, { value: "TN", label: "TN" },
                        { value: "TX", label: "TX" }, { value: "UT", label: "UT" }, { value: "VT", label: "VT" },
                        { value: "VA", label: "VA" }, { value: "WA", label: "WA" }, { value: "WV", label: "WV" },
                        { value: "WI", label: "WI" }, { value: "WY", label: "WY" }
                    ]
                },
                { id: "zip", name: "zip", type: "text", label: _t('gift.field.zip', 'ZIP Code'), placeholder: " ", required: true, autocomplete: "postal-code", icon: "pin", gridCol: "col-12 col-md-3", pattern: "^[0-9]{5}(-[0-9]{4})?$", maxLength: 10 }
            ],
            buttons: {
                submit: { label: _t('gift.submit', 'Send My Kit'), icon: "send",  type: "submit" },
                cancel: { label: _t('gift.cancel', 'Cancel'),      icon: "close", type: "button" }
            }
        },
        messages: {
            success:  _t('gift.success',   'Your free Lockout Kit is on the way! 🎁'),
            error:    _t('gift.error',     'Please fill in all required fields.'),
            cancel:   _t('gift.cancelled', 'Request cancelled.')
        },
        events: {
            submit: "mtk-gift:submit",
            cancel: "mtk-gift:cancel",
            open:   "mtk-gift:open",
            close:  "mtk-gift:close"
        }
    }
};
