import type { Alpine } from "alpinejs";
import type { PageData } from "./pageData";
import getPresentationOrder, {
  type PresentationEntry,
} from "../sheetsData/getPresentationOrder";
import type { PresentationDateEntry } from "../sheetsData/getPresentationDates";
import getPresentationDates from "../sheetsData/getPresentationDates";

const blockStartTimes = {
  1: "07:45",
  2: "09:20",
  3: "10:55",
  4: "13:10",
  5: "14:30",
  6: "16:00",
};

const time2Block = (time: Date) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  for (const [block, blockStart] of Object.entries(blockStartTimes)) {
    const [blockHours, blockMinutes] = blockStart.split(":").map(Number);
    const blockTotalMinutes = blockHours * 60 + blockMinutes;
    if (totalMinutes < blockTotalMinutes) {
      return Number(block) - 1;
    }
  }
  return Object.keys(blockStartTimes).length - 1;
};

const isSameDate = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isAfter = (date1: Date, date2: Date) => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1 > d2;
};

const presentationDataStore = (Alpine: Alpine) => ({
  presentationOrder: [] as Array<PresentationEntry>,
  presentationDates: [] as Array<PresentationDateEntry>,
  groupPresentationDates: {} as Record<number, PresentationDateEntry>,
  setPresentationOrder(order: Array<PresentationEntry>) {
    this.presentationOrder = order;
  },
  setPresentationDates(dates: Array<PresentationDateEntry>) {
    this.presentationDates = dates;
  },
  setGroupPresentationDate(groupId: number, date: PresentationDateEntry) {
    this.groupPresentationDates[groupId] = date;
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
  calculatePresentationBlocks() {
    const blocks = [];
    const now = new Date();
    const currentBlock = time2Block(now);
    // Get dates that are today or later and
    const relevantDates = this.presentationDates.filter(
      (dateEntry) =>
        isAfter(dateEntry.date, now) ||
        (isSameDate(dateEntry.date, now) && dateEntry.block >= currentBlock)
    );
    // Get groups that are pending or in progress
    const relevantGroups = this.presentationOrder.filter(
      (presentation) =>
        presentation.state === "Pendiente" ||
        presentation.state === "Presentando"
    );
    let groupIndex = 0;
    for (const dateEntry of relevantDates) {
      const block = {
        dateEntry,
        groups: relevantGroups
          .slice(groupIndex, groupIndex + dateEntry.numberOfPresentations)
          .map((group) => group.id),
      };
      blocks.push(block);
      groupIndex += dateEntry.numberOfPresentations;
      if (groupIndex >= relevantGroups.length) {
        break;
      }
    }
    for (const block of blocks) {
      for (const groupId of block.groups) {
        this.setGroupPresentationDate(groupId, block.dateEntry);
      }
    }
  },
  async loadPresentationData(rotation: string) {
    await Promise.all([
      this.getPresentationOrder(rotation),
      this.getPresentationDates(rotation),
    ]);
    this.calculatePresentationBlocks();
    console.log(this.groupPresentationDates);
  },
  getPendingPresentations() {
    return this.presentationOrder.filter(
      (presentation) => presentation.state === "Pendiente"
    );
  },
});

export default presentationDataStore;
export type PresentationData = ReturnType<typeof presentationDataStore>;
