import localforage from "localforage";

localforage.config({
  name: "HVEdu",
  storeName: "cacheStore",
});

export default localforage;
