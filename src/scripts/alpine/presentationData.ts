import type { Alpine } from "alpinejs";
import type { PageData } from "./pageData";
import getPresentationOrder from "../sheetsData/getPresentationOrder";

const presentationDataStore = (Alpine: Alpine) => ({
  presentationOrder: [] as Array<{
    id: number;
    name: string;
    instance: number;
    state: string;
  }>,
  setPresentationOrder(
    order: Array<{
      id: number;
      name: string;
      instance: number;
      state: string;
    }>
  ) {
    this.presentationOrder = order;
  },
  async getPresentationOrder(rotation: string) {
    const { dataSheetId, onCampus } = Alpine.store("pageData") as PageData;
    const presentationOrder = await getPresentationOrder(rotation, dataSheetId);
    this.setPresentationOrder(presentationOrder);
  },
  getPendingPresentations() {
    return this.presentationOrder.filter(
      (presentation) => presentation.state === "Pendiente"
    );
  },
});

export default presentationDataStore;
export type PresentationData = ReturnType<typeof presentationDataStore>;
