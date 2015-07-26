/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Jarvus.proxy.API', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.api',
    requires: [
        'Jarvus.util.API'
    ],

    config: {
        /**
         * @cfg The {Ext.data.Connection} instance that will process requests
         * @required
         */
        connection: 'Jarvus.util.API'
    },

    onClassExtended: function(cls, data, hooks) {
        var connection = data.connection || data.config && data.config.connection,
            onBeforeClassCreated;

        if (typeof connection === 'string') {
            onBeforeClassCreated = hooks.onBeforeCreated;

            hooks.onBeforeCreated = function() {
                var me = this,
                    args = arguments;

                Ext.require(connection, function() {
                    onBeforeClassCreated.apply(me, args);
                });
            };
        }
    }, 

    applyConnection: function(connection) {
        if (typeof connection == 'string') {
            Ext.syncRequire(connection);
            connection = Ext.ClassManager.get(connection);
        }

        return connection;
    },

    sendRequest: function(request) {
        var me = this;

        request.setRawRequest(me.getConnection().request(Ext.applyIf({
            autoDecode: false,
            disableCaching: false,
            failureStatusCodes: [404] // TODO: verify this results in the proper failure method being called in the proxy
        }, request.getCurrentConfig())));

        me.lastRequest = request;

        return request;
    }
});
