import * as React from "react";
import { ReactElement, ReactNode } from "react";
import {
  List,
  MenuItem,
  ListItemIcon,
  Typography,
  Collapse,
  Tooltip,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useTranslate, useSidebarState } from "react-admin";

interface Props {
  dense: boolean;
  handleToggle: () => void;
  icon: ReactElement;
  isOpen: boolean;
  name: string;
  children: ReactNode;
}

const SubMenu: React.FC<Props> = ({
  dense,
  handleToggle,
  icon,
  isOpen,
  name,
  children,
}) => {
  const [sidebarIsOpen] = useSidebarState();

  const header = (
    <MenuItem
      dense={dense}
      onClick={handleToggle}
      className="rounded-r-xl px-3 py-3 hover:bg-[#fabe79] hover:text-white gap-4 mb-2"
    >
      <div>{isOpen ? <ExpandMore /> : icon}</div>
      <p>{name}</p>
    </MenuItem>
  );

  return (
    <div>
      {sidebarIsOpen || isOpen ? (
        header
      ) : (
        <Tooltip title={name} placement="right">
          {header}
        </Tooltip>
      )}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          dense={dense}
          component="div"
          disablePadding
          sx={{
            "& .MuiMenuItem-root": {
              transition: "padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
            },
          }}
        >
          {children}
        </List>
      </Collapse>
    </div>
  );
};

export default SubMenu;
