import { Grid } from '@mui/material'
import React from 'react'

export default function MainGrid(prop) {

    const { children } = prop;

    return (
        <div>
            <Grid container sx={{
                height: "100%"
            }}>
                <Grid item xs={0} sm={1} md={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                </Grid>
                <Grid item xs={12} sm={10} md={8} sx={{
                    '--Grid-borderWidth': '1px',
                    borderLeft: 'var(--Grid-borderWidth) solid',
                    borderRight: 'var(--Grid-borderWidth) solid',
                    borderColor: 'divider',
                    padding: "20px 40px",
                    minHeight: "66vh"
                }}>
                    {children}
                </Grid>
                <Grid item xs={0} sm={1} md={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                </Grid>
            </Grid>
        </div>
    )
}
