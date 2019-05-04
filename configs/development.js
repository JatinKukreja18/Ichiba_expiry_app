/**
 * Development configuration file
 */

module.exports = {
    // Mongo URI
    mongo: {
        uri: "mongodb+srv://piyush-admin:aadirock95@cluster0-izss2.mongodb.net/test?retryWrites=true"
    },
    // Environment IP
    ip: process.env.NODEJS_IP || process.env.IP,
    // Environment PORT
    port: process.env.NODEJS_PORT || process.env.PORT || 3000
}