const isOnCampus = () => {
  const host = window.location.host;
  return host === "campus.ort.edu.ar";
};

export default () => ({
  onCampus: isOnCampus(),
  dataSheetId: "15G9sQ8vv0C38mQXtgcfKqPiahh5eK-qRCaHHbcccffA",
});
