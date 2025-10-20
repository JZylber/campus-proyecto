import type { Alpine } from "alpinejs";
import type { PageData } from "./pageData";
import getPresentationOrder, {
  type PresentationEntry,
} from "../sheetsData/getPresentationOrder";
import type { PresentationDateEntry } from "../sheetsData/getPresentationDates";
import getPresentationDates from "../sheetsData/getPresentationDates";

const presentationDataStore = (Alpine: Alpine) => ({
  presentationOrder: [] as Array<PresentationEntry>,
  presentationDates: [] as Array<PresentationDateEntry>,
  setPresentationOrder(order: Array<PresentationEntry>) {
    this.presentationOrder = order;
  },
  setPresentationDates(dates: Array<PresentationDateEntry>) {
    this.presentationDates = dates;
  },
  async getPresentationOrder(rotation: string) {
    const { dataSheetId, onCampus } = Alpine.store("pageData") as PageData;
    const presentationOrder = await getPresentationOrder(rotation, dataSheetId);
    this.setPresentationOrder(presentationOrder);
  },
  async getPresentationDates(rotation: string) {
    const { dataSheetId, onCampus } = Alpine.store("pageData") as PageData;
    const presentationDates = await getPresentationDates(rotation, dataSheetId);
    this.setPresentationDates(presentationDates);
  },
  async loadPresentationData(rotation: string) {
    await Promise.all([
      this.getPresentationOrder(rotation),
      this.getPresentationDates(rotation),
    ]);
  },
  getPendingPresentations() {
    return this.presentationOrder.filter(
      (presentation) => presentation.state === "Pendiente"
    );
  },
});

export default presentationDataStore;
export type PresentationData = ReturnType<typeof presentationDataStore>;
