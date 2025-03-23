import moment from "moment";
export const handleGoogleRedirect = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`;
};

export const getLastActiveStatus = (lastActive: Date | null) => {
  if (!lastActive) return "Offline"; // Handle null values

  const lastActiveMoment = moment(lastActive);
  const now = moment();

  if (now.diff(lastActiveMoment, "minutes") < 2) {
    return "Online"; // User was active within the last 2 minutes
  } else if (now.isSame(lastActiveMoment, "day")) {
    return `Last seen today at ${lastActiveMoment.format("h:mm A")}`;
  } else if (now.diff(lastActiveMoment, "days") === 1) {
    return `Last seen yesterday at ${lastActiveMoment.format("h:mm A")}`;
  } else {
    return `Last seen on ${lastActiveMoment.format("D MMMM [at] h:mm A")}`;
  }
};
