import getSheetData from "./getSheetData";

const getPresentationOrder = async (dataSheetId: string) => {
  const presentationOrder = await getSheetData({
    sheetID: dataSheetId,
    sheetName: `Presentacion`,
    query: `SELECT * `,
  });
  return presentationOrder.map((entry) => ({
    id: entry["N Grupo"] as number,
    name: entry["Grupo"] as string,
    instance: entry["Instancia"] as number,
    rotation: entry["Rotación"] as string,
    state: entry["Estado"] as string,
  }));
};

export default getPresentationOrder;
export type PresentationEntry = ReturnType<
  typeof getPresentationOrder
> extends Promise<Array<infer U>>
  ? U
  : never;
