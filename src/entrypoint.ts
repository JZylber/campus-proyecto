import type { Alpine, ElementWithXAttributes } from "alpinejs";
import pageData, { type PageData } from "./scripts/alpine/pageData";
import studentData from "./scripts/alpine/studentData";
import presentationDataStore from "./scripts/alpine/presentationData";
import presentations from "./scripts/alpine/presentations";

export default (Alpine: Alpine) => {
  Alpine.store("pageData", pageData());
  Alpine.store("studentData", studentData(Alpine));
  Alpine.store("presentationData", presentationDataStore(Alpine));
  Alpine.data("presentations", presentations);
  const shadowContainer = document.querySelector("#campus-insertion");
  if (
    shadowContainer !== null &&
    (Alpine.store("pageData") as PageData).onCampus
  ) {
    const shadow = shadowContainer.shadowRoot?.getRootNode() as
      | ElementWithXAttributes
      | undefined;
    if (shadow !== undefined) {
      Alpine.initTree(shadow);
    }
  }
};
