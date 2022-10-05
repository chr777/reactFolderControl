
import React from 'react';
import Box from '@mui/material/Box';

import Folder from "./Folder";
import File from "./File";
import { useAppSelector } from '../redux/hooks';
import {
  selectData,
  selectTrashData
} from '../redux/features/dataSlice';

import { IListItem } from "../App";
import './listStyles.css';

function List ({ parentId, isTrashList } : any) {
  const trashData =  useAppSelector(selectTrashData);
  const ordinaryData = useAppSelector(selectData);

  const data = isTrashList ? trashData : ordinaryData;

  const list = parentId ? data.filter((item: IListItem) => item.parentId ===  parentId).map((item: IListItem) => item.type !== 'file' ?
                 <Folder key={item.id} item={item} isTrashList={isTrashList}/>  : <File key={item.id} data={item} isTrashList={isTrashList}/>) :
                          data.filter((item: IListItem) => !item.parentId).map((item: IListItem) => item.type !== 'file' ?
                 <Folder key={item.id} item={item} isTrashList={isTrashList}/>  : <File key={item.id} data={item} isTrashList={isTrashList}/>);
           
    return (
      <div className="List">
        <Box sx={{ width: '100%', minWidth: 100, maxWidth: 700}}>
          <nav aria-label="main mailbox folders">
              {list}
           </nav>
        </Box>
      </div>
    );
  }
  
  export default List;
  