import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
// Step management removed - FlowNavigation calculates step from tracking flags directly
import { useCalc } from '@/contexts/CalcContext';
import { useNavigate } from 'react-router-dom';
import { INITIATIVES, PAGE_CONTENT, UI_TEXT, getSelectedInitiativesFromCalcModel, markScreenAsVisited } from '@/Sim/Content';
import { ROUND_MANAGEMENT_RANGE_NAMES } from '@/Sim/RangeNameMap';

export default function InitiativeImpactsPage() {
  const { getValue, setValue } = useCalc();
  const navigate = useNavigate();
  
  // Get current round from CalcModel
  const currentRound = parseInt(getValue(ROUND_MANAGEMENT_RANGE_NAMES.CURRENT_ROUND) || '1');
  
  // Note: Step is calculated from screen tracking flags in FlowNavigation
  // No need to manually update step here

  const handleReturnToDashboard = () => {
    // Mark screen 4 as visited after returning to dashboard from initiative impacts
    markScreenAsVisited('SCREEN_4', setValue, getValue);
    navigate('/dashboard');
  };

  // Derive selected initiatives from calc model
  const selectedInitiativesData = React.useMemo(() => {
    return getSelectedInitiativesFromCalcModel(currentRound, getValue);
  }, [currentRound, getValue]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {PAGE_CONTENT.INITIATIVES.IMPACTS_TITLE} - Round {currentRound}
          </h1>
          <p className="text-muted-foreground">
            {PAGE_CONTENT.INITIATIVES.IMPACTS_DESCRIPTION}
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
        {selectedInitiativesData.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {selectedInitiativesData.map((initiative, index) => (
                <Card key={index} className="bg-card/95 backdrop-blur-sm border border-white/10 shadow-2xl shadow-accent-2/20 overflow-hidden hover:shadow-accent-2/30 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{initiative.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-muted-foreground mb-4">
                      {initiative.description}
                    </p>
                    <div>
                      <h4 className="font-semibold mb-3 text-base">Impacts</h4>
                      <ul className="space-y-2 text-base">
                        {(initiative.impact || [
                          '• Impact analysis will be available after selection',
                          '• Detailed metrics will be calculated',
                          '• Performance indicators will be updated',
                          '• Timeline: Implementation varies by initiative'
                        ]).map((impact, idx) => (
                          <li key={idx} dangerouslySetInnerHTML={{ __html: impact }} />
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleReturnToDashboard}
                variant="secondary-gradient"
                className="px-10 py-4 rounded-full text-lg font-semibold"
              >
                {UI_TEXT.BUTTONS.RETURN_TO_DASHBOARD}
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No initiatives selected. Please go back and select special initiatives first.
              </p>
              <Button
                onClick={() => navigate('/initiatives')}
                variant="outline"
                className="mt-4"
              >
                {UI_TEXT.BUTTONS.SELECT_INITIATIVES}
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </AppLayout>
);
}