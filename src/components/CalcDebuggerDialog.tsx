import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { CalcDebugger } from './CalcDebugger';

interface CalcDebuggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CalcDebuggerDialog: React.FC<CalcDebuggerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0 bg-gray-50 [&>button]:hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-gray-700" />
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Calc Debugger
              </DialogTitle>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                Developer Tool
              </span>
            </div>
          </div>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <CalcDebugger />
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

