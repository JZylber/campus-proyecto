import type { Alpine, ElementWithXAttributes } from "alpinejs";
import pageData, { type PageData } from "./scripts/alpine/pageData";
import studentData from "./scripts/alpine/studentData";
import presentationDataStore from "./scripts/alpine/presentationData";

export default (Alpine: Alpine) => {
  Alpine.store("pageData", pageData());
  Alpine.store("studentData", studentData(Alpine));
  Alpine.store("presentationData", presentationDataStore(Alpine));
};
