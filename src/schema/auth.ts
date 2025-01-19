import * as yup from "yup";

export const signUpSchema = yup.object().shape({
  fullName: yup.string().required("Please enter your full name"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter your email"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password should not be more than 20 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*_?&]{6,20}$/,
      "Password must contain at least one letter and number"
    )
    .required("Please enter your password"),
});


export type SignUpSchema = yup.InferType<typeof signUpSchema>;