export type image = {
    width: number,
    height: number,
    url: string,
    type: string
}

export type info = {
    left: string,
    right: string
}

export type link = {
    text: string,
    url: string
}

export type tableData = {
    width: number,
    titles: string[],
    images: image[],
    text: string[],
    info: info[]
    related: link[]

}

export type section = {
    title: string,
    text: string,
    tableData: tableData,
    section_id?: string,
    saveCounter?: number
}

export type selection = {
    element: number,
    section: number
}

export type pageCreatorState = {
    pageTitle: string,
    introText: string,
    introTableData: tableData,
    pageSections: section[],
    titleSelected: selection,
    imageSelected: selection,
    textSelected: selection,
    infoSelected: selection,
    relatedSelected: selection
}