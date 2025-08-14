"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Option = {
    value: string;
    label: string;
};

interface MultiSelectProps {
    options: Option[];
    value: string[]; // valeurs sélectionnées (value[])
    onChange: (value: string[]) => void; // callback parent
    placeholder?: string;
}

export function MultiSelect({
                                options,
                                value,
                                onChange,
                                placeholder = "Search...",
                            }: MultiSelectProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    // On déduit les options sélectionnées à partir de props.value
    const selectedOptions = options.filter((opt) => value.includes(opt.value));
    const availableOptions = options.filter((opt) => !value.includes(opt.value));

    const handleUnselect = React.useCallback(
        (option: Option) => {
            onChange(value.filter((v) => v !== option.value));
        },
        [onChange, value]
    );

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (!input) return;

            if ((e.key === "Delete" || e.key === "Backspace") && input.value === "") {
                onChange(value.slice(0, -1)); // supprime le dernier élément
            }

            if (e.key === "Escape") {
                input.blur();
            }
        },
        [onChange, value]
    );

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selectedOptions.map((option) => (
                        <Badge key={option.value} variant="secondary">
                            {option.label}
                            <button
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleUnselect(option);
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(option)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="relative mt-2">
                <CommandList>
                    {open && availableOptions.length > 0 && (
                        <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                                {availableOptions.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => {
                                            setInputValue("");
                                            onChange([...value, option.value]);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </div>
                    )}
                </CommandList>
            </div>
        </Command>
    );
}
