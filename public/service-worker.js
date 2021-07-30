
// array of files to link and cache
const FILE_TO_CACHE = [
    "./index.html",
    "./css/styles.css",
    "./js/index.js"
]

// Budget tracker app prefixes/variables
const APP_PREFIX = "BudgetTracker-"
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

// log the cache that is installing
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILE_TO_CACHE)
        })
    )
});

// activate and delete cache
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            })

            cacheKeeplist.push(CACHE_NAME);

            // delete cache
            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log('deleting cache : ' + keyList[i]);
                        return caches.delete(keyList[i]);
                    }
                }));

        })
    )
});

// retrieve needed cache 
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + e.request.url)
                return request
            } else {
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })

    )
})


// confirm that the service worker was registered in the console
console.log('Service worker registered!')