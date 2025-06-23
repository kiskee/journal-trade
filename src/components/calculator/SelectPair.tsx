import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  tradingPairs: { value: string; label: string }[];
};

const SelectPair = ({ value, onChange, tradingPairs }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex flex-col items-center">
      <FormLabel className="text-blue-600 text-2xl">Pares</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-[200px] justify-between",
                !value && "text-muted-foreground",
                "text-black"
              )}
            >
              {value
                ? tradingPairs.find((pair) => pair.value === value)?.label
                : "Selecciona un Par"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar..." className="h-9" />
            <CommandList>
              <CommandEmpty>No se encontró el par.</CommandEmpty>
              <CommandGroup>
                {tradingPairs.map((pair) => (
                  <CommandItem
                    value={pair.label}
                    key={pair.value}
                    onSelect={() => {
                      onChange(pair.value);
                      setOpen(false);
                    }}
                  >
                    {pair.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        pair.value === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};

export default SelectPair;  