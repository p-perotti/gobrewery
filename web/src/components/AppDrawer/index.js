import React, { useState } from 'react';
import { useSelector } from 'react-redux';
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
  ListAlt,
  InsertChart,
  TableChart,
} from '@material-ui/icons';

import style from './styles';

function AppMenu() {
  const classes = style();

  const administrator = useSelector((state) => state.user.administrator);

  const [registerOpen, setRegisterOpen] = useState(false);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
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
          {administrator && (
            <ListItem button component={Link} to="/dashboard">
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          )}
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
              {administrator && (
                <ListItem
                  button
                  className={classes.nested}
                  component={Link}
                  to="/users"
                >
                  <ListItemText primary="Usuários" />
                </ListItem>
              )}
              <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/sizes"
              >
                <ListItemText primary="Tamanhos" />
              </ListItem>
              <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/products"
              >
                <ListItemText primary="Produtos" />
              </ListItem>
              <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/coupons"
              >
                <ListItemText primary="Cupons" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => {
              setMaintenanceOpen(!maintenanceOpen);
            }}
          >
            <ListItemIcon>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary="Manutenções" />
            {maintenanceOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={maintenanceOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                className={classes.nested}
                component={Link}
                to="/stock-operations"
              >
                <ListItemText primary="Movimentações de estoque" />
              </ListItem>
            </List>
          </Collapse>
          {administrator && (
            <>
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
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/charts/best-sellers-by-liter"
                  >
                    <ListItemText primary="Produtos mais vendidos (por L)" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/charts/monthly-stock-operations-by-week"
                  >
                    <ListItemText primary="Movimentações de estoque semanal por mês" />
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
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/sales"
                  >
                    <ListItemText primary="Vendas" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/stock-operations"
                  >
                    <ListItemText primary="Estoque" />
                  </ListItem>
                  <ListItem
                    button
                    className={classes.nested}
                    component={Link}
                    to="/reports/total-discount-by-coupon"
                  >
                    <ListItemText primary="Desconto total por cupom" />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}
        </List>
      </div>
    </Drawer>
  );
}

export default AppMenu;
