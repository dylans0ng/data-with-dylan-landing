import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
