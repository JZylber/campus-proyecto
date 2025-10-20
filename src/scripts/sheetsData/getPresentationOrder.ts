import getSheetData from "./getSheetData";

const getPresentationOrder = async (rotation: string, dataSheetId: string) => {
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

export default getPresentationOrder;
export type PresentationEntry = ReturnType<
  typeof getPresentationOrder
> extends Promise<Array<infer U>>
  ? U
  : never;
