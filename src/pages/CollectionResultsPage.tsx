import { Navigate, useParams } from "react-router-dom";
import ResultsPage from "./ResultsPage";
import { getCollection } from "@/lib/registry";

const CollectionResultsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const collection = getCollection(slug);
  if (!collection) return <Navigate to="/" replace />;
  return <ResultsPage collection={collection} />;
};

export default CollectionResultsPage;