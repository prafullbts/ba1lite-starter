import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLayout } from "@/components/layout/AppLayout";
import { NavigationControls } from "@/components/layout/NavigationControls";
import { FINANCIAL_STATEMENT, GENERAL_UI, markScreenAsVisited, markRoundAsSubmitted } from "@/Sim/Content";
import { InfoTooltip } from "@/components/InfoTooltip";
// Step management removed - FlowNavigation calculates step from tracking flags directly
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCalc } from "@/contexts/CalcContext";
import { Pill, Hospital, Truck, Circle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ROUND_MANAGEMENT_RANGE_NAMES, DEBRIEF_RANGE_NAMES, DEBRIEF_RANGE_NAMES_R2 } from "@/Sim/RangeNameMap";
import { CalcValue } from "@/components/calc";

export default function FinancialStatementPage() {
  const { getValue, setValue } = useCalc();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const hasMarkedVisited = useRef(false);

  // Get current round from CalcModel first
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');

  // Set initial year based on current round - defaults to the current round's year
  const [selectedYear, setSelectedYear] = useState<'year-0' | 'year-1' | 'year-2'>(
    currentRound >= 2 ? 'year-2' : 'year-1'
  );

  // Mark screen 18 as visited when this page loads (Info Screen 8 - Income Statement)
  useEffect(() => {
    if (!hasMarkedVisited.current) {
      markScreenAsVisited('SCREEN_18', setValue, getValue);
      hasMarkedVisited.current = true;
    }
  }, [setValue]);

  // Select the appropriate debrief range object based on current round
  // Financial statements use all rounds in one object (R0, R1, R2 ranges)
  const debriefRanges = DEBRIEF_RANGE_NAMES;

  // Determine if Year 2 should be enabled
  const isYear2Enabled = currentRound >= 2;

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="mb-3">
          <h1 className="text-2xl font-bold text-foreground mb-2">{FINANCIAL_STATEMENT.PAGE_TITLE}</h1>
          <p className="text-muted-foreground">
            {FINANCIAL_STATEMENT.PAGE_DESCRIPTION}
          </p>
        </div>

        {/* Year Toggle - Outside of Card */}
        <div className="flex justify-start mb-4">
          <ToggleGroup
              type="single" 
              value={selectedYear} 
              onValueChange={(value) => value && setSelectedYear(value as typeof selectedYear)}
              className="inline-flex bg-[#FDE6F0] p-1 rounded-lg gap-1 border border-[#E70865]/30"
            >
              <ToggleGroupItem 
                value="year-0" 
                className="w-28 text-base font-semibold rounded-md px-4 py-2 
                           data-[state=on]:bg-[#E70865] data-[state=on]:text-white 
                           data-[state=off]:bg-transparent data-[state=off]:text-[#01426A]
                           hover:bg-[#E70865]/10 transition-colors"
              >
                {FINANCIAL_STATEMENT.YEAR_TOGGLE.YEAR_0}
              </ToggleGroupItem>
              
              <ToggleGroupItem 
                value="year-1" 
                className="w-28 text-base font-semibold rounded-md px-4 py-2 
                           data-[state=on]:bg-[#E70865] data-[state=on]:text-white 
                           data-[state=off]:bg-transparent data-[state=off]:text-[#01426A]
                           hover:bg-[#E70865]/10 transition-colors"
              >
                {FINANCIAL_STATEMENT.YEAR_TOGGLE.YEAR_1}
              </ToggleGroupItem>
              
              {isYear2Enabled && (
                <ToggleGroupItem 
                  value="year-2" 
                  className="w-28 text-base font-semibold rounded-md px-4 py-2 
                             data-[state=on]:bg-[#E70865] data-[state=on]:text-white 
                             data-[state=off]:bg-transparent data-[state=off]:text-[#01426A]
                             hover:bg-[#E70865]/10 transition-colors"
                >
                  {FINANCIAL_STATEMENT.YEAR_TOGGLE.YEAR_2}
                </ToggleGroupItem>
              )}
            </ToggleGroup>
        </div>

        {/* Income Statement Card */}
        <Card className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-1/20 overflow-hidden hover:shadow-accent-1/30 transition-all duration-300">
          <CardHeader className="bg-gradient-secondary">
            <CardTitle className="text-center text-xl text-white font-bold">{FINANCIAL_STATEMENT.STATEMENT_TITLE}</CardTitle>
            <p className="text-center text-primary-foreground/80 text-sm mt-1">(In millions)</p>
          </CardHeader>
          <CardContent className="p-8">
            {/* Financial Statement Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-accent-1/30">
                      <th className="text-left py-4 text-foreground font-medium"></th>
                      <th className="text-center py-4 text-foreground font-bold text-lg">
                        <div className="flex items-center justify-center gap-2">
                          <Pill className="h-5 w-5" />
                          <span>{FINANCIAL_STATEMENT.COLUMN_HEADERS.PHARMACY_BENEFITS}</span>
                  <InfoTooltip 
                    content={FINANCIAL_STATEMENT.TOOLTIPS.PHARMACY_BENEFITS}
                    variant="simple"
                    position="bottom"
                  />
                        </div>
                      </th>
                      <th className="text-center py-4 text-foreground font-bold text-lg">
                        <div className="flex items-center justify-center gap-2">
                          <Hospital className="h-5 w-5" />
                          <span>{FINANCIAL_STATEMENT.COLUMN_HEADERS.MEDICAL_BENEFITS}</span>
                  <InfoTooltip 
                    content={FINANCIAL_STATEMENT.TOOLTIPS.MEDICAL_BENEFITS}
                    variant="simple"
                    position="bottom"
                  />
                        </div>
                      </th>
                      <th className="text-center py-4 text-foreground font-bold text-lg">
                        <div className="flex items-center justify-center gap-2">
                          <Truck className="h-5 w-5" />
                          <span>{FINANCIAL_STATEMENT.COLUMN_HEADERS.NON_NETWORK}</span>
                  <InfoTooltip 
                    content={FINANCIAL_STATEMENT.TOOLTIPS.NON_NETWORK}
                    variant="simple"
                    position="bottom"
                  />
                        </div>
                      </th>
                      <th className="text-center py-4 text-foreground font-bold text-lg">
                        <div className="flex items-center justify-center gap-2">
                          <Circle className="h-5 w-5" />
                          <span>{FINANCIAL_STATEMENT.COLUMN_HEADERS.CMM}</span>
                  <InfoTooltip 
                    content={FINANCIAL_STATEMENT.TOOLTIPS.CMM}
                    variant="simple"
                    position="bottom"
                  />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {/* Revenue */}
                    <tr className="border-b border-muted/10">
                      <td className="py-3 text-foreground font-medium">Revenue</td>
                      <td className="py-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU1_REV_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU1_REV_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU1_REV_R2} format="currency-clean" decimals={1} />}
                      </td>
                      <td className="py-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU2_REV_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU2_REV_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU2_REV_R2} format="currency-clean" decimals={1} />}
                      </td>
                      <td className="py-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU3_REV_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU3_REV_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU3_REV_R2} format="currency-clean" decimals={1} />}
                      </td>
                      <td className="py-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_TOTAL_REV_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_TOTAL_REV_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_TOTAL_REV_R2} format="currency-clean" decimals={1} />}
                      </td>
                    </tr>
                    
                    {/* Cost of Sales */}
                    <tr className="border-b-2 border-muted/30">
                      <td className="py-3 text-foreground font-medium">Cost of Sales</td>
                      <td className="py-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU1_COS_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU1_COS_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU1_COS_R2} format="currency-clean" decimals={1} />}
                      </td>
                      <td className="py-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU2_COS_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU2_COS_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU2_COS_R2} format="currency-clean" decimals={1} />}
                      </td>
                      <td className="py-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU3_COS_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU3_COS_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU3_COS_R2} format="currency-clean" decimals={1} />}
                      </td>
                      <td className="py-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_TOTAL_COS_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_TOTAL_COS_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_TOTAL_COS_R2} format="currency-clean" decimals={1} />}
                      </td>
                    </tr>
                    
                    {/* Gross Profit */}
                    <tr className="border-b border-muted/20 bg-muted/5">
                      <td className="py-3 text-foreground font-bold">{FINANCIAL_STATEMENT.TOTALS.GROSS_PROFIT}</td>
                      <td className="py-3 text-center font-bold text-confirmation">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU1_GP_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU1_GP_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU1_GP_R2} format="currency-clean" decimals={1} />}
                      </td>
                      <td className="py-3 text-center font-bold text-confirmation">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU2_GP_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU2_GP_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU2_GP_R2} format="currency-clean" decimals={1} />}
                      </td>
                      <td className="py-3 text-center font-bold text-confirmation">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU3_GP_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU3_GP_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU3_GP_R2} format="currency-clean" decimals={1} />}
                      </td>
                      <td className="py-3 text-center font-bold text-confirmation">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_TOTAL_GP_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_TOTAL_GP_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_TOTAL_GP_R2} format="currency-clean" decimals={1} />}
                      </td>
                    </tr>
                    
                    {/* Gross Margin - with magenta separator line after */}
                    <tr className="border-b-[3px] border-secondary">
                      <td className="py-3 pb-6 text-foreground font-medium">Gross Margin</td>
                      <td className="py-3 pb-6 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU1_GM_R0} format="percentage" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU1_GM_R1} format="percentage" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU1_GM_R2} format="percentage" decimals={1} />}
                      </td>
                      <td className="py-3 pb-6 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU2_GM_R0} format="percentage" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU2_GM_R1} format="percentage" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU2_GM_R2} format="percentage" decimals={1} />}
                      </td>
                      <td className="py-3 pb-6 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_BU3_GM_R0} format="percentage" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_BU3_GM_R1} format="percentage" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_BU3_GM_R2} format="percentage" decimals={1} />}
                      </td>
                      <td className="py-3 pb-6 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_TOTAL_GM_R0} format="percentage" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_TOTAL_GM_R1} format="percentage" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_TOTAL_GM_R2} format="percentage" decimals={1} />}
                      </td>
                    </tr>
                    
                    {/* Operating Expenses - with magenta separator line after */}
                    <tr className="border-b-[3px] border-secondary">
                      <td className="pt-6 pb-3 text-foreground font-medium">Operating Expenses</td>
                      <td className="pt-6 pb-3 text-center"></td>
                      <td className="pt-6 pb-3 text-center"></td>
                      <td className="pt-6 pb-3 text-center"></td>
                      <td className="pt-6 pb-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_TOTAL_OPEX_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_TOTAL_OPEX_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_TOTAL_OPEX_R2} format="currency-clean" decimals={1} />}
                      </td>
                    </tr>
                    
                    {/* AOP */}
                    <tr className="border-b border-muted/20 bg-muted/5">
                      <td className="pt-6 pb-3 text-foreground font-bold">AOP</td>
                      <td className="pt-6 pb-3 text-center font-bold text-accent-1"></td>
                      <td className="pt-6 pb-3 text-center font-bold text-accent-1"></td>
                      <td className="pt-6 pb-3 text-center font-bold text-accent-1"></td>
                      <td className="pt-6 pb-3 text-center font-bold text-confirmation">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_TOTAL_OPINC_R0} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_TOTAL_OPINC_R1} format="currency-clean" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_TOTAL_OPINC_R2} format="currency-clean" decimals={1} />}
                      </td>
                    </tr>
                    
                    {/* Operating Margin */}
                    <tr>
                      <td className="py-3 text-foreground font-medium">Operating Margin</td>
                      <td className="py-3 text-center"></td>
                      <td className="py-3 text-center"></td>
                      <td className="py-3 text-center"></td>
                      <td className="py-3 text-center">
                        {selectedYear === 'year-0' && <CalcValue refName={debriefRanges.PNL_TOTAL_OM_R0} format="percentage" decimals={1} />}
                        {selectedYear === 'year-1' && <CalcValue refName={debriefRanges.PNL_TOTAL_OM_R1} format="percentage" decimals={1} />}
                        {selectedYear === 'year-2' && <CalcValue refName={debriefRanges.PNL_TOTAL_OM_R2} format="percentage" decimals={1} />}
                      </td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <NavigationControls
          onNext={() => setShowConfirmDialog(true)}
          backLabel={GENERAL_UI.BUTTONS.BACK}
          nextLabel="Submit Round"
          showDashboard={false}
        />

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Round</DialogTitle>
              <DialogDescription>
                Are you sure you want to submit this round? This will finalize your decisions and progress to the next round.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button variant="secondary-gradient" onClick={() => {
                const submissionKey = currentRound === 2 ? 'ROUND_2_SUBMITTED' : 'ROUND_1_SUBMITTED';
                markRoundAsSubmitted(submissionKey, setValue);
                navigate('/round-completed');
              }}>
                Yes, Submit Round
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}