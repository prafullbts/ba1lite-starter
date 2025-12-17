import React from 'react';
import { AthenaChatbot } from '@/components/AthenaChatbot';

interface AthenaButtonProps {
  className?: string;
}

export const AthenaButton: React.FC<AthenaButtonProps> = ({ className = '' }) => {
  return <AthenaChatbot />;
};
