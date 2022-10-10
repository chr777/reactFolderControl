import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { IListItem } from '../../App'

export interface IReducerInterface {
    data: IListItem[];
    trashData: IListItem[];
  }

// Define the initial state using that type
const initialState: IReducerInterface = {
    data: [],
    trashData: []
}

export const dataSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<any>) => {
        state.data = state.data.concat(action.payload)
        state.data = state.data.map((item: IListItem) => {
            if(item.id === action.payload.path[action.payload.path.length - 2]) return {...item, children: true}
            else return item
        }) 
    },
    getData: (state, action: PayloadAction<IListItem[]>) => {
        state.data = action.payload
    },
    trash: (state, action: PayloadAction<IListItem>) => {
        const data = state.data.filter((item: any) => item.path.includes(action.payload.id))
        const treshData = data.map((item: any) => {
          if(item.path.includes(action.payload.id) && item.id === action.payload.id)
            return {...item, parentId: false, trashParentId: action.payload.parentId}
          else return item;
        })
        state.data = state.data.filter(item => !(Array.isArray(item.path) && item.path.includes(action.payload.id)))
        state.trashData = treshData ? [...state.trashData, ...treshData] : [...state.trashData, action.payload] 

          state.data = state.data.map((item: any) => {
            if(item.id === action.payload.parentId && !(state.data.filter((i: any) => i.path.includes(item.id)).length > 1))
              return {...item, children: false}
            else return item;
          });      
    },
    deleteItem: (state, action: PayloadAction<IListItem>) => {
        state.trashData = state.trashData.filter((item: IListItem) => item.id !== action.payload.id);

       state.trashData = state.trashData.map((item: any) => {
          if(item.id === action.payload.parentId && !(state.trashData.filter((i: any) => i.path.includes(item.id)).length > 1))
            return {...item, children: false}
          else return item;
        });
         
    },
    restore: (state, action: PayloadAction<IListItem>) => {
      const restoreData = state.trashData.filter((item: any) => item.path.includes(action.payload.id)).map((item: IListItem) => {
        if(item.trashParentId)
          return {...item, parentId: item.trashParentId, trashParentId: false}
        else return item
        })
      state.data = [...state.data, ...restoreData]
      state.trashData = state.trashData.filter((item: IListItem) => !(Array.isArray(item.path) && item.path.includes(action.payload.id)))

      state.data = state.data.map((item: any) => {
        if(item.id === action.payload.trashParentId || (state.data.filter((i: any) => i.path.includes(item.id)).length > 1))
          return {...item, children: true}
        else return item;
      });         
    },
    saveText: (state, action: PayloadAction<{id: number, text: string | undefined}>) => {
      state.data = state.data.map((item: IListItem) => {
          if(item.id === action.payload.id) return {...item, text: action.payload.text}
          else return item
      }) 
  },
  },
})

export const { add, getData, trash, deleteItem, restore, saveText } = dataSlice.actions

export const selectData = (state: RootState) => state.data.data
export const selectTrashData = (state: RootState) => state.data.trashData


export default dataSlice.reducer