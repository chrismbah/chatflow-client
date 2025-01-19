import { DefaultToastOptions } from "react-hot-toast";

export const toastOption: DefaultToastOptions = {
  success: {
    style: {
      background: "green",
      color: "#fff",
      textTransform: "capitalize",
      fontSize: "14px",
    },
  },
  error: {
    style: {
      background: "#DA281C",
      color: "#fff",
      textTransform: "capitalize",
      fontSize: "14px",
    },
  },
};
