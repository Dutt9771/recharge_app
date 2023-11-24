import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/dashboard";

import { useFormik } from "formik";
import { toast } from "react-toastify";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Loader from "../../components/Loader";
import TextField from "@mui/material/TextField";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import {
	getAllRoles,
	getAllModule,
	getUserPermissionById,
	updatePermission,
} from "../../redux/userPermission/userPermissionthunk";
import { getViewVisible, getEditVisible } from "../../utils/userPermission";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { IconButton } from "@mui/material";
function UserPermissions() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// User Permission Use Effect : If user not has access to this module then redirect to dashboard
	useEffect(() => {
		if (!getViewVisible("userPermissions")) {
			dispatch(getAllRoles());
			navigate("/dashboard");
		}
	}, []);

	const [isArrowDown, setIsArrowDown] = useState(null);
	const data = useSelector((state) => state.userPermission.data);
	const loading = useSelector((state) => state.userPermission.loading);
	const limit = useSelector((state) => state.userPermission.limit);
	const page = useSelector((state) => state.userPermission.page);
	const totalPage = useSelector((state) => state.userPermission.totalPage);
	const status = useSelector((state) => state.userPermission.status);
	const error = useSelector((state) => state.userPermission.error);
	/* const totalCount = useSelector((state) => state.candidate.totalCount);
	const sortBy = useSelector((state) => state.candidate.sortBy);
	const orderBy = useSelector((state) => state.candidate.orderBy); */
	const dropdownUserRoleData = useSelector(
		(state) => state.userPermission.userRoleDropdown,
	);
	// const AllModuleData = useSelector((state) => state.userPermission.AllModule);
	const [permissionArray, setPermissionArray] = useState([]);

	const Organizations = [
		"employee",
		"holiday",
		"policy",
		"specialDay",
		"policy",
		"dataChangeRequest",
		
	];
	const Recruitment = ["candidates", "interview", "jobDescription", "company", "jobVacancy","inbox"];
	const TPA = ["college", "interns", "drives", "project"];
	const AssetManagement = [
		"assets",
		"items",
		"itemInventory",
		"vendors",
		"manufacturers",
		"AssetMaster",
		"assetMapping",
		"assetItemMapping",
		"licenceMaster",
		"vmMaster",
		"ispMaster",
		"cmsVariables",
		"assetAllocation",
	];
	const Settings = [
		"master",
		"department",
		"addressMaster",
		"pageMaster",
		"userList",
		"userRoles",
		"userPermissions",
		"emailTemplate",
		"workFlow",
		"salarySlip",
		"systemConfig"
	];
	// const Inbox = [
	// 	"inbox"
	// ]
	const Evaluation = [
		"evaluation"
	];
	const OnboardedCandidates = [
		"onboardedCandidates"
	]
	const Helpdesk = [
		"categories",
		"tickets",
	]
	const Poll = [
		"poll"
	];

	// const SystemConfig = [
	// 	"systemConfig"
	// ]
	const formik = useFormik({
		initialValues: {
			roleId: "",
			permissions: [],
		},
		// validationSchema: candidateSchema,
		onSubmit: async (values, { resetForm }) => {
			try {
				values.permissions = [...permissionArray];

				/* values.permissions.map((permission) => {
					delete permission.moduleName;
					return permission;
				}); */

				let res = await dispatch(updatePermission(values)).unwrap();

				if (res.status === 200) {
					/* 	console.log(permissionArray);
					console.log(values.permissions); */

					setPermissionArray([]);
					await getAllModuleData();
					await getUserPermission(values.roleId);
				}
			} catch (error) {
				toast.error(error.message);
			}
		},
	});

	const { handleSubmit, getFieldProps, values, setFieldValue } = formik;

	useEffect(() => {
		dispatch(getAllRoles());
		let data = {};
		permissionArray.map((permission) => {
			data = { ...data, [permission.moduleName]: false };
		});

		setIsArrowDown(data);
	}, [dispatch]);

	const setUserPermission = (userPermissionData) => {
		let userPermission = userPermissionData.data;
		if (permissionArray.length > 0) {
			let tempObject = permissionArray;
			for (let index = 0; index < tempObject.length; index++) {
				const permission1 = tempObject[index];

				for (let index2 = 0; index2 < userPermission.length; index2++) {
					const permission2 = userPermission[index2];
					if (permission1.moduleId == permission2.moduleId) {
						permissionArray[index].create = permission2.create;
						permissionArray[index].delete = permission2.delete;
						permissionArray[index].update = permission2.update;
						permissionArray[index].view = permission2.view;
					}
				}
			}


			setPermissionArray(tempObject);
		}
	};

	const setAllModules = (AllModules) => {
		let permissionModule = AllModules.data;
		// console.log('permissionModule', permissionModule)
		let tempObject = [];

		permissionModule.forEach((element) => {
			tempObject.push({
				moduleId: element.id,
				moduleName: element.moduleName,
				moduleKey: element.moduleKey,
				create: false,
				view: false,
				update: false,
				delete: false,
			});
		});
		setPermissionArray(tempObject);
	};

	const getAllModuleData = async () => {
		try {
			const res = await dispatch(getAllModule()).unwrap();

			setAllModules(res);
		} catch (error) {
			toast.error(error.message);
		}
	};
	useEffect(() => {
		getAllModuleData();
	}, [dispatch]);

	const getUserPermission = async (Id) => {
		try {
			const res = await dispatch(
				getUserPermissionById({
					roleid: Id,
				}),
			).unwrap();

			setFieldValue(`roleId`, Id);
			setUserPermission(res);
		} catch (error) {
			setFieldValue(`roleId`, Id);
			getAllModuleData();
			toast.error(error.message);
		}
	};

	const permissionHandleChange = (event) => {
		let permissionModuleId = event.target.name;
		let permissionName = event.target.id;
		let permissionValue = event.target.checked;

		let temppermission = permissionArray.map((permission) =>
			permission.moduleId == permissionModuleId
				? { ...permission, [permissionName]: permissionValue }
				: permission,
		);

		setPermissionArray(temppermission);
	};

	const modulePermissionHandleChange = (event) => {
		let permissionModuleId = event.target.name;

		let permissionValue = event.target.checked;

		let temppermission = permissionArray.map((permission) =>
			permission.moduleId == permissionModuleId
				? {
					...permission,
					["create"]: permissionValue,
					["update"]: permissionValue,
					["view"]: permissionValue,
					["delete"]: permissionValue,
				}
				: permission,
		);

		setPermissionArray(temppermission);
	};

//  console.log("Permission Array :", permissionArray); 
//  console.log("DATA Array :", data); 

	function handleArrowChange(name) {
		setIsArrowDown((value) => ({ ...value, [name]: !value?.[name] }));
	}


	return (
		<Container maxWidth="xl">
			<Stack mb={3}>
				<Typography variant="h4">
					<h4>User Permissions</h4>
					<Typography variant="body2">Total Records : {permissionArray ? permissionArray.length : 0}</Typography>
				</Typography>
			</Stack>

			<Card>
				<div className="header" style={{ borderBottom: "1px solid #f0f0f0" }}>
					<form onSubmit={handleSubmit}>
						<Grid container p={3}>
							<Grid item xs={3} p={1}>
								<FormControl size="small" sx={{ minWidth: 120 }} fullWidth>
									<Autocomplete
										size="small"
										fullWidth
										value={
											dropdownUserRoleData.map((role, idx) => {
												return role.role == values.roleid;
											}) || ""
										}
										options={dropdownUserRoleData || []}
										key={dropdownUserRoleData.id || []}
										getOptionLabel={(option) => option.role || ""}
										{...getFieldProps(`roleid`)}
										onChange={(e, newValue) => {
											getUserPermission(newValue.id);
										}}
										isOptionEqualToValue={(option, value) =>
											option.id === value
										}
										renderInput={(params) => (
											<TextField {...params} label="User Role" />
										)}
										blurOnSelect={"mouse"}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={3} p={1}>
								<Button variant="contained" type="submit">
									Save
								</Button>
							</Grid>
						</Grid>
					</form>
				</div>

				<Grid container pl={3} pb={2}>
					<Grid item xs={12}>
						<h4 style={{ marginBottom: "20px" }}>Choose Module's permission</h4>
					</Grid>
					{/* Organizations */}
					{ loading  ? ( <Loader/>) :	(
					<>
					<Grid item xs={12}>
						<h4>Organizations</h4>
					</Grid>
					{Array.isArray(permissionArray) &&
						permissionArray.length > 0 &&
						permissionArray.map((permissionModule, idx) => {
							const isChecked =
								permissionModule["create"] ||
								permissionModule["update"] ||
								permissionModule["delete"] ||
								permissionModule["view"];

							if (Organizations.includes(permissionModule.moduleKey))
								return (
									<>
										<Grid container key={permissionModule.moduleId} ml={2}>
											<Grid
												item
												xs={3}
												style={{
													display: "flex",
													// justifyContent: "flex-start",
													// alignItems: "center",
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={`${permissionModule.moduleId}`}
																size="small"
																checked={
																	permissionModule["create"] ||
																	permissionModule["update"] ||
																	permissionModule["delete"] ||
																	permissionModule["view"]
																}
																onChange={modulePermissionHandleChange}
															/>
														}
														label={permissionModule?.moduleName || ""}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={1}>
												{isArrowDown?.[permissionModule.moduleName] ? (
													<IconButton color="primary" size="small">
														<ArrowRightIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												) : (
													<IconButton color="primary" size="small">
														<ArrowLeftIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												)}
											</Grid>
											{!isArrowDown?.[permissionModule.moduleName] ? (
												<>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="create"
																		checked={
																			permissionModule["create"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Add"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="update"
																		checked={
																			permissionModule["update"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Edit"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="delete"
																		checked={
																			permissionModule["delete"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Delete"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="view"
																		checked={permissionModule["view"] || false}
																		onChange={permissionHandleChange}
																	/>
																}
																label="View"
															/>
														</FormGroup>
													</Grid>
												</>
											) : (
												""
											)}
										</Grid>
									</>
								);
						})}

					<Grid item xs={12}>
						<h4>Recruitment</h4>
					</Grid>
					{Array.isArray(permissionArray) &&
						permissionArray.length > 0 &&
						permissionArray.map((permissionModule, idx) => {
							const isChecked =
								permissionModule["create"] ||
								permissionModule["update"] ||
								permissionModule["delete"] ||
								permissionModule["view"];

							if (Recruitment.includes(permissionModule.moduleKey))
								return (
									<>
										<Grid container key={permissionModule.moduleId} ml={2}>
											<Grid
												item
												xs={3}
												style={{
													display: "flex",
													// justifyContent: "flex-start",
													// alignItems: "center",
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={`${permissionModule.moduleId}`}
																size="small"
																checked={
																	permissionModule["create"] ||
																	permissionModule["update"] ||
																	permissionModule["delete"] ||
																	permissionModule["view"]
																}
																onChange={modulePermissionHandleChange}
															/>
														}
														label={permissionModule?.moduleName || ""}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={1}>
												{isArrowDown?.[permissionModule.moduleName] ? (
													<IconButton color="primary" size="small">
														<ArrowRightIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												) : (
													<IconButton color="primary" size="small">
														<ArrowLeftIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												)}
											</Grid>
											{!isArrowDown?.[permissionModule.moduleName] ? (
												<>
												{console.log("ModuleName",permissionModule.moduleKey)}
										{	permissionModule.moduleKey !== "inbox"	 && <Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="create"
																		checked={
																			permissionModule["create"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Add"
															/>
														</FormGroup>
													</Grid>}
													{permissionModule.moduleKey !== "inbox" && <Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="update"
																		checked={
																			permissionModule["update"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Edit"
															/>
														</FormGroup>
													</Grid>}
											{	permissionModule.moduleKey !== "inbox"&& <Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="delete"
																		checked={
																			permissionModule["delete"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Delete"
															/>
														</FormGroup>
													</Grid>}
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="view"
																		checked={permissionModule["view"] || false}
																		onChange={permissionHandleChange}
																	/>
																}
																label="View"
															/>
														</FormGroup>
													</Grid>
												</>
											) : (
												""
											)}
										</Grid>
									</>
								);
						})}

					<Grid item xs={12}>
						<h4>TPA</h4>
					</Grid>
					{Array.isArray(permissionArray) &&
						permissionArray.length > 0 &&
						permissionArray.map((permissionModule, idx) => {
							const isChecked =
								permissionModule["create"] ||
								permissionModule["update"] ||
								permissionModule["delete"] ||
								permissionModule["view"];

							if (TPA.includes(permissionModule.moduleKey))
								return (
									<>
										<Grid container key={permissionModule.moduleId} ml={2}>
											<Grid
												item
												xs={3}
												style={{
													display: "flex",
													// justifyContent: "flex-start",
													// alignItems: "center",
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={`${permissionModule.moduleId}`}
																size="small"
																checked={
																	permissionModule["create"] ||
																	permissionModule["update"] ||
																	permissionModule["delete"] ||
																	permissionModule["view"]
																}
																onChange={modulePermissionHandleChange}
															/>
														}
														label={permissionModule?.moduleName || ""}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={1}>
												{isArrowDown?.[permissionModule.moduleName] ? (
													<IconButton color="primary" size="small">
														<ArrowRightIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												) : (
													<IconButton color="primary" size="small">
														<ArrowLeftIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												)}
											</Grid>
											{!isArrowDown?.[permissionModule.moduleName] ? (
												<>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="create"
																		checked={
																			permissionModule["create"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Add"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="update"
																		checked={
																			permissionModule["update"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Edit"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="delete"
																		checked={
																			permissionModule["delete"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Delete"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="view"
																		checked={permissionModule["view"] || false}
																		onChange={permissionHandleChange}
																	/>
																}
																label="View"
															/>
														</FormGroup>
													</Grid>
												</>
											) : (
												""
											)}
										</Grid>
									</>
								);
						})}
					<Grid item xs={12}>
						<h4>Asset Management</h4>
					</Grid>
					{Array.isArray(permissionArray) &&
						permissionArray.length > 0 &&
						permissionArray.map((permissionModule, idx) => {
							const isChecked =
								permissionModule["create"] ||
								permissionModule["update"] ||
								permissionModule["delete"] ||
								permissionModule["view"];

							if (AssetManagement.includes(permissionModule.moduleKey))
								return (
									<>
										<Grid container key={permissionModule.moduleId} ml={2}>
											<Grid
												item
												xs={3}
												style={{
													display: "flex",
													// justifyContent: "flex-start",
													// alignItems: "center",
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={`${permissionModule.moduleId}`}
																size="small"
																checked={
																	permissionModule["create"] ||
																	permissionModule["update"] ||
																	permissionModule["delete"] ||
																	permissionModule["view"]
																}
																onChange={modulePermissionHandleChange}
															/>
														}
														label={permissionModule?.moduleName || ""}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={1}>
												{isArrowDown?.[permissionModule.moduleName] ? (
													<IconButton color="primary" size="small">
														<ArrowRightIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												) : (
													<IconButton color="primary" size="small">
														<ArrowLeftIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												)}
											</Grid>
											{!isArrowDown?.[permissionModule.moduleName] ? (
												<>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="create"
																		checked={
																			permissionModule["create"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Add"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="update"
																		checked={
																			permissionModule["update"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Edit"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="delete"
																		checked={
																			permissionModule["delete"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Delete"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="view"
																		checked={permissionModule["view"] || false}
																		onChange={permissionHandleChange}
																	/>
																}
																label="View"
															/>
														</FormGroup>
													</Grid>
												</>
											) : (
												""
											)}
										</Grid>
									</>
								);
						})}
					<Grid item xs={12}>
						<h4>Settings</h4>
					</Grid>
					{Array.isArray(permissionArray) &&
						permissionArray.length > 0 &&
						permissionArray.map((permissionModule, idx) => {
							const isChecked =
								permissionModule["create"] ||
								permissionModule["update"] ||
								permissionModule["delete"] ||
								permissionModule["view"];

							if (Settings.includes(permissionModule.moduleKey))
								return (
									<>
										<Grid container key={permissionModule.moduleId} ml={2}>
											<Grid
												item
												xs={3}
												style={{
													display: "flex",
													// justifyContent: "flex-start",
													// alignItems: "center",
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={`${permissionModule.moduleId}`}
																size="small"
																checked={
																	permissionModule["create"] ||
																	permissionModule["update"] ||
																	permissionModule["delete"] ||
																	permissionModule["view"]
																}
																onChange={modulePermissionHandleChange}
															/>
														}
														label={permissionModule?.moduleName || ""}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={1}>
												{isArrowDown?.[permissionModule.moduleName] ? (
													<IconButton color="primary" size="small">
														<ArrowRightIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												) : (
													<IconButton color="primary" size="small">
														<ArrowLeftIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												)}
											</Grid>
											{!isArrowDown?.[permissionModule.moduleName] ? (
												<>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="create"
																		checked={
																			permissionModule["create"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Add"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="update"
																		checked={
																			permissionModule["update"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Edit"
															/>
														</FormGroup>
													</Grid>
													{ permissionModule.moduleKey !== 'systemConfig' && <Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="delete"
																		checked={
																			permissionModule["delete"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Delete"
															/>
														</FormGroup>
													</Grid>}
													{ permissionModule.moduleKey !== 'systemConfig' && <Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="view"
																		checked={permissionModule["view"] || false}
																		onChange={permissionHandleChange}
																	/>
																}
																label="View"
															/>
														</FormGroup>
													</Grid>}
												</>
											) : (
												""
											)}
										</Grid>
									</>
								);
						})}

					{/* <Grid item xs={12}>
						<h4>Inbox</h4>
					</Grid>
					{Array.isArray(permissionArray) &&
						permissionArray.length > 0 &&
						permissionArray.map((permissionModule, idx) => {
							const isChecked =
								permissionModule["view"];

							if (Inbox.includes(permissionModule.moduleKey))
								return (
									<>
										<Grid container key={permissionModule.moduleId} ml={2}>
											<Grid
												item
												xs={3}
												style={{
													display: "flex",
													// justifyContent: "flex-start",
													// alignItems: "center",
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={`${permissionModule.moduleId}`}
																size="small"
																checked={
																	permissionModule["view"]
																}
																onChange={modulePermissionHandleChange}
															/>
														}
														label={permissionModule?.moduleName || ""}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={1}>
												{isArrowDown?.[permissionModule.moduleName] ? (
													<IconButton color="primary" size="small">
														<ArrowRightIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												) : (
													<IconButton color="primary" size="small">
														<ArrowLeftIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												)}
											</Grid>
											{!isArrowDown?.[permissionModule.moduleName] ? (
												<>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="view"
																		checked={permissionModule["view"] || false}
																		onChange={permissionHandleChange}
																	/>
																}
																label="View"
															/>
														</FormGroup>
													</Grid>
												</>
											) : (
												""
											)}
										</Grid>
									</>
								);
						})} */}

                {/* <Grid item xs={12}>
						<h4>System Config</h4>
					</Grid>
					{Array.isArray(permissionArray) &&
						permissionArray.length > 0 &&
						permissionArray.map((permissionModule, idx) => {
							const isChecked =
								permissionModule["create"];

							if (SystemConfig.includes(permissionModule.moduleKey))
								return (
									<>
										<Grid container key={permissionModule.moduleId} ml={2}>
											<Grid
												item
												xs={3}
												style={{
													display: "flex",
													// justifyContent: "flex-start",
													// alignItems: "center",
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={`${permissionModule.moduleId}`}
																size="small"
																checked={
																	permissionModule["create"]
																}
																onChange={modulePermissionHandleChange}
															/>
														}
														label={permissionModule?.moduleName || ""}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={1}>
												{isArrowDown?.[permissionModule.moduleName] ? (
													<IconButton color="primary" size="small">
														<ArrowRightIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												) : (
													<IconButton color="primary" size="small">
														<ArrowLeftIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												)}
											</Grid>
											{!isArrowDown?.[permissionModule.moduleName] ? (
												<>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="create"
																		checked={permissionModule["create"] || false}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Add"
															/>
														</FormGroup>
													</Grid>
												</>
											) : (
												""
											)}
										</Grid>
									</>
								);
						})} */}
					<Grid item xs={12}>
						<h4>Evaluation</h4>
					</Grid>
					{Array.isArray(permissionArray) &&
						permissionArray.length > 0 &&
						permissionArray.map((permissionModule, idx) => {
							const isChecked =
								permissionModule["create"] ||
								permissionModule["update"] ||
								permissionModule["delete"] ||
								permissionModule["view"];

							if (Evaluation.includes(permissionModule.moduleKey))
								return (
									<>
										<Grid container key={permissionModule.moduleId} ml={2}>
											<Grid
												item
												xs={3}
												style={{
													display: "flex",
													// justifyContent: "flex-start",
													// alignItems: "center",
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={`${permissionModule.moduleId}`}
																size="small"
																checked={
																	permissionModule["create"] ||
																	permissionModule["update"] ||
																	permissionModule["delete"] ||
																	permissionModule["view"]
																}
																onChange={modulePermissionHandleChange}
															/>
														}
														label={permissionModule?.moduleName || ""}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={1}>
												{isArrowDown?.[permissionModule.moduleName] ? (
													<IconButton color="primary" size="small">
														<ArrowRightIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												) : (
													<IconButton color="primary" size="small">
														<ArrowLeftIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												)}
											</Grid>
											{!isArrowDown?.[permissionModule.moduleName] ? (
												<>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="create"
																		checked={
																			permissionModule["create"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Add"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="update"
																		checked={
																			permissionModule["update"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Edit"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="delete"
																		checked={
																			permissionModule["delete"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Delete"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="view"
																		checked={permissionModule["view"] || false}
																		onChange={permissionHandleChange}
																	/>
																}
																label="View"
															/>
														</FormGroup>
													</Grid>
												</>
											) : (
												""
											)}
										</Grid>
									</>
								);
						})}
					</>
					)}
					<Grid item xs={12}>
						<h4>Helpdesk</h4>
					</Grid>
					{Array.isArray(permissionArray) &&
						permissionArray.length > 0 &&
						permissionArray.map((permissionModule, idx) => {
							const isChecked =
								permissionModule["create"] ||
								permissionModule["update"] ||
								permissionModule["delete"] ||
								permissionModule["view"];

							if (Helpdesk.includes(permissionModule.moduleKey))
								return (
									<>
										<Grid container key={permissionModule.moduleId} ml={2}>
											<Grid
												item
												xs={3}
												style={{
													display: "flex",
													// justifyContent: "flex-start",
													// alignItems: "center",
												}}
											>
												<FormGroup>
													<FormControlLabel
														control={
															<Checkbox
																name={`${permissionModule.moduleId}`}
																size="small"
																checked={
																	permissionModule["create"] ||
																	permissionModule["update"] ||
																	permissionModule["delete"] ||
																	permissionModule["view"]
																}
																onChange={modulePermissionHandleChange}
															/>
														}
														label={permissionModule?.moduleName || ""}
													/>
												</FormGroup>
											</Grid>
											<Grid item xs={1}>
												{isArrowDown?.[permissionModule.moduleName] ? (
													<IconButton color="primary" size="small">
														<ArrowRightIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												) : (
													<IconButton color="primary" size="small">
														<ArrowLeftIcon
															size="small"
															onClick={() =>
																handleArrowChange(permissionModule.moduleName)
															}
														/>
													</IconButton>
												)}
											</Grid>
											{!isArrowDown?.[permissionModule.moduleName] ? (
												<>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="create"
																		checked={
																			permissionModule["create"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Add"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="update"
																		checked={
																			permissionModule["update"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Edit"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="delete"
																		checked={
																			permissionModule["delete"] || false
																		}
																		onChange={permissionHandleChange}
																	/>
																}
																label="Delete"
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={2}>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		id="view"
																		checked={permissionModule["view"] || false}
																		onChange={permissionHandleChange}
																	/>
																}
																label="View"
															/>
														</FormGroup>
													</Grid>
												</>
											) : (
												""
											)}
										</Grid>
									</>
								);
							})}
							<Grid item xs={12}>
								<h4>Poll</h4>
							</Grid>
							{Array.isArray(permissionArray) &&
								permissionArray.length > 0 &&
								permissionArray.map((permissionModule, idx) => {
									const isChecked =
										permissionModule["create"] ||
										permissionModule["update"] ||
										permissionModule["delete"] ||
										permissionModule["view"];

									if (Poll.includes(permissionModule.moduleKey))
										return (
											<>
												<Grid container key={permissionModule.moduleId} ml={2}>
													<Grid
														item
														xs={3}
														style={{
															display: "flex",
															// justifyContent: "flex-start",
															// alignItems: "center",
														}}
													>
														<FormGroup>
															<FormControlLabel
																control={
																	<Checkbox
																		name={`${permissionModule.moduleId}`}
																		size="small"
																		checked={
																			permissionModule["create"] ||
																			permissionModule["update"] ||
																			permissionModule["delete"] ||
																			permissionModule["view"]
																		}
																		onChange={modulePermissionHandleChange}
																	/>
																}
																label={permissionModule?.moduleName || ""}
															/>
														</FormGroup>
													</Grid>
													<Grid item xs={1}>
														{isArrowDown?.[permissionModule.moduleName] ? (
															<IconButton color="primary" size="small">
																<ArrowRightIcon
																	size="small"
																	onClick={() =>
																		handleArrowChange(permissionModule.moduleName)
																	}
																/>
															</IconButton>
														) : (
															<IconButton color="primary" size="small">
																<ArrowLeftIcon
																	size="small"
																	onClick={() =>
																		handleArrowChange(permissionModule.moduleName)
																	}
																/>
															</IconButton>
														)}
													</Grid>
													{!isArrowDown?.[permissionModule.moduleName] ? (
														<>
															<Grid item xs={2}>
																<FormGroup>
																	<FormControlLabel
																		control={
																			<Checkbox
																				name={`${permissionModule.moduleId}`}
																				size="small"
																				id="create"
																				checked={
																					permissionModule["create"] || false
																				}
																				onChange={permissionHandleChange}
																			/>
																		}
																		label="Add"
																	/>
																</FormGroup>
															</Grid>
															<Grid item xs={2}>
																<FormGroup>
																	<FormControlLabel
																		control={
																			<Checkbox
																				name={`${permissionModule.moduleId}`}
																				size="small"
																				id="update"
																				checked={
																					permissionModule["update"] || false
																				}
																				onChange={permissionHandleChange}
																			/>
																		}
																		label="Edit"
																	/>
																</FormGroup>
															</Grid>
															<Grid item xs={2}>
																<FormGroup>
																	<FormControlLabel
																		control={
																			<Checkbox
																				name={`${permissionModule.moduleId}`}
																				size="small"
																				id="delete"
																				checked={
																					permissionModule["delete"] || false
																				}
																				onChange={permissionHandleChange}
																			/>
																		}
																		label="Delete"
																	/>
																</FormGroup>
															</Grid>
															<Grid item xs={2}>
																<FormGroup>
																	<FormControlLabel
																		control={
																			<Checkbox
																				name={`${permissionModule.moduleId}`}
																				size="small"
																				id="view"
																				checked={permissionModule["view"] || false}
																				onChange={permissionHandleChange}
																			/>
																		}
																		label="View"
																	/>
																</FormGroup>
															</Grid>
														</>
													) : (
														""
													)}
												</Grid>
											</>
										);
									})}
				</Grid>
			</Card>
		</Container>
	);
}

const componentConfig = {
	component: UserPermissions,
	path: "/user-permissions",
	public: false,
	layout: DashboardLayout,
	group: "users",
	role: ["admin"],
	sidebar: true,
};

export default componentConfig;
