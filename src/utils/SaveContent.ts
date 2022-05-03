import { handleApiData } from "./apicalls";

export function saveContent(path: string, body: object | null, setState: Function | null){
    handleApiData(path, setState, "patch", body)
}