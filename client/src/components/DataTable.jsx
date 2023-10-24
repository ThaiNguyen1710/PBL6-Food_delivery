import React from "react";
import MaterialTable from "material-table";
import { ThemeProvider, createTheme } from "@mui/material";

const DataTable = ({ columns, data, title, actions }) => {
  const defaultMaterialTheme = createTheme();

  return <ThemeProvider  theme={defaultMaterialTheme}>
    <MaterialTable  
        columns={columns}
        data={Array.isArray(data) ? data : []} 
        title={title}
        actions={actions}
        
    />
  </ThemeProvider>;
};

export default DataTable;
