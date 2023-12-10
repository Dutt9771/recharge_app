import { useEffect, useState, createRef } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Badge from "@mui/material/Badge";
import { purple, red } from "@mui/material/colors";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import DashboardLayout from "../layouts/dashboard";
import TimelineDot from "@mui/lab/TimelineDot";
import { styled } from "@mui/material/styles";
import CircleIcon from "@mui/icons-material/Circle";
import Avatar from "@mui/material/Avatar";
import { getCalendarData } from "../redux/calendar/calendarThunk";
import { currentMonth, GetCalenderMonth } from "../utils/currentMonth";
import { getViewVisible, getEditVisible } from "../utils/userPermission";
import {
	convertCustomDateFormat,
	birthDateConvertCustomDateFormat,
} from "../utils/formatTime";
import Loader from "../components/Loader";
import moment from "moment";
import "./Dashboard.css";

function Calendar() {
	const dispatch = useDispatch();
	const calendar = createRef();
	const [calendarMonth, setCalendarMonth] = useState(currentMonth());
	const [date, setDate] = useState(new Date());
	const [totalEvent, setTotalEvent] = useState(0);
	const data = useSelector((state) => state.calendar.data);
	const loading = useSelector((state) => state.calendar.loading);
	const error = useSelector((state) => state.calendar.error);
	const [commitment, setCommitment] = useState();
	useEffect(() => {
		dispatch(getCalendarData({ date: calendarMonth }));
	}, [calendarMonth]);

	//  console.log("data",data)
	// useEffect(() => {
	// 	let d = []
	// 	data?.employeeCommitmentOver?.map((employee) => {
	// 		if(employee?.workDetails?.commitmentStartDate && employee?.workDetails?.bondDuration)
	// 		{
	// 			let newDate = new Date(employee?.workDetails?.commitmentStartDate)
	// 			let n = Number(employee?.workDetails?.bondDuration)
	// 			if(Number.isInteger(n) == false)
	// 			{
	// 				let a = employee?.workDetails?.bondDuration.split(".");
	// 				if(a[0] == "1")
	// 				{
	// 					newDate.setMonth(newDate.getMonth() + 12)
	// 				}
	// 				newDate.setMonth(newDate.getMonth() + Number(a[1]))
	// 			}
	// 			else {
	// 				newDate.setFullYear(newDate.getFullYear() + n);
	// 			}
	// 			if(newDate.setHours(0,0,0,0) < new Date().setHours(0,0,0,0))
	// 			{
	// 				d = [...d, {id: employee?.id, commitDate: newDate, firstName: employee?.firstName, lastName: employee?.lastName}]
	// 			}
	// 		}
	// 	})
	// 	setCommitment(d)
	// }, [data?.employeeCommitmentOver]);

	const setTheMultipleEvents = () => {
		let events = [];

		//Holiday Data
		if (data.holidayData?.length) {
			if (getViewVisible("holiday")) {
				events.push({
					events: [
						...data?.holidayData
							?.filter((x) => x.isHoliday === true)
							.map((holiday) => {
								return {
									start: convertCustomDateFormat(holiday.start),
									end: convertCustomDateFormat(holiday.end),
									title: holiday.title,
									overlap: true,
									extendedProps: {
										constraint: "H",
										color: "#DADADA",
										eventsCount: events.length,
									},
								};
							}),
					],
					color: "#DADADA",
					display: "list-item",
				});
			}
			if (getViewVisible("specialDay")) {
				events.push({
					events: [
						...data?.holidayData
							?.filter((x) => x.isHoliday === false)
							.map((holiday) => {
								return {
									start: convertCustomDateFormat(holiday.start),
									end: convertCustomDateFormat(holiday.end),
									title: holiday.title,
									overlap: true,
									extendedProps: {
										constraint: "S",
										color: "#92DBBE",
										eventsCount: events.length,
									},
								};
							}),
					],
					color: "#92DBBE",
					display: "list-item",
				});
			}
		}

		if (getViewVisible("employee")) {
			//Birthday Data
			if (data.todayBirthday?.length) {
				events.push({
					events: [
						...data?.todayBirthday?.map((user) => ({
							date: birthDateConvertCustomDateFormat(date, user.dateOfBirth),
							title: `${user.firstName} ${user.lastName}`,
							overlap: true,
							extendedProps: {
								constraint: "B",
								color: "#FBB294",
								eventsCount: events.length,
							},
						})),
					],
					color: "#FBB294",
					display: "list-item",
				});
			}

			//New Join Data
			if (data.employeeJoinignList?.length) {
				events.push({
					events: [
						...data?.employeeJoinignList?.map((employee) => ({
							date: convertCustomDateFormat(employee.workDetails.joiningDate),
							title: `${employee.firstName} ${employee.lastName}`,
							extendedProps: {
								constraint: "J",
								color: "#A1D8FF",
								eventsCount: events.length,
							},
							overlap: true,
						})),
					],
					display: "list-item",
					color: "#A1D8FF",
				});
			}

			//Exiting Employee Data
			if (data.employeeRelivingList?.length) {
				events.push({
					events: [
						...data?.employeeRelivingList?.map((employee) => ({
							date: convertCustomDateFormat(employee.workDetails.relievingDate),
							title: `${employee.firstName} ${employee.lastName}`,
							extendedProps: {
								constraint: "R",
								color: "#EA6060",
								eventsCount: events.length,
							},
							overlap: true,
						})),
					],
					color: "#EA6060",
					display: "list-item",
				});
			}

			//Employee Anniversary Data
			if (data.employeeAniversary?.length) {
				events.push({
					events: [
						...data?.employeeAniversary?.map((employee) => ({
							date: birthDateConvertCustomDateFormat(
								date,
								employee.workDetails.productionDate,
							),
							title: `${employee.firstName} ${employee.lastName}`,
							extendedProps: {
								constraint: "A",
								color: "#EDADF2",
								eventsCount: events.length,
							},
							overlap: true,
						})),
					],
					color: "#EDADF2",
					display: "list-item",
				});
			}
		}

		if (getViewVisible("drives")) {
			if (data.placementDrive?.length) {
				//Placement Drive Data
				events.push({
					events: [
						...data?.placementDrive?.map((employee) => ({
							date: convertCustomDateFormat(employee.placementDate),
							title: `${employee.college.collegeName}`,
							extendedProps: {
								constraint: "P",
								color: "#959EF3",
								eventsCount: events.length,
							},
							overlap: true,
						})),
					],
					color: "#959EF3",
					display: "list-item",
				});
			}
		}

		if (getViewVisible("employee")) {
			if (data.employeeCommitmentOver?.length) {

				events.push({
					events: [
						...data?.employeeCommitmentOver?.map((employee) => ({
							date: convertCustomDateFormat(employee?.CommitmentOverDate),
							title: `${employee.firstName} ${employee.lastName}`,
							extendedProps: {
								constraint: "C",
								color: "#C9F4AA",
								eventsCount: events.length,
							},
							overlap: true,
						})),
					],
					color: "#C9F4AA",
					display: "list-item",
				});
			}
		}

		// if (getViewVisible("employee")) {
			
		// 	if (commitment?.length) {

		// 		events.push({
		// 			events: [
		// 				...commitment?.map((employee) => ({
		// 					date: convertCustomDateFormat(employee?.commitDate),
		// 					title: `${employee.firstName} ${employee.lastName}`,
		// 					extendedProps: {
		// 						constraint: "C",
		// 						color: "#C9F4AA",
		// 						eventsCount: events.length,
		// 					},
		// 					overlap: true,
		// 				})),
		// 			],
		// 			color: "#C9F4AA",
		// 			display: "list-item",
		// 		});
		// 	}
		// }

		// setTotalEvent(events.length);
		return events;
	};

	const LightTooltip = styled(({ className, ...props }) => (
		<Tooltip {...props} classes={{ popper: className }} placement="left" />
	))(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: theme.palette.common.white,
			color: "rgba(0, 0, 0, 0.87)",
			boxShadow: theme.shadows[1],
			fontSize: 11,
			zIndex: 999,
		},
	}));
	function stringToColor(string) {
		let hash = 0;
		let i;

		/* eslint-disable no-bitwise */
		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = "#";

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		/* eslint-enable no-bitwise */

		return color;
	}
	function stringAvatar(name) {
		return {
			sx: {
				bgcolor: stringToColor(name),
			},
			children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
		};
	}
	const renderEventContent = (eventInfo) => {
		return (
			<>
				{/* 
				<LightTooltip
					style={{ marginRight: "20px" }}
					title={
						<Grid container>
							<Grid item style={{ padding: "0" }}>
								<Avatar
									sx={{
										bgcolor: eventInfo.event.extendedProps.color,
										width: 25,
										height: 25,
									}}
								>
									{eventInfo.event.extendedProps.constraint}
								</Avatar>
							</Grid>
							<Grid item style={{ padding: "4px 0 0 5px" }}>
								{eventInfo.event.title}
							</Grid>
						</Grid>
					}
					arrow
				> */}
				<span style={{ marginRight: "0", whiteSpace: "normal" }}>
					<Badge
						sx={{
							"& .MuiBadge-badge": {
								backgroundColor: eventInfo.event.extendedProps.color,
								width: "9px",
								height: "9px",
								padding: "0",
								minWidth: "0",
								cursor: "pointer",
							},
						}}
						badgeContent=" "
					/>{" "}
					<span style={{ marginLeft: "5px", fontSize: "10px" }}>
						{eventInfo.event.title}
					</span>
				</span>
				{/* </LightTooltip> */}
			</>
		);
	};

	const renderInnerContent = (eventInfo) => {
		return (
			<Tooltip>
				<b>{eventInfo.timeText}</b>
				<i>{eventInfo.event.title}</i>
			</Tooltip>
		);
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<Grid item xs={14} className="calander">
			<Grid
				container
				spacing={2}
				alignItems="center"
				justify="center"
				style={{
					justifyContent: "center",
				}}
			>
				{getViewVisible("employee") ? (
					<>
						<Grid item /* style={{ marginRight: "10px" }} */>
							<Badge
								sx={{
									"& .MuiBadge-badge": {
										backgroundColor: "#FBB294",
										width: "11px",
										height: "11px",
										borderRadius: "50%",
									},
								}}
								variant="dot"
							/>
							<Typography sx={{ marginLeft: 1, fontSize: 13 }} variant="span">
								Birthday
							</Typography>
						</Grid>
						<Grid item /* style={{ marginRight: "10px" }} */>
							<Badge
								sx={{
									"& .MuiBadge-badge": {
										backgroundColor: "#A1D8FF",
										width: "11px",
										height: "11px",
										borderRadius: "50%",
									},
								}}
								variant="dot"
							/>
							<Typography sx={{ marginLeft: 1, fontSize: 13 }} variant="span">
								New Joining
							</Typography>
						</Grid>
						<Grid item /* style={{ marginRight: "10px" }} */>
							<Badge
								sx={{
									"& .MuiBadge-badge": {
										backgroundColor: "#EA6060",
										width: "11px",
										height: "11px",
										borderRadius: "50%",
									},
								}}
								variant="dot"
								badgeContent=" "
							/>
							<Typography sx={{ marginLeft: 1, fontSize: 13 }} variant="span">
								Relieving
							</Typography>
						</Grid>
						<Grid item /* style={{ marginRight: "10px" }} */>
							<Badge
								sx={{
									"& .MuiBadge-badge": {
										backgroundColor: "#EDADF2",
										width: "11px",
										height: "11px",
										borderRadius: "50%",
									},
								}}
								variant="dot"
								badgeContent=" "
							/>
							<Typography sx={{ marginLeft: 1, fontSize: 13 }} variant="span">
								Aniversary
							</Typography>
						</Grid>
					</>
				) : (
					""
				)}

				{getViewVisible("drives") ? (
					<Grid item /* style={{ marginRight: "10px" }} */>
						<Badge
							sx={{
								"& .MuiBadge-badge": {
									backgroundColor: "#959EF3",
									width: "11px",
									height: "11px",
									borderRadius: "50%",
								},
							}}
							variant="dot"
							badgeContent=" "
						/>
						<Typography sx={{ marginLeft: 1, fontSize: 13 }} variant="span">
							Placement Drive
						</Typography>
					</Grid>
				) : (
					""
				)}

				{getViewVisible("specialDay") ? (
					<Grid item /* style={{ marginRight: "10px" }} */>
						<Badge
							sx={{
								"& .MuiBadge-badge": {
									backgroundColor: "#92DBBE",
									width: "11px",
									height: "11px",
									borderRadius: "50%",
								},
							}}
							variant="dot"
							badgeContent=" "
						/>
						<Typography sx={{ marginLeft: 1, fontSize: 13 }} variant="span">
							Special Day
						</Typography>
					</Grid>
				) : (
					""
				)}

				{getViewVisible("holiday") ? (
					<Grid item /* style={{ marginRight: "10px" }} */>
						<Badge
							sx={{
								"& .MuiBadge-badge": {
									backgroundColor: "#DADADA",
									width: "11px",
									height: "11px",
									borderRadius: "50%",
								},
							}}
							variant="dot"
							badgeContent=" "
						/>
						<Typography sx={{ marginLeft: 1, fontSize: 13 }} variant="span">
							Public Holiday
						</Typography>
					</Grid>
				) : (
					""
				)}

				{getViewVisible("employee") ? (
					<Grid item /* style={{ marginRight: "10px" }} */>
						<Badge
							sx={{
								"& .MuiBadge-badge": {
									backgroundColor: "#C9F4AA",
									width: "11px",
									height: "11px",
									borderRadius: "50%",
								},
							}}
							variant="dot"
							badgeContent=" "
						/>
						<Typography sx={{ marginLeft: 1, fontSize: 13 }} variant="span">
							Commitment Over
						</Typography>
					</Grid>
				) : (
					""
				)}
			</Grid>
			<FullCalendar
				customButtons={{
					myNextCustomButton: {
						text: ">",
						click: function () {
							const calendarEl = calendar.current;
							if (calendarEl) {
								const calendarApi = calendarEl.getApi();
								calendarApi.next();
								setDate(calendarApi.getDate());
							}
							const currentM = moment(
								calendarEl._calendarApi.view.currentStart,
							).format("YYYY-MM");
							setCalendarMonth(currentM);
						},
					},

					myPrevCustomButton: {
						text: "<",
						click: function () {
							const calendarEl = calendar.current;
							if (calendarEl) {
								const calendarApi = calendarEl.getApi();
								calendarApi.prev();
								setDate(calendarApi.getDate());
							}

							const currentM = moment(
								calendarEl._calendarApi.view.currentStart,
							).format("YYYY-MM");
							setCalendarMonth(currentM);
						},
					},

					// 	myCurrentCustomButton:{
					// 		text: 'Today',
					// 		click: function() {

					// 					setDate(new Date());
					// 					const currentM =	currentMonth();
					// 					setCalendarMonth(currentM);
					// 		},
					// },
				}}
				plugins={[dayGridPlugin]}
				ref={calendar}
				headerToolbar={{
					start: "myPrevCustomButton",
					center: "title",
					end: "myNextCustomButton",
				}}
				dayMaxEvents={true}
				initialDate={date}
				initialView="dayGridMonth"
				eventLimit={true}
				eventLimitText="plae"
				eventSources={setTheMultipleEvents()}
				eventContent={renderEventContent}
			/>
		</Grid>
	);
}

export default Calendar;
