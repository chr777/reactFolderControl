import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from '../redux/hooks';
import {  trash, deleteItem } from '../redux/features/dataSlice';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import List from './List';

import './listStyles.css';

function Folder ({ item, isTrashList } : any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if(location.pathname === '/')
      setOpen(false);
  }, [location.pathname])

  const handleClick = () => {
    let path = ''
    if(open){
      for(let i=0; i < item.path.length-1; i++) {
        path = path ? path + '/' + item.path[i] : '/' + item.path[i];
      }
      navigate(path);
    }else {
      for(let i=0; i < item.path.length; i++) {
        path = path ? path + '/' + item.path[i] : '/' + item.path[i];
      }
      navigate(path);
    }
    setOpen(!open);

  };

  const handleDelete = () => {
    let path = ''
    for(let i=0; i < item.path.length-1; i++) {
        path = path ? path + '/' + item.path[i] : '/' + item.path[i];
      }
    !isTrashList && navigate(path);
    
    isTrashList ? dispatch(deleteItem(item)) : dispatch(trash(item))
  };

    return (
      <>
        <ListItem secondaryAction={
          <>
          {/* {isTrashList && <IconButton onClick={handleDelete} edge="end" aria-label="restore">
            <DeleteIcon />
          </IconButton>} */}
          <IconButton onClick={handleDelete} edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
          </>         
        }>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
                <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
         {item.children && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        <Collapse style={{margin: 0, padding: 0}} in={open} timeout="auto" unmountOnExit>
          <div style={{marginLeft: '18px'}}>
            {isTrashList ? <List isTrashList parentId={item.id} /> : <List isTrashList={false} parentId={item.id} />}
          </div>
        </Collapse>
        <Divider />
      </>
      
    );
  }
  
  export default Folder;
  