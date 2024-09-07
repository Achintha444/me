import { CssBaseline, ThemeProvider } from "@mui/material";
import Head from "next/head";
import React from "react";
import "../styles/globals.css";
import { appTheme } from "../utils/theme/appTheme";

function MyApp(prop) {

    const { Component, pageProps } = prop;

    return (
        <>
            <Head>
                <title>Achintha Isuru</title>
                <link rel="shortcut icon" href="/favicon.webp" />
            </Head>
            <ThemeProvider theme={ appTheme }>
                <CssBaseline enableColorScheme />
                <Component { ...pageProps } />
            </ThemeProvider>

        </>

    );
}

export default MyApp;
