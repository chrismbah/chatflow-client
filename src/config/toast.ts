import { DefaultToastOptions } from "react-hot-toast";

export const toastOptions: DefaultToastOptions = {
  style: {
    background: "#26262e",
    color: "#f3f4f6",
    textTransform: "capitalize",
    fontSize: "14px",
    borderRadius: "6px",
    padding: "16px",
  },
  success: {
    style: {
      background: "#26262e",
      color: "#f3f4f6",
    },
  },
  error: {
    style: {
      background: "#26262e",
      color: "#f3f4f6",
    },
  },
};
