import { Navigate } from 'react-router-dom';

/**
 * /timeline was an empty stub with no content and no CTA, linked from the
 * footer as "Bridal Concierge". The planning ladder it was meant to become
 * lives at /wedding-checklist, so redirect rather than serve a dead end.
 */
export default function WeddingTimeline() {
  return <Navigate to="/wedding-checklist" replace />;
}
