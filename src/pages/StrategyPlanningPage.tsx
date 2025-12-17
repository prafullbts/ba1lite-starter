import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { STRATEGY_PLANNING, markScreenAsVisited, LOGOUT_DIALOG, validatePassword, PASSWORD } from "@/Sim/Content";
import { STRATEGY_PLANNING_RANGE_NAMES, ROUND_MANAGEMENT_RANGE_NAMES } from "@/Sim/RangeNameMap";
import { CalcTextArea, CalcValue } from "@/components/calc";
import { useCalc } from "@/contexts/CalcContext";
import { MenuButton } from "@/components/ui/MenuButton";
import { useLogout } from "@/utils/logout";
import { Zap, AlertTriangle, Lightbulb, ShieldAlert, LogOut, Target } from "lucide-react";
import btsLogo from "@/assets/bts-logo.svg";

const StrategyPlanningPage = () => {
  const navigate = useNavigate();
  const { setValue, getValue } = useCalc();
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const handleLogout = useLogout();

  const menuItems = [
    {
      label: 'Logout',
      onClick: () => setShowLogoutDialog(true),
      icon: <LogOut className="w-4 h-4 mr-2" />,
    }
  ];

  const handleSubmit = () => {
    // In Round 2+, skip password and navigate directly
    if (currentRound >= 2) {
      markScreenAsVisited('SCREEN_2', setValue, getValue);
      console.log('Strategy planning completed (Round 2+), navigating to dashboard without password');
      navigate('/dashboard');
    } else {
      // Round 1: Show password dialog
      setShowPasswordDialog(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (validatePassword(password, PASSWORD.STRATEGY_PLANNING)) {
      // Password correct - proceed
      markScreenAsVisited('SCREEN_2', setValue, getValue);
      console.log('Strategy planning completed, navigating to dashboard');
      setShowPasswordDialog(false);
      setPassword("");
      setPasswordError("");
      navigate('/dashboard');
    } else {
      // Password incorrect - show error
      setPasswordError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleCancelPassword = () => {
    setShowPasswordDialog(false);
    setPassword("");
    setPasswordError("");
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header with gradient and team name - Full width */}
      <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-orange-400 text-white py-4">
        <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Team Name Display */}
            <div className="flex items-center gap-3 flex-1">
              <label className="text-lg font-semibold whitespace-nowrap">
                {STRATEGY_PLANNING.TEAM_NAME.LABEL}
              </label>
              <CalcValue
                refName={STRATEGY_PLANNING_RANGE_NAMES.TEAM_NAME}
                className="text-lg font-semibold"
              />
            </div>
            
            {/* Right: BTS Logo and Menu Button */}
            <div className="flex items-center gap-4">
              <img 
                src={btsLogo} 
                alt="BTS Logo" 
                className="h-10 w-auto bg-white p-2 rounded"
              />
              <MenuButton 
                menuItems={menuItems}
                className="bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 hover:border-white/50 [&>svg]:!text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Flex grow to fill remaining space */}
      <div className="flex-1 w-full bg-card border-t shadow-sm py-5 overflow-hidden">
        <div className="h-full w-full max-w-[1600px] mx-auto px-4 lg:px-6 xl:px-8 flex flex-col gap-5">
          
          {/* SWOT Analysis Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              {STRATEGY_PLANNING.SWOT.TITLE}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {STRATEGY_PLANNING.SWOT.DESCRIPTION}
            </p>
            
            {/* SWOT 2x2 Grid */}
            <div className="w-full grid grid-cols-2 gap-4">
              {/* Strengths Card */}
              <Card className="w-full border-l-4 border-l-accent-1">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent-1" />
                    {STRATEGY_PLANNING.SWOT.SECTIONS.STRENGTHS.TITLE}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <CalcTextArea
                    refName={STRATEGY_PLANNING_RANGE_NAMES.STRENGTHS}
                    placeholder={STRATEGY_PLANNING.SWOT.SECTIONS.STRENGTHS.PLACEHOLDER}
                    rows={4}
                    className="w-full min-h-[100px] resize-none border-accent-1/20 bg-slate-50/50 shadow-sm focus-visible:ring-accent-1 focus-visible:border-accent-1/40"
                  />
                </CardContent>
              </Card>

              {/* Weaknesses Card */}
              <Card className="w-full border-l-4 border-l-accent-2">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-accent-2" />
                    {STRATEGY_PLANNING.SWOT.SECTIONS.WEAKNESSES.TITLE}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <CalcTextArea
                    refName={STRATEGY_PLANNING_RANGE_NAMES.WEAKNESSES}
                    placeholder={STRATEGY_PLANNING.SWOT.SECTIONS.WEAKNESSES.PLACEHOLDER}
                    rows={4}
                    className="w-full min-h-[100px] resize-none border-accent-2/20 bg-slate-50/50 shadow-sm focus-visible:ring-accent-2 focus-visible:border-accent-2/40"
                  />
                </CardContent>
              </Card>

              {/* Opportunities Card */}
              <Card className="w-full border-l-4 border-l-accent-3">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-accent-3" />
                    {STRATEGY_PLANNING.SWOT.SECTIONS.OPPORTUNITIES.TITLE}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <CalcTextArea
                    refName={STRATEGY_PLANNING_RANGE_NAMES.OPPORTUNITIES}
                    placeholder={STRATEGY_PLANNING.SWOT.SECTIONS.OPPORTUNITIES.PLACEHOLDER}
                    rows={4}
                    className="w-full min-h-[100px] resize-none border-accent-3/20 bg-slate-50/50 shadow-sm focus-visible:ring-accent-3 focus-visible:border-accent-3/40"
                  />
                </CardContent>
              </Card>

              {/* Threats Card */}
              <Card className="w-full border-l-4 border-l-accent-4">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-accent-4" />
                    {STRATEGY_PLANNING.SWOT.SECTIONS.THREATS.TITLE}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <CalcTextArea
                    refName={STRATEGY_PLANNING_RANGE_NAMES.THREATS}
                    placeholder={STRATEGY_PLANNING.SWOT.SECTIONS.THREATS.PLACEHOLDER}
                    rows={4}
                    className="w-full min-h-[100px] resize-none border-accent-4/20 bg-slate-50/50 shadow-sm focus-visible:ring-accent-4 focus-visible:border-accent-4/40"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Strategic Priorities Section */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">
              {STRATEGY_PLANNING.PRIORITIES.TITLE}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {STRATEGY_PLANNING.PRIORITIES.DESCRIPTION}
            </p>
            
            {/* Priorities 1x2 Grid */}
            <div className="w-full grid grid-cols-2 gap-4">
              {/* Short-term Priorities Card */}
              <Card className="w-full border-l-4 border-l-accent-2">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent-2" />
                    {STRATEGY_PLANNING.PRIORITIES.SECTIONS.SHORT_TERM.TITLE}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <CalcTextArea
                    refName={STRATEGY_PLANNING_RANGE_NAMES.SHORT_TERM_PRIORITIES}
                    placeholder={STRATEGY_PLANNING.PRIORITIES.SECTIONS.SHORT_TERM.PLACEHOLDER}
                    rows={4}
                    className="w-full min-h-[100px] resize-none border-accent-2/20 bg-slate-50/50 shadow-sm focus-visible:ring-accent-2 focus-visible:border-accent-2/40"
                  />
                </CardContent>
              </Card>

              {/* Long-term Priorities Card */}
              <Card className="w-full border-l-4 border-l-accent-1">
                <CardHeader className="px-4 py-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Target className="h-4 w-4 text-accent-1" />
                    {STRATEGY_PLANNING.PRIORITIES.SECTIONS.LONG_TERM.TITLE}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 py-2">
                  <CalcTextArea
                    refName={STRATEGY_PLANNING_RANGE_NAMES.LONG_TERM_PRIORITIES}
                    placeholder={STRATEGY_PLANNING.PRIORITIES.SECTIONS.LONG_TERM.PLACEHOLDER}
                    rows={4}
                    className="w-full min-h-[100px] resize-none border-accent-1/20 bg-slate-50/50 shadow-sm focus-visible:ring-accent-1 focus-visible:border-accent-1/40"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleSubmit}
              variant="secondary-gradient"
              className="px-8 py-3 rounded-full text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {STRATEGY_PLANNING.BUTTONS.SUBMIT}
            </Button>
          </div>
        </div>
      </div>

      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Password</DialogTitle>
            <DialogDescription>
              Please enter the password to continue to the dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
              className="w-full"
              autoFocus
            />
            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancelPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              variant="secondary-gradient"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{LOGOUT_DIALOG.TITLE}</DialogTitle>
            <DialogDescription>{LOGOUT_DIALOG.DESCRIPTION}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              {LOGOUT_DIALOG.BUTTONS.CANCEL}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              {LOGOUT_DIALOG.BUTTONS.LOGOUT}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategyPlanningPage;
