import { IListItem } from "./App"

export const  findSameName = (data: IListItem[], name: string, parentId: string)  => {
    return data.filter((item: IListItem) => parentId === item.parentId.toString())
                .find((item: IListItem) => item.name === name );   
} 

export const  parentIsFile = (data: IListItem[], parentId: string)  => {
    return data.find((item: IListItem) => item.id.toString() === parentId)?.type === 'file';    
} 
