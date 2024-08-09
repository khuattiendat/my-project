const userRouter = require('./user');
const authRouter = require('./auth');
const productRouter = require('./product');
const categoryRouter = require('./category');
const galleryRouter = require('./gallery');
const transactionRouter = require('./transaction');
const paymentRouter = require('./payment');
const orderRouter = require('./order');
const bannerRouter = require('./banner');
const statisticRouter = require('./statistical');

function Router(app) {
    app.use('/api/users', userRouter)
    app.use('/api/auth', authRouter)
    app.use('/api/products', productRouter)
    app.use('/api/categories', categoryRouter)
    app.use('/api/galleries', galleryRouter)
    app.use('/api/transactions', transactionRouter)
    app.use('/api/payments', paymentRouter);
    app.use('/api/orders', orderRouter);
    app.use('/api/banners', bannerRouter);
    app.use('/api/statistical', statisticRouter);
}

module.exports = Router;
