import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import btsLogo from '@/assets/bts-logo.svg';
import { toast } from 'sonner';
import { useCalc } from '@/contexts/CalcContext';
import { useModelStorage } from '@/contexts/ModelStorageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { RotateCcw, Home, FileText, LayoutDashboard, Lightbulb, TrendingUp, Package, Settings, Calendar, BarChart, DollarSign, CheckCircle, Trophy, Bug, CloudUpload } from 'lucide-react';
import { fetchAndSetVerityScore } from '@/services/verityScoreService';
import { CalcDebuggerDialog } from '@/components/CalcDebuggerDialog';

interface BtsLogoProps {
  size?: number;
  className?: string;
}

export function BtsLogo({
  size = 32,
  className = ""
}: BtsLogoProps) {
  const navigate = useNavigate();
  const { calcService, setValue, getValue } = useCalc();
  const { syncToBackend } = useModelStorage();
  const [open, setOpen] = useState(false);
  const [isFetchingVerityScore, setIsFetchingVerityScore] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [calcDebuggerOpen, setCalcDebuggerOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(true); // Admin menu starts locked

  // Ctrl+Shift+3 toggle for admin access
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === '#') { // '#' is the key for Shift+3
        e.preventDefault();
        setIsLocked(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleReset = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to reset decisions? You cannot undo this action.'
    );
    
    if (!confirmed) {
      setOpen(false);
      return;
    }

    toast.info(
      'Simulation Reset',
      {
        description: 'Resetting simulation to Round 1...',
        duration: 1000,
      }
    );

    // Nuclear reset: Clear EVERYTHING
    try {
      // 1. Clear ALL cookies (comprehensive approach)
      const cookies = document.cookie.split(";");
      cookies.forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        if (name) {
          const pathsAndDomains = [
            { path: '/', domain: '' },
            { path: '/', domain: window.location.hostname },
            { path: '/', domain: '.' + window.location.hostname },
            { path: window.location.pathname, domain: '' },
            { path: window.location.pathname, domain: window.location.hostname },
            { path: window.location.pathname, domain: '.' + window.location.hostname },
          ];
          
          pathsAndDomains.forEach(({ path, domain }) => {
            const domainPart = domain ? `;domain=${domain}` : '';
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}${domainPart}`;
          });
        }
      });
      
      // 2. Clear ALL localStorage
      localStorage.clear();
      
      // 3. Clear ALL sessionStorage
      sessionStorage.clear();
      
      // 4. Clear CalcModel state via service
      if (calcService) {
        await calcService.clearModelState();
      }
      
      console.log('🧹 Nuclear simulation reset: All cookies, localStorage, sessionStorage, and CalcModel state cleared');
    } catch (error) {
      console.error('❌ Failed to clear simulation data:', error);
    }
    
    setTimeout(() => {
      // Reload the page to ensure all components reload with clean state
      window.location.reload();
    }, 500);
    
    setOpen(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleFetchVerityScore = async (round: string) => {
    if (isFetchingVerityScore) {
      return; // Prevent multiple simultaneous requests
    }

    setIsFetchingVerityScore(true);
    setOpen(false); // Close dropdown while fetching

    try {
      toast.info(
        `Fetching Verity Score`,
        {
          description: `Loading Verity score for Round ${round}...`,
          duration: 2000,
        }
      );

      const result = await fetchAndSetVerityScore(round, setValue, getValue);

      if (result.success) {
        toast.success(
          `Verity Score Loaded`,
          {
            description: result.message || `Successfully loaded Verity score for Round ${round}: ${result.score}`,
            duration: 4000,
          }
        );
      } else {
        toast.error(
          `Failed to Load Verity Score`,
          {
            description: result.message || `Could not load Verity score for Round ${round}. The score may not be available yet.`,
            duration: 5000,
          }
        );
      }
    } catch (error) {
      console.error('Error fetching Verity score:', error);
      toast.error(
        `Error`,
        {
          description: error instanceof Error ? error.message : 'An unexpected error occurred while fetching Verity score.',
          duration: 5000,
        }
      );
    } finally {
      setIsFetchingVerityScore(false);
    }
  };

  const handleSyncToBackend = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    setOpen(false);
    
    toast.info('Syncing to Backend', {
      description: 'Saving current state to server...',
      duration: 2000,
    });
    
    try {
      await syncToBackend();
      toast.success('Sync Complete', {
        description: 'Successfully synced to backend.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Sync to backend failed:', error);
      toast.error('Sync Failed', {
        description: error instanceof Error ? error.message : 'Could not sync to backend.',
        duration: 5000,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={isLocked ? undefined : setOpen}>
      <DropdownMenuTrigger asChild disabled={isLocked}>
        <div 
          className={`flex items-center ${isLocked ? 'cursor-default' : 'cursor-pointer hover:opacity-80'} transition-opacity ${className}`} 
          style={{ minWidth: size }}
        >
          <img 
            src={btsLogo} 
            alt="BTS Logo" 
            width={size}
            height={size}
            className="object-contain"
            style={{ display: 'block' }}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border-border z-50 max-h-[500px] overflow-y-auto">
        <DropdownMenuItem 
          onClick={handleReset}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          <span>Reset Simulation</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => {
            setCalcDebuggerOpen(true);
            setOpen(false);
          }}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Bug className="mr-2 h-4 w-4" />
          <span>Calc Debugger</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSyncToBackend}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
          disabled={isSyncing}
        >
          <CloudUpload className="mr-2 h-4 w-4" />
          <span>{isSyncing ? 'Syncing...' : 'Sync to Backend'}</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Verity Scores</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleFetchVerityScore('1')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
          disabled={isFetchingVerityScore}
        >
          <Trophy className="mr-2 h-4 w-4" />
          <span>Fetch Verity Score - Round 1</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleFetchVerityScore('2')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
          disabled={isFetchingVerityScore}
        >
          <Trophy className="mr-2 h-4 w-4" />
          <span>Fetch Verity Score - Round 2</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Main Pages</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Home className="mr-2 h-4 w-4" />
          <span>Home</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/strategy-planning')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>Strategy Planning</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigate('/dashboard')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Initiatives</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/initiatives')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Lightbulb className="mr-2 h-4 w-4" />
          <span>Initiatives</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/initiative-impacts')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Initiative Impacts</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Decision Screens</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/bu1')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Business Unit 1</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/bu2')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Business Unit 2</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/corporate')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Corporate</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Events - Round 1</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/events/1/1')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>Round 1 Event 1</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/events/1/2')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>Round 1 Event 2</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/events/1/3')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>Round 1 Event 3</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/events/1/4')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>Round 1 Event 4</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Events - Round 2</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/events/2/1')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>Round 2 Event 1</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/events/2/2')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>Round 2 Event 2</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/events/2/3')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>Round 2 Event 3</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/events/2/4')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span>Round 2 Event 4</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Event Outcomes - Round 1</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/event-outcomes/1/1')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <BarChart className="mr-2 h-4 w-4" />
          <span>Round 1 Event 1 Outcome</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/event-outcomes/1/2')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <BarChart className="mr-2 h-4 w-4" />
          <span>Round 1 Event 2 Outcome</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/event-outcomes/1/3')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <BarChart className="mr-2 h-4 w-4" />
          <span>Round 1 Event 3 Outcome</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/event-outcomes/1/4')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <BarChart className="mr-2 h-4 w-4" />
          <span>Round 1 Event 4 Outcome</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Event Outcomes - Round 2</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/event-outcomes/2/1')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <BarChart className="mr-2 h-4 w-4" />
          <span>Round 2 Event 1 Outcome</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/event-outcomes/2/2')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <BarChart className="mr-2 h-4 w-4" />
          <span>Round 2 Event 2 Outcome</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/event-outcomes/2/3')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <BarChart className="mr-2 h-4 w-4" />
          <span>Round 2 Event 3 Outcome</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/event-outcomes/2/4')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <BarChart className="mr-2 h-4 w-4" />
          <span>Round 2 Event 4 Outcome</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Debrief Screens - Round 1</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-pbnh')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>PB Network Health</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-gennpis')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Active Generalist NPIs</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigate('/debrief-retpharmvol')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Retail Pharmacy Scripts</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-pharmanps')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Pharma NPS</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-pbrevenue')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>PB Revenue</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Debrief Screens - Round 2</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-pbnh')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>PB Network Health</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-pbrevenue')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>PB Revenue</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-pharmanps')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Pharma NPS</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-mbrevenue')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          <span>MB Revenue</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-mbnh')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>MB Network Health</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/debrief-specnpis')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Active Specialist NPIs</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNavigate('/debrief-specpharmvol')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Specialty Pharmacy Scripts</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleNavigate('/financial-statement')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <DollarSign className="mr-2 h-4 w-4" />
          <span>Financial Statement</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleNavigate('/round-completed')}
          className="cursor-pointer hover:bg-accent focus:bg-accent"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>Round Completed</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <CalcDebuggerDialog open={calcDebuggerOpen} onOpenChange={setCalcDebuggerOpen} />
    </DropdownMenu>
  );
}