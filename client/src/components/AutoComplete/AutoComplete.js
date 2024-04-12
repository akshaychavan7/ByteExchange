import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function AutoComplete({ options, value, setValue }) {
  return (
    <Autocomplete
      freeSolo
      options={options}
      value={value}
      onSelect={(event) => setValue(event.target.value)}
      renderInput={(params) => <TextField {...params} label="Location" />}
    />
  );
}
