import React, {useState, useEffect} from "react";
import InfoTable from "./InfoTable";
import PageSection from "./PageSection";

function WikiPage() {
    const [pageTitle, setPageTitle] = useState('Type Title Here.')
    const [introText, setIntroText] = useState('Type Intro Text Here.')
    const [introTableData, setIntroTableData] = useState({})
    const [pageSections, setPageSections] = useState([])



    return (
        <div className = "content">
            <h1>{pageTitle}</h1>
            <PageSection title = {null} text = {introText} tableData = {introTableData} />
            <div className = "fullWidth">
                {pageSections.map((data : any) => <PageSection title = {data.title} text = {data.text} tableData = {data.tableData}/>)}
            </div>
        </div>
    )
}
export default WikiPage