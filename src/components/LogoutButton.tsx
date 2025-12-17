import React, { useState } from 'react';
import { useLogout } from '@/utils/logout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { LOGOUT_DIALOG } from '@/Sim/Content';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'outline',
  size = 'default',
  className = '',
  showIcon = true,
  children = LOGOUT_DIALOG.BUTTONS.LOGOUT
}) => {
  const handleLogout = useLogout();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const confirmLogout = async () => {
    setShowLogoutDialog(false);
    await handleLogout();
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowLogoutDialog(true)}
        className={`gap-2 ${className}`}
      >
        {showIcon && <LogOut className="h-4 w-4 scale-x-[-1]" />}
        {children}
      </Button>

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
              onClick={confirmLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4 scale-x-[-1]" />
              {LOGOUT_DIALOG.BUTTONS.LOGOUT}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
