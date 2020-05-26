import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Dashboard from '@material-ui/icons/Dashboard';
import Storage from '@material-ui/icons/Storage';
import People from '@material-ui/icons/People';
import Storefront from '@material-ui/icons/Storefront';
import InsertChart from '@material-ui/icons/InsertChart';
import TableChart from '@material-ui/icons/TableChart';

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
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="Usuários" />
              </ListItem>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <Storefront />
                </ListItemIcon>
                <ListItemText primary="Produtos" />
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
