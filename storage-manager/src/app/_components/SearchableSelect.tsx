"use client";

import { useState } from "react";
import {
  Combobox,
  Group,
  InputBase,
  ScrollArea,
  useCombobox,
  Text,
} from "@mantine/core";

export const SearchableSelect = ({
  data,
  placeholder,
  onSubmit,
}: {
  data: {
    key: string;
    value: string;
    storeName?: string;
    storeChainName?: string;
  }[];
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
      <Group>
        <div>
          <Text fz="sm" fw={500}>
            {item.value}
          </Text>
          {item.storeName ? (
            <Text fz="xs" opacity={0.6}>
              {item.storeName}
            </Text>
          ) : null}
          {item.storeChainName ? (
            <Text fz="xs" opacity={0.6}>
              {item.storeChainName}
            </Text>
          ) : null}
        </div>
      </Group>
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
          <ScrollArea.Autosize mah={200} type="scroll">
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>Nothing found</Combobox.Empty>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
