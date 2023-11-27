import { ConfirmProvider } from "material-ui-confirm";
import "./App.css";
import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
import Router from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <ThemeConfig>
      {/* <ScrollToTop /> */}
      <GlobalStyles />
      {/* <BaseOptionChartStyle /> */}
      <ConfirmProvider
        defaultOptions={{
          confirmationButtonProps: {
            variant: "contained",
            color: "error",
          },
          confirmationText: "Yes",
          cancellationText: "Cancel",
          cancellationButtonProps: {
            variant: "contained",
          },
        }}
      >
        {/* <NiceModal.Provider> */}
        {/* <Router isAuthenticated={isAuthenticated} /> */}
        <Router />
        {/* </NiceModal.Provider> */}
      </ConfirmProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        theme="colored"
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        limit={3}
      />
    </ThemeConfig>
  );
}

export default App;
