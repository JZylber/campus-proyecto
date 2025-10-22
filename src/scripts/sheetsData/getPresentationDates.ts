import getSheetData from "./getSheetData";

async function getPresentationDates(dataSheetId: string) {
  const presentationDates = await getSheetData({
    sheetID: dataSheetId,
    sheetName: `Fechas`,
    query: `SELECT * `,
  });
  return presentationDates.map((entry) => ({
    date: entry["Fecha"] as Date,
    block: entry["Bloque"] as number,
    instance: entry["Instancia"] as number,
    rotation: entry["Rotación"] as string,
    numberOfPresentations: entry["N Grupos"] as number,
  }));
}

export default getPresentationDates;
export type PresentationDateEntry = ReturnType<
  typeof getPresentationDates
> extends Promise<Array<infer U>>
  ? U
  : never;
