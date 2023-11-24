import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormControlLabel, Switch } from "@mui/material";
const ConfigForm = (props) =>{
    const {
        values,
        handleChange,
        setFieldValue,
        touched,
        errors,
        handleSubmit,
        getFieldProps,
        handleBlur,
        setValues,
        moduleName
      } = props;
    return(
        <Card pb={3}>
           <Container maxWidth="xl">
             <form  onSubmit={handleSubmit}>
             <h6 style = {{fontSize: "18px",fontWeight: "700", marginTop : "25px", textTransform : 'capitalize'}}> {moduleName} Config </h6>
               <Grid container spacing={3} style={{ marginBottom: "20px" }}>
              {
                moduleName === 'mail' && (
                  <>
                   <Grid item xs={6} mt={3}>
               <Stack className="checkbox-part">
											<FormControlLabel
												control={
													<Switch
													   checked={values.enableMailCommunication}
														 onChange={handleChange}
														name="enableMailCommunication"
														inputProps={{ "data-cy": "chk-enableMailCommunication-item" }}
														size="small"
													/>
												}
												label="Enable MailCommunication"
											/>
										</Stack>
                  </Grid>
                  <Grid item xs={6} mt={3}>
                   <TextField
                     fullWidth
                     label="Default SenderEmail"
                     name="defaultSenderEmail"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.defaultSenderEmail || ""}
                     onChange={handleChange}
                     error={Boolean(touched.defaultSenderEmail && errors.defaultSenderEmail)}
                     helperText={touched.defaultSenderEmail && errors.defaultSenderEmail}
                   />
                 </Grid>
                  </>
                )
              }
              
              
                 <Grid item xs={6} mt={3}>
                   <TextField
                     fullWidth
                     label="Client Email"
                     name="clientEmail"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.clientEmail || ""}
                     onChange={handleChange}
                     error={Boolean(touched.clientEmail && errors.clientEmail)}
                     helperText={touched.clientEmail && errors.clientEmail}
                   />
                 </Grid>
                 <Grid item xs={6} mt={3}>
                   <TextField
                     fullWidth
                     label="Client Id"
                     name="clientId"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.clientId  || ""}
                     onChange={handleChange}
                     error={Boolean(touched.clientId && errors.clientId)}
                     helperText={touched.clientId && errors.clientId}
                   />
                 </Grid>
               </Grid>
               <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Client SecretKey"
                     name="clientSecretId"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.clientSecretId  || ""}
                     onChange={handleChange}
                     error={Boolean(
                       touched.clientSecretId && errors.clientSecretId
                     )}
                     helperText={touched.clientSecretId && errors.clientSecretId}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Refresh Token"
                     name="refreshToken"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.refreshToken  || ""}
                     onChange={handleChange}
                     error={Boolean(touched.refreshToken && errors.refreshToken)}
                     helperText={touched.refreshToken && errors.refreshToken}
                   />
                 </Grid>
               </Grid>
               <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="Redirect Url"
                     name="redirectUrl"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.redirectUrl  || ""}
                     onChange={handleChange}
                     error={Boolean(touched.redirectUrl && errors.redirectUrl)}
                     helperText={touched.redirectUrl && errors.redirectUrl}
                   />
                 </Grid>
                { moduleName === 'drives' && ( <Grid item xs={6}>
                 <TextField
                     fullWidth
                     label="Checklist FolderKey"
                     name="checklistFolderKey"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.checklistFolderKey  || ""}
                     onChange={handleChange}
                     error={Boolean(
                       touched.checklistFolderKey && errors.checklistFolderKey
                     )}
                     helperText={touched.checklistFolderKey && errors.checklistFolderKey}
                   />
               </Grid>)}
               </Grid>
              { moduleName === 'drives' && (
                <>
                <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="PAN FolderKey"
                     name="panFolderKey"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                    //  InputLabelProps={{shrink: true}}
                     autoComplete="off"
                     value={values.panFolderKey  || ""}
                     onChange={handleChange}
                     error={Boolean(
                       touched.panFolderKey && errors.panFolderKey
                     )}
                     helperText={touched.panFolderKey && errors.panFolderKey}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="EmployeeResumes FolderKey"
                     name="employeeResumesFolderKey"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.employeeResumesFolderKey  || ""}
                     onChange={handleChange}
                     error={Boolean(touched.employeeResumesFolderKey && errors.employeeResumesFolderKey)}
                     helperText={touched.employeeResumesFolderKey && errors.employeeResumesFolderKey}
                   />
                 </Grid>
               </Grid>
               <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="CandidateResumes FolderKey"
                     name="candidateResumesFolderKey"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.candidateResumesFolderKey  || ""}
                     onChange={handleChange}
                     error={Boolean(
                       touched.candidateResumesFolderKey && errors.candidateResumesFolderKey
                     )}
                     helperText={touched.candidateResumesFolderKey && errors.candidateResumesFolderKey}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="InternResumes FolderKey"
                     name="internResumesFolderKey"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.internResumesFolderKey  || ""}
                     onChange={handleChange}
                     error={Boolean(touched.internResumesFolderKey && errors.internResumesFolderKey)}
                     helperText={touched.internResumesFolderKey && errors.internResumesFolderKey}
                   />
                 </Grid>
               </Grid>
               <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="ProjectDefination FolderKey"
                     name="projectDefinationFolderKey"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.projectDefinationFolderKey  || ""}
                     onChange={handleChange}
                     error={Boolean(
                       touched.projectDefinationFolderKey && errors.projectDefinationFolderKey
                     )}
                     helperText={touched.projectDefinationFolderKey && errors.projectDefinationFolderKey}
                   />
                 </Grid>
                 <Grid item xs={6}>
                   <TextField
                     fullWidth
                     label="AdharCard FolderKey"
                     name="adharFolderKey"
                     variant="outlined"
                     size="small"
                     // inputProps={{ maxLength: 64 }}
                     autoComplete="off"
                     value={values.adharFolderKey  || ""}
                     onChange={handleChange}
                     error={Boolean(
                       touched.adharFolderKey && errors.adharFolderKey
                     )}
                     helperText={touched.adharFolderKey && errors.adharFolderKey}
                   />
                 </Grid>
                 </Grid>
                 </>
                 )}
               <Stack
                 direction="row"
                 alignItems="center"
                 justifyContent="flex-end"
                 mb={3}
               >
                 <Button variant="contained" type="submit" >
                   Save
                 </Button>
               </Stack>
             </form>
           </Container>
         </Card>)
}

export default ConfigForm;