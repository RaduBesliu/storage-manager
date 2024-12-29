"use client";

import { useState } from "react";
import { Combobox, InputBase, useCombobox } from "@mantine/core";

export const SearchableSelect = ({
  data,
  placeholder,
  onSubmit,
}: {
  data: { key: string; value: string }[];
  placeholder?: string;
  onSubmit: (key: string) => void; // Adjusted to submit the key
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState("");

  // Filter options based on search input
  const filteredOptions = data.filter((item) =>
    item.value.toLowerCase().includes(search.toLowerCase().trim()),
  );

  // Render options
  const options = filteredOptions.map((item) => (
    <Combobox.Option key={item.key} value={item.key}>
      {item.value}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(key) => {
        const selectedOption = data.find((item) => item.key === key);
        if (selectedOption) {
          setSearch(selectedOption.value); // Set the displayed value
          combobox.closeDropdown();
          onSubmit(key); // Submit the key
        }
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          value={search}
          onChange={(event) => {
            const value = event.currentTarget.value;
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(search || "");
          }}
          placeholder={placeholder ?? "Search value"}
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? (
            options.length > 16 ? (
              options.slice(0, 16)
            ) : (
              options
            )
          ) : (
            <Combobox.Empty>Nothing found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
