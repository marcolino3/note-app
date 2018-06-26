class StyleSwitcher {
    constructor() {
        this.style = '';
    }

    getStyle() {
        
        const styleFromLocalStorage = localStorage.getItem('style');

        if (styleFromLocalStorage !== null) {
            this.style = styleFromLocalStorage;
            this.setStyle(this.style);
        } else {
            this.style = 'dark';
            this.setStyle('dark');
        }    
    }

    setStyle(style) {
        localStorage.setItem('style', style);
        this.style = style;

        if (this.style === 'dark') {
            $('body').removeClass('light');
            $('#style-switcher option[value="dark"]').attr("selected",true);
        } else if (this.style === 'light') {
            $('body').addClass('light');
            $('#style-switcher option[value="light"]').attr("selected",true);
        }
    }

    registerEvents() {

        // Style Switcher
        $('#style-switcher').on('change', (e) => {

            const styleToSet = $('#style-switcher').val();
            this.setStyle(styleToSet);
            
        });
    }
};

export default StyleSwitcher;