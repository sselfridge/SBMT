const components = {
  MuiToolbar: {
    styleOverrides: {
      root: {
        minHeight: "30px !important",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        color: "white",
      },
    },
    defaultProps: {
      variant: "contained",
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        backgroundColor: "#44ecf6",
        height: 4,
      },
    },
  },
  MuiTypography: {
    defaultProps: {
      align: "center",
    },
  },
  MuiCssBaseline: {
    styleOverrides: (themeParam) => `
    .App-Body {
      background-color: #282c34; 
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: calc(10px + 2vmin);
      color: white;
    }
    `,
  },
};

export default components;
