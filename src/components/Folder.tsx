import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {  trash, deleteItem, restore, selectData } from '../redux/features/dataSlice';
import { toggleError } from '../redux/features/errorSlice';

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
import { IListItem } from '../App';
import { findSameName } from '../util';

import './listStyles.css';

function Folder ({ item, isTrashList } : any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const ordinaryData = useAppSelector(selectData);

  const [open, setOpen] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    const path = location.pathname.split('/').filter(((item: string) => item.length > 0)).map((i: string) => +i);

    if(path[path.length-1] === item.id){
      setIsActive(true);
    }
    else{
      setIsActive(false);
    }
  },[location.pathname])


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

  const handleRestore= () => {
    navigate('/trash');
    const parentFromData = ordinaryData.find((i: IListItem) => i.id === item.parentId);
    const sameName = findSameName(ordinaryData, item.name, item.parentId);
    if(!parentFromData && item.parentId) {
      dispatch(toggleError({isOpen: true, message: 'Parent cannot be found in data'}));
      return;
    }
    if(sameName) {
      dispatch(toggleError({isOpen: true, message: 'There is already folder/file with the same name in data'}));
      return;
    }
    dispatch(restore(item));
  };

    return (
      <>
        <ListItem style={{backgroundColor: isActive ? '#ebf4fb' : '', borderRadius: '15px'}} 
                          secondaryAction={
                            <div>
                              <IconButton onClick={handleDelete} edge="end" aria-label="delete">
                                <DeleteIcon />
                              </IconButton>
                              {isTrashList && <IconButton onClick={handleRestore} edge="end" aria-label="restore">
                                <RestorePageIcon />
                              </IconButton>}
                            </div>         
                          }>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
                <FolderIcon />
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
         {item.children && (open ? <ExpandLess  style={{marginRight: isTrashList ? '24px' : '4px'}}/> : <ExpandMore style={{marginRight: isTrashList ? '24px' : '4px'}} />)}
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
  