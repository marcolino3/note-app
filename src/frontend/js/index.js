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
});