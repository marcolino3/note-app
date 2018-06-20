;

import Persistance from './model/persistance.js';
import ServiceContext from './model/service-context.js';
import Controller from './controller.js';

const $ = jQuery;

// bootstrap dependencies (optionally, a DI container may be used for this)
const persistance = new Persistance();
const serviceContext = new ServiceContext(persistance);
const controller = new Controller(serviceContext);

$(function() { // on DOMContent Loaded

    // initialize main controller after VIEW (html) has been loaded
    controller.initUI();
});


