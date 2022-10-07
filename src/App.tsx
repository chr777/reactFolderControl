import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { getData, add, selectData } from './redux/features/dataSlice';
import { selectError, toggleError } from './redux/features/errorSlice';

import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from "./components/List";
import { findSameName, parentIsFile } from './util';
import { dataInitial } from "./data";

import './App.css';

export interface IListItem {
  id: number,
  type: string,
  children?: IListItem[] | boolean,
  name: string,
  path:  boolean | number[],
  parentId: boolean | number,
  trashParentId?: number | boolean,
  text?: string,
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [folderName, setFolderName] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [trashIsOpen, setOpenTrash] = useState<boolean>(false)
  const [textArea, setTextArea] = useState<any>(null)

  const error = useAppSelector(selectError);
  const data = useAppSelector(selectData);

  useEffect(()=> {
    dispatch(getData(dataInitial));
  },[dispatch])

  useEffect(() => {
    const path = location.pathname.split('/').filter(((item: string) => item.length > 0)).map((i: string) => +i);
    const foundItem = data.find((item: IListItem) => item.id === path[path.length-1] && item.type === 'file')?.id
    if(foundItem && path.length > 0){
      setTextArea(foundItem);
    }
    else{
      setTextArea(false);
    }
  },[location.pathname])

  const id = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

  const handleAddFolder = useCallback(() => {
    const path = location.pathname.split('/').filter(((item: string) => item.length > 0)).map((i: string) => +i);
    const newPath = [...path, Math.floor((1 + Math.random()) * 0x10000)];
    const newFolder: IListItem = {
                    name: folderName,
                    children: false,
                    id: newPath[newPath.length-1],
                    type: 'folder', path: newPath,
                    parentId: id ? +path[path.length-1] : false
                  };

    setFolderName('');
    if(!folderName) return;
    if(findSameName(data, folderName, newFolder.parentId.toString())){
      dispatch(toggleError({isOpen: true, message: 'You have folder/file with the same name!'}));
      return;
    }
    if(parentIsFile(data, newFolder.parentId.toString())){
      dispatch(toggleError({isOpen: true, message: 'Cannot create folder in file!'}));
      return;
    }
    dispatch(add(newFolder));

  }, [id, folderName, data,location.pathname, dispatch]);

  const handleAddFile = useCallback(() => {
    const path = location.pathname.split('/').filter(((item: string) => item.length > 0)).map((i: string) => +i);
    const newPath = [...path, Math.floor((1 + Math.random()) * 0x10000)];
    const newFile: IListItem = {
            name: fileName,
            id: newPath[newPath.length-1],
            type: 'file',
            path: newPath, parentId: id ? +path[path.length-1] : false,
            children: false
          };

    setFileName('');
    if(!fileName) return;
    if(findSameName(data, fileName, newFile.parentId.toString())){
      dispatch(toggleError({isOpen: true, message: 'You have folder/file with the same name!'}));
      return;
    }
    if(parentIsFile(data, newFile.parentId.toString())){
      dispatch(toggleError({isOpen: true, message: 'Cannot create file in file!'}));
      return;
    }
    dispatch(add(newFile));

}, [id, fileName, data, dispatch, location.pathname]);

  const handleToggleTrash = () => {
    trashIsOpen ? navigate('/') : navigate('trash')
    setOpenTrash(!trashIsOpen)
  }

  const handleHome = () => {
    navigate('/')
    setOpenTrash(false)
  }

  // console.log('data', data);

  return (
      <div className="App">
        <header className="App-header">
          <div className="Home">
            <IconButton aria-label="home" onClick={handleHome}>
              <HomeIcon />
            </IconButton>
          </div>
          <h1>React Folder Control</h1>
        </header>
        <div className="Body">
          <div className="Buttons">
              <TextField value={folderName} onChange={(e) => setFolderName(e.target.value)} style={{marginRight: '8px'}} label="Folder Name" variant="filled"  size='small' disabled={trashIsOpen} />
              <Button onClick={handleAddFolder} style={{marginRight: '18px'}} variant="contained" size="large" disabled={trashIsOpen}>
                Add folders
              </Button>
              <TextField value={fileName} onChange={(e) => setFileName(e.target.value)}  style={{marginRight: '8px'}} label="File Name" variant="filled" size='small' disabled={trashIsOpen}/>
                <Button onClick={handleAddFile} style={{marginRight: '18px'}} variant="contained" size="large" disabled={trashIsOpen} >
                    Add File
                </Button>
                <Button onClick={handleToggleTrash} style={{marginRight: '18px'}} variant="contained" color={trashIsOpen ? "secondary" : "error"}size="large">
                  {trashIsOpen ? 'Go Back' : 'Trash'}
                </Button>
          </div>
          {trashIsOpen ? <List parentId={false} isTrashList /> : <List parentId={false} isTrashList={false} />}
        </div>
        {error.isOpen && <div className='Error'>
                        <Alert onClose={() => dispatch(toggleError({isOpen: false, message: ''}))} variant="filled" severity="error">{error.message}</Alert>
                      </div>}
      </div>  
  );
}

export default App;
