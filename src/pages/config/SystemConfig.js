import DashboardLayout from "../../layouts/dashboard";
import React, { useEffect ,useState} from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import systemConfigSchema from "../../validations/systemConfigSchema";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import {
  getEmailConfig,
  updateEmailConfig,
} from "../../redux/systemConfig/thunk";
// import {
// 	getViewVisible,
// 	getAddVisible,
// 	getEditVisible,
// 	getDeleteVisible,
// } from "../../../utils/userPermission";
import ConfigForm from "./SystemconfigComp/ConfigForm"
const SystemConfig = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const dispatch = useDispatch();

  	const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
	};
let moduleList = ["drives","meet","inbox", "mail"]
  const formik = useFormik({
    initialValues: {
      clientEmail: "",
      clientId: "",
      clientSecretId: "",
      refreshToken: "",
      redirectUrl: "",
      ...( moduleList[tabValue] === "drives" ?
      {adharFolderKey: "",
      checklistFolderKey: "",
      panFolderKey: "",
      employeeResumesFolderKey: "",
      candidateResumesFolderKey: "",
      internResumesFolderKey: "",
      projectDefinationFolderKey: "" } : {} ),
      ...( moduleList[tabValue] === "mail" ?
      {enableMailCommunication : false,
       defaultSenderEmail : ""
    } : {} )
    },
    validationSchema: systemConfigSchema(moduleList[tabValue]) ,
    onSubmit: async (values, { resetForm }, isSubmitting) => {
      let newValue = {...values,enableMailCommunication : values.enableMailCommunication ? "1" : "0"}
      let data = await dispatch(updateEmailConfig({module_type : moduleList[tabValue],value : moduleList[tabValue] === "mail" ? newValue : values})).unwrap()
    
    },
  });

  const {
    values,
    handleChange,
    touched,
    errors,
    handleSubmit,
    getFieldProps,
    handleBlur,
    setValues,
    setFieldValue,
  } = formik;

  useEffect(async () => {
    let data = await dispatch(getEmailConfig(moduleList[tabValue])).unwrap();
 
    if (Object.keys(data).length != 0) {
      let newValue = {
        clientEmail: data?.clientEmail || "",
        clientId: data?.clientId || "",
        clientSecretId: data?.clientSecretId || "",
        redirectUrl: data?.redirectUrl || "",
        refreshToken: data?.refreshToken || "",
       ...( moduleList[tabValue] === "drives" ?
        {adharFolderKey: data?.adharFolderKey ||  "",
        checklistFolderKey: data?.checklistFolderKey || "",
        panFolderKey:  data?.panFolderKey || "",
        employeeResumesFolderKey: data?.employeeResumesFolderKey ||"",
        candidateResumesFolderKey:data?.candidateResumesFolderKey || "",
        internResumesFolderKey: data?.internResumesFolderKey ||"",
        projectDefinationFolderKey:data?.projectDefinationFolderKey || "" }  : {}),
        ...( moduleList[tabValue] === "mail" ?
        {enableMailCommunication : data?.enableMailCommunication === "1" ? true : false || false,
         defaultSenderEmail : data?.defaultSenderEmail || ""
      } : {} )
      }
    
      setValues(newValue)
    }

  }, [tabValue]);

  	function a11yProps(index) {
		return {
			id: `vertical-tab-${index}`,
			"aria-controls": `vertical-tabpanel-${index}`,
		};
	}

  return (
		<Container maxWidth="xl">
			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				mb={3}
			>
				<Typography variant="h4" gutterBottom>
					System Config
				</Typography>
			</Stack>
			<Card sx={{ maxWidth: { xs: 500, sm: 900 }, minWidth: "100%" }}>
				{/* <Card style={{minWidth: "100%"}}> */}
				<Card style={{ minWidth: "100%", width: "100%" }}>
					<TabContext tabValue={tabValue}>
						<Box sx={{ bgcolor: "#f4f6f8"}}>
							<Tabs
								value={tabValue}
								onChange={handleTabChange}
								variant="scrollable"
								scrollButtons="auto"
								aria-label="scrollable auto tabs example"
							>
								<Tab label="Google Drive" {...a11yProps(0)}  />
								<Tab label="Google Meet" {...a11yProps(1)}  />
                <Tab label="Inbox" {...a11yProps(2)}  />
								<Tab label="Mail" {...a11yProps(3)}  />
							</Tabs>
						</Box>

							<ConfigForm 
               values={values}
               handleChange={handleChange}
               setFieldValue = {setFieldValue}
               touched = {touched}
               errors = {errors}
               handleSubmit = {handleSubmit}
               getFieldProps = {getFieldProps}
               handleBlur = {handleBlur}
               setValues = {setValues}
               moduleName = {moduleList[tabValue]}
              />
          </TabContext> 
				</Card>
			</Card>
		</Container>
  );
};
const componentConfig = {
  component: SystemConfig,
  path: "/system-config",
  public: false,
  layout: DashboardLayout,
  group: "users",
  sidebar: true,
  role: ["admin"],
};

export default componentConfig;
