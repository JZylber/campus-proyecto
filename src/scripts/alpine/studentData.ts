import type { Alpine } from "alpinejs";
import type { PageData } from "./pageData";
import getStudentData from "../sheetsData/getStudentData";

const DEBUG = false;
const testName = "Julian";
const testSurname = "Garbate";

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
  rotation: "",
  loading: true,
  setRotation(course: string) {
    if (course.at(-1) === "A" || course.at(-1) === "B") {
      this.rotation = "AB";
    } else if (course.at(-1) === "C" || course.at(-1) === "D") {
      this.rotation = "CD";
    }
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
    this.setRotation(studentData.course);
  },
  async init() {
    const { dataSheetId, onCampus } = Alpine.store("pageData") as PageData;
    let name = DEBUG ? testName : "";
    let surname = DEBUG ? testSurname : "";
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
    }
    const studentData = await getStudentData(name, surname, dataSheetId);
    if (studentData) {
      this.setStudentData(studentData);
    }
    this.loading = false;
  },
});

export default studentDataStore;
export type StudentData = ReturnType<typeof studentDataStore>;
