import "./App.css";
import LoginForm from "./pages/login-page";
import LeftMenu from "./components/left-menu";
import RecordDashlets from "./pages/home-page"; 
import UserRecordView from "./pages/users-record-view";
import RecordView from "./pages/record-view";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TokenContext from "./contexts/token-context";
import GenericDataList from "@/pages/grid-list-page";
import ModulesList from "./pages/modules-list";


("@/pages/modules-list");

function App() {

  return (
    <TokenContext.Provider value="test token">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/HomePage"
            element={
              <LeftMenu>
                  <RecordDashlets />
              </LeftMenu>
            }
          />
          <Route
            path="/RecordDashlets"
            element={
              <LeftMenu>
                  <RecordDashlets />
              </LeftMenu>
            }
          />
          <Route
            path="/ModulesList"
            element={
              <LeftMenu>
                <ModulesList />
              </LeftMenu>
            }
          />
          <Route
            path="/List/:module"
            element={
              <LeftMenu>
                <GenericDataList />
              </LeftMenu>
            }
          />
          <Route path="/User/:id" element={<UserRecordView />} />
          <Route path="/User" element={<UserRecordView />} />
          <Route
            path="/:module/:id"
            element={
              <LeftMenu>
                <RecordView />
              </LeftMenu>
            }
          />
          <Route
            path="/:module"
            element={
              <LeftMenu>
                <RecordView />
              </LeftMenu>
            }
          />
        </Routes>
      </BrowserRouter>
    </TokenContext.Provider>
  );
}

export default App;
