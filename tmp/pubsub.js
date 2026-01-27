// Simple PubSub
const PubSub = {
    events: {},
    subscribe: function(event, callback) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(callback);
    },
    publish: function(event, data) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => callback(data));
    }
};
