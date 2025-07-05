import { Routes, Route } from "react-router-dom";
import HRLayout from "./HRLayout";
// import JobSeekerLayout from "./layouts/JobSeekerLayout";
import OverViewPage from "./Admin/Pages/OverViewPage";
import JobsPage from "./Admin/Pages/JobsPage";
import ApplicantsPage from "./Admin/Pages/ApplicantsPage";
import PostJobs from "./Components/Jobs/PostJobs";
import EditJobs from "./Components/Jobs/EditJobs";
import ProfileSettings from "./Components/Settings/ProfileSetting";
import Profile from "./Admin/Pages/ProfilePage";
import JobseekerHome from "./JobSeeker/Pages/JobseekerHome";
import EmpReg from "./Auth/EmpReg";
import LogIn from "./Auth/Login";
import ResetPassword from "./Components/Settings/ResetPass";
import ConfirmPass from "./Components/Settings/ResetPassword.jsx";
import JSRegistration from "./Auth/JobseekerRegister.jsx";
import Jobs from "./JobSeeker/Jobs.jsx";
import JobSeekerProfilePage from "./JobSeeker/Pages/JobSeekerProfilePage";
import PieChart from "./Components/shared/chart1.jsx";
function App() {
  return (
    <Routes>
      <Route path="empreg" element={<EmpReg />} />
      <Route path="login" element={<LogIn />} />
      <Route path="/jobseeker/profile" element={<JobSeekerProfilePage />} />
      <Route path="Jobs-js" element={<Jobs />} />
      {/*--------------------------------------------------- */}
      <Route element={<HRLayout />}>
        <Route path="/overview" element={<OverViewPage />} />
        <Route path="/Applicants" element={<ApplicantsPage />} />
        <Route path="/PostJob" element={<PostJobs />} />
        <Route path="/edit-job/:jobId" element={<EditJobs />} />
        <Route path="/Jobs" element={<JobsPage />} />
        <Route path="/ProfileSettings" element={<ProfileSettings />} />
        <Route path="/Profile" element={<Profile />} />
      </Route>
      {/* ------------------------------------------------------ */}
      <Route path="/resetpass" element={<ResetPassword />} />
      <Route path="/reset-password" element={<ConfirmPass />} />
      <Route path="" element={<JobseekerHome />} />
      <Route path="jsreg" element={<JSRegistration />} />
      <Route path="pie" element={<PieChart />} />
    </Routes>
  );
}

export default App;
