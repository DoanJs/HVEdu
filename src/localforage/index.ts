import localforage from "localforage";

localforage.config({
  name: "AKEdu",
  storeName: "cacheStore",
});

export default localforage;
