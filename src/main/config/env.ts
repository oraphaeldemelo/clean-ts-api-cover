export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://raphael:0000@localhost:27017/clean-node-api?authSource=admin',
    port: process.env.PORT || 3000

}
