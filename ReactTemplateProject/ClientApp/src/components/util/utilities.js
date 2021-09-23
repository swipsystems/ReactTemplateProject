
const utilities = {
    dimensions: {
        XL: 1200,
        LG: 992,
        MD: 768,
        SM: 576,
    },
    getScreenWidth: function() {
        const width = window.innerWidth;
        if (width < this.dimensions.SM) {
            return 'xs';
        } else if (width >= this.dimensions.SM && width < this.dimensions.MD) {
            return 'sm';
        } else if (width >= this.dimensions.MD  && width < this.dimensions.LG) {
            return 'md';
        } else if (width >= this.dimensions.LG && width < this.dimensions.XL) {
            return 'lg';
        } else {
            return 'xl';
        }
    }    
}

export default utilities;