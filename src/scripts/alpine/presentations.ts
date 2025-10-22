import type { PresentationData } from "./presentationData";

const presentations = () => {
  return {
    presentations: [] as PresentationData["presentationOrder"],
    filter: {
      rotation: "",
      keyword: "",
    },
    init() {
      this.presentations = (
        Alpine.store("presentationData") as PresentationData
      ).presentationOrder;
    },
    get filteredPresentations() {
      let result = this.presentations;

      if (this.filter.rotation !== "") {
        result = result.filter((p) => p.rotation === this.filter.rotation);
      }

      if (this.filter.keyword !== "") {
        result = result.filter((p) =>
          p.name.toLowerCase().includes(this.filter.keyword.toLowerCase())
        );
      }
      return result;
    },
  };
};

export default presentations;
