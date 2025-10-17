import Fuse from "fuse.js";
import getSheetData from "./getSheetData";

export default async (name: string, surname: string, dataSheetId: string) => {
  const allStudents = await getSheetData({
    sheetID: dataSheetId,
    sheetName: "Estudiante",
    query: `SELECT * `,
  });
  const fuse = new Fuse(allStudents, {
    keys: ["Nombre", "Apellido"],
    threshold: 0.4,
  });
  const students = fuse.search({ Nombre: name, Apellido: surname });
  const found = students.length > 0;
  if (found) {
    let student = students[0].item as Record<string, string | number>;
    return {
      name: student["Nombre"] as string,
      surname: student["Apellido"] as string,
      course: student["Curso"] as string,
      id: student["DNI"] as number,
      group: {
        id: student["Id Grupo"] as number,
        name: student["Grupo"] as string,
      },
      role: student["Rol"] as string,
    };
  } else {
    return null;
  }
};
