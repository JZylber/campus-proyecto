import type { Alpine } from "alpinejs";
import pageData from "./scripts/alpine/pageData";
import studentData from "./scripts/alpine/studentData";

export default (Alpine: Alpine) => {
  Alpine.store("pageData", pageData());
  Alpine.store("studentData", studentData(Alpine));
};
