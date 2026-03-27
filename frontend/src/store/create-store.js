import {configureStore} from '@reduxjs/toolkit';
import vendorReducer from '../slices/vendor-slice';
import adminReducer from '../slices/admin-slice';
import categoryReducer from '../slices/category-slice'
import productReducer from '../slices/product-slice';
import customerReducer from '../slices/customer-slice';
import cartReducer from '../slices/cart-slice';
import deliveryBoyReducer from '../slices/dboy-slice';
import orderReducer from '../slices/order-slice';

const createStore = () => {
    return configureStore({
        reducer: {  
            vendor: vendorReducer,
            admin: adminReducer,
            category: categoryReducer,
            product: productReducer,
            customer: customerReducer,
            cart: cartReducer,
            deliveryBoy: deliveryBoyReducer,
            order: orderReducer
        }
    });
}
export default createStore;