import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router-dom";

import Scrollbar from "../../components/Scrollbar";
import DashboardLayout from "../../layouts/dashboard";

import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import invertDirection from "../../utils/invertDirection";
import TableSortLabel from "@mui/material/TableSortLabel";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
	getUserRoles,
	createUserRoles,
	deleteuserRoleById,
	updateUserRolesById,
} from "../../redux/userRoles/userRolesthunk";

import {
	getViewVisible,
	getAddVisible,
	getEditVisible,
	getDeleteVisible,
} from "../../utils/userPermission";

import { setSortBy, setOrderBy } from "../../redux/userRoles/userRolesSlice";
import { getUserPermissionByRoll } from "../../redux/userPermission/userPermissionthunk";
import { encryption } from "../../utils/encodeString";
import LocalStorage from "../../service/localStorage";

function UserRoles() {
	const confirm = useConfirm();
	const dispatch = useDispatch();
	const [id, setId] = useState(null);
	const navigate = useNavigate();

	const [isAdding, setIsAdding] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const { data, status, orderBy, sortBy } = useSelector((state) => state.userRoles);
	const getUserPermission = async (Id) => {
		try {
			const res = await dispatch(
				getUserPermissionByRoll({
					id: Id,
				}),
			).unwrap();
			LocalStorage.setItem(
				"userPermissions",
				encryption(JSON.stringify(res.data)),
			);
		} catch (error) {
			
		}
	};
	useEffect(() => {
		let roleId=LocalStorage.getItem("roleId");
		getUserPermission(roleId)
	},[dispatch])
	// User Permission Use Effect : If user not has access to this module then redirect to dashboard
	useEffect(() => {
		if (!getViewVisible("userRoles")) {
			dispatch(getUserRoles({sortBy, orderBy}));
			navigate("/dashboard");
		}
	}, []);

	const formik = useFormik({
		initialValues: {
			role: "",
		},
		
		validationSchema: Yup.object().shape({
			role: Yup.string()
				.required("Role Name is required")
				.matches(/^[a-zA-Z.\s]+$/, "Please enter a valid role")
				.max(64, "Role is too long"),
		}),
		onSubmit: async (values, { resetForm }) => {
			try {
				setIsAdding(true);
				if (id) {
					await dispatch(updateUserRolesById({ ...values, id })).unwrap();
				}
				if (!id) {
					await dispatch(createUserRoles({ ...values })).unwrap();
				}
				setIsAdding(false);
				dispatch(getUserRoles({}));
				resetForm();
				return setId(null);
			} catch (error) {
				setIsAdding(false);
				toast.error(error.message);
			}
		},
	});

	const { handleSubmit, setValues, values, handleChange, errors, touched } =
		formik;

	const handleUpdate = (data) => {
		setValues({
			role: data.role,
		});
		setId(data.id);
	};

	const handleDelete = async (id, name) => {
		try {
			setIsDeleting(true);
			await confirm({
				description: `Are you sure you want to delete ${name}?`,
			});
			if (id) {
				await dispatch(deleteuserRoleById(id)).unwrap();
			}
			setIsDeleting(false);
			dispatch(getUserRoles());
		} catch (error) {
			setIsDeleting(false);
			toast.error(error?.message);
		}
	};

	useEffect(() => {
		if (status === "idle") {
			dispatch(getUserRoles({sortBy, orderBy}));
		}
	}, [dispatch, sortBy, orderBy]);

	const handleSorting = (columnName) => {
		dispatch(setSortBy({ sortBy: columnName }));
		dispatch(
			setOrderBy({
				orderBy: invertDirection(sortBy === columnName, orderBy),
			}),
		);
	};

	return (
		<Container maxWidth="xl">
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={3}
			>
				<Typography variant="h4" gutterBottom>
					User Roles
					<Typography variant="body2">Total Records : {data ? data.length : 0}</Typography>
				</Typography>
			</Stack>

			{getAddVisible("userRoles") && (
				<Card className="holiday-table-grid" mb={5}>
					<Container maxWidth="xl">
						<Paper>
							<form onSubmit={handleSubmit}>
								<Grid container spacing={2}>
									<Grid item xs={6} mt={3} mb={3}>
										<TextField
											label="Role Name"
											name="role"
											inputProps={{
												maxLength: 64,
												"data-cy": "txt-role-user-role",
											}}
											FormHelperTextProps={{
												"data-cy": "txt-role-err-user-role",
											}}
											value={values.role}
											onChange={handleChange}
											variant="outlined"
											size="small"
											fullWidth
											error={Boolean(touched.role && errors.role)}
											helperText={touched.role && errors.role}
										/>
									</Grid>
									<Grid item xs={6} mt={3}>
										<Stack direction="row" alignItems="center">
											<LoadingButton
												disabled={isAdding}
												loading={isAdding}
												type="submit"
												variant="contained"
												data-cy="btn-submit-user-role"
											>
												Save
											</LoadingButton>
										</Stack>
									</Grid>
								</Grid>
							</form>
						</Paper>
					</Container>
				</Card>
			)}

			<Card>
				<Scrollbar>
					<TableContainer sx={{ minWidth: 800 }}>
						<Table>
							<TableHead>
								<TableRow>
									{/*<TableCell align="left">Id</TableCell>*/}
									<TableCell align="left">
										<TableSortLabel
											active={sortBy === "role"}
											direction={sortBy === "role" ? orderBy : "asc"}
											onClick={() => handleSorting("role")}
										>
											Role
										</TableSortLabel>
									</TableCell>
									{/*<TableCell align="center">Actions</TableCell>*/}
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map((userRole, idx) => (
									<TableRow key={idx}>
										{/*<TableCell align="left">{userRole.id}</TableCell>*/}
										<TableCell align="left">{userRole.role}</TableCell>
										{/*<TableCell align="center">
                      <div className="action-button">
                        <span style={{ marginRight: 8 }}>
                          <IconButton
                            data-cy="btn-edit-user-role"
                            onClick={() => handleUpdate(userRole)}
                          >
                            <EditIcon color="primary" />{" "}
                          </IconButton>
                        </span>
                        <span>
                          <IconButton
                            disabled={isDeleting}
                            data-cy="btn-delete-user-role"
                            onClick={() =>
                              handleDelete(userRole.id, userRole.role)
                            }
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </span>
                      </div>
                    </TableCell>*/}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Scrollbar>
			</Card>
		</Container>
	);
}

const componentConfig = {
	component: UserRoles,
	path: "/user-roles",
	public: false,
	layout: DashboardLayout,
	group: "users",
	role: ["admin"],
	sidebar: true,
};

export default componentConfig;
