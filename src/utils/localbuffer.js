import { openDB } from "idb";

const dbPromise = openDB("local-buffer", 1, {
    upgrade(db) {
        db.createObjectStore("objects");
    },
});

export async function saveObject(id, type, blob) {
    const db = await dbPromise;
    await db.put("objects", { type, blob }, id);
}

export async function getObject(id) {
    const db = await dbPromise;
    return await db.get("objects", id);
}

export async function getObjects() {
    const db = await dbPromise;
    return await db.getAll("objects");
}

export async function deleteObject(id) {
    const db = await dbPromise;
    return await db.delete("objects", id);
}

export async function deleteObjects() {
    const db = await dbPromise;
    const keys = await db.getAllKeys("objects");
    return await Promise.all(keys.map(key => deleteObject(key)));
}