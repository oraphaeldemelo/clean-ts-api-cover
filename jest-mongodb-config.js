module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            dbName: 'jest'
        },
        binary: {
            version: '6.0.4',
            skipMD5: true
        },
        autoStart: false
    }
}
