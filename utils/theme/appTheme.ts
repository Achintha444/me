import { pink } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const appTheme = responsiveFontSizes(createTheme({
    palette: {
        primary: {
            main: "#6082B6",
            contrastText: "#242424"
        },
        secondary: pink,
        text: {
            primary: "#dbe2ec",
            secondary: "#a5adb9"
        },
        divider: "#1f1f1f",
        background: {
            default: "#121212",
            paper: "#121212"

        }
    },
    typography: {
        body1: {
            fontFamily: "BioRhyme-Light",
            fontSize: "1.2rem"
        },
        body2: {
            fontFamily: "Cabin-Regular",
            fontSize: "1.1rem"
        },
        button: {
            fontFamily: "Cabin-Regular"
        },
        subtitle2: {
            fontFamily: "BioRhyme-Light"
        },
        h2: {
            fontFamily: "BioRhyme-Light"
        },
        h3: {
            fontFamily: "BioRhyme-Light"
        },
        h4: {
            fontFamily: "BioRhyme-Light"
        },

        h5: {
            fontFamily: "BioRhyme-Light"
        },

        h6: {
            fontFamily: "BioRhyme-Light",
            fontSize: "1.4rem"
        }
    },
    components: {
        MuiAvatar: {
            defaultProps: {
                variant: "circular",
            },
            styleOverrides: {
                root: {
                    width: "4vw",
                    height: "4vw",
                    background: "#1f1f1f",
                    backgroundColor: "#1f1f1f",
                }
            }
        },
        MuiAvatarGroup: {
            defaultProps: {
                spacing: "small",
                variant : "circular",
            },
            styleOverrides : {
                root : {
                    position : "relative",
                    left : "0px"
                }
            }
        },
        MuiAppBar: {
            defaultProps: {
                elevation: 0
            },
            styleOverrides: {
                root: {
                    background: "#1f1f1f",
                    borderWidth: "1px",
                    borderColor: "#dbe2ec",
                    font: "#dbe2ec"
                }
            }
        }
    }
}));
