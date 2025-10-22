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
  7: "17:30",
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
  return Object.keys(blockStartTimes).length;
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
  async getPresentationOrder() {
    const { dataSheetId, onCampus } = Alpine.store("pageData") as PageData;
    const presentationOrder = await getPresentationOrder(dataSheetId);
    this.setPresentationOrder(presentationOrder);
  },
  async getPresentationDates() {
    const { dataSheetId, onCampus } = Alpine.store("pageData") as PageData;
    const presentationDates = await getPresentationDates(dataSheetId);
    this.setPresentationDates(presentationDates);
  },
  calculatePresentationBlocks() {
    const blocks = [];
    const now = new Date();
    const currentBlock = time2Block(now);
    // Get all unique possible rotations as a set
    const possibleRotations = new Set(
      this.presentationDates.map((dateEntry) => dateEntry.rotation)
    );
    // For each rotation, calculate the presentation blocks
    for (const rotation of possibleRotations) {
      const relevantDates = this.presentationDates.filter(
        (dateEntry) =>
          (isAfter(dateEntry.date, now) ||
            (isSameDate(dateEntry.date, now) &&
              dateEntry.block >= currentBlock)) &&
          dateEntry.rotation === rotation
      );
      // Get groups that are pending or in progress
      const relevantGroups = this.presentationOrder.filter(
        (presentation) =>
          (presentation.state === "Pendiente" ||
            presentation.state === "Presentando") &&
          presentation.rotation === rotation
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
    }
  },
  async init(rotation: string) {
    await Promise.all([
      this.getPresentationOrder(),
      this.getPresentationDates(),
    ]);
    this.calculatePresentationBlocks();
  },
  getGroupPresentationState(groupId: number) {
    const presentation = this.presentationOrder.find((p) => p.id === groupId);
    return presentation ? presentation.state : undefined;
  },
  showDate(date: Date) {
    // Format date as Weekday (long) DD/MM
    // Weekday in Spanish
    const weekday = date.toLocaleDateString("es-AR", { weekday: "long" });
    // Capitalize first letter
    const capitalizedWeekday =
      weekday.charAt(0).toUpperCase() + weekday.slice(1);
    const day = date.getDate().toString();
    const month = (date.getMonth() + 1).toString();
    return `${capitalizedWeekday} ${day}/${month}`;
  },
});

export default presentationDataStore;
export type PresentationData = ReturnType<typeof presentationDataStore>;
