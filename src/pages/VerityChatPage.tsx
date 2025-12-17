import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Home } from "lucide-react";
// Step management removed - FlowNavigation calculates step from tracking flags directly
import { useCalc } from "@/contexts/CalcContext";
import { markScreenAsVisited, PAGE_CONTENT, VERITY_EXIT_DIALOG, validatePassword, PASSWORD } from "@/Sim/Content";
import { fetchAndSetVerityScore } from "@/services/verityScoreService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VerityConfig {
  botId: string;
  userId: string;
  email: string;
  name: string;
  eventName: string;
  type: string;
  environment: string;
}

interface VerityResponse {
  success: boolean;
  chatUrl?: string;
  message?: string;
}

// Configuration for each Verity event
const getVerityConfig = (round: string, eventNumber: string): VerityConfig | null => {
  // Get email from localStorage if available
  let emailFromStorage: string | null = null;
  let nameFromStorage: string | null = null;
  let idFromStorage: string | null = null;
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      emailFromStorage = user?.pemail || null;
      nameFromStorage = user?.pname || null;
      idFromStorage = user?.pid || null;
    }
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
  }

  // Round 1 Event 1 config
  if (round === "1" && eventNumber === "1") {
    const defaultEmail = "will.cozadd@bts.com";
    const email = emailFromStorage || defaultEmail;
    const defaultName = "Will Cozadd";
    const name = nameFromStorage || defaultName;
    const id = idFromStorage ||defaultEmail;
    return {
      botId: "comp-CoverMyMed-3wobb/WOR9DhDB8QWDE4inXuJW",
      userId: id,
      email: email,
      name: name,
      eventName: "CoverMyMeds_BA1Lite_PulseEvent",
      type: "IsomerPulse",
      environment: "production"
    };
  }
  // Round 2 Event 1 config
  if (round === "2" && eventNumber === "1") {
    const defaultEmail = "dhaval.maniar@bts.com";
    const email = emailFromStorage || defaultEmail;
    const defaultName = "Dhaval Maniar";
    const name = nameFromStorage || defaultName;
    const id = idFromStorage || defaultEmail;
    return {
      botId: "comp-CoverMyMed-3wobb/nB1W9fUXTjFHU1Uw8hEx",
      userId: id,
      email: email,
      name: name,
      eventName: "CoverMyMeds_BA1Lite_PulseEvent",
      type: "IsomerPulse",
      environment: "production"
    };
  }
  return null;
};

export default function VerityChatPage() {
  const { round = "1", eventNumber = "1" } = useParams();
  const navigate = useNavigate();
  // Note: Step is calculated from screen tracking flags in FlowNavigation
  const { setValue, getValue } = useCalc();
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDashboardConfirm, setShowDashboardConfirm] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  
  type TimerPhase = 'planning' | 'conversation';
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>('planning');
  const [timeRemaining, setTimeRemaining] = useState<number>(
    PAGE_CONTENT.EVENTS.VERITY_TIMER.PLANNING_DURATION_SECONDS
  );

  const fetchChatUrl = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const config = getVerityConfig(round, eventNumber);
    if (!config) {
      setErrorMessage("Invalid event configuration");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://isomerstage.btspulse.com/PulseServices/Authenticate.svc/GetVerityUrlsV2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Handle response normalization (API might wrap in GetVerityUrlsV2Result)
      const result: VerityResponse = data.GetVerityUrlsV2Result || data;

      if (result.success && result.chatUrl) {
        setIframeUrl(result.chatUrl);
      } else {
        setErrorMessage(result.message || "Failed to load chat URL");
      }
    } catch (error) {
      console.error("Error fetching Verity chat URL:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load chat. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatUrl();
    // Reset to planning phase when navigating between events
    setCurrentPhase('planning');
    setTimeRemaining(PAGE_CONTENT.EVENTS.VERITY_TIMER.PLANNING_DURATION_SECONDS);
  }, [round, eventNumber]);

  // Timer countdown effect with phase transition
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Check if we're in planning phase and need to transition
          if (currentPhase === 'planning') {
            setCurrentPhase('conversation');
            return PAGE_CONTENT.EVENTS.VERITY_TIMER.CONVERSATION_DURATION_SECONDS;
          }
          // In conversation phase - stop at 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPhase]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    fetchChatUrl();
  };

  const handleDashboardClick = () => {
    setPasswordInput("");
    setPasswordError(false);
    setShowDashboardConfirm(true);
  };

  const handleConfirmDashboard = async () => {
    // Get the correct password based on current round
    const correctPassword = round === "1" 
      ? PASSWORD.VERITY_EXIT_R1
      : PASSWORD.VERITY_EXIT_R2;
    
    // Validate password
    if (!validatePassword(passwordInput, correctPassword)) {
      setPasswordError(true);
      return;
    }
    
    // Password is correct, proceed with navigation
    setShowDashboardConfirm(false);
    
    // Skip event outcomes for Verity events - mark Event 1 as complete
    if (round === "1" && eventNumber === "1") {
      // Mark Event 1 as visited (SCREEN_5)
      markScreenAsVisited('SCREEN_5', setValue, getValue);
      // Note: Step will be calculated from tracking flags in FlowNavigation
    } else if (round === "2" && eventNumber === "1") {
      // For Round 2 Event 1, also mark Event 1 as visited (SCREEN_5)
      markScreenAsVisited('SCREEN_5', setValue, getValue);
      // Note: Step will be calculated from tracking flags in FlowNavigation
    }
    
    // Silently fetch Verity score in background - only show toast on failure
    try {
      const result = await fetchAndSetVerityScore(round, setValue, getValue);
      
      // Only show toast if fetch failed
      if (!result.success) {
        toast.error("Unfortunately your verity score couldn't be stored at this time. Please alert your facilitator and it will be added in shortly");
      }
      // If successful, silently continue - no toast needed
    } catch (error) {
      // Show error toast on exception
      toast.error("Unfortunately your verity score couldn't be stored at this time. Please alert your facilitator and it will be added in shortly");
    }
    
    navigate('/dashboard');
  };

  return (
    <div className="w-full h-full flex flex-col bg-background text-foreground">
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Verity chat...</p>
          </div>
        </div>
      )}

      {errorMessage && !isLoading && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Chat</h2>
            <p className="text-muted-foreground mb-6">{errorMessage}</p>
            <Button onClick={handleRetry} variant="default">
              Retry
            </Button>
          </div>
        </div>
      )}

      {iframeUrl && !isLoading && !errorMessage && (
        <div className="flex-1 min-h-0 w-full">
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            allow="clipboard-write *; microphone; camera; autoplay; fullscreen"
            title="Verity Chat Interface"
          />
        </div>
      )}

      <div className="flex justify-between items-center py-6 px-8 w-full border-t border-border">
        {/* Timer Display - Left Side */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {currentPhase === 'planning' 
              ? PAGE_CONTENT.EVENTS.VERITY_TIMER.PLANNING_LABEL
              : PAGE_CONTENT.EVENTS.VERITY_TIMER.CONVERSATION_LABEL
            }
          </span>
          <span className={`font-mono text-lg font-semibold ${
            timeRemaining <= PAGE_CONTENT.EVENTS.VERITY_TIMER.WARNING_THRESHOLD_SECONDS 
              ? 'text-orange-500' 
              : 'text-foreground'
          }`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        
        {/* Return to Dashboard Button - Right Side */}
        <Button 
          variant="secondary-gradient" 
          onClick={handleDashboardClick}
          className="px-10 py-4 rounded-full text-lg font-semibold"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Dashboard
        </Button>
      </div>

      <AlertDialog open={showDashboardConfirm} onOpenChange={(open) => {
        setShowDashboardConfirm(open);
        if (!open) {
          setPasswordInput("");
          setPasswordError(false);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{VERITY_EXIT_DIALOG.TITLE}</AlertDialogTitle>
            <AlertDialogDescription className="text-base space-y-3">
              <p className="text-foreground">
                {VERITY_EXIT_DIALOG.DESCRIPTION.QUESTION.split('"End Call"').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && <strong>"End Call"</strong>}
                  </span>
                ))}
              </p>
              <ul className="space-y-2 ml-4 list-none">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    {VERITY_EXIT_DIALOG.DESCRIPTION.IF_YES.split('"Proceed"').map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && <strong>"Proceed"</strong>}
                      </span>
                    ))}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    {VERITY_EXIT_DIALOG.DESCRIPTION.IF_NO.split('"Back"').map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && <strong>"Back"</strong>}
                      </span>
                    ))}
                  </span>
                </li>
              </ul>
              <div className="pt-2">
                <label htmlFor="exit-password" className="block text-sm font-medium mb-2 text-foreground">
                  {VERITY_EXIT_DIALOG.PASSWORD_PROMPT}
                </label>
                <Input
                  id="exit-password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirmDashboard();
                    }
                  }}
                  placeholder={VERITY_EXIT_DIALOG.PASSWORD_PLACEHOLDER}
                  className={passwordError ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">
                    {VERITY_EXIT_DIALOG.PASSWORD_ERROR}
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gradient-secondary text-white hover:bg-gradient-secondary hover:text-white border-0">
              {VERITY_EXIT_DIALOG.BUTTONS.BACK}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDashboard}
              className="bg-gray-200 text-gray-900 hover:bg-gray-200 hover:text-gray-900"
            >
              {VERITY_EXIT_DIALOG.BUTTONS.PROCEED}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
