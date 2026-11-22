import { Navigate, Route, Routes, useParams } from "react-router-dom";
import DocsPage from "./features/docs/DocsPage";

function LegacyDocsRedirect() {
  const { "*": rest = "" } = useParams();
  return <Navigate to={rest ? `/${rest}` : "/"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/docs/*" element={<LegacyDocsRedirect />} />
      <Route path="/docs" element={<Navigate to="/" replace />} />
      <Route path="/" element={<DocsPage />} />
      <Route path="/:slug" element={<DocsPage />} />
      <Route path="/:slug/:mode" element={<DocsPage />} />
      <Route path="/:slug/:mode/:pageId" element={<DocsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
