require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const port = 4050;

const configureDB = require('./config/db');
configureDB();


const authenticateUser = require("./app/middlewares/authenticateUser");
const authorizeUser = require("./app/middlewares/authorizeUser")

const userCtlr = require('./app/controllers/user-controller')
const adminCtlr = require('./app/controllers/admin-controller.js'); 
const vendorCtlr = require('./app/controllers/vendor-controller.js');
const deliveryBoyCtlr = require('./app/controllers/deliveryBoy-controller');
const customerCtlr = require('./app/controllers/customer-controller.js');
const categoryCtlr = require('./app/controllers/category-controller.js');
const productCtlr = require('./app/controllers/product-controller.js');
const cartCtlr = require('./app/controllers/cart-controller.js');
const orderCtlr = require('./app/controllers/order-controller.js');
//public route
app.post('/users/register', userCtlr.register);
app.post('/users/login', userCtlr.login)
//protected route
app.get('/users/list', authenticateUser, authorizeUser(["admin"]), userCtlr.list);
app.get('/users/account', authenticateUser, userCtlr.account);
app.get("/users/:id", authenticateUser, authorizeUser(["admin"]), userCtlr.show)
app.delete("/users/:id", authenticateUser, authorizeUser(["admin"]), userCtlr.remove)
//admin
app.put("/admin/approveVendor/:vendorId", authenticateUser, authorizeUser(["admin"]), adminCtlr.approveVendor);
app.delete("/admin/rejectVendor/:vendorId", authenticateUser, authorizeUser(["admin"]), adminCtlr.rejectVendor);
app.get("/admin/pendingVendors", authenticateUser, authorizeUser(["admin"]), adminCtlr.listPendingVendors);
//customer
app.post('/customer', authenticateUser, authorizeUser(['customer']), customerCtlr.create);
app.get('/customer/profile', authenticateUser, authorizeUser(['customer']), customerCtlr.getProfile); 
app.get('/customers/list', authenticateUser, authorizeUser(['admin']), customerCtlr.list);  
app.delete('/customers/remove/:id', authenticateUser, authorizeUser(['admin']), customerCtlr.remove);
app.get('/customers/:id', authenticateUser, authorizeUser(['admin']), customerCtlr.show);
app.put('/customer/update/:id', authenticateUser, authorizeUser(['customer']), customerCtlr.update);
//vendor
app.post('/vendor', authenticateUser, authorizeUser(['vendor']), vendorCtlr.create);
app.get("/vendors/list", authenticateUser, authorizeUser(["admin"]), vendorCtlr.list);
app.get("/vendors/pendingList", authenticateUser, authorizeUser(["admin"]), vendorCtlr.pendingList);
app.put("/vendors/update/:id", authenticateUser, authorizeUser(["vendor"]), vendorCtlr.update);
app.delete("/vendors/remove/:id", authenticateUser, authorizeUser(["admin"]), vendorCtlr.remove)
//deliveryBoy
app.post('/deliveryboy', authenticateUser, authorizeUser(['deliveryboy']), deliveryBoyCtlr.create);
app.get('/deliveryboys/availableList', authenticateUser, authorizeUser(['vendor']), deliveryBoyCtlr.listavailable);
app.get('/deliveryboy/myOrders', authenticateUser, authorizeUser(['deliveryboy']), deliveryBoyCtlr.myOrders);
//app.post('/deliveryboys/assignVendor/:id', authenticateUser, authorizeUser(['vendor']), deliveryBoyCtlr.assignVendor);
///app.get('/deliveryboys/list', authenticateUser, authorizeUser(['vendor']), deliveryBoyCtlr.list);
// app.get("/deliveryboys/list", authenticateUser, authorizeUser(["vendor"]), deliveryBoyCtlr.list);
app.get('/deliveryboy/account', authenticateUser, deliveryBoyCtlr.account);
app.delete("/deliveryboys/remove/:id", authenticateUser, authorizeUser(["vendor"]), deliveryBoyCtlr.remove)
//category
app.post('/categories', authenticateUser, authorizeUser(['vendor']), categoryCtlr.create);
app.get('/categories/list', authenticateUser, authorizeUser(['vendor']), categoryCtlr.list);    
app.get('/categories/publicList/:vendorId', categoryCtlr.publicList);
app.put('/categories/update/:id', authenticateUser, authorizeUser(['vendor']), categoryCtlr.update);
app.delete('/categories/remove/:id', authenticateUser, authorizeUser(['vendor']), categoryCtlr.remove);
//product
app.post('/products', authenticateUser, authorizeUser(['vendor']), productCtlr.create);
app.get('/products/vendorList', authenticateUser, authorizeUser(['vendor']), productCtlr.listByVendor);
app.get('/products/publicList', productCtlr.publicList);
app.put('/products/update/:id', authenticateUser, authorizeUser(['vendor']), productCtlr.update);
app.delete('/products/remove/:id', authenticateUser, authorizeUser(['vendor']), productCtlr.remove);
//cart
app.post('/cart/addItem', authenticateUser, authorizeUser(['customer']), cartCtlr.addItem);
app.get('/cart/view', authenticateUser, authorizeUser(['customer']), cartCtlr.viewCart);
app.put('/cart/updateItem/:productId', authenticateUser, authorizeUser(['customer']), cartCtlr.updateItem);
app.delete('/cart/removeItem/:productId', authenticateUser, authorizeUser(['customer']), cartCtlr.removeItem);
//order
app.post('/orders/placeOrder', authenticateUser, authorizeUser(['customer']), orderCtlr.placeOrder);
app.get('/orders/myOrders', authenticateUser, authorizeUser(['customer']), orderCtlr.getMyOrders);
app.delete('/orders/cancelOrder/:id', authenticateUser, authorizeUser(['customer']), orderCtlr.cancelOrder);
app.put('/orders/startPacking/:id', authenticateUser, authorizeUser(['vendor']), orderCtlr.startPacking);
app.put('/orders/assignDeliveryBoy/:id', authenticateUser, authorizeUser(['vendor']), orderCtlr.assignDeliveryBoy); 
app.put('/orders/markAsDelivered/:id', authenticateUser, authorizeUser(['deliveryboy']), orderCtlr.markAsDelivered);

app.listen(port, () => {
    console.log('server is running on port', port);
})