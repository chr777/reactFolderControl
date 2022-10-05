import { useNavigate } from "react-router-dom";

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { useAppDispatch } from '../redux/hooks';
import { trash, deleteItem } from '../redux/features/dataSlice';

import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';

import './listStyles.css';

function File ({ data, isTrashList } : any) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
    return (
      <>
        <ListItem secondaryAction={
          <IconButton onClick={handleDelete} edge="end" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        }>
          <ListItemButton onClick={handleClick}>
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
  