import type { Alpine } from "alpinejs";
import pageData from "./scripts/alpine/pageData";
import studentData from "./scripts/alpine/studentData";
import presentationData from "./scripts/alpine/presentationData";

export default (Alpine: Alpine) => {
  Alpine.store("pageData", pageData());
  Alpine.store("studentData", studentData(Alpine));
  Alpine.store("presentationData", presentationData(Alpine));
};
