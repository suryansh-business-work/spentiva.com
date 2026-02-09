import mjml2html from 'mjml';

interface ReportData {
  userName: string;
  dateRange: string;
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  averageExpense: number;
  transactionCount: number;
  currency?: string;
  categoryData: Array<{
    category: string;
    type?: string;
    total: number;
    count: number;
  }>;
  monthlyData: Array<{
    month: number;
    total: number;
    expenses?: number;
    income?: number;
  }>;
}

const getCurrencySymbol = (code?: string): string => {
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return symbols[code || 'INR'] || code || '₹';
};

export const generateReportEmail = (data: ReportData): string => {
  const expenseCats = data.categoryData.filter(c => !c.type || c.type === 'expense');
  const incomeCats = data.categoryData.filter(c => c.type === 'income');
  const netBalance = data.netBalance ?? data.totalIncome - data.totalExpenses;
  const sym = getCurrencySymbol(data.currency);
  const savingsRate =
    data.totalIncome > 0 ? ((data.totalIncome - data.totalExpenses) / data.totalIncome) * 100 : 0;
  const topExpenseCat = expenseCats.length > 0 ? expenseCats[0] : null;

  const mjml = `
    <mjml>
      <mj-head>
        <mj-title>Finance Report - ${data.dateRange}</mj-title>
        <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" />
        <mj-attributes>
          <mj-all font-family="Inter, Arial, sans-serif" />
          <mj-text font-size="14px" color="#374151" line-height="1.6" />
          <mj-section padding="0" />
        </mj-attributes>
        <mj-style>
          .stat-value { font-size: 24px; font-weight: 700; margin: 0; }
          .stat-label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
          .progress-bar { background: #e5e7eb; border-radius: 8px; overflow: hidden; height: 6px; }
          .insight-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 12px 16px; border-radius: 0 8px 8px 0; }
          .insight-warn { background: #fef3c7; border-left: 4px solid #f59e0b; }
        </mj-style>
      </mj-head>

      <mj-body background-color="#f8fafc">
        <!-- Header -->
        <mj-section background-color="#ffffff" padding="28px 24px 20px" border-bottom="2px solid #10b981">
          <mj-column>
            <mj-text font-size="22px" font-weight="700" color="#0f172a" letter-spacing="-0.3px">
              Spentiva
            </mj-text>
            <mj-text font-size="13px" color="#6b7280" padding-top="4px">
              Financial Report &middot; ${data.dateRange}
            </mj-text>
          </mj-column>
        </mj-section>

        <!-- Greeting -->
        <mj-section background-color="#ffffff" padding="24px 40px 12px">
          <mj-column>
            <mj-text font-size="15px" font-weight="600" color="#111827">
              Hi ${data.userName},
            </mj-text>
            <mj-text padding-top="6px" font-size="13px" color="#6b7280">
              Here's your financial overview for <strong style="color:#111827">${data.dateRange}</strong>.
            </mj-text>
          </mj-column>
        </mj-section>

        <!-- Summary Cards -->
        <mj-section background-color="#ffffff" padding="12px 30px 20px">
          <mj-group>
            <mj-column width="25%" background-color="#fef2f2" border-radius="8px" padding="14px 10px">
              <mj-text css-class="stat-label" align="center">EXPENSES</mj-text>
              <mj-text css-class="stat-value" align="center" color="#dc2626" padding-top="4px">${sym}${data.totalExpenses.toLocaleString('en-IN')}</mj-text>
            </mj-column>
            <mj-column width="25%" background-color="#f0fdf4" border-radius="8px" padding="14px 10px">
              <mj-text css-class="stat-label" align="center">INCOME</mj-text>
              <mj-text css-class="stat-value" align="center" color="#16a34a" padding-top="4px">${sym}${data.totalIncome.toLocaleString('en-IN')}</mj-text>
            </mj-column>
            <mj-column width="25%" background-color="${netBalance >= 0 ? '#eff6ff' : '#fef3c7'}" border-radius="8px" padding="14px 10px">
              <mj-text css-class="stat-label" align="center">NET BALANCE</mj-text>
              <mj-text css-class="stat-value" align="center" color="${netBalance >= 0 ? '#2563eb' : '#d97706'}" padding-top="4px">${netBalance >= 0 ? '+' : '-'}${sym}${Math.abs(netBalance).toLocaleString('en-IN')}</mj-text>
            </mj-column>
            <mj-column width="25%" background-color="#faf5ff" border-radius="8px" padding="14px 10px">
              <mj-text css-class="stat-label" align="center">SAVINGS</mj-text>
              <mj-text css-class="stat-value" align="center" color="${savingsRate >= 0 ? '#7c3aed' : '#dc2626'}" padding-top="4px">${savingsRate.toFixed(1)}%</mj-text>
            </mj-column>
          </mj-group>
        </mj-section>

        <!-- Quick Insights -->
        <mj-section background-color="#ffffff" padding="10px 40px 20px">
          <mj-column>
            <mj-text font-size="15px" font-weight="700" color="#111827" padding-bottom="10px">
              Quick Insights
            </mj-text>
            <mj-raw>
              <div class="insight-box ${savingsRate < 0 ? 'insight-warn' : ''}">
                <span style="font-size:13px;color:#374151;">
                  ${
                    savingsRate >= 20
                      ? `Great job! You saved <strong>${savingsRate.toFixed(1)}%</strong> of your income this period.`
                      : savingsRate >= 0
                        ? `You saved <strong>${savingsRate.toFixed(1)}%</strong> of your income. Try to aim for 20%+.`
                        : `You overspent by <strong>${sym}${Math.abs(netBalance).toLocaleString('en-IN')}</strong> this period. Consider reviewing your expenses.`
                  }
                </span>
              </div>
            </mj-raw>
            ${
              topExpenseCat
                ? `
            <mj-raw>
              <div style="margin-top: 8px; background: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; border-radius: 0 8px 8px 0;">
                <span style="font-size:13px;color:#374151;">
                  Top spending: <strong>${topExpenseCat.category}</strong> at ${sym}${topExpenseCat.total.toLocaleString('en-IN')}
                  (${data.totalExpenses > 0 ? ((topExpenseCat.total / data.totalExpenses) * 100).toFixed(0) : 0}% of expenses)
                </span>
              </div>
            </mj-raw>
            `
                : ''
            }
            <mj-raw>
              <div style="margin-top: 8px; background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 0 8px 8px 0;">
                <span style="font-size:13px;color:#374151;">
                  ${data.transactionCount} transactions &middot; avg expense ${sym}${Math.round(data.averageExpense).toLocaleString('en-IN')}
                </span>
              </div>
            </mj-raw>
          </mj-column>
        </mj-section>

        <!-- Expense Category Breakdown -->
        ${
          expenseCats.length > 0
            ? `
        <mj-section background-color="#ffffff" padding="25px 40px 8px">
          <mj-column>
            <mj-text font-size="15px" font-weight="700" color="#dc2626">
              Expense Breakdown
            </mj-text>
          </mj-column>
        </mj-section>

        ${expenseCats
          .slice(0, 8)
          .map((category, index) => {
            const percentage =
              data.totalExpenses > 0 ? (category.total / data.totalExpenses) * 100 : 0;
            return `
            <mj-section background-color="#ffffff" padding="${index === 0 ? '12px 40px 4px' : '4px 40px'}">
              <mj-column width="60%">
                <mj-text font-weight="600" color="#1f2937" font-size="13px">${category.category} <span style="color:#9ca3af;font-size:11px;">(${category.count})</span></mj-text>
              </mj-column>
              <mj-column width="40%">
                <mj-text align="right" font-weight="700" color="#dc2626" font-size="13px">${sym}${category.total.toLocaleString('en-IN')} <span style="color:#6b7280;font-size:10px">${percentage.toFixed(1)}%</span></mj-text>
              </mj-column>
            </mj-section>
            <mj-section background-color="#ffffff" padding="0px 40px 8px">
              <mj-column>
                <mj-raw>
                  <div class="progress-bar">
                    <div style="width: ${percentage}%; background: #dc2626; height: 100%;"></div>
                  </div>
                </mj-raw>
              </mj-column>
            </mj-section>`;
          })
          .join('')}
        `
            : ''
        }

        <!-- Income Category Breakdown -->
        ${
          incomeCats.length > 0
            ? `
        <mj-section background-color="#ffffff" padding="25px 40px 8px">
          <mj-column>
            <mj-text font-size="15px" font-weight="700" color="#16a34a">
              Income Breakdown
            </mj-text>
          </mj-column>
        </mj-section>

        ${incomeCats
          .slice(0, 8)
          .map((category, index) => {
            const percentage = data.totalIncome > 0 ? (category.total / data.totalIncome) * 100 : 0;
            return `
            <mj-section background-color="#ffffff" padding="${index === 0 ? '12px 40px 4px' : '4px 40px'}">
              <mj-column width="60%">
                <mj-text font-weight="600" color="#1f2937" font-size="13px">${category.category} <span style="color:#9ca3af;font-size:11px;">(${category.count})</span></mj-text>
              </mj-column>
              <mj-column width="40%">
                <mj-text align="right" font-weight="700" color="#16a34a" font-size="13px">${sym}${category.total.toLocaleString('en-IN')} <span style="color:#6b7280;font-size:10px">${percentage.toFixed(1)}%</span></mj-text>
              </mj-column>
            </mj-section>
            <mj-section background-color="#ffffff" padding="0px 40px 8px">
              <mj-column>
                <mj-raw>
                  <div class="progress-bar">
                    <div style="width: ${percentage}%; background: #16a34a; height: 100%;"></div>
                  </div>
                </mj-raw>
              </mj-column>
            </mj-section>`;
          })
          .join('')}
        `
            : ''
        }

        <!-- Monthly Trend -->
        ${
          data.monthlyData.length > 0
            ? `
        <mj-section background-color="#ffffff" padding="25px 40px 12px">
          <mj-column>
            <mj-text font-size="15px" font-weight="700" color="#111827">
              Monthly Trend
            </mj-text>
          </mj-column>
        </mj-section>

        <mj-section background-color="#ffffff" padding="0 40px 20px">
          <mj-column>
            <mj-table>
              <tr style="border-bottom: 2px solid #e5e7eb; text-align: left;">
                <th style="padding: 8px; font-weight: 600; color: #6b7280; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px;">Month</th>
                <th style="padding: 8px; font-weight: 600; color: #dc2626; font-size: 10px; text-transform: uppercase; text-align: right; letter-spacing: 0.5px;">Expenses</th>
                <th style="padding: 8px; font-weight: 600; color: #16a34a; font-size: 10px; text-transform: uppercase; text-align: right; letter-spacing: 0.5px;">Income</th>
                <th style="padding: 8px; font-weight: 600; color: #6b7280; font-size: 10px; text-transform: uppercase; text-align: right; letter-spacing: 0.5px;">Net</th>
              </tr>
              ${data.monthlyData
                .filter(m => (m.expenses ?? m.total ?? 0) > 0 || (m.income ?? 0) > 0)
                .map(month => {
                  const monthNames = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                  ];
                  const exp = month.expenses ?? month.total ?? 0;
                  const inc = month.income ?? 0;
                  const net = inc - exp;
                  return `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 9px 8px; color: #374151; font-size: 13px; font-weight: 500;">${monthNames[month.month - 1]}</td>
                    <td style="padding: 9px 8px; color: #dc2626; font-weight: 600; text-align: right; font-size: 13px;">${sym}${exp.toLocaleString('en-IN')}</td>
                    <td style="padding: 9px 8px; color: #16a34a; font-weight: 600; text-align: right; font-size: 13px;">${sym}${inc.toLocaleString('en-IN')}</td>
                    <td style="padding: 9px 8px; color: ${net >= 0 ? '#2563eb' : '#d97706'}; font-weight: 600; text-align: right; font-size: 13px;">${net >= 0 ? '+' : '-'}${sym}${Math.abs(net).toLocaleString('en-IN')}</td>
                  </tr>`;
                })
                .join('')}
            </mj-table>
          </mj-column>
        </mj-section>
        `
            : ''
        }

        <!-- CTA -->
        <mj-section background-color="#ffffff" padding="20px 40px 30px">
          <mj-column>
            <mj-button
              background-color="#059669"
              color="#ffffff"
              font-weight="600"
              border-radius="8px"
              padding="12px 32px"
              font-size="14px"
              href="https://app.spentiva.com/trackers"
            >
              View Full Dashboard
            </mj-button>
          </mj-column>
        </mj-section>

        <!-- Footer -->
        <mj-section background-color="#f9fafb" padding="20px 40px">
          <mj-column>
            <mj-text align="center" font-size="11px" color="#9ca3af">
              Automated report from Spentiva &middot; Your personal finance companion
            </mj-text>
            <mj-text align="center" font-size="10px" color="#d1d5db" padding-top="6px">
              &copy; ${new Date().getFullYear()} Spentiva. All rights reserved.
            </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;

  const result = mjml2html(mjml);
  return result.html;
};
