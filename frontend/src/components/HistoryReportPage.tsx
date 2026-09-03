import React, { useEffect } from 'react'
import Report from './Report'
import { useParams } from 'react-router-dom'
import { useDashboardStore } from '../store/DashboardStore'

const HistoryReportPage = () => {
    const { sessionId } = useParams()

    const { getHistoryDetail, isLoading, historyDetail } = useDashboardStore()

    useEffect(() => {
        getHistoryDetail(sessionId)
    }, [sessionId])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!historyDetail) {
        return <div>Report not found</div>
    }

    return (
        <div>
            <Report value={historyDetail.report} />
        </div>
    )
}

export default HistoryReportPage
