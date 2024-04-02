import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import navItemsConfig from "../../../utils/data/navItems.json";

interface Props {
    window?: () => Window;
}

const drawerWidth = 240;

export default function NavBar(props: Props) {
    const { window } = props;
    const [ mobileOpen, setMobileOpen ] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={ handleDrawerToggle } sx={ { textAlign: "center" } }>
            <Divider />
            <List>
                <ListItem key={ navItemsConfig.title.title } disablePadding>
                    <ListItemButton sx={ { textAlign: "center" } } href={ navItemsConfig.title.link }>
                        <ListItemText primary={ navItemsConfig.title.title } />
                    </ListItemButton>
                </ListItem>
                { navItemsConfig.content.map((item) => (
                    <ListItem key={ item.title } disablePadding>
                        <ListItemButton sx={ { textAlign: "center" } } href={ item.link } target={ item.target ? item.target : "_self" }>
                            <ListItemText primary={ item.title } />
                        </ListItemButton>
                    </ListItem>
                )) }
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={ { display: "flex" } }>
            <AppBar
                component="nav"
                elevation={ 0 }
                sx={ {
                    "--AppBar-borderWidth": "1px",
                    borderBottom: "var(--AppBar-borderWidth) solid",
                    borderColor: "divider"
                } }>
                <Toolbar>
                    <Box sx={ { flexGrow: 1, display: { xs: "none", sm: "block" } } }>
                        <Button key="name" href={ navItemsConfig.title.link } target="_self">
                            <Typography
                                variant="h6"
                                component="div"
                                color="text.primary"
                                textTransform="unset"
                            >
                                { navItemsConfig.title.title }
                            </Typography>
                        </Button>
                    </Box>
                    <Box sx={ { display: { xs: "none", sm: "block" } } }>
                        { navItemsConfig.content.map((item) => (
                            <Button key={ item.title } sx={ { color: "#242424" } } href={ item.link } target={ item.target ? item.target : "_self" }>
                                { item.title }
                            </Button>
                        )) }
                    </Box>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={ handleDrawerToggle }
                        sx={ { mr: 2, display: { sm: "none" } } }>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    container={ container }
                    variant="temporary"
                    open={ mobileOpen }
                    onClose={ handleDrawerToggle }
                    ModalProps={ {
                        keepMounted: true // Better open performance on mobile.
                    } }
                    sx={ {
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
                    } }
                >
                    { drawer }
                </Drawer>
            </Box>
            <Box sx={ { p: 4 } }>
            </Box>
        </Box>
    );
}
