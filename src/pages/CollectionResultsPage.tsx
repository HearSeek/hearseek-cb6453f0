import { Navigate, useLocation, useParams } from "react-router-dom";
import ResultsPage from "./ResultsPage";
import { getCollection } from "@/lib/registry";

const CollectionResultsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const collection = getCollection(slug);
  if (!collection) return <Navigate to="/" replace />;
  if (slug !== collection.key)
    return <Navigate to={`/collections/${collection.key}/results${location.search}`} replace />;
  return <ResultsPage collection={collection} />;
};

export default CollectionResultsPage;