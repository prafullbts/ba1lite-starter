import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { INVESTMENT_CARD } from '@/Sim/Content';

interface InvestmentCardProps {
  title: string;
  description: string;
  route: string;
  totalInvestment?: number;
  totalFTE?: number;
  isCompleted?: boolean;
}

export function InvestmentCard({ 
  title, 
  description, 
  route, 
  totalInvestment = 0, 
  totalFTE = 0,
  isCompleted = false 
}: InvestmentCardProps) {
  const navigate = useNavigate();

  return (
    <Card className={`transition-all hover:shadow-lg ${isCompleted ? 'border-secondary' : 'border-border'}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          {isCompleted && (
            <div className="text-xs text-secondary font-normal">{INVESTMENT_CARD.LABELS.COMPLETED}</div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-lg font-semibold">${totalInvestment}M</div>
            <div className="text-xs text-muted-foreground">{INVESTMENT_CARD.LABELS.TOTAL_INVESTMENT}</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-lg font-semibold">{totalFTE}</div>
            <div className="text-xs text-muted-foreground">{INVESTMENT_CARD.LABELS.TOTAL_CAPACITY}</div>
          </div>
        </div>

        <Button 
          onClick={() => navigate(route)} 
          className="w-full"
          variant={isCompleted ? "secondary" : "default"}
        >
          {isCompleted ? INVESTMENT_CARD.BUTTONS.REVIEW_INVESTMENTS : INVESTMENT_CARD.BUTTONS.MAKE_INVESTMENTS}
        </Button>
      </CardContent>
    </Card>
  );
}