import type { Alpine } from "alpinejs";
import type { PageData } from "./pageData";
import getStudentData from "../sheetsData/getStudentData";

const defaultStudent = {
  name: "Julian Ariel",
  surname: "Zylber",
};

const studentDataStore = (Alpine: Alpine) => ({
  name: "",
  surname: "",
  course: "",
  id: 0,
  group: {
    id: 0,
    name: "",
  },
  role: "",
  getRotation() {
    if (this.course.at(-1) === "A" || this.course.at(-1) === "B") {
      return "AB";
    } else if (this.course.at(-1) === "C" || this.course.at(-1) === "D") {
      return "CD";
    }
    return "";
  },
  setStudentData(studentData: {
    name: string;
    surname: string;
    course: string;
    id: number;
    group: { id: number; name: string };
    role: string;
  }) {
    this.name = studentData.name;
    this.surname = studentData.surname;
    this.course = studentData.course;
    this.id = studentData.id;
    this.group = studentData.group;
    this.role = studentData.role;
  },
  async init() {
    const { dataSheetId, onCampus } = Alpine.store("pageData") as PageData;
    let name = "";
    let surname = "";
    if (onCampus) {
      const data = await fetch(
        "https://campus.ort.edu.ar/ajaxactions/GetLoggedInData",
        {
          headers: {
            accept: "application/json",
          },
        }
      ).then((res) => res.json());
      [name, surname] = data.nombre.split("<br/>");
    } else {
      name = defaultStudent.name;
      surname = defaultStudent.surname;
    }
    const studentData = await getStudentData(name, surname, dataSheetId);
    if (studentData) {
      this.setStudentData(studentData);
    }
  },
});

export default studentDataStore;
export type StudentData = ReturnType<typeof studentDataStore>;
