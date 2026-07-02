import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AccountPage from "../pages/auth/AccountPage";
import AuthCallbackPage from "../pages/auth/AuthCallbackPage";
import AuthPage from "../pages/auth/AuthPage";
import HomePage from "../pages/HomePage";
import LessonCollectionPage from "../pages/resources/LessonCollectionPage";
import LessonDetailPage from "../pages/resources/LessonDetailPage";
import ResourcesIndexPage from "../pages/resources/ResourcesIndexPage";
import TopicOverviewPage from "../pages/resources/TopicOverviewPage";

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/resources" element={<ResourcesIndexPage />} />
        <Route path="/resources/:topicSlug" element={<TopicOverviewPage />} />
        <Route
          path="/resources/:topicSlug/:format"
          element={<LessonCollectionPage />}
        />
        <Route
          path="/resources/:topicSlug/:format/:lessonSlug"
          element={<LessonDetailPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
