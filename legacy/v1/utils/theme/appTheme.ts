import { pink } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export const appTheme = responsiveFontSizes(createTheme({
    palette: {
        primary: {
            main: "#F6EEE3",
            contrastText: "#242424"
        },
        secondary: pink,
        text: {
            primary: "#242424",
            secondary: "#667080"
        },
        divider: "#000000",
        background: {
            default: "#F6EEE3",
            paper: "#F6EEE3"

        }
    },
    typography: {
        body1: {
            fontFamily: "Minipax-Regular"
        },
        body2: {
            fontFamily: "SpaceGrotesk-Regular",
            fontSize: "1rem"
        },
        button: {
            fontFamily: "SpaceGrotesk-Regular",
            color: "#242424"
        },
        subtitle2: {
            fontFamily: "Minipax-Regular"
        },
        h2: {
            fontFamily: "Minipax-Regular"
        },
        h3: {
            fontFamily: "Minipax-Regular"
        },
        h4: {
            fontFamily: "Minipax-Regular"
        },

        h5: {
            fontFamily: "Minipax-SemiBold"
        },

        h6: {
            fontFamily: "Minipax-SemiBold"
        }
    },
    components: {
        MuiAvatar: {
            defaultProps: {
                variant: "circular"
            },
            styleOverrides: {
                "root": {
                    width: "4vw",
                    height: "4vw"
                }
            }
        },
        MuiAvatarGroup: {
            defaultProps: {
                spacing: "small",
                variant : "circular"
            },
            styleOverrides : {
                root : {
                    left : "0px",
                    position : "relative"
                }
            }
        }
    }
}));
