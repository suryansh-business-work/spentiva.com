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
import { getRequest, postRequest } from '../../utils/http';
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
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    netBalance: 0,
    transactionCount: 0,
    expenseCount: 0,
    incomeCount: 0,
    averageExpense: 0,
    averageIncome: 0,
  });
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

      const defaultSummary = {
        totalExpenses: 0,
        totalIncome: 0,
        netBalance: 0,
        transactionCount: 0,
        expenseCount: 0,
        incomeCount: 0,
        averageExpense: 0,
        averageIncome: 0,
      };
      setSummary(summaryData?.stats || defaultSummary);
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
      // Build CSV from current summary data client-side
      const csvRows = [
        ['Spentiva Finance Report'],
        [`Period: ${filter}`],
        [],
        ['Metric', 'Value'],
        ['Total Expenses', summary.totalExpenses],
        ['Total Income', summary.totalIncome],
        ['Net Balance', summary.netBalance],
        ['Transaction Count', summary.transactionCount],
        ['Average Expense', Math.round(summary.averageExpense)],
        ['Average Income', Math.round(summary.averageIncome)],
      ];
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spentiva-report-${filter}-${Date.now()}.csv`;
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
      await postRequest(endpoints.analytics.emailReport, {
        filter,
        ...(customStartDate && { startDate: customStartDate }),
        ...(customEndDate && { endDate: customEndDate }),
        ...(trackerId && { trackerId }),
      });
      alert('Report sent successfully to your email!');
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
