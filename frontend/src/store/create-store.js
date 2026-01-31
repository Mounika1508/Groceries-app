import {configureStore} from '@reduxjs/toolkit';
import vendorReducer from '../slices/vendor-slice';

const createStore = () => {
    return configureStore({
        reducer: {  
            vendor: vendorReducer,
        }
    });
}
export default createStore;