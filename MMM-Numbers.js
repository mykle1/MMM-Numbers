/* Magic Mirror
 * Module: MMM-Numbers
 *
 * By Mykle1
 *
 */
Module.register("MMM-Numbers", {

    // Module config defaults.
    defaults: {
        type: "math",
        useHeader: false, // false if you don't want a header
        header: "", // Any text you want. useHeader must be true
        maxWidth: "300px",
        animationSpeed: 3000, // fade speed
        initialLoadDelay: 3250,
        retryDelay: 2500,
        updateInterval: 10 * 60 * 1000,

    },

    getStyles: function() {
        return ["MMM-Numbers.css"];
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification("CONFIG", this.config);

        // Schedule update timer
        setInterval(function() {
            self.updateDom(self.config.animationSpeed || 0); // use config.animationSpeed or revert to zero
        }, this.config.updateInterval);


        //  Set locale.
        this.Numbers = {};
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "I've got your number . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        var time = document.createElement("div");
        time.classList.add("small", "bright", "time");
        time.innerHTML = new Date().getTime();
        wrapper.appendChild(time);


        var display = document.createElement("div");
        display.classList.add("small", "bright", "display");
        // Remove quotes at beginning and end of string response - Stackoverflow via google
        if (this.Numbers.charAt(0) === '"' && this.Numbers.charAt(this.Numbers.length - 1) === '"') {
            display.innerHTML = this.Numbers.substr(1, this.Numbers.length - 2);
            wrapper.appendChild(display);
        }


        return wrapper;

    }, // <-- End of getDom()


    processNumbers: function(data) {
        this.Numbers = data;
        this.loaded = true;
        //  console.log(this.Numbers);
    },


    scheduleUpdate: function() {
        setInterval(() => {
            this.getNumbers();
        }, this.config.updateInterval);
        this.getNumbers(this.config.initialLoadDelay);
    },

    getNumbers: function() {
        this.sendSocketNotification('GET_NUMBERS');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "NUMBERS_RESULT") {
            this.processNumbers(payload);
            if (this.rotateInterval == null) {
                //  this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }

        this.updateDom(this.config.initialLoadDelay);
    },
});
