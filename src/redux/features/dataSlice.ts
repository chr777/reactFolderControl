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
    add: (state, action: PayloadAction<IListItem>) => {
        state.data = state.data.concat(action.payload) 
    },
    getData: (state, action: PayloadAction<IListItem[]>) => {
        state.data = action.payload
    },
    trash: (state, action: PayloadAction<IListItem>) => {
        const data = state.data.filter((item: any) => item.path.includes(action.payload.id))
        const treshData = data.map((item: any) => {
          if(item.path.includes(action.payload.id) && item.id === action.payload.id)
            return {...item, parentId: false}
          else return item;
        })
        state.data = state.data.filter(item => !(Array.isArray(item.path) && item.path.includes(action.payload.id)))
        state.trashData = treshData ? [...state.trashData, ...treshData] : [...state.trashData, action.payload] 
    },
    deleteItem: (state, action: PayloadAction<IListItem>) => {
        state.trashData = state.trashData.filter(item => item.id !== action.payload.id)
    },
    restore: (state, action: PayloadAction<number>) => {
            //   state.value += action.payload
    },
  },
})

export const { add, getData, trash, deleteItem, restore } = dataSlice.actions

export const selectData = (state: RootState) => state.data.data
export const selectTrashData = (state: RootState) => state.data.trashData


export default dataSlice.reducer