import mjml2html from 'mjml';

interface ReportData {
  userName: string;
  dateRange: string;
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  averageExpense: number;
  transactionCount: number;
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

export const generateReportEmail = (data: ReportData): string => {
  const expenseCats = data.categoryData.filter(c => !c.type || c.type === 'expense');
  const incomeCats = data.categoryData.filter(c => c.type === 'income');
  const netBalance = data.netBalance ?? data.totalIncome - data.totalExpenses;

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
          .stat-value { font-size: 28px; font-weight: 700; margin: 0; }
          .stat-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
          .progress-bar { background: #e5e7eb; border-radius: 8px; overflow: hidden; height: 6px; }
        </mj-style>
      </mj-head>
      
      <mj-body background-color="#f3f4f6">
        <!-- Header -->
        <mj-section background-color="#10b981" padding="30px 20px">
          <mj-column>
            <mj-text align="center" font-size="28px" font-weight="700" color="#ffffff">
              Spentiva
            </mj-text>
            <mj-text align="center" font-size="14px" color="rgba(255,255,255,0.85)" padding-top="5px">
              Finance Report &middot; ${data.dateRange}
            </mj-text>
          </mj-column>
        </mj-section>

        <!-- Greeting -->
        <mj-section background-color="#ffffff" padding="25px 40px 15px">
          <mj-column>
            <mj-text font-size="16px" font-weight="600" color="#1f2937">
              Hello ${data.userName},
            </mj-text>
            <mj-text padding-top="8px" font-size="14px">
              Here's your financial summary for <strong>${data.dateRange}</strong>.
            </mj-text>
          </mj-column>
        </mj-section>

        <!-- Summary Cards -->
        <mj-section background-color="#ffffff" padding="15px 30px">
          <mj-group>
            <mj-column width="25%" background-color="#fef2f2" border-radius="8px" padding="15px">
              <mj-text css-class="stat-label" align="center">EXPENSES</mj-text>
              <mj-text css-class="stat-value" align="center" color="#dc2626" padding-top="5px">₹${data.totalExpenses.toLocaleString('en-IN')}</mj-text>
            </mj-column>
            <mj-column width="25%" background-color="#f0fdf4" border-radius="8px" padding="15px">
              <mj-text css-class="stat-label" align="center">INCOME</mj-text>
              <mj-text css-class="stat-value" align="center" color="#16a34a" padding-top="5px">₹${data.totalIncome.toLocaleString('en-IN')}</mj-text>
            </mj-column>
            <mj-column width="25%" background-color="${netBalance >= 0 ? '#eff6ff' : '#fef3c7'}" border-radius="8px" padding="15px">
              <mj-text css-class="stat-label" align="center">NET</mj-text>
              <mj-text css-class="stat-value" align="center" color="${netBalance >= 0 ? '#2563eb' : '#d97706'}" padding-top="5px">${netBalance >= 0 ? '+' : ''}₹${Math.abs(netBalance).toLocaleString('en-IN')}</mj-text>
            </mj-column>
            <mj-column width="25%" background-color="#f9fafb" border-radius="8px" padding="15px">
              <mj-text css-class="stat-label" align="center">TRANSACTIONS</mj-text>
              <mj-text css-class="stat-value" align="center" color="#1f2937" padding-top="5px">${data.transactionCount}</mj-text>
            </mj-column>
          </mj-group>
        </mj-section>

        <!-- Expense Category Breakdown -->
        ${expenseCats.length > 0 ? `
        <mj-section background-color="#ffffff" padding="30px 40px 10px">
          <mj-column>
            <mj-text font-size="18px" font-weight="700" color="#dc2626">
              Expense Breakdown
            </mj-text>
          </mj-column>
        </mj-section>

        ${expenseCats
          .slice(0, 8)
          .map((category, index) => {
            const percentage = data.totalExpenses > 0 ? (category.total / data.totalExpenses) * 100 : 0;
            return `
            <mj-section background-color="#ffffff" padding="${index === 0 ? '15px 40px 5px' : '5px 40px'}">
              <mj-column width="65%">
                <mj-text font-weight="600" color="#1f2937" font-size="13px">${category.category}</mj-text>
              </mj-column>
              <mj-column width="35%">
                <mj-text align="right" font-weight="700" color="#dc2626" font-size="14px">₹${category.total.toLocaleString('en-IN')} <span style="color:#6b7280;font-size:11px">(${percentage.toFixed(1)}%)</span></mj-text>
              </mj-column>
            </mj-section>
            <mj-section background-color="#ffffff" padding="0px 40px 10px">
              <mj-column>
                <mj-raw>
                  <div class="progress-bar">
                    <div style="width: ${percentage}%; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); height: 100%;"></div>
                  </div>
                </mj-raw>
              </mj-column>
            </mj-section>`;
          })
          .join('')}
        ` : ''}

        <!-- Income Category Breakdown -->
        ${incomeCats.length > 0 ? `
        <mj-section background-color="#ffffff" padding="30px 40px 10px">
          <mj-column>
            <mj-text font-size="18px" font-weight="700" color="#16a34a">
              Income Breakdown
            </mj-text>
          </mj-column>
        </mj-section>

        ${incomeCats
          .slice(0, 8)
          .map((category, index) => {
            const percentage = data.totalIncome > 0 ? (category.total / data.totalIncome) * 100 : 0;
            return `
            <mj-section background-color="#ffffff" padding="${index === 0 ? '15px 40px 5px' : '5px 40px'}">
              <mj-column width="65%">
                <mj-text font-weight="600" color="#1f2937" font-size="13px">${category.category}</mj-text>
              </mj-column>
              <mj-column width="35%">
                <mj-text align="right" font-weight="700" color="#16a34a" font-size="14px">₹${category.total.toLocaleString('en-IN')} <span style="color:#6b7280;font-size:11px">(${percentage.toFixed(1)}%)</span></mj-text>
              </mj-column>
            </mj-section>
            <mj-section background-color="#ffffff" padding="0px 40px 10px">
              <mj-column>
                <mj-raw>
                  <div class="progress-bar">
                    <div style="width: ${percentage}%; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); height: 100%;"></div>
                  </div>
                </mj-raw>
              </mj-column>
            </mj-section>`;
          })
          .join('')}
        ` : ''}

        <!-- Monthly Trend -->
        ${
          data.monthlyData.length > 0
            ? `
        <mj-section background-color="#ffffff" padding="30px 40px 15px">
          <mj-column>
            <mj-text font-size="18px" font-weight="700" color="#1f2937">
              Monthly Trend
            </mj-text>
          </mj-column>
        </mj-section>

        <mj-section background-color="#ffffff" padding="0 40px 20px">
          <mj-column>
            <mj-table>
              <tr style="border-bottom: 2px solid #e5e7eb; text-align: left;">
                <th style="padding: 8px; font-weight: 600; color: #6b7280; font-size: 11px; text-transform: uppercase;">Month</th>
                <th style="padding: 8px; font-weight: 600; color: #dc2626; font-size: 11px; text-transform: uppercase; text-align: right;">Expenses</th>
                <th style="padding: 8px; font-weight: 600; color: #16a34a; font-size: 11px; text-transform: uppercase; text-align: right;">Income</th>
              </tr>
              ${data.monthlyData
                .filter(m => (m.expenses ?? m.total ?? 0) > 0 || (m.income ?? 0) > 0)
                .map(month => {
                  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const exp = month.expenses ?? month.total ?? 0;
                  const inc = month.income ?? 0;
                  return `
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 10px 8px; color: #374151; font-size: 13px;">${monthNames[month.month - 1]}</td>
                    <td style="padding: 10px 8px; color: #dc2626; font-weight: 600; text-align: right; font-size: 13px;">₹${exp.toLocaleString('en-IN')}</td>
                    <td style="padding: 10px 8px; color: #16a34a; font-weight: 600; text-align: right; font-size: 13px;">₹${inc.toLocaleString('en-IN')}</td>
                  </tr>`;
                })
                .join('')}
            </mj-table>
          </mj-column>
        </mj-section>
        `
            : ''
        }

        <!-- Call to Action -->
        <mj-section background-color="#ffffff" padding="30px 40px">
          <mj-column>
            <mj-button 
              background-color="#10b981" 
              color="#ffffff" 
              font-weight="600"
              border-radius="8px"
              padding="12px 36px"
              href="https://app.spentiva.com/trackers"
            >
              View Full Dashboard
            </mj-button>
          </mj-column>
        </mj-section>

        <!-- Footer -->
        <mj-section background-color="#f9fafb" padding="25px 40px">
          <mj-column>
            <mj-text align="center" font-size="11px" color="#9ca3af">
              This is an automated report from Spentiva
            </mj-text>
            <mj-text align="center" font-size="11px" color="#9ca3af" padding-top="4px">
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
