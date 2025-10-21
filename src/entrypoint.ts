import type { Alpine, ElementWithXAttributes } from "alpinejs";
import pageData, { type PageData } from "./scripts/alpine/pageData";
import studentData from "./scripts/alpine/studentData";
import presentationData from "./scripts/alpine/presentationData";

export default (Alpine: Alpine) => {
  Alpine.store("pageData", pageData());
  Alpine.store("studentData", studentData(Alpine));
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
