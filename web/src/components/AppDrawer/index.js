import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  Storage,
  InsertChart,
  TableChart,
} from '@material-ui/icons';

import style from './styles';

function AppMenu() {
  const classes = style();

  const [registerOpen, setRegisterOpen] = useState(false);
  const [graphsOpen, setGraphsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setRegisterOpen(!registerOpen);
            }}
          >
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary="Cadastros" />
            {registerOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={registerOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/users"
              >
                <ListItemText primary="Usuários" />
              </ListItem>
              <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/packages"
              >
                <ListItemText primary="Embalagens" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => {
              setGraphsOpen(!graphsOpen);
            }}
          >
            <ListItemIcon>
              <InsertChart />
            </ListItemIcon>
            <ListItemText primary="Gráficos" />
            {graphsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={graphsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <InsertChart />
                </ListItemIcon>
                <ListItemText primary="Gráfico Teste" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => {
              setReportsOpen(!reportsOpen);
            }}
          >
            <ListItemIcon>
              <TableChart />
            </ListItemIcon>
            <ListItemText primary="Relatórios" />
            {reportsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <TableChart />
                </ListItemIcon>
                <ListItemText primary="Relatório Teste" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </div>
    </Drawer>
  );
}

export default AppMenu;
