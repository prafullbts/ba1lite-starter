import { useParams } from "react-router-dom";
import VerityChatPage from "./VerityChatPage";
import EventsPage from "./EventsPage";

export default function EventsConditional() {
  const { round, eventNumber } = useParams();
  
  // Show Verity chat for Round 1 Event 1 OR Round 2 Event 1
  const isVerityEvent = 
    (String(round) === "1" && String(eventNumber) === "1") ||
    (String(round) === "2" && String(eventNumber) === "1");
  
  if (isVerityEvent) {
    return <VerityChatPage />;
  }
  
  return <EventsPage />;
}
