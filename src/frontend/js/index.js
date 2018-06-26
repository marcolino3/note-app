import Persistance from './model/persistance.js';
import ServiceContext from './model/service-context.js';
import IndexController from './controller/index-controller.js';
import EditController from './controller/edit-controller.js';

const $ = jQuery;

// bootstrap dependencies (optionally, a DI container may be used for this)
const persistance = new Persistance();
const serviceContext = new ServiceContext(persistance);
const indexController = new IndexController(serviceContext);
const editController = new EditController(serviceContext);

$(function() { // on DOMContent Loaded
    
    // Router
    if ((location.href).toString().includes('edit.html')) {
        editController.initUI();
    } else {
        indexController.initUI();
    }

    // getStyle();

    // // Style Switcher
    // $('#style-switcher').on('change', (e) => {

    //     const styleToSet = $('#style-switcher').val();
    //     setStyle(styleToSet);
        
    // });


});

// const getStyle = () => {

//     const styleFromLocalStorage = localStorage.getItem('style');

//         if (styleFromLocalStorage !== null) {
//             setStyle(styleFromLocalStorage);
//         } else {
//             setStyle('dark');
//         }
// };

// const setStyle = (style) => {
//     localStorage.setItem('style', style);

//         if (style === 'dark') {
//             $('body').removeClass('light');
//             $('#style-switcher option[value="dark"]').attr("selected",true);
//         } else if (style === 'light') {
//             $('body').addClass('light');
//             $('#style-switcher option[value="light"]').attr("selected",true);
//         }
// };