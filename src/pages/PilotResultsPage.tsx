import { Navigate, useParams } from "react-router-dom";
import ResultsPage from "./ResultsPage";
import { getPilot } from "@/lib/pilots";

const PilotResultsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const pilot = getPilot(slug);
  if (!pilot) return <Navigate to="/" replace />;
  return <ResultsPage pilot={pilot} />;
};

export default PilotResultsPage;
