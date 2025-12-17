import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Step management removed - FlowNavigation calculates step from tracking flags directly
import { BtsLogo } from '@/components/ui/BtsLogo';
import { MenuButton } from '@/components/ui/MenuButton';
import { Card } from '@/components/ui/card';
import { KPI, formatCurrencySmart, formatNumberK, formatNumberM, formatNumberPlain, LOGOUT_DIALOG } from '@/Sim/Content';
import { LayoutGrid, LogOut } from 'lucide-react';
import { InfoTooltip } from '@/components/InfoTooltip';
import { CalcValueChanges } from '@/components/calc/CalcValueChanges';
import { NPSGauge } from '@/components/ui/NPSGauge';
import { useCalc } from '@/contexts/CalcContext';
import { KPI_RANGE_NAMES_R1, KPI_RANGE_NAMES_R2, ROUND_MANAGEMENT_RANGE_NAMES } from '@/Sim/RangeNameMap';

import { useLogout } from '@/utils/logout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// KPI Configuration - Define all metrics to display
interface KPICardConfig {
  key: string;
  label: string;
  refName: string;
  formatter: 'currency' | 'currency-clean' | 'currency-smart' | 'percentage' | 'number' | 'number-k' | 'number-m' | 'number-plain';
  ariaId: string;
  tooltip: string;
  decimals?: number;
  accentColor: string;
  group: 'financial' | 'pharmacy' | 'operations';
}


export function KPIBar() {
  const navigate = useNavigate();
  const { getValue, calcService } = useCalc();
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND, true) || '1');
  const teamNumber = getValue(ROUND_MANAGEMENT_RANGE_NAMES.TEAM_NUMBER, true) || '1';
  
  // Logout dialog state
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const handleLogout = useLogout();
  
  // Select the appropriate KPI range object based on current round
  const kpiRanges = currentRound === 2 ? KPI_RANGE_NAMES_R2 : KPI_RANGE_NAMES_R1;
  
  // Menu items configuration
  const menuItems = [
    {
      label: 'Strategic Planning',
      onClick: () => navigate('/strategy-planning'),
      icon: <LayoutGrid className="w-4 h-4 mr-2" />
    },
    {
      label: 'Logout',
      onClick: () => setShowLogoutDialog(true),
      icon: <LogOut className="w-4 h-4 mr-2" />,
      separator: true
    }
  ];
  
  // KPI Configuration - using round-specific ranges and centralized labels
  const KPI_CARD_CONFIG: KPICardConfig[] = [
    {
      key: 'revenue',
      label: KPI.FINANCIAL_METRICS.metric1.label,
      refName: kpiRanges.REVENUE,
      formatter: 'currency-clean',
      decimals: 0,
      ariaId: 'kpi-revenue',
      tooltip: KPI.TOOLTIPS.metric1,
      accentColor: '#E70865', // CMM Magenta
      group: 'financial',
    },
    {
      key: 'grossProfit',
      label: KPI.FINANCIAL_METRICS.grossProfit.label,
      refName: kpiRanges.GROSS_PROFIT,
      formatter: 'currency-clean',
      decimals: 1,
      ariaId: 'kpi-gross-profit',
      tooltip: KPI.TOOLTIPS.grossProfit,
      accentColor: '#E70865', // CMM Magenta
      group: 'financial',
    },
    {
      key: 'aop',
      label: KPI.FINANCIAL_METRICS.metric2.label,
      refName: kpiRanges.AOP,
      formatter: 'currency-clean',
      decimals: 1,
      ariaId: 'kpi-aop',
      tooltip: KPI.TOOLTIPS.metric2,
      accentColor: '#E70865', // CMM Magenta
      group: 'financial',
    },
    {
      key: 'specPharmacy',
      label: KPI.SECONDARY_METRICS.tlOutputCorp_Metric4_R1.label,
      refName: kpiRanges.SPEC_PHARMACY,
      formatter: 'number-m',
      decimals: 2,
      ariaId: 'kpi-spec-pharmacy',
      tooltip: KPI.TOOLTIPS.tlOutputCorp_Metric4_R1,
      accentColor: '#008AD8', // CMM Cyan
      group: 'pharmacy',
    },
    {
      key: 'pharmaNps',
      label: KPI.GAUGE_METRICS.metric7.label,
      refName: kpiRanges.PHARMA_NPS,
      formatter: 'number',
      decimals: 1,
      ariaId: 'kpi-pharma-nps',
      tooltip: KPI.TOOLTIPS.metric7,
      accentColor: '#008AD8', // CMM Cyan
      group: 'pharmacy',
    },
    {
      key: 'capacityRemaining',
      label: KPI.OPERATIONAL_METRICS.capacityRemaining.label,
      refName: kpiRanges.CAPACITY_REMAINING,
      formatter: 'number',
      decimals: 0,
      ariaId: 'kpi-capacity',
      tooltip: KPI.TOOLTIPS.capacityRemaining,
      accentColor: '#FF8F1C', // CMM Orange
      group: 'operations',
    }
  ];
  
  
  // Helper to get grouped cards
  const getGroupedCards = () => {
    const groupedCards: Record<string, KPICardConfig[]> = {
      financial: [],
      pharmacy: [],
      operations: [],
    };
    
    KPI_CARD_CONFIG.forEach((config) => {
      groupedCards[config.group].push(config);
    });
    
    return groupedCards;
  };

  // Render KPI cards - Horizontal Layout (xl+)
  const renderKPICardsHorizontal = () => {
    const groupedCards = getGroupedCards();
    const capacityValue = parseFloat(getValue(kpiRanges.CAPACITY_REMAINING, true) || '0');
    const isCapacityNegative = capacityValue < 0;

    // Flatten all cards with divider markers
    const allCards: Array<{ type: 'card' | 'divider'; data?: KPICardConfig; groupKey?: string }> = [];
    
    Object.entries(groupedCards).forEach(([groupKey, configs], groupIndex) => {
      if (groupIndex > 0) {
        allCards.push({ type: 'divider', groupKey });
      }
      configs.forEach(config => {
        allCards.push({ type: 'card', data: config });
      });
    });

    return (
      <div className="hidden xl:flex items-center gap-2 lg:gap-3 xl:gap-4 w-full">
        {allCards.map((item, index) => {
          if (item.type === 'divider') {
            return (
              <div key={`divider-${item.groupKey}`} className="flex-[0.25] flex items-center justify-center">
                <div className="h-12 w-px bg-[#01426A]/20" />
              </div>
            );
          }

          const kpi = item.data!;

          return (
            <Card 
              key={kpi.key} 
              className="flex-1 bg-white border border-[#008AD8]/20 shadow-sm p-3 rounded-lg min-w-0 relative overflow-hidden @container"
            >
              <div 
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ 
                  background: `linear-gradient(to right, ${kpi.accentColor}, ${kpi.accentColor}80)` 
                }}
              />
              
              <div className="text-center min-w-0">
                {kpi.key === 'pharmaNps' ? (
                  <>
                    <NPSGauge
                      refName={kpi.refName}
                    />
                    <div className="flex items-center justify-center gap-1 mt-1 min-w-0">
                      <InfoTooltip 
                        content={kpi.tooltip}
                        position="bottom"
                        variant="grey"
                      />
                      <p id={kpi.ariaId} className="text-[#01426A]/70 text-xs font-medium truncate">
                        {kpi.label}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CalcValueChanges
                      refName={kpi.refName}
                      format={kpi.formatter}
                      decimals={kpi.decimals}
                      className={`text-xl @[140px]:text-2xl font-bold font-tabular ${
                        kpi.key === 'capacityRemaining' && isCapacityNegative 
                          ? 'text-red-600'
                          : 'text-[#01426A]'
                      }`}
                      fallback="0"
                    />
                    <div className="flex items-center justify-center gap-1 mt-1 min-w-0">
                      <InfoTooltip 
                        content={kpi.tooltip}
                        position="bottom"
                        variant="grey"
                      />
                      <p id={kpi.ariaId} className="text-[#01426A]/70 text-xs font-medium truncate">
                        {kpi.label}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  // Render KPI cards - Vertical Layout (<xl)
  const renderKPICardsVertical = () => {
    const groupedCards = getGroupedCards();
    const capacityValue = parseFloat(getValue(kpiRanges.CAPACITY_REMAINING, true) || '0');
    const isCapacityNegative = capacityValue < 0;

    return (
      <div className="flex xl:hidden flex-col gap-4 w-full">
        {Object.entries(groupedCards).map(([groupKey, configs], groupIndex) => (
          <React.Fragment key={groupKey}>
            {groupIndex > 0 && (
              <div className="h-px w-full bg-[#01426A]/20" />
            )}
            
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {configs.map((kpi) => {
                  return (
                    <Card 
                      key={kpi.key} 
                      className="bg-white border border-[#008AD8]/20 shadow-sm p-3 rounded-lg relative overflow-hidden @container"
                    >
                      <div 
                        className="absolute top-0 left-0 right-0 h-0.5"
                        style={{ 
                          background: `linear-gradient(to right, ${kpi.accentColor}, ${kpi.accentColor}80)` 
                        }}
                      />
                      
                      <div className="text-center">
                        {kpi.key === 'pharmaNps' ? (
                          <>
                            <NPSGauge
                              refName={kpi.refName}
                            />
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <InfoTooltip 
                                content={kpi.tooltip}
                                position="bottom"
                                variant="grey"
                              />
                              <p id={kpi.ariaId} className="text-[#01426A]/70 text-xs font-medium truncate">
                                {kpi.label}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <CalcValueChanges
                              refName={kpi.refName}
                              format={kpi.formatter}
                              decimals={kpi.decimals}
                              className={`text-xl @[140px]:text-2xl font-bold font-tabular ${
                                kpi.key === 'capacityRemaining' && isCapacityNegative 
                                  ? 'text-red-600'
                                  : 'text-[#01426A]'
                              }`}
                              fallback="0"
                            />
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <InfoTooltip 
                                content={kpi.tooltip}
                                position="bottom"
                                variant="grey"
                              />
                              <p id={kpi.ariaId} className="text-[#01426A]/70 text-xs font-medium truncate">
                                {kpi.label}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-tint-orange backdrop-blur-sm border-b border-border">
      <div className="w-full max-w-[100vw] overflow-x-auto px-6 py-3">
        <div className="flex items-center justify-between w-full min-w-0">
          {/* Left Section - Menu Button + BTS Logo + Round (Fixed Width) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Circular Glassmorphic Menu Button */}
            <MenuButton menuItems={menuItems} />
            
            {/* BTS Logo + Round Info */}
            <div className="flex flex-col items-center justify-center">
              <BtsLogo size={150} />
              <div className="text-[#01426A] font-semibold text-sm">
                Team {teamNumber} | Round {currentRound}
              </div>
            </div>
          </div>

          {/* Center Section - KPI Cards (Expands to Fill) */}
          <div className="flex-1 w-0 overflow-hidden ml-4 sm:ml-6 lg:ml-8">
            {renderKPICardsHorizontal()}
            {renderKPICardsVertical()}
          </div>

        </div>
      </div>
      
      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{LOGOUT_DIALOG.TITLE}</DialogTitle>
            <DialogDescription>
              {LOGOUT_DIALOG.DESCRIPTION}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              {LOGOUT_DIALOG.BUTTONS.CANCEL}
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                setShowLogoutDialog(false);
                await handleLogout();
              }}
              className="gap-2"
            >
              <LogOut className="h-4 w-4 scale-x-[-1]" />
              {LOGOUT_DIALOG.BUTTONS.LOGOUT}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
