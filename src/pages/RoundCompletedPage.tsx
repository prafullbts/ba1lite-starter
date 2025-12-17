import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BtsLogo } from "@/components/ui/BtsLogo";
import { LogoutButton } from "@/components/LogoutButton";
import { useNavigate } from "react-router-dom";
// Step management removed - FlowNavigation calculates step from tracking flags directly
import { useCalc } from "@/contexts/CalcContext";
import { ROUND_MANAGEMENT_RANGE_NAMES, SCREEN_TRACKING_RANGE_NAMES_R2 } from "@/Sim/RangeNameMap";
import { ROUND_COMPLETED, validatePassword, PASSWORD } from "@/Sim/Content";
import btsLogo from "@/assets/bts-logo.svg";

export default function RoundCompletedPage() {
  const navigate = useNavigate();
  const { getValue, setValue } = useCalc();
  
  // Password dialog state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  
  // Get round information from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  const totalRounds = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.TOTAL_ROUNDS) || '3');
  
  const handleNextRound = () => {
    if (currentRound < totalRounds) {
      // Show password dialog instead of immediately advancing
      setShowPasswordDialog(true);
    } else {
      // Simulation complete
      navigate('/');
    }
  };

  const handleConfirmAdvancement = () => {
    // Validate password
    if (!validatePassword(passwordInput, PASSWORD.ROUND_ADVANCEMENT)) {
      setPasswordError(true);
      return;
    }
    
    // Password is correct, proceed with advancement
    setShowPasswordDialog(false);
    setPasswordInput("");
    setPasswordError(false);
    
    // Increment round in CalcModel
    setValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND, (currentRound + 1).toString());
    
    // Mark Round 2 welcome and strategy screens as visited
    // This prevents IntelligentLanding from redirecting to team-entry on page refresh
    setValue(SCREEN_TRACKING_RANGE_NAMES_R2.SCREEN_1, '1'); // Team Name Entry
    setValue(SCREEN_TRACKING_RANGE_NAMES_R2.SCREEN_2, '1'); // Strategic Planning
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  const isLastRound = currentRound >= totalRounds;

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Header with BTS Logo and Logout Button */}
      <div className="w-[90%] mx-auto py-6">
        <header className="mb-8 flex justify-between items-center">
          <img 
            src={btsLogo} 
            alt="BTS Logo" 
            className="h-8 w-auto"
          />
          <LogoutButton 
            variant="outline" 
            size="sm" 
            className="bg-background/80 backdrop-blur-sm border-[#01426A]/20 hover:border-[#01426A]/40"
          />
        </header>
        <main>
          <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <BtsLogo size={64} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {isLastRound 
                  ? ROUND_COMPLETED.TITLE.SIMULATION_COMPLETE 
                  : ROUND_COMPLETED.TITLE.ROUND_COMPLETED.replace('{currentRound}', currentRound.toString())
                }
              </h1>
              <p className="text-muted-foreground">
                {isLastRound 
                  ? ROUND_COMPLETED.DESCRIPTION.SIMULATION_COMPLETE.replace('{totalRounds}', totalRounds.toString())
                  : ROUND_COMPLETED.DESCRIPTION.ROUND_COMPLETED
                      .replace('{currentRound}', currentRound.toString())
                      .replace('{totalRounds}', totalRounds.toString())
                }
              </p>
            </div>
            
            {!isLastRound && (
              <Button 
                onClick={handleNextRound}
                className="mt-4"
                variant="default"
              >
                {ROUND_COMPLETED.BUTTONS.CONTINUE_TO_NEXT_ROUND.replace('{nextRound}', (currentRound + 1).toString())}
              </Button>
            )}
            
            {isLastRound && (
              <Button 
                onClick={() => navigate('/')}
                className="mt-4"
                variant="default"
              >
                {ROUND_COMPLETED.BUTTONS.RETURN_TO_HOME}
              </Button>
            )}
          </CardContent>
        </Card>
          </div>
        </main>
      </div>

      {/* Password Dialog for Round Advancement */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Password to Continue</DialogTitle>
            <DialogDescription>
              Please enter the facilitator password to advance to Round {currentRound + 1}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleConfirmAdvancement();
                  }
                }}
                className={passwordError ? 'border-destructive' : ''}
                placeholder="Enter password"
                autoComplete="off"
              />
              {passwordError && (
                <p className="text-sm text-destructive">
                  Incorrect password. Please try again or contact your facilitator.
                </p>
              )}
            </div>
            <Button 
              onClick={handleConfirmAdvancement}
              className="w-full"
            >
              Confirm and Continue to Round {currentRound + 1}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}