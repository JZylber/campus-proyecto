const isOnCampus = () => {
  const host = window.location.host;
  return host === "campus.ort.edu.ar";
};

const pageDataStore = () => ({
  onCampus: isOnCampus(),
  dataSheetId: "15G9sQ8vv0C38mQXtgcfKqPiahh5eK-qRCaHHbcccffA",
});

export type PageData = ReturnType<typeof pageDataStore>;
export default pageDataStore;
