import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface MenuItemType {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  menuList: MenuItemType[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end';  // Updated alignment values
  placeholder?: string | 'Please Select';
  disabled?: boolean
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  menuList,
  value,
  onChange,
  className,
  buttonClassName,
  contentClassName,
  placeholder,
  align = 'start',  // Default alignment is 'start'
  disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
    menuList.find((menuItem) => menuItem.value === value) || null
  );

  const handleSelect = (menuItem: MenuItemType) => {
    setSelectedMenuItem(menuItem);
    onChange(menuItem.value);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75",
              buttonClassName,
              `${disabled ? 'pointer-events-none opacity-50' : 'pointer-events-auto opacity-100'}`
            )}
          >
            {selectedMenuItem?.label || placeholder || 'Please Select'}
            {open ? <ChevronUp className="opacity-50" /> : <ChevronDown className="opacity-50" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align={align}
          sideOffset={8}
          className={cn(
            "absolute z-10 w-max p-0 max-h-48 overflow-y-auto bg-white shadow-md",
            contentClassName,
          )}
        >
          {menuList.map((menuItem) => (
            <div
              key={menuItem.value}
              className={cn(
                "cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between",
                selectedMenuItem?.value === menuItem.value && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleSelect(menuItem)}
            >
              {menuItem.label}
              <Check
                className={cn(
                  "ml-2",
                  selectedMenuItem?.value === menuItem.value ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomSelect;
