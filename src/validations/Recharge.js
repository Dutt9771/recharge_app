import * as yup from "yup";

const RechargeSchema = yup.object().shape({
  code: yup.string().required("Country code is required"),
  mobileNumber: yup
    .string()
    .required("Mobile number is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .max(15, "Must be at most 15 digits"),
});

export default RechargeSchema;
