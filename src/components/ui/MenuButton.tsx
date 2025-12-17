import { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface MenuButtonProps {
  menuItems?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    separator?: boolean;
  }>;
  className?: string;
}

export function MenuButton({ menuItems = [], className = '' }: MenuButtonProps) {
  const [open, setOpen] = useState(false);

  // Default menu items if none provided
  const defaultMenuItems: MenuButtonProps['menuItems'] = [
    { label: 'Menu Item 1', onClick: () => console.log('Item 1') },
    { label: 'Menu Item 2', onClick: () => console.log('Item 2') },
  ];

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm border border-white/30 
                     hover:bg-white/10 hover:border-white/40 transition-all shadow-md 
                     flex items-center justify-center cursor-pointer ${className}`}
        >
          <Menu className="w-6 h-6 text-[#01426A]" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-card border border-[#01426A]/40 z-50">
        {items.map((item, index) => (
          <div key={index}>
            {item.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={item.onClick}>
              {item.icon && item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
