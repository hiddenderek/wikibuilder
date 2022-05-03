export interface tableData {

}

export interface section {
    title: string,
    text: string,
    tableData: object,
    section_id?: string,
    saveCounter?: number
}

export interface pageCreatorState {
    pageTitle: string,
    introText: string,
    introTableData: tableData
    pageSections: section[]
}