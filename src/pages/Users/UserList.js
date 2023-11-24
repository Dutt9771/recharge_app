import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useConfirm } from "material-ui-confirm";
import { debounce } from "lodash";
import NiceModal from "@ebay/nice-modal-react";

import Scrollbar from "../../components/Scrollbar";
import DashboardLayout from "../../layouts/dashboard";
import Loader from "../../components/Loader";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import invertDirection from "../../utils/invertDirection";
import TableSortLabel from "@mui/material/TableSortLabel";

import {
  getUser,
  updateAccess,
  getUserCount,
  updateEmployeeRole,
} from "../../redux/user/userthunk";
import {
  setLimit,
  setCurrentPage,
  setSortBy,
  setOrderBy,
} from "../../redux/user/userSlice";
import { getUserRoles } from "../../redux/userRoles/userRolesthunk";
import CustomPagination from "../../components/Pagination";
import { getViewVisible, getEditVisible } from "../../utils/userPermission";
import ChangeEmployeeRoleModal from "./UserListComponents/ChangeEmployeeRoleModal";
import LocalStorage from "../../service/localStorage";
import {
  getUserPermissionById,
  getUserPermissionByRoll,
} from "../../redux/userPermission/userPermissionthunk";
import { encryption } from "../../utils/encodeString";

function UserList() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const navigate = useNavigate();

  // User Permission Use Effect : If user not has access to this module then redirect to dashboard
  useEffect(() => {
    if (!getViewVisible("userList")) {
      dispatch(
        getUser({ page: currentPage + 1, limit: limit, sortBy, orderBy })
      );
      navigate("/dashboard");
    }
  }, []);

  const getUserPermission = async (Id) => {
    try {
      const res = await dispatch(
        getUserPermissionByRoll({
          id: Id,
        })
      ).unwrap();
      LocalStorage.setItem(
        "userPermissions",
        encryption(JSON.stringify(res.data))
      );
    
    } catch (error) {}
  };
  useEffect(() => {
    let roleId = localStorage.getItem("roleId");
    getUserPermission(roleId);
  }, [dispatch]);

  const {
    data,
    totalRecords,
    currentPage,
    limit,
    status,
    totalPages,
    loading: userListLoading,
    isSearchQuery,
    sortBy,
    orderBy,
  } = useSelector((state) => state.user);

  const { data: roleData, loading: userRoleLoading } = useSelector(
    (state) => state.userRoles
  );

  const { totalCounts } = useSelector((state) => state.userCount);
  const [filterData, setFilterData] = useState(null);
  const [filterChips, setFilterChips] = useState([]);
  const formik = useFormik({
    initialValues: {
      search: "",
      roleId: "",
    },
    onSubmit: async (values) => {
      try {
        const roleId = roleData.filter((role) => {
          if (role.role == values.roleId) {
            return role.id;
          }
        });
        var searchParams = {};
        let Params = { ...values };
        searchParams.page = currentPage + 1;
        searchParams.limit = limit;
        searchParams.search = values.search;
        searchParams.roleId = roleId[0]?.id ? roleId[0].id : "";
        prepareChips(Params);
        setFilterData({ ...Params });
        dispatch(getUser(searchParams));
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  const {
    handleSubmit,
    setValues,
    getFieldProps,
    setFieldValue,
    values,
    handleChange,
    errors,
    touched,
    isSubmitting,
  } = formik;
  useEffect(() => {
    if (status === "idle") {
      dispatch(
        getUser({ page: currentPage + 1, limit: limit, sortBy, orderBy })
      );
    }
  }, [dispatch, limit, currentPage, status, sortBy, orderBy]);

  useEffect(() => {
    dispatch(getUser({ page: currentPage + 1, limit: limit }));
  }, []);

  useEffect(() => {
    getViewVisible("userRoles") && dispatch(getUserRoles());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getUserCount());
  }, [dispatch]);

  // useEffect(() => {
  // 	dispatch(getUserCount());
  // }, [dispatch]);
  // const handleDelete = async (id, title) => {
  // 	try {
  // 		await confirm({
  // 			description: `Are you sure you want to delete ${title}?`,
  // 		});
  // 		if (id) {
  // 			await dispatch(deleteuserById(id)).unwrap();
  // 		}
  // 		dispatch(getUser({ page: currentPage + 1, limit: limit }));
  // 	} catch (error) {
  // 		toast.error(error?.message);
  // 	}
  // };

  const prepareChips = (searchParams) => {
    let filters = { ...searchParams };
    let tempChips = [];

    for (const key in filters) {
      if (filters[key] && key === "search") {
        filters[key] = filters[key];
      }

      if (filters[key] && key === "roleId") {
        filters[key] = `User Role : ${filters[key]}`;
      }

      if (filters[key]) {
        tempChips = [...tempChips, { type: key, filter: filters[key] }];
      }
    }
    setFilterChips(tempChips);
  };

  const handleClear = () => {
    setValues({
      search: "",
      roleId: "",
    });
    handleSubmit();
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setCurrentPage({ page: newPage }));
  };

  const handleRemoveAccess = async (id) => {
    try {
      await confirm({
        description: `Are you sure you want to remove Access?`,
      });
      if (id) {
        await dispatch(updateAccess(id)).unwrap();
      }
      handleSubmit();
      dispatch(getUser({ page: currentPage + 1, limit: limit }));
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setCurrentPage({ page: 0 }));
    dispatch(setLimit({ limit: parseInt(event.target.value, 10) }));
  };
  const onDeleteChip = (value, length) => {
    let { type } = value;
    delete filterData[value.type];
    setFilterData({ ...filterData });
    setFieldValue(type, "");
    let updateChips = filterChips.filter((chip) => {
      return chip.type !== type;
    });
    setFilterChips([...updateChips]);
    dispatch(setCurrentPage({ page: 0 }));
    handleSubmit();
  };
  const handleSorting = (columnName) => {
    dispatch(setSortBy({ sortBy: columnName }));
    dispatch(
      setOrderBy({
        orderBy: invertDirection(sortBy === columnName, orderBy),
      })
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
          System User
          <Typography variant="body2">Total Records : {totalCounts}</Typography>
        </Typography>
      </Stack>

      <Card className="holiday-table-grid" mb={5}>
        <Container maxWidth="xl">
          <Paper>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={5} mt={3}>
                  <TextField
                    fullWidth
                    autoComplete="off"
                    label="Search by First Name/Last Name/Email"
                    name="search"
                    variant="outlined"
                    size="small"
                    value={values.search}
                    inputProps={{ maxLength: 64 }}
                    onChange={handleChange}
                    //onChange={handleInputChangeByDebounce}
                  />
                </Grid>
                <Grid item xs={5} mt={3}>
                  <FormControl size="small" sx={{ minWidth: 120 }} fullWidth>
                    {/*<InputLabel id="demo-simple-select-helper-label">
                                            User Role
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            name="roleId"
                                            value={values.roleId}
                                            label="User Role"
                                            size="small"
                                            fullWidth
                                            onChange={handleChange}
                                            error={Boolean(
                                                touched.roleId && errors.roleId
                                            )}
                                        >
                                            {roleData.length > 0 &&
                                                roleData.map((role, key) => (
                                                    <MenuItem
                                                        key={key}
                                                        value={role.role}
                                                    >
                                                        {role.role}
                                                    </MenuItem>
                                                ))}
                                        </Select>*/}

                    <Autocomplete
                      size="small"
                      fullWidth
                      disabled={getViewVisible("userRoles") === false}
                      options={roleData || []}
                      {...getFieldProps(`roleId`)}
                      value={
                        roleData.find((tech) => tech.role == values.roleId) ??
                        ""
                      }
                      getOptionLabel={(option) => option?.role || ""}
                      onChange={(event, newValue) => {
                        setFieldValue(`roleId`, newValue?.role || "");
                      }}
                      //onChange={handleRoleChange}
                      renderInput={(params) => (
                        <TextField {...params} label="User Role" />
                      )}
                      error={Boolean(touched.roleId && errors.roleId)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2} mt={0} mb={0}>
                  <Stack direction="row" justifyContent="flex-end" my={3}>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      loading={isSubmitting}
                    >
                      Search
                    </LoadingButton>
                    <Button
                      type="button"
                      variant="contained"
                      style={{ marginLeft: "10px" }}
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Card>
      <Stack
        style={{ marginBottom: "10px", marginTop: "10px" }}
        direction="row"
        alignItems="start"
      >
        {filterChips.map((chips, idx) => {
          return (
            <Chip
              label={chips.filter}
              color="primary"
              size="small"
              key={chips.filter}
              style={{ marginRight: "5px" }}
              variant="filled"
              onDelete={() => onDeleteChip(chips, filterChips.length)}
            />
          );
        })}
      </Stack>
      {filterChips.length > 0 ? (
        <Typography variant="body2" mb={1}>
          {totalRecords} {"records found"}{" "}
        </Typography>
      ) : (
        ""
      )}

      <Card>
        <CustomPagination
          totalPage={totalPages}
          totalCount={totalRecords}
          limit={limit}
          handleChangePage={handleChangePage}
          page={currentPage}
          rowsPerPageOptions={[10, 20, 40]}
          handleRowsPerPageChange={handleChangeRowsPerPage}
          //filter={isSearchQuery ? true : false}
        />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <TableSortLabel
                      active={sortBy === "firstName"}
                      direction={sortBy === "firstName" ? orderBy : "asc"}
                      onClick={() => handleSorting("firstName")}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="left">Role</TableCell>
                  <TableCell align="left">Email</TableCell>
                  <TableCell align="left">Employee Code</TableCell>
                  {getEditVisible("userList") && (
                    <TableCell align="right" style={{ width: "130px" }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              {userListLoading || userRoleLoading ? (
                <TableCell align="center" width="100%" colSpan={5}>
                  <Loader />
                </TableCell>
              ) : (
                <TableBody>
                  {Array.isArray(data) && data.length === 0 ? (
                    <TableRow>
                      <TableCell align="center" colSpan={6}>
                        No Record(s) Found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((user, idx) => (
                      <TableRow key={idx}>
                        <TableCell align="left">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell align="left">{user?.role?.role}</TableCell>
                        <TableCell align="left">
                          {user?.emails[0]?.email}
                        </TableCell>
                        <TableCell align="left">{user?.employeeId}</TableCell>
                        {getEditVisible("userList") && (
                          <TableCell align="right">
                            <div className="action-button">
                              <IconButton
                                style={{ padding: "5px" }}
                                onClick={async () => {
                                  await NiceModal.show(
                                    ChangeEmployeeRoleModal,
                                    {
                                      id: user.id,
                                      roleid: user?.role?.id,
                                      currentPage,
                                      limit,
                                    }
                                  );
                                }}
                              >
                                <EditIcon color="primary" />
                              </IconButton>
                              <IconButton
                                style={{ padding: "5px" }}
                                onClick={() => handleRemoveAccess(user.id)}
                              >
                                <CancelIcon color="error" />
                              </IconButton>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </Container>
  );
}

const componentConfig = {
  component: UserList,
  path: "/user-list",
  public: false,
  layout: DashboardLayout,
  group: "users",
  role: ["admin"],
  sidebar: true,
};

export default componentConfig;
