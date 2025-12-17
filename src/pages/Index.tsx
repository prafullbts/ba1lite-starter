import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { markScreenAsVisited, TEAM_ENTRY } from "@/Sim/Content";
import { useCalc } from "@/contexts/CalcContext";
import { PillBottleStatic } from "@/components/PillBottleStatic";
import { CalcInput } from "@/components/calc";
import { LogoutButton } from "@/components/LogoutButton";
import { STRATEGY_PLANNING_RANGE_NAMES } from "@/Sim/RangeNameMap";
import btsLogo from "@/assets/bts-logo.png";

const Index = () => {
  const navigate = useNavigate();
  const { setValue, getValue } = useCalc();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teamName = getValue(STRATEGY_PLANNING_RANGE_NAMES.TEAM_NAME) || '';
    if (teamName.trim().length >= 2) {
      markScreenAsVisited('SCREEN_1', setValue, getValue);
      navigate('/strategy-planning');
    }
  };

  const teamName = getValue(STRATEGY_PLANNING_RANGE_NAMES.TEAM_NAME) || '';
  const isValid = teamName.trim().length >= 2;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F5F1E8] flex items-center justify-center">
      {/* Decorative corner arcs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top left arc - Pink */}
        <div className="absolute -top-20 -left-20 w-80 h-80 border-[12px] border-[#E4007C] rounded-full opacity-30"></div>
        
        {/* Bottom right arc - Orange */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 border-[12px] border-[#F68D2E] rounded-full opacity-30"></div>
      </div>
      
      {/* BTS Logo - Top Left */}
      <div className="absolute top-8 left-8 z-20">
        <img 
          src={btsLogo} 
          alt="BTS Logo" 
          className="h-8 w-auto object-contain opacity-90"
        />
      </div>
      
      {/* Logout Button - Top Right */}
      <div className="absolute top-8 right-8 z-20">
        <LogoutButton 
          variant="outline" 
          size="sm" 
          className="bg-background/80 backdrop-blur-sm border-[#01426A]/20 hover:border-[#01426A]/40"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
        {/* Pill Bottle */}
        <div className="mb-8 mt-12 animate-fade-in scale-90 md:scale-100" style={{ animationDelay: '0.1s' }}>
          <PillBottleStatic />
        </div>

        {/* Main Heading */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#333333] mb-6 tracking-wide">
            {TEAM_ENTRY.PAGE_TITLE}
          </h1>
        </div>

        {/* Team Name Form */}
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div className="space-y-3">
              <Label 
                htmlFor="team-name" 
                className="text-lg font-medium text-[#333333] block"
              >
                Enter Your Team Name
              </Label>
              <CalcInput
                refName={STRATEGY_PLANNING_RANGE_NAMES.TEAM_NAME}
                placeholder="Enter team name"
                className="h-14 text-lg bg-white border-[#E4007C]/30 text-[#333333] placeholder:text-gray-400 focus:border-[#E4007C] focus:ring-[#E4007C]/20"
                ariaLabel="team-name"
              />
            </div>
            
            <Button
              type="submit"
              disabled={!isValid}
              className="w-full h-14 px-6 py-3 text-lg font-semibold bg-gradient-to-r from-[#E4007C] to-[#F68D2E] hover:from-[#C5006A] hover:to-[#E67D25] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
            >
              Enter Simulation
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
