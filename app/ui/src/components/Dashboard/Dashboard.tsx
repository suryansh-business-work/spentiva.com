import React, { useState, useEffect } from 'react';
import { Container, Paper } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { endpoints } from '../../config/api';
import { getRequest } from '../../utils/http';
import { parseResponseData } from '../../utils/response-parser';
import FilterBar from './components/FilterBar';
import StatCards from './components/StatCards';
import ChartSection from './components/ChartSection';
import CategoryBreakdown from './components/CategoryBreakdown';
import DashboardSkeleton from './components/DashboardSkeleton';

interface DashboardProps {
  trackerId?: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC<DashboardProps> = ({ trackerId }) => {
  const [filter, setFilter] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [summary, setSummary] = useState({ total: 0, average: 0, count: 0 });
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [emailLoading, setEmailLoading] = useState(false);

  useEffect(() => {
    loadData();
    const handleExpenseUpdate = () => loadData();
    window.addEventListener('expenseUpdated', handleExpenseUpdate);
    return () => window.removeEventListener('expenseUpdated', handleExpenseUpdate);
  }, [filter, customStartDate, customEndDate, selectedYear, trackerId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, categoryRes, monthlyRes] = await Promise.all([
        getRequest(endpoints.analytics.summary, {
          params: { filter, startDate: customStartDate, endDate: customEndDate, trackerId },
        }),
        getRequest(endpoints.analytics.byCategory, {
          params: { filter, startDate: customStartDate, endDate: customEndDate, trackerId },
        }),
        getRequest(endpoints.analytics.byMonth, { params: { year: selectedYear, trackerId } }),
      ]);

      const summaryData = parseResponseData<any>(summaryRes, {});
      const categoryDataRes = parseResponseData<any>(categoryRes, []);
      const monthlyDataRes = parseResponseData<any>(monthlyRes, []);

      setSummary(summaryData?.stats || { total: 0, average: 0, count: 0 });
      setCategoryData(categoryDataRes || []);
      setMonthlyData(monthlyDataRes || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    if (newFilter !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
    }
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    if (field === 'start') setCustomStartDate(value);
    else setCustomEndDate(value);
  };

  const handleDownloadReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        filter,
        ...(customStartDate && { startDate: customStartDate }),
        ...(customEndDate && { endDate: customEndDate }),
        ...(trackerId && { trackerId }),
      });

      const response = await fetch(`https://api.spentiva.com/api/reports/download?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to download report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expense-report-${filter}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert((error as Error).message || 'Failed to download report');
    }
  };

  const handleEmailReport = async () => {
    try {
      setEmailLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://api.spentiva.com/api/reports/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filter,
          ...(customStartDate && { startDate: customStartDate }),
          ...(customEndDate && { endDate: customEndDate }),
          ...(trackerId && { trackerId }),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send email');
      alert(data.message || 'Report sent successfully to your email');
    } catch (error) {
      console.error('Error sending email report:', error);
      alert((error as Error).message || 'Failed to send email report');
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 2.5 }, px: { xs: 2, sm: 3 } }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <FilterBar
          filter={filter}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          emailLoading={emailLoading}
          onFilterChange={handleFilterChange}
          onCustomDateChange={handleCustomDateChange}
          onDownload={handleDownloadReport}
          onEmail={handleEmailReport}
        />
      </Paper>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <StatCards summary={summary} />
          <ChartSection
            categoryData={categoryData}
            monthlyData={monthlyData}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
          <CategoryBreakdown categoryData={categoryData} />
        </>
      )}
    </Container>
  );
};

export default Dashboard;
