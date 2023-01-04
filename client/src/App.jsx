import initRoutes from "./routes";
import { ToastContainer } from "react-toastify";
import GlobalStyles from "~/components/GlobalStyle";
import ConfirmModal from "~/components/modals/ConfirmModal";

import { AuthProvider } from '~/context/AuthProvider';
import { ConfirmModalProvider } from "~/context/ConfirmModalProvider";

function App() {
  return (
    <GlobalStyles>
      <div className="App">
        <AuthProvider>
          <ConfirmModalProvider>
            <ConfirmModal />
            {initRoutes()}
          </ConfirmModalProvider>
        </AuthProvider>
      </div>
      <ToastContainer />
    </GlobalStyles>
  );
}

export default App;
