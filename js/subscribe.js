// Make sure _pubsub.js is loaded first
// Example: <script src="_pubsub.js"></script>

// Subscribe to all messages
(function() {
    // Using a wildcard subscription if supported
    // Otherwise, subscribe to a list of known channels
    const subscribeAll = (pubsub) => {
        if (!pubsub || typeof pubsub.subscribe !== 'function') {
            console.error('_pubsub.js not loaded or invalid');
            return;
        }

        // Option 1: if _pubsub supports "*" or "all" channel
        try {
            pubsub.subscribe('*', (topic, data) => {
                console.log('Received message on topic:', topic);
                console.log('Data:', data);
            });
        } catch (err) {
            console.warn('Wildcard subscription not supported. Subscribing to known channels instead.');

            // Option 2: subscribe to all known channels manually
            const channels = ['login', 'logout', 'click', 'update', 'custom']; // add your channels
            channels.forEach(channel => {
                pubsub.subscribe(channel, (data) => {
                    console.log(`Received message on channel '${channel}':`, data);
                });
            });
        }
    };

    // Run subscription after _pubsub is loaded
    document.addEventListener('DOMContentLoaded', () => {
        if (window.PubSub) {
            subscribeAll(window.PubSub);
        } else if (window._pubsub) {
            subscribeAll(window._pubsub);
        } else {
            console.error('_pubsub object not found on window');
        }
    });
})();
