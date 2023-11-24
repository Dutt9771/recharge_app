import Container from "@mui/material/Container";
import DashboardLayout from "../layouts/dashboard";
import "./Dashboard.css";


function DashboardApp() {

	return (
		<div className="view_employee view_asset employee">
			<Container maxWidth="xl">
				Hiii
			</Container>
		</div>
	);
}

const componentConfig = {
	component: DashboardApp,
	path: "/dashboard",
	public: false,
	layout: DashboardLayout,
	roles: ["admin"],
	group: null,
	sidebar: true,
};

export default componentConfig;
