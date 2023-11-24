import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getDashboardInterviewList } from "../redux/dashboardInterviewList/dashboardInterviewListThunk";
import { updateDashboardInterviewStatus } from "../redux/dashboardInterviewStatus/updateInterviewStatusThunk";
import { useDispatch, useSelector } from "react-redux";
import {
	indianDateFormat,
	dateDiffrence,
	tomorrowDate,
} from "../utils/dateFormat";
import { convertTo24HrsFormat } from "../utils/formatTime";
import { encryption } from "../utils/encodeString";
import Loader from "../components/Loader";
import { getCandidateByStatus } from "../redux/candidateState/candidateStatethunk";
import { useConfirm } from "material-ui-confirm";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { style } from "@mui/system";
import { Autocomplete, TextField } from "@mui/material";
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { values } from "lodash";
import LoadingButton from "@mui/lab/LoadingButton";

const style2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  gap: 2,
  p: 4,
};

const InterviewList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
	const [noteError, setNoteError] = useState({ flag: false, title: "" });
	const [interview, setInterview] = useState();
	const [nValue, setNValue] = useState("");
	const interviewList = useSelector(
		(state) => state.dashboardInterviewList.data,
	);
	const confirm = useConfirm();
	const updateInterviewStatus = useSelector(
		(state) => state.updateDashboardInterviewStatus.data,
	);

	const candidateState = useSelector((state) => state.candidateState);

	const loading = useSelector((state) => state.dashboardInterviewList.loading);

	const [todayInterviews, setTodayInterviews] = useState([]);
	const [tomorrowInterviews, setTomorrowInterviews] = useState([]);

	const ITEM_HEIGHT = 100;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT + ITEM_PADDING_TOP,
				width: 140,
			},
		},
	};

	useEffect(() => {
		dispatch(getDashboardInterviewList());
		dispatch(getCandidateByStatus(4));
	}, []);

	const formatInterviewerName = (interviewrefrences) => {
		return interviewrefrences
			?.map(
				(ref) => `${ref?.interviewer?.firstName} ${ref?.interviewer?.lastName}`,
			)
			.join(", ");
	};

	const { values, setFieldValue} =
	useFormik({
		initialValues: {
			note: ""
		},
	});

	const handleCancel = () => {
		handleClose();
		setFieldValue("note", "");
		setNoteError({ flag: false, title: "" });
	}

	const handleInterviewStatusChange = (noteValue) => {
		if(noteValue == "")
		{
			setNoteError({ flag: true, title: "Please enter notes" });
		}
		if(noteValue != "")
		{
			setNoteError({ flag: false, title: "" });
		}
		if(noteValue != "")
		{
				dispatch(
					updateDashboardInterviewStatus({
						interviewId: interview.id,
						candidateId: interview.candidateId,
						activityStateId: nValue.id,
						note: noteValue,
					}),
				).then(() => {
					dispatch(getDashboardInterviewList());
				});
			setFieldValue("note", "");
			handleClose();
		}
	}

	const handleInterviewStateChange = (e) => {
		handleOpen();
	};

	const mapInterview = (interview, key) => {
		let role=localStorage.getItem("role").toLowerCase().replace(/\s+/g, "").replace(/"/g, "");
		// console.log(localStorage.getItem("role").toLowerCase().replace(/\s+/g, "").replace(/"/g, "")=="superadmin","popopopopop",localStorage.getItem("role").toLowerCase().replace(/\s+/g,'').replace(/"/g, ""));
		return (
			<div key={key} className="interview_item">
				<div className="interview_top">
					<Typography
						variant="h5"
						style={{ cursor: "pointer" }}
						onClick={() =>
							navigate(`/candidate/view/${encryption(interview.candidateId)}`)
						}
					>
						{interview?.candidateName}
					</Typography>
					<div style={{ display: "flex", alignItems: "center" }}>
						<span>{formatInterviewerName(interview?.interviewrefrences)}</span>
						<div className="interview_call">
							{" "}
							{interview?.interviewType == "Practical Offline" ||
							interview?.interviewType == "Practical Online" ? (
								<img src="/assets/images/moniter.svg" />
							) : (
								<img src="/assets/images/orangecall.svg" />
							)}{" "}
							{convertTo24HrsFormat(interview?.interviewTime)}
						</div>
					</div>
				</div>
				<div className="interview_middle">
					<div>
						<strong>
							<span> &nbsp;{interview?.technology?.title}</span>
							<span>
								{`${interview?.technology?.title}` &&
								`${interview?.candidate?.totalExperience}`
									? " | "
									: ""}
								{interview?.candidate?.totalExperience &&
								interview?.candidate?.totalExperience != 0
									? `${interview?.candidate?.totalExperience} Yrs `
									: "0 Yrs"}
							</span>
						</strong>
						{(role=="superadmin"||role=="hr")?<div
							style={{
								display: "flex",
								alignItems: "center",
								margin: "5px 0 0px 0",
							}}
						>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									margin: "0 15px 0 0",
								}}
							>
								<img src="/assets/images/roundcall.svg" />{" "}
								<a href={`tel:${interview?.candidate?.contactNumber}`}>
									{interview?.candidate?.contactNumber}
								</a>
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									margin: "0 15px 0 0",
								}}
							>
								<img src="/assets/images/roundmail.svg" />{" "}
								<a href={`mailto:${interview?.candidate?.email}`}>
									{interview?.candidate?.email}
								</a>
							</div>
						</div>:''}
					</div>
					<div className="social-image-icon">
						{interview?.googleMeetLink && (
							<a href={`${interview?.googleMeetLink}`} target="_blank">
								<img
									className="skype"
									height="25px"
									width="25px"
									src="/assets/images/google-meet.png"
								/>
							</a>
						)}
						{interview?.candidate?.skype && (
							<a href={`skype:${interview?.candidate?.skype}?chat`}>
								<img className="skype" src="/assets/images/skype.png" />
							</a>
						)}
						{interview?.candidate?.linkedIn && (
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={interview?.candidate?.linkedIn}
							>
								<img
									className="skype "
									src="/assets/images/linkedin.png"
									style={{ width: "19px" }}
								/>
							</a>
						)}
						{interview?.candidate?.candidateResume && (
							<a
								target="_blank"
								rel="noopener noreferrer"
								href={interview?.candidate?.candidateResume?.webViewLink}
							>
								<img
									className="skype"
									src="/assets/images/resume-download-icon.png"
									style={{ width: "15px" }}
								/>
							</a>
						)}
					</div>
				</div>
				{(role=="superadmin"||role=="hr")?<div className="interview_bottom" mb={0}>
					<div className="mail-dropdown-div">
						<Autocomplete
							size="small"
							fullWidth
							options={candidateState?.stateData || []}
							getOptionLabel={(option) => option.name || ""}
							disableClearable
							value={candidateState?.stateData?.find(
								(status) =>
									status.id === interview?.candidate?.interviewStatusId,
							)}
							// value={interview?.candidate?.interviewStatusId}
							renderInput={(params) => (
								<TextField
									{...params}
									//   label="State"
								/>
							)}
							onChange={(e, newValue) => {
									setInterview(interview);
									setNValue(newValue);
									handleInterviewStateChange();
								}
							}
						/>
					</div>
					<Link
						to={`/interviewlist/schedule-interview/${encryption(interview?.candidate?.id)}`}
					>
						Schedule Next Round
					</Link>
				</div>:''}

			</div>
		);
	};
	return (
		<>
			<Grid item xs={6} sm={6} md={6} style={{ paddingTop: "24px" }}>
				<Grid item xs={12} sm={12} md={12}>
					<Typography variant="h6">
						{interviewList.todaysInterviews?.length > 0
							? indianDateFormat(
									new Date(interviewList.todaysInterviews[0]["interviewDate"]),
							  )
							: indianDateFormat(new Date())}
					</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					mb={2}
					style={{ paddingTop: "10px" }}
				>
					{loading ? (
						<Loader />
					) : (
						<Card className="interview" sx={{maxHeight:'500px',overflow: 'auto'}}>
							{interviewList.todaysInterviews?.length > 0 ? (
								interviewList.todaysInterviews.map((interview, idx) =>
									mapInterview(interview, idx),
								)
							) : (
								<Typography align="center">
									No interview schedules Today
								</Typography>
							)}
						</Card>
					)}
				</Grid>
			</Grid>

			<Grid item xs={6} sm={6} md={6} style={{ paddingTop: "24px" }}>
				<Grid item xs={12} sm={12} md={12}>
					<Typography variant="h6">
						{interviewList.tomorrowsInterviews?.length > 0
							? indianDateFormat(
									new Date(
										interviewList.tomorrowsInterviews[0]["interviewDate"],
									),
							  )
							: indianDateFormat(tomorrowDate())}
					</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					sm={12}
					md={12}
					mb={2}
					style={{ paddingTop: "10px" }}
				>
					{loading ? (
						<Loader />
					) : (
						<Card className="interview" sx={{maxHeight:'500px',overflow: 'auto'}}>
							{interviewList.tomorrowsInterviews?.length > 0 ? (
								interviewList.tomorrowsInterviews.map((interview, idx) =>
									mapInterview(interview, idx),
								)
							) : (
								<Typography align="center">
									No interview schedules Tomorrow
								</Typography>
							)}
						</Card>
					)}

				<Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Stack sx={style2}>
					Are you sure you want to change the interview status of {interview?.candidateName} to {nValue?.name} ?
						<TextField
							fullWidth
							multiline
							label="Note"
							aria-label="Note..."
							minRows={3}
							// placeholder="Minimum 3 rows"
							/* className="custom-textarea" */
							// {...getFieldProps("note")}
							inputProps={{
								inputComponent: TextareaAutosize,
								maxLength: 512,
								style: {
									resize: "auto",
								},
							}}
							onChange={(e) => {
								setFieldValue("note", e.target.value || "")
								if(e.target.value)
								{
									setNoteError({ flag: false, title: "" });
								}
								if(e.target.value == ""){
									setNoteError({ flag: true, title: "Please enter notes" });
								}
							}}
							helperText={noteError?.title && noteError?.title}
              error={Boolean(noteError?.flag && noteError?.flag)}
						/>
						<Stack direction="row" alignItems="right" justifyContent="flex-end">
							<Button
								variant="contained"
								// type="submit"
								onClick={handleCancel} 
								sx={{ marginRight: "15px" }}
							>
								Cancel
							</Button>
							<LoadingButton
								// component={RouterLink}
								onClick={() => handleInterviewStatusChange(values.note)}
								variant="contained"
							>
								Yes
							</LoadingButton>
						</Stack>
          </Stack>
        </Modal>

				</Grid>
			</Grid>
		</>
	);
};

export default InterviewList;
