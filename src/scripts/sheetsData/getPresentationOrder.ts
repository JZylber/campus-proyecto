import getSheetData from "./getSheetData";

export default async (rotation: string, dataSheetId: string) => {
  const presentationOrder = await getSheetData({
    sheetID: dataSheetId,
    sheetName: `Presentacion`,
    query: `SELECT * WHERE C = '${rotation}'`,
  });
  return presentationOrder.map((entry) => ({
    id: entry["N Grupo"] as number,
    name: entry["Grupo"] as string,
    instance: entry["Instancia"] as number,
    state: entry["Estado"] as string,
  }));
};
