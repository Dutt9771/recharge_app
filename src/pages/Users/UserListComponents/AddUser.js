// import React, { useState } from "react";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
// import { useFormik } from "formik";

// import DashboardLayout from "../../../layouts/dashboard";

// import Container from "@mui/material/Container";
// import Typography from "@mui/material/Typography";
// import FormControl from "@mui/material/FormControl";
// import FormHelperText from "@mui/material/FormHelperText";
// import Paper from "@mui/material/Paper";
// import Grid from "@mui/material/Grid";
// import TextField from "@mui/material/TextField";
// import Card from "@mui/material/Card";
// import Stack from "@mui/material/Stack";
// import Button from "@mui/material/Button";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import LoadingButton from "@mui/lab/LoadingButton";
// import Autocomplete from "@mui/material/Autocomplete";

// import userSchema from "../../../validations/userSchema";
// import Loader from "../../../components/Loader";
// import {
// 	getuserById,
// 	updateUserById,
// 	createUser,
// 	getUser,
// } from "../../../redux/user/userthunk";
// import { decryption } from "../../../utils/encodeString";
// import {
// 	getViewVisible,
// 	getAddVisible,
// 	getEditVisible,
// 	getDeleteVisible,
// } from "../../../utils/userPermission";

// function AddUser() {
// 	const { id } = useParams();
// 	const navigate = useNavigate();
// 	const dispatch = useDispatch();

// 	const { data: userRoles } = useSelector((state) => state.userRoles);
// 	const [isLoading, setIsLoading] = useState(true);
// 	const [isAdding, setIsAdding] = useState(false);
// 	const [paramsId, setParamsId] = useState(null);

// 	const { currentPage, limit } = useSelector((state) => state.user);
// 	if (!getAddVisible("userList") || !getEditVisible("userList")) {
// 		navigate("/dashboard");
// 	}
// 	const formik = useFormik({
// 		initialValues: {
// 			firstName: "",
// 			lastName: "",
// 			email: "",
// 			mobileNumber: "",
// 			//password: "cccadmin",
// 			roleId: "",
// 		},
// 		validationSchema: userSchema,
// 		onSubmit: async (values, { resetForm }) => {
// 			try {
// 				setIsAdding(true);
// 				const roleId = userRoles.filter((role) => {
// 					if (role.role === values.roleId) {
// 						return role.id;
// 					}
// 				});
// 				const body = { ...values, roleId: roleId[0].id };
// 				if (id) {
// 					await dispatch(updateUserById({ ...body, id: paramsId })).unwrap();
// 				}
// 				if (!id) {
// 					await dispatch(createUser({...body, password: "cccadmin"})).unwrap();
// 				}
// 				setIsAdding(false);
// 				dispatch(getUser({ page: currentPage + 1, limit: limit }));
// 				navigate("/user-list");
// 				resetForm();
// 			} catch (error) {
// 				setIsAdding(false);
// 				console.log(error);
// 			}
// 		},
// 	});

// 	const {
// 		handleSubmit,
// 		values,
// 		setFieldValue,
// 		handleChange,
// 		errors,
// 		touched,
// 		getFieldProps,
// 	} = formik;

// 	useEffect(() => {
// 		if (id) {
// 			var decodeParam = decryption(id);
// 			setParamsId(decodeParam);
// 			const userData = dispatch(getuserById({ id: decodeParam })).unwrap();
// 			userData
// 				.then((values) => {
// 					const val = values.data;
// 					setFieldValue("firstName", val.firstName);
// 					setFieldValue("lastName", val.lastName);
// 					setFieldValue("email", val.email);
// 					setFieldValue("mobileNumber", val.mobileNumber);
// 					setFieldValue("roleId", val.userinroles[0].userroles.role);
// 					setIsLoading(false);
// 				})
// 				.catch(() => {
// 					setIsLoading(false);
// 					navigate("/user-list");
// 				});
// 		} else {
// 			setIsLoading(false);
// 		}
// 	}, [dispatch, setFieldValue, id, navigate]);

// 	if (isLoading) {
// 		return <Loader />;
// 	}

// 	return (
// 		<Container maxWidth="xl">
// 			<form onSubmit={handleSubmit}>
// 				<Stack
// 					direction="row"
// 					alignItems="center"
// 					justifyContent="space-between"
// 					mb={3}
// 				>
// 					<Typography variant="h4" gutterBottom>
// 						{id ? "Edit User" : "Add User"}
// 					</Typography>
// 					<Stack direction="row" alignItems="center">
// 						<LoadingButton
// 							disabled={isAdding}
// 							loading={isAdding}
// 							type="submit"
// 							variant="contained"
// 						>
// 							Save
// 						</LoadingButton>
// 						<Button
// 							variant="contained"
// 							component={RouterLink}
// 							to="/user-list"
// 							startIcon={<ArrowBackIcon />}
// 							style={{ marginLeft: "10px" }}
// 						>
// 							Back To List
// 						</Button>
// 					</Stack>
// 				</Stack>
// 				<Card className="holiday-table-grid" mb={5}>
// 					<Container maxWidth="xl">
// 						<Paper>
// 							<Grid container spacing={3}>
// 								<Grid item xs={6} mt={3}>
// 									<TextField
// 										fullWidth
// 										autoComplete='off'
// 										label="First Name"
// 										name="firstName"
// 										value={values.firstName}
// 										onChange={handleChange}
// 										variant="outlined"
// 										size="small"
// 										inputProps={{ maxLength: 64 }}
// 										error={Boolean(touched.firstName && errors.firstName)}
// 										helperText={touched.firstName && errors.firstName}
// 									/>
// 								</Grid>
// 								<Grid item xs={6} mt={3}>
// 									<TextField
// 										label="Last Name"
// 										autoComplete='off'
// 										name="lastName"
// 										value={values.lastName}
// 										onChange={handleChange}
// 										variant="outlined"
// 										size="small"
// 										inputProps={{ maxLength: 64 }}
// 										fullWidth
// 										error={Boolean(touched.lastName && errors.lastName)}
// 										helperText={touched.lastName && errors.lastName}
// 									/>
// 								</Grid>
// 								<Grid item xs={6}>
// 									<TextField
// 										label="Mobile Number"
// 										autoComplete='off'
// 										name="mobileNumber"
// 										value={values.mobileNumber}
// 										onChange={handleChange}
// 										variant="outlined"
// 										size="small"
// 										inputProps={{ maxLength: 10 }}
// 										error={Boolean(touched.mobileNumber && errors.mobileNumber)}
// 										helperText={touched.mobileNumber && errors.mobileNumber}
// 										fullWidth
// 									/>
// 								</Grid>
// 								<Grid item xs={6}>
// 									<TextField
// 										label="Email"
// 										autoComplete='off'
// 										name="email"
// 										value={values.email}
// 										onChange={handleChange}
// 										variant="outlined"
// 										size="small"
// 										inputProps={{ maxLength: 512 }}
// 										error={Boolean(touched.email && errors.email)}
// 										helperText={touched.email && errors.email}
// 										fullWidth
// 									/>
// 								</Grid>
// 								<Grid item xs={6}>
// 									{/*<InputLabel id="demo-simple-select-label" size="small">
// 											Role
// 										</InputLabel>
// 										<Select
// 											labelId="demo-simple-select-label"
// 											id="demo-simple-select"
// 											name="role"
// 											value={values.roleId}
// 											label="role"
// 											size="small"
// 											fullWidth
// 											onChange={handleChange}
// 											error={Boolean(touched.roleId && errors.roleId)}
// 											helperText={touched.roleId && errors.roleId}
// 										>
// 											{userRoles.map((role, key) => (
// 												<MenuItem key={key} value={role.role}>
// 													{role.role}
// 												</MenuItem>
// 											))}
// 											</Select> */}
// 									<Autocomplete
// 										size="small"
// 										fullWidth
// 										options={userRoles || []}
// 										{...getFieldProps(`roleId`)}
// 										//value={values.roleId}
// 										value={
// 											userRoles.find((tech) => tech.role == values.roleId) ?? ""
// 										}
// 										getOptionLabel={(option) => option?.role || ""}
// 										onChange={(event, newValue) => {
// 											setFieldValue(`roleId`, newValue?.role || "");
// 										}}
// 										renderInput={(params) => (
// 											<TextField
// 												{...params}
// 												autoComplete="off"
// 												label="Role"
// 												error={Boolean(touched?.roleId && errors?.roleId)}
// 												helperText={touched?.roleId && errors?.roleId}
// 											/>
// 										)}
// 									/>
// 								</Grid>
// 							</Grid>
// 							<Stack direction="row" justifyContent="end" my={3}>

// 							</Stack>
// 							{/*<Stack direction="row" justifyContent="end" my={3}>
// 								<Button type="submit" variant="contained">
// 									Save
// 								</Button>
// 										</Stack>*/}
// 						</Paper>
// 					</Container>
// 				</Card>
// 			</form>
// 		</Container>
// 	);
// }

// const componentConfig = [
// 	{
// 		component: AddUser,
// 		path: "/user-list/add",
// 		public: false,
// 		group: "user",
// 		layout: DashboardLayout,
// 		sidebar: true,
// 		role: ["admin"],
// 	},
// 	{
// 		component: AddUser,
// 		path: "/user-list/add/:id",
// 		public: false,
// 		group: "user",
// 		layout: DashboardLayout,
// 		sidebar: true,
// 		role: ["admin"],
// 	},
// ];

// export default componentConfig;
