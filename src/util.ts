import { IListItem } from "./App"

export const  findSameName = (data: IListItem[], name: string, parentId: string | boolean)  => {
    return parentId ? data.filter((item: IListItem) => parentId === item.parentId.toString())
                .find((item: IListItem) => item.name === name) :
                data.filter((item: IListItem) => !item.parentId)
                .find((item: IListItem) => item.name === name);   
} 

export const  parentIsFile = (data: IListItem[], parentId: string)  => {
    return data.find((item: IListItem) => item.id.toString() === parentId)?.type === 'file';    
} 
