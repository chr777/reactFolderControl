import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from "./components/List";
import { findSameName, parentIsFile } from './util';
import { dataInitial as data } from "./data";
import { useAppDispatch, useAppSelector } from './redux/hooks';
import {
  getData,
  add,
  selectData
} from './redux/features/dataSlice';

import './App.css';

export interface IListItem {
  id: number,
  type: string,
  children?: IListItem[] | boolean,
  name: string,
  path:  boolean | number[],
  parentId: boolean | number,
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [folderName, setFolderName] = useState<string>('')
  const [fileName, setFileName] = useState<string>('')
  const [alertOpen, setAlertOpen] = useState<boolean>(false)
  const [alertText, setAlertText] = useState<string>('')
  const [trashIsOpen, setOpenTrash] = useState<boolean>(false)


  const stateData = useAppSelector(selectData);

  useEffect(()=> {
    dispatch(getData(data));
  },[dispatch])


  const id = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

  const handleAddFolder = useCallback(() => {
    const path = location.pathname.split('/').filter(((item: string) => item.length > 0)).map((i: string) => +i);
    const newPath = [...path, stateData.length+12];
    console.log('path', path, 'newPath', newPath);
    const newFolder: IListItem = {name: folderName, children: false, id: stateData.length+12, type: 'folder', path: newPath, parentId: id ? +path[path.length-1] : false};

    setFolderName('');
    if(!folderName) return;
    if(findSameName(stateData, folderName, newFolder.parentId.toString())){
      setAlertText('You have folder/file with the same name!');
      setAlertOpen(true);
      return;
    }
    if(parentIsFile(stateData, newFolder.parentId.toString())){
      setAlertText('Cannot create folder in file!');
      setAlertOpen(true);
      return;
    }
    dispatch(add(newFolder));


  }, [id, folderName, stateData,location.pathname, dispatch]);

  const handleAddFile = useCallback(() => {
    const path = location.pathname.split('/').filter(((item: string) => item.length > 0)).map((i: string) => +i);
    const newPath = [...path, stateData.length+15];
    const newFile: IListItem = {name: fileName, id: stateData.length+12, type: 'file', path: newPath, parentId: id ? +path[path.length-1] : false, children: false};

    setFileName('');
    if(!fileName) return;
    if(findSameName(stateData, fileName, newFile.parentId.toString())){
      setAlertText('You have folder/file with the same name!');
      setAlertOpen(true);
      return;
    }
    if(parentIsFile(stateData, newFile.parentId.toString())){
      setAlertText('Cannot create file in file!!');
      setAlertOpen(true);
      return;
    }
    dispatch(add(newFile));

}, [id, fileName, stateData, dispatch, location.pathname]);

  const handleToggleTrash = () => {
    trashIsOpen ? navigate('/') : navigate('trash')
    setOpenTrash(!trashIsOpen)
  }

  const handleHome = () => {
    navigate('/')
    setOpenTrash(false)
  }

  // console.log('stateData', stateData);

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
              <Button onClick={handleAddFolder} style={{marginRight: '18px'}} variant="contained" size="large">
                Add folders
              </Button>
              <TextField value={fileName} onChange={(e) => setFileName(e.target.value)}  style={{marginRight: '8px'}} label="File Name" variant="filled" size='small' disabled={trashIsOpen}/>
                <Button onClick={handleAddFile} style={{marginRight: '18px'}} variant="contained" size="large">
                    Add File
                </Button>
                <Button onClick={handleToggleTrash} style={{marginRight: '18px'}} variant="contained" color={trashIsOpen ? "secondary" : "error"}size="large">
                  {trashIsOpen ? 'Go Back' : 'Trash'}
                </Button>
          </div>
          {trashIsOpen ? <List parentId={false} isTrashList /> : <List parentId={false} isTrashList={false} />}
        </div>
        {alertOpen && <div className='Error'>
                        <Alert onClose={() => setAlertOpen(false)} variant="filled" severity="error">{alertText}</Alert>
                      </div>}
      </div>  
  );
}

export default App;
