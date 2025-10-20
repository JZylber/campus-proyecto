import getSheetData from "./getSheetData";

async function getPresentationDates(rotation: string, dataSheetId: string) {
  const presentationDates = await getSheetData({
    sheetID: dataSheetId,
    sheetName: `Fechas`,
    query: `SELECT * WHERE C = '${rotation}'`,
  });
  return presentationDates.map((entry) => ({
    date: entry["Fecha"] as Date,
    block: entry["Bloque"] as number,
    instance: entry["Instancia"] as number,
    numberOfPresentations: entry["N Grupos"] as number,
  }));
}

export default getPresentationDates;
export type PresentationDateEntry = ReturnType<
  typeof getPresentationDates
> extends Promise<Array<infer U>>
  ? U
  : never;
