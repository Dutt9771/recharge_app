import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "./Dashboard.css";
import {
	indianDateFormat,
	getYearDiff,
	DateFormat,
	tomorrowDate,
	getOneWeekBeforeDate,
	getTwoWeekBeforeDate,
	dayAfterTomorrowDate,
	firstDayOfWeek,
	lastDayOfWeek,
	dateFormat,
} from "../utils/dateFormat";
import { getViewVisible, getEditVisible } from "../utils/userPermission";

import moment from "moment";

const NewsFeed = (data) => {
	const [commitment, setCommitment] = useState();
	const [commitmentOver, setCommitmentOver] = useState();
	const {
		todayBirthday,
		employeeAniversary,
		employeeJoinignList,
		employeeRelivingList,
		futureSpecialDay,
		futureJoining,
		futureReliving,
		employeeCommitmentOver,
		employeeProductionList
	} = data;

	useEffect(() => {
		let d = employeeCommitmentOver?.map(obj => {
			return {...obj, CommitmentOverDate : new Date(obj.CommitmentOverDate)};
		})
		
		
		
		const sortedAsc = d?.sort(
			(objA, objB) => Number(objA.CommitmentOverDate) - Number(objB.CommitmentOverDate),
			);
			
			let d2  = sortedAsc?.map(obj => {
				return {...obj, CommitmentOverDate : dateFormat(obj.CommitmentOverDate)};
			})
				
		// employeeCommitmentOver?.map((employee) => {
		// 	if(employee?.workDetails?.commitmentStartDate && employee?.workDetails?.bondDuration)
		// 	{
		// 		let newDate = new Date(employee?.workDetails?.commitmentStartDate)
		// 		let n = Number(employee?.workDetails?.bondDuration)
		// 		if(Number.isInteger(n) == false)
		// 		{
		// 			let a = employee?.workDetails?.bondDuration.split(".");
		// 			if(a[0] == "1")
		// 			{
		// 				newDate.setMonth(newDate.getMonth() + 12)
		// 			}
		// 			newDate.setMonth(newDate.getMonth() + Number(a[1]))
		// 		}
		// 		else {
		// 			newDate.setFullYear(newDate.getFullYear() + n);
		// 		}
		// 		if(newDate.setHours(0,0,0,0) == new Date().setHours(0,0,0,0))
		// 		{
		// 			d = [...d, {id: employee?.id, commitDate: newDate, firstName: employee?.firstName, lastName: employee?.lastName}]
		// 		}
		// 	}
		// })
		 setCommitmentOver(d2)
	}, [employeeCommitmentOver]);
	const ordinal_suffix_of = (i) => {
		var j = i % 10,
			k = i % 100;
		if (j === 1 && k !== 11) {
			return i + "st";
		}
		if (j === 2 && k !== 12) {
			return i + "nd";
		}
		if (j === 3 && k !== 13) {
			return i + "rd";
		}
		return i + "th";
	};

	//Get Today Birthday List
	let birthdayList = Array.isArray(todayBirthday)
		? todayBirthday
				.map(function (d, idx) {
					var today = moment(new Date()).format("DD-MM");
					var birthDate = moment(d.dateOfBirth).format("DD-MM");

					if (birthDate === today) {
						return { firstName: d.firstName, lastName: d.lastName };
					}
				})
				.filter(Boolean)
		: "";
	//Get Today Work Aniversary List
	let workAniversaryList = Array.isArray(employeeAniversary)
		? employeeAniversary
				.map(function (d, idx) {
					var years = moment().diff(
						moment(d.workDetails?.productionDate).format("YYYY-MM-DD"),
						"years",
						false,
					);
					var today = moment(new Date()).format("DD-MM");
					var aniversaryDate = moment(d.workDetails?.productionDate).format(
						"DD-MM",
					);

					if (today === aniversaryDate) {
						return {
							firstName: d.firstName,
							lastName: d.lastName,
							aniversary: `${ordinal_suffix_of(years)} Anniversary`,
						};
						// 	<div className="span-flex">
						// 		{} {} ( )
						// 	</div>
						// );
					}
				})
				.filter(Boolean)
		: "";
//Get Tommorow Work Aniversary List
let workAniversaryListTomorrow = Array.isArray(employeeAniversary)
? employeeAniversary
		.map(function (d, idx) {
			var years = moment().diff(
				moment(d.workDetails?.productionDate).format("YYYY-MM-DD"),
				"years",
				false,
			);
			var tomorrow = moment(new Date()).add(1, "days").format("DD-MM");
			var aniversaryDate = moment(d.workDetails?.productionDate).format(
				"DD-MM",
			);
			if (tomorrow === aniversaryDate) {
				return {
					firstName: d.firstName,
					lastName: d.lastName,
					aniversary: `${ordinal_suffix_of(years+1)} Anniversary`,
				};
				// 	<div className="span-flex">
				// 		{} {} ( )
				// 	</div>
				// );
			}
		})
		.filter(Boolean)
: "";
	//Get Today Joining List

	let todayJoiningList = Array.isArray(employeeJoinignList)
		? employeeJoinignList
				.map((employee) => {
					const JoinDate = DateFormat(employee.workDetails?.joiningDate);
					const TodayDate = DateFormat(new Date());

					if (moment(JoinDate).isSame(TodayDate)) {
						return `${employee.firstName} ${employee.lastName}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

	let dayBeforeJoiningList = Array.isArray(futureJoining)
		? futureJoining
				.map((employee) => {
					const JoinDate = DateFormat(employee.workDetails?.joiningDate);
					const dayBeforeDate = DateFormat(tomorrowDate());

					if (moment(JoinDate).isSame(dayBeforeDate)) {
						return `${employee.firstName} ${employee.lastName}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

		let thisWeekJoiningList = Array.isArray(futureJoining)?
		futureJoining
		.map((employee) => {
			const JoinDate = DateFormat(employee.workDetails?.joiningDate);
			const  firstDay= DateFormat(firstDayOfWeek());
			const lastDay = DateFormat(lastDayOfWeek());

			if (
				moment(JoinDate).isBetween(
					firstDay,
					lastDay,
					undefined,
					"(]",
				)
			) {
				return `${employee.firstName} ${employee.lastName}`;
			}
		})
		.filter((notUndefined) => notUndefined !== undefined)
: "";

	let oneWeekBeforeJoiningList = Array.isArray(futureJoining)
		? futureJoining
				.map((employee) => {
					const JoinDate = DateFormat(employee.workDetails?.joiningDate);
					// const dayBeforeDate = DateFormat(dayAfterTomorrowDate());
					// const oneWeekBeforeDate = DateFormat(getOneWeekBeforeDate());
					// const RelievingDate = DateFormat(employee.workDetails?.relievingDate);
					const lastDayCurrentWeek = lastDayOfWeek();
					const dayBeforeDate = DateFormat(moment(lastDayCurrentWeek).add(0, 'days'));
					const oneWeekBeforeDate = DateFormat(moment(lastDayCurrentWeek).add(7, 'days'));
					if (
						moment(JoinDate).isBetween(
							dayBeforeDate,
							oneWeekBeforeDate,
							undefined,
							"[]",
						)
					) {
						return `${employee.firstName} ${employee.lastName}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

	let twoWeekBeforeJoiningList = Array.isArray(futureJoining)
		? futureJoining
				.map((employee) => {
					const JoinDate = DateFormat(employee.workDetails?.joiningDate);
					// const oneWeekBeforeDate = DateFormat(getOneWeekBeforeDate());
					// const twoWeekBeforeDate = DateFormat(getTwoWeekBeforeDate());
					// const RelievingDate = DateFormat(employee.workDetails?.relievingDate);
			const lastDayCurrentWeek = lastDayOfWeek();
			// const firstDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(0, 'days'));
			const lastDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(7, 'days'));
			const oneWeekBeforeDate = DateFormat(moment(lastDayNextWeek).add(0, 'days'));
			const twoWeekBeforeDate = DateFormat(moment(lastDayNextWeek).add(7, 'days'));
					if (
						moment(JoinDate).isBetween(
							oneWeekBeforeDate,
							twoWeekBeforeDate,
							undefined,
							"(]",
						)
					) {
						return `${employee.firstName} ${employee.lastName}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

	let relivingList = Array.isArray(futureReliving)
		? futureReliving
				.map((employee) => {
					const RelievingDate = DateFormat(employee.workDetails?.relievingDate);
					const TodayDate = DateFormat(new Date());

					if (moment(RelievingDate).isSame(TodayDate)) {
						return `${employee.firstName} ${employee.lastName}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

	let dayBeforeRelivingList = Array.isArray(futureReliving)
		? futureReliving
				.map((employee) => {
					const RelievingDate = DateFormat(employee.workDetails?.relievingDate);
					const dayBeforeDate = DateFormat(tomorrowDate());

					if (moment(RelievingDate).isSame(dayBeforeDate)) {
						return `${employee.firstName} ${employee.lastName}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

		let thisWeekRelivingList = Array.isArray(futureReliving)?
		futureReliving
		.map((employee) => {
			const RelievingDate = DateFormat(employee.workDetails?.relievingDate);
			const  firstDay= DateFormat(firstDayOfWeek());
			const lastDay = DateFormat(lastDayOfWeek());

			if (
				moment(RelievingDate).isBetween(
					firstDay,
					lastDay,
					undefined,
					"(]",
				)
			) {
				return `${employee.firstName} ${employee.lastName}`;
			}
		})
		.filter((notUndefined) => notUndefined !== undefined)
: "";
	// let oneWeekBeforeRelivingList = Array.isArray(futureReliving)
	// 	? futureReliving
	// 			.map((employee) => {
	// 				const RelievingDate = DateFormat(employee.workDetails?.relievingDate);
	// 				const dayBeforeDate = DateFormat(dayAfterTomorrowDate());
	// 				const oneWeekBeforeDate = DateFormat(getOneWeekBeforeDate());

	// 				if (
	// 					moment(RelievingDate).isBetween(
	// 						dayBeforeDate,
	// 						oneWeekBeforeDate,
	// 						undefined,
	// 						"(]",
	// 					)
	// 				) {
	// 					return `${employee.firstName} ${employee.lastName}`;
	// 				}
	// 			})
	// 			.filter((notUndefined) => notUndefined !== undefined)
	// 	: "";


		let oneWeekBeforeRelivingList = Array.isArray(futureReliving)?
		futureReliving
		.map((employee) => {
			const RelievingDate = DateFormat(employee.workDetails?.relievingDate);
			const lastDayCurrentWeek = lastDayOfWeek();
			const firstDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(0, 'days'));
			const lastDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(7, 'days'));
	
			if (
				moment(RelievingDate).isBetween(
					firstDayNextWeek,
					lastDayNextWeek,
					undefined,
					"(]",
				)
			) {
				return `${employee.firstName} ${employee.lastName}`;
			}
		})
		.filter((notUndefined) => notUndefined !== undefined)
	: "";

	let twoWeekBeforeRelivingList = Array.isArray(futureReliving)?
		futureReliving
		.map((employee) => {
			const RelievingDate = DateFormat(employee.workDetails?.relievingDate);
			const lastDayCurrentWeek = lastDayOfWeek();
			// const firstDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(0, 'days'));
			const lastDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(7, 'days'));
			const firstDayTwoWeeksLater = DateFormat(moment(lastDayNextWeek).add(0, 'days'));
			const lastDayTwoWeeksLater = DateFormat(moment(lastDayNextWeek).add(7, 'days'));

	
			if (
				moment(RelievingDate).isBetween(
					firstDayTwoWeeksLater,
					lastDayTwoWeeksLater,
					undefined,
					"(]",
				)
			) {
				return `${employee.firstName} ${employee.lastName}`;
			}
		})
		.filter((notUndefined) => notUndefined !== undefined)
	: "";
	// let twoWeekBeforeRelivingList = Array.isArray(futureReliving)
	// 	? futureReliving
	// 			.map((employee) => {
	// 				const RelievingDate = DateFormat(employee.workDetails?.relievingDate);
	// 				const oneWeekBeforeDate = DateFormat(getOneWeekBeforeDate());
	// 				const twoWeekBeforeDate = DateFormat(getTwoWeekBeforeDate());

	// 				if (
	// 					moment(RelievingDate).isBetween(
	// 						oneWeekBeforeDate,
	// 						twoWeekBeforeDate,
	// 						undefined,
	// 						"(]",
	// 					)
	// 				) {
	// 					return `${employee.firstName} ${employee.lastName}`;
	// 				}
	// 			})
	// 			.filter((notUndefined) => notUndefined !== undefined)
	// 	: "";

	let specialDay = Array.isArray(futureSpecialDay)
		? futureSpecialDay
				.map((specialDay) => {
					const SDate = DateFormat(specialDay?.startDate);
					const TodayDate = DateFormat(new Date());

					if (moment(SDate).isSame(TodayDate)) {
						return `${specialDay.title}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

	let dayBeforeSpecialDay = Array.isArray(futureSpecialDay)
		? futureSpecialDay
				.map((specialDay) => {
					const SDate = DateFormat(specialDay?.startDate);
					const dayBeforeDate = DateFormat(tomorrowDate());

					if (moment(SDate).isSame(dayBeforeDate)) {
						return `${specialDay.title}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

		let thisWeekSpecialDay = Array.isArray(futureSpecialDay)?
		futureSpecialDay
		.map((specialDay) => {
			const SDate = DateFormat(specialDay?.startDate);
			const  firstDay= DateFormat(firstDayOfWeek());
			const lastDay = DateFormat(lastDayOfWeek());

			if (
				moment(SDate).isBetween(
					firstDay,
					lastDay,
					undefined,
					"(]",
				)
			) {
				return `${specialDay.title}`;
			}
		})
		.filter((notUndefined) => notUndefined !== undefined)
: "";
	let oneWeekBeforeSpecialDay = Array.isArray(futureSpecialDay)
		? futureSpecialDay
				.map((specialDay) => {
					const SDate = DateFormat(specialDay?.startDate);
					// const dayBeforeDate = DateFormat(tomorrowDate());
					// const oneWeekBeforeDate = DateFormat(getOneWeekBeforeDate());
					const lastDayCurrentWeek = lastDayOfWeek();
			const firstDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(0, 'days'));
			const lastDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(7, 'days'));
// console.log(dayBeforeDate, oneWeekBeforeDate, SDate,"specialDay");
					if (
						moment(SDate).isBetween(
							firstDayNextWeek,
							lastDayNextWeek,
							undefined,
							"(]",
						)
					) {
						return `${specialDay.title}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

	let twoWeekBeforeSpecialDay = Array.isArray(futureSpecialDay)
		? futureSpecialDay
				.map((specialDay) => {
					const lastDayCurrentWeek = lastDayOfWeek();
			// const firstDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(0, 'days'));
			const lastDayNextWeek = DateFormat(moment(lastDayCurrentWeek).add(7, 'days'));
			const oneWeekBeforeDate = DateFormat(moment(lastDayNextWeek).add(0, 'days'));
			const twoWeekBeforeDate = DateFormat(moment(lastDayNextWeek).add(7, 'days'));
					const SDate = DateFormat(specialDay?.startDate);
					// const oneWeekBeforeDate = DateFormat(getOneWeekBeforeDate());
					// const twoWeekBeforeDate = DateFormat(getTwoWeekBeforeDate());

					if (
						moment(SDate).isBetween(
							oneWeekBeforeDate,
							twoWeekBeforeDate,
							undefined,
							"(]",
						)
					) {
						return `${specialDay.title}`;
					}
				})
				.filter((notUndefined) => notUndefined !== undefined)
		: "";

		let commitmentData = Array.isArray(commitment) ? 
			commitment?.map((employee) => {
			if (employee.commitDate.setHours(0,0,0,0) < new Date(new Date().getTime() + (45 * 24 * 60 * 60 * 1000)).setHours(0,0,0,0))
			 {
				return `${employee.firstName} ${employee.lastName}`;
			}
		})
		.filter((notUndefined) => notUndefined !== undefined)
	: "";
		// console.log(DateFormat(firstDayOfWeek()),'pokjhgfd',DateFormat(lastDayOfWeek()));

	return (
		<>
			<Grid item xs={12}>
				<Card className="news">
					<Typography variant="h4">News Feed</Typography>
					{getViewVisible("employee") ? (
						<>
							{birthdayList?.length > 0 && (
								<div className="news_item">
									<div>
										<div style={{ display: "flex", alignItems: "center" }}>
											<img
												src="/assets/images/birthday.svg"
												style={{ width: "20px", height: "20px" }}
											/>
											<p>Today's Birthday:</p>
										</div>
										<span style={{ marginTop: "6px" }}>
											<div className="span-flex">
												{Array.isArray(birthdayList)
													? birthdayList
															.map((e) => e.firstName + " " + e.lastName)
															.join(", ")
													: ""}
											</div>
										</span>
									</div>
								</div>
							)}

							{workAniversaryList?.length > 0 && (
								<div className="news_item">
									<div>
										<div style={{ display: "flex", alignItems: "center" }}>
											<img
												src="/assets/images/aniversary.png"
												style={{ width: "20px", height: "20px" }}
											/>
											<p>Today's Anniversary:</p>
										</div>
										<span>
											{Array.isArray(workAniversaryList)
												? workAniversaryList.map((e) => {
														return (
															<div className="span-flex">
																{e.firstName +
																	" " +
																	e.lastName +
																	" (" +
																	e.aniversary +
																	")"}
															</div>
														);
												  })
												: ""}
										</span>
									</div>
								</div>
							)}

							{workAniversaryListTomorrow?.length > 0 && (
								<div className="news_item">
									<div>
										<div style={{ display: "flex", alignItems: "center" }}>
											<img
												src="/assets/images/aniversary.png"
												style={{ width: "20px", height: "20px" }}
											/>
											<p>Tomorrow's Anniversary: (Reminder)</p>
										</div>
										<span>
											{Array.isArray(workAniversaryListTomorrow)
												? workAniversaryListTomorrow.map((e) => {
														return (
															<div className="span-flex">
																{e.firstName +
																	" " +
																	e.lastName +
																	" (" +
																	e.aniversary +
																	")"}
															</div>
														);
												  })
												: ""}
										</span>
									</div>
								</div>
							)}
							{
								todayJoiningList?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Joining: (Today)</p>
										</div>
										<span>
											{Array.isArray(todayJoiningList)
												? todayJoiningList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{
								dayBeforeJoiningList?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Joining: (Tomorrow)</p>
										</div>
										<span>
											{Array.isArray(dayBeforeJoiningList)
												? dayBeforeJoiningList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{thisWeekJoiningList?.length > 0 &&thisWeekJoiningList.filter((oldObj) => ![...todayJoiningList,...dayBeforeJoiningList].some((newObj) => `${newObj}` === `${oldObj}`)).length > 0&& (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Joining: (This Week)</p>
										</div>
										<span>
											{Array.isArray(thisWeekJoiningList)
												? thisWeekJoiningList.filter((oldObj) => ![...todayJoiningList,...dayBeforeJoiningList].some((newObj) => `${newObj}` === `${oldObj}`)).map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)}
							{
								oneWeekBeforeJoiningList?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Joining: (In 1 Week)</p>
										</div>
										<span>
											{Array.isArray(oneWeekBeforeJoiningList)
												? oneWeekBeforeJoiningList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{
								twoWeekBeforeJoiningList?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Joining: (In 2 Week)</p>
										</div>
										<span>
											{Array.isArray(twoWeekBeforeJoiningList)
												? twoWeekBeforeJoiningList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}


{
								relivingList?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Relieving: (Today)</p>
										</div>
										<span>
											{Array.isArray(relivingList)
												? relivingList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{
								dayBeforeRelivingList?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Relieving: (Tomorrow)</p>
										</div>
										<span>
											{Array.isArray(dayBeforeRelivingList)
												? dayBeforeRelivingList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{/* {console.log(thisWeekRelivingList,"uuuuuuuuu")} */}
							{thisWeekRelivingList.length > 0 && thisWeekRelivingList.filter((oldObj) => ![...relivingList,...dayBeforeRelivingList].some((newObj) => `${newObj}` === `${oldObj}`)).length > 0 &&(<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Relieving: (This Week)</p>
										</div>
										<span>
											{Array.isArray(thisWeekRelivingList)
												? thisWeekRelivingList.filter((oldObj) => ![...relivingList,...dayBeforeRelivingList].some((newObj) => `${newObj}` === `${oldObj}`)).map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)}
							{
								oneWeekBeforeRelivingList?.length > 0&&oneWeekBeforeRelivingList?.filter((oldObj) => !thisWeekRelivingList.some((newObj) =>`${newObj}` === `${oldObj}`)).length>0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Relieving: (In 1 Week)</p>
										</div>
										<span>
											{Array.isArray(oneWeekBeforeRelivingList)
												? oneWeekBeforeRelivingList.filter((oldObj) => !thisWeekRelivingList.some((newObj) =>`${newObj}` === `${oldObj}`)).map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{
								twoWeekBeforeRelivingList?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Relieving: (In 2 Week)</p>
										</div>
										<span>
											{Array.isArray(twoWeekBeforeRelivingList)
												? twoWeekBeforeRelivingList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{/* {
								commitmentData?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Commitment Over</p>
										</div>

										<span>
											{Array.isArray(commitmentData)
												? commitmentData.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							} */}
							{
								commitmentOver?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Commitment Over</p>
										</div>

										<span>
											{Array.isArray(commitmentOver)
												? commitmentOver?.map((e) => {
														return (
															<div className="span-flex">{`${e.firstName} ${e.lastName} (${(e?.CommitmentOverDate)})`}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							

							{
								employeeProductionList?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p>Production</p>
										</div>

										<span>
											{Array.isArray(employeeProductionList)
												? employeeProductionList.map((e) => {
														return (
															<div className="span-flex">{`${e.firstName} ${e.lastName} (${(dateFormat(e.workDetails?.productionDate))})`}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{/* {(todayJoiningList?.length > 0 ||
								dayBeforeJoiningList?.length > 0 ||
								oneWeekBeforeJoiningList?.length > 0 ||
								twoWeekBeforeJoiningList?.length > 0) && (
								<div className="news_item">
									<div>
										<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Production:</p>
										</div>
										<span>
											{Array.isArray(todayJoiningList)
												? todayJoiningList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
											{Array.isArray(dayBeforeJoiningList)
												? dayBeforeJoiningList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
											{Array.isArray(oneWeekBeforeJoiningList)
												? oneWeekBeforeJoiningList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
											{Array.isArray(twoWeekBeforeJoiningList)
												? twoWeekBeforeJoiningList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
									</div>
								</div>
							)} */}

							{/* {(relivingList?.length > 0 ||
								dayBeforeRelivingList?.length > 0 ||
								oneWeekBeforeRelivingList?.length > 0 ||
								twoWeekBeforeRelivingList?.length > 0) && (
								<div className="news_item">
									<div>
										<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Relieving:</p>
										</div>
										<span>
											{Array.isArray(relivingList)
												? relivingList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
											{Array.isArray(dayBeforeRelivingList)
												? dayBeforeRelivingList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
											{Array.isArray(oneWeekBeforeRelivingList)
												? oneWeekBeforeRelivingList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
											{Array.isArray(twoWeekBeforeRelivingList)
												? twoWeekBeforeRelivingList.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
									</div>
								</div>
							)} */}


{
								specialDay?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Special Day: (Today)</p>
										</div>
										<span>
											{Array.isArray(specialDay)
												? specialDay.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{
								dayBeforeSpecialDay?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Special Day: (Tomorrow)</p>
										</div>
										<span>
											{Array.isArray(dayBeforeSpecialDay)
												? dayBeforeSpecialDay.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{thisWeekSpecialDay?.length > 0 &&thisWeekSpecialDay.filter((oldObj) => ![...specialDay,...dayBeforeSpecialDay].some((newObj) => `${newObj}` === `${oldObj}`)).length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Special Day: (This Week)</p>
										</div>
										<span>
											{Array.isArray(thisWeekSpecialDay)
												? thisWeekSpecialDay.filter((oldObj) => ![...specialDay,...dayBeforeSpecialDay].some((newObj) => `${newObj}` === `${oldObj}`)).map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{
								oneWeekBeforeSpecialDay?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Special Day: (In 1 Week)</p>
										</div>
										<span>
											{Array.isArray(oneWeekBeforeSpecialDay)
												? oneWeekBeforeSpecialDay.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}
							{
								twoWeekBeforeSpecialDay?.length > 0 && (<div className="news_item">
									<div style={{ display: "flex", alignItems: "center" }}>
											<img src="/assets/images/cm.svg" />
											<p> Special Day: (In 2 Week)</p>
										</div>
										<span>
											{Array.isArray(twoWeekBeforeSpecialDay)
												? twoWeekBeforeSpecialDay.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
								</div>)
							}





							{/* {(specialDay?.length > 0 ||
								dayBeforeSpecialDay?.length > 0 ||
								oneWeekBeforeSpecialDay?.length > 0 ||
								twoWeekBeforeSpecialDay?.length > 0) && (
								<div className="news_item">
									<div>
										<div style={{ display: "flex", alignItems: "center" }}>
											<img
												src="/assets/images/aniversary.png"
												style={{ width: "20px", height: "20px" }}
											/>
											<p> Special Day:</p>
										</div>
										<span>
											{Array.isArray(specialDay)
												? specialDay.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
											{Array.isArray(dayBeforeSpecialDay)
												? dayBeforeSpecialDay.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
											{Array.isArray(oneWeekBeforeSpecialDay)
												? oneWeekBeforeSpecialDay.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
											{Array.isArray(twoWeekBeforeSpecialDay)
												? twoWeekBeforeSpecialDay.map((e) => {
														return (
															<div className="span-flex">{`${e} `}</div>
														);
												  })
												: ""}
										</span>
									</div>
								</div>
							)} */}
						</>
					) : (
						""
					)}
				</Card>
			</Grid>
		</>
	);
};

export default NewsFeed;
