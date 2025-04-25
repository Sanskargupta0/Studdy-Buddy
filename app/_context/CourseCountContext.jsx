import { createContext } from "react";

export const CourseCountContext = createContext({
  totalCourse: 0,
  setTotalCourse: () => {},
});
