const dbName = "myDatabase";
const dbVersion = 1;

const saveBlobToIndexedDB = (trackName, blob, callback) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("blobs")) {
            db.createObjectStore("blobs", { keyPath: "name" });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["blobs"], "readwrite");
        const store = transaction.objectStore("blobs");

        // Сохраняем Blob в IndexedDB
        const request = store.put({ name: trackName, blob });

        request.onsuccess = function () {
            console.log(`Blob saved to IndexedDB with name: ${trackName}`);
            if (typeof callback === "function") {
                callback();
            }
        };

        request.onerror = function () {
            console.error("Error saving Blob to IndexedDB");
            if (typeof callback === "function") {
                callback();
            }
        };
    };
};

const getBlobFromIndexedDB = (trackName, callback) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["blobs"], "readonly");
        const store = transaction.objectStore("blobs");
        const request = store.get(trackName);

        request.onsuccess = function () {
            const blobData = request.result;
            if (blobData) {
                const blob = blobData.blob;
                console.log(
                    `Blob retrieved from IndexedDB with name: ${trackName}`
                );
                callback(blob);
            } else {
                console.error(
                    `Blob not found in IndexedDB with name: ${trackName}`
                );
                callback(null);
            }
        };

        request.onerror = function () {
            console.error("Error getting Blob from IndexedDB");
            callback(null);
        };
    };
};

export { saveBlobToIndexedDB, getBlobFromIndexedDB };
