import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { trash, deleteItem, restore, selectData } from '../redux/features/dataSlice';
import { toggleError } from '../redux/features/errorSlice';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';

import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import FolderIcon from '@mui/icons-material/Folder';
import { IListItem } from '../App';
import { findSameName } from "../util";

import './listStyles.css';

function File ({ data, isTrashList } : any) {
  const location = useLocation()
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const ordinaryData = useAppSelector(selectData);

  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    const path = location.pathname.split('/').filter(((item: string) => item.length > 0)).map((i: string) => +i);

    if(path[path.length-1] === data.id){
      setIsActive(true);
    }
    else{
      setIsActive(false);
    }
  },[location.pathname])

  const handleClick = () => {
    let path = ''
    for(let i = 0; i < data.path.length; i++) {
      path = path ? path + '/' + data.path[i] : '/' + data.path[i];
    }
    navigate(path);
  };

  const handleDelete = () => {
    let path = ''
    for(let i=0; i < data.path.length-1; i++) {
        path = path ? path + '/' + data.path[i] : '/' + data.path[i];
      }
    !isTrashList && navigate(path);
    
    isTrashList ? dispatch(deleteItem(data)) : dispatch(trash(data))
  };

  
  const handleRestore= () => {
    navigate('/trash');
    const parentFromData = ordinaryData.find((item: IListItem) => item.id === data.parentId);
    const sameName = findSameName(ordinaryData, data.name, data.parentId);
    if(!parentFromData && data.parentId) {
      dispatch(toggleError({isOpen: true, message: 'Parent cannot be found in data'}));
      return;
    }
    if(sameName) {
      dispatch(toggleError({isOpen: true, message: 'There is already file/folder with the same name in data'}));
      return;
    }
    dispatch(restore(data));
  };

    return (
      <>
        <ListItem style={{backgroundColor: isActive ? '#ebf4fb' : '', borderRadius: '15px'}} secondaryAction={
          <div>
            <IconButton onClick={handleDelete} edge="end" aria-label="delete">
              <DeleteIcon />
            </IconButton>
            {isTrashList && <IconButton onClick={handleRestore} edge="end" aria-label="restore">
              <RestorePageIcon />
            </IconButton>}
          </div>   
        }>
          <ListItemButton style={{backgroundColor: isActive ? '#ebf4fb' : ''}} onClick={handleClick}>
            <ListItemIcon>
               {data.type === 'file' ? <InsertDriveFileIcon /> : <FolderIcon />}
            </ListItemIcon>
            <ListItemText primary={data.name} />
          </ListItemButton>
        </ListItem>
        <Divider />
      </>
      
    );
  }
  
  export default File;
  