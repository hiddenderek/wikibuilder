export type section = {
    title: string | null,
    text: string,
    tableData: object,
    section_id?: string,
    saveCounter?: number
}

export type contribution = {
    action_type: string,
    time_executed: string,
    username?: string
}

export type page = {
    title: string,
    intro_text?: string,
    intro_table_data?: string,
    page_section_data?: string
}
