import React, { useState, useEffect } from "react";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";

import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import { getUserRoles } from "../../../redux/userRoles/userRolesthunk";
import { getUser, updateEmployeeRole } from "../../../redux/user/userthunk";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const ChangeEmployeeRoleModal = NiceModal.create(
	({ id, roleid, currentPage, limit }) => {
		const modal = useModal();
		const dispatch = useDispatch();

		const { data: roleData, loading: userRoleLoading } = useSelector(
			(state) => state.userRoles,
		);

		const initialValues = {
			id: id,
			roleid: roleid,
		};

		const formik = useFormik({
			initialValues,
			onSubmit: async (values) => {
				try {
					const response = await dispatch(updateEmployeeRole(values)).unwrap();

					if (response.status === 200) {
						dispatch(getUser({ page: currentPage + 1, limit: limit }));
						modal.resolve({ ...response.data });
						return modal.hide();
					}
				} catch (error) {
					toast.error(error.message);
				}
			},
		});

		const { setFieldValue } = formik;

		useEffect(async () => {
			dispatch(getUserRoles());
		}, [dispatch]);

		return (
			<Dialog
				TransitionComponent={Transition}
				open={modal.visible}
				onClose={() => modal.hide()}
				TransitionProps={{
					onExited: () => modal.remove(),
				}}
				fullWidth
			>
				<form onSubmit={formik.handleSubmit}>
					<DialogTitle>Change Employee Role</DialogTitle>
					<DialogContent>
						<Grid container spacing={1}>
							<Grid item xs={12} mt={1}>
								<FormControl size="small" fullWidth>
									<Autocomplete
										labelId="demo-simple-select-helper-label"
										id="demo-simple-select-helper"
										label="state"
										size="small"
										name="role"
										defaultValue=""
										onChange={(event, newValue) => {
											setFieldValue("roleid", newValue.id);
										}}
										value={
											roleData.find(
												(role) => role.id === formik.values.roleid,
											) ?? ""
										}
										options={roleData || []}
										getOptionLabel={(option) => option.role}
										renderInput={(params) => (
											<TextField {...params} label="Role" />
										)}
									/>
								</FormControl>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button
							color="error"
							variant="contained"
							onClick={() => modal.hide()}
						>
							Close
						</Button>
						<LoadingButton
							loading={formik.loading}
							type="submit"
							variant="contained"
						>
							Change
						</LoadingButton>
					</DialogActions>
				</form>
			</Dialog>
		);
	},
);

export default ChangeEmployeeRoleModal;
