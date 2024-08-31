import { Dispatch, SetStateAction, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import Link from "next/link";

interface Items {
  value: string;
  label: string;
}

interface MultiComboboxProps {
  items: Items[];
  multipleMode?: "selections" | "names";
  itemText?: string;
  nothingFoundText?: string;
  nothingFoundLink?: string;
  customWidth?: string;
  defaultValue?: string;
}

interface SingleComboboxProps {
  items: Items[];
  itemText?: string;
  nothingFoundText?: string;
  nothingFoundLink?: string;
  customWidth?: string;
  defaultValue?: string;
  setCurrentItem?: Dispatch<SetStateAction<string>>;
}
export function MultiCombobox({
  items,
  itemText = "Item",
  multipleMode = "selections",
  nothingFoundText = "No Item Found.",
  nothingFoundLink = "",
  customWidth = "min-w-[200px]",
}: MultiComboboxProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleValue = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((val) => val !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const isSelected = (value: string) => selectedValues.includes(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", customWidth)}
        >
          {selectedValues.length > 0
            ? multipleMode === "selections"
              ? `${selectedValues.length} selected`
              : selectedValues
                  .map((value) => {
                    const selectedFramework = items.find(
                      (fw) => fw.value === value
                    );
                    return selectedFramework ? selectedFramework.label : null;
                  })
                  .join(", ")
            : `Select ${itemText}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${itemText}...`} />
          <CommandEmpty>
            {nothingFoundText ? (
              <Link href={nothingFoundLink}>{nothingFoundText}</Link>
            ) : (
              nothingFoundText
            )}
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {items.map((singleItem: Items) => (
                <CommandItem
                  key={singleItem.value}
                  value={singleItem.value}
                  onSelect={() => toggleValue(singleItem.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected(singleItem.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {singleItem.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function SingleCombobox({
  items,
  itemText = "Item",
  nothingFoundText = "No Item Found.",
  nothingFoundLink = "",
  customWidth = "min-w-[200px]",
  defaultValue,
  setCurrentItem,
}: SingleComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    defaultValue || (items.length > 0 ? items[0]?.value : "")
  );

  const handleSelect = (currentValue: string) => {
    const newValue =
      currentValue === value
        ? items.length > 0
          ? items[0]?.value
          : ""
        : currentValue;
    setValue(newValue);
    setOpen(false);
    if (setCurrentItem) {
      setCurrentItem(newValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", customWidth)}
        >
          {value
            ? items.find((singleItem) => singleItem.value === value)?.label
            : `Select ${itemText}`}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[190px] p-0">
        <Command className="w-full">
          <CommandInput placeholder={`Search ${itemText}...`} />
          <CommandEmpty>
            {nothingFoundText ? (
              <Link href={nothingFoundLink}>{nothingFoundText}</Link>
            ) : (
              nothingFoundText
            )}
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {items.map((singleItem) => (
                <CommandItem
                  key={singleItem.value}
                  value={singleItem.value}
                  onSelect={() => handleSelect(singleItem.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      value === singleItem.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {singleItem.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
