import type { Alpine } from "alpinejs";
import pageData from "./alpine/pageData";

export default (Alpine: Alpine) => {
  Alpine.store("pageData", pageData());
};
