import OpenAI from 'openai';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../config/categories';
import { ParsedExpense, OpenAIUsage } from '../types';
import config from '../config/env';
import { logger } from '../utils/logger';

// Prefer the configured key from `config`, but fall back to process.env
const OPENAI_KEY = config.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  logger.warn('OpenAI API key is not set in config or process.env. OpenAI features will be disabled.');
}
const openai = OPENAI_KEY ? new OpenAI({ apiKey: OPENAI_KEY }) : null;

interface CategoriesMap {
  expense: Array<{ name: string; _id?: string; id?: string; subcategories?: Array<{ name: string }> }>;
  income: Array<{ name: string; _id?: string; id?: string; subcategories?: Array<{ name: string }> }>;
  debitModes: string[];
  creditModes: string[];
}

export class ExpenseParser {
  private static buildSystemPrompt(cats: CategoriesMap, defaultCurrency = 'INR'): string {
    const expenseList = cats.expense
      .map(cat => {
        const subcats = cat.subcategories?.map((s: { name: string }) => s.name).join(', ') || '';
        return `${cat.name}: ${subcats}`;
      })
      .join('\n');

    const incomeList = cats.income
      .map(cat => {
        const subcats = cat.subcategories?.map((s: { name: string }) => s.name).join(', ') || '';
        return `${cat.name}: ${subcats}`;
      })
      .join('\n');

    return `You are a financial tracking assistant. Parse user messages about expenses AND income, extract structured data.

AVAILABLE EXPENSE CATEGORIES AND SUBCATEGORIES:
${expenseList}

AVAILABLE INCOME CATEGORIES AND SUBCATEGORIES:
${incomeList}

AVAILABLE DEBIT FROM (PAYMENT MODES - for expenses):
${cats.debitModes.join(', ')}

AVAILABLE CREDIT FROM (INCOME SOURCES - for income):
${cats.creditModes.join(', ')}

TRANSACTION TYPE RULES:
1. "expense" - User spent money (bought, paid, spent, purchased, etc.)
2. "income" - User received money (salary, refund, cashback, earned, received, credited, got money, etc.)
3. "transfer" - User moved money between own accounts (transferred from X to Y) - NOT an expense or income

PARSING RULES:
1. Extract ALL transactions from the message (can be single or multiple, mixed expense & income)
2. Determine the TYPE of each transaction: "expense", "income", or "transfer"
3. For EXPENSES: extract amount, category (from expense list), subcategory, paymentMethod (debit from), currency, description
4. For INCOME: extract amount, category (from income list), subcategory, creditFrom (income source), currency, description
5. For TRANSFERS: extract amount, description (from/to accounts), type="transfer"
6. ALWAYS return an array of transaction objects

CURRENCY RULES:
- The user's DEFAULT currency is "${defaultCurrency}"
- If no specific currency is mentioned, ALWAYS use "${defaultCurrency}"
- If user mentions USD, dollars → currency: "USD"
- If user mentions EUR, euros → currency: "EUR"
- If user mentions GBP, pounds → currency: "GBP"
- If user mentions rupees, INR, ₹ → currency: "INR"
- Each transaction can have its own currency

CATEGORY MATCHING RULES:
- For expenses: match to EXPENSE CATEGORIES list
- For income: match to INCOME CATEGORIES list  
- Use EXACT category name from the available list
- "food/lunch/dinner" → match expense categories, "salary" → match income categories
- "refund/cashback" → income type with income categories
- If NO match found, use EXACT word/phrase from user input
- DO NOT invent categories or use "Unknown"

PAYMENT METHOD (DEBIT FROM) RULES - FOR EXPENSES:
- If user mentions a payment method, use it (credit card, debit card, cash, UPI, etc.)
- If NOT mentioned, use "User not provided payment method"

CREDIT FROM RULES - FOR INCOME:
- If user mentions how income was received, use it (bank transfer, UPI, cash, etc.)
- If NOT mentioned, use "User not provided credit source"

DATE RULES:
- "today" → current date
- "yesterday" → yesterday's date
- If no date mentioned → current date

EXAMPLES:

Input: "I spent 250 rupees on lunch using my credit card"
Output: [{"type": "expense", "amount": 250, "category": "Food & Dining", "subcategory": "Restaurants", "paymentMethod": "Credit Card", "currency": "INR"}]

Input: "My salary of 75000 got credited today"
Output: [{"type": "income", "amount": 75000, "category": "Salary & Wages", "subcategory": "Salary", "creditFrom": "Bank Transfer", "currency": "INR"}]

Input: "I got a refund of 1200 from Amazon"
Output: [{"type": "income", "amount": 1200, "category": "Refunds & Cashback", "subcategory": "Refund", "creditFrom": "User not provided credit source", "currency": "INR", "description": "Amazon refund"}]

Input: "Salary 50000 credited and I spent 2000 on rent"
Output: [
  {"type": "income", "amount": 50000, "category": "Salary & Wages", "subcategory": "Salary", "creditFrom": "Bank Transfer", "currency": "INR"},
  {"type": "expense", "amount": 2000, "category": "Bills & Utilities", "subcategory": "Rent", "paymentMethod": "User not provided payment method", "currency": "INR"}
]

Input: "I spent 20 USD on coffee and 500 INR on dinner"
Output: [
  {"type": "expense", "amount": 20, "category": "Food & Dining", "subcategory": "Fast Food", "paymentMethod": "User not provided payment method", "currency": "USD"},
  {"type": "expense", "amount": 500, "category": "Food & Dining", "subcategory": "Restaurants", "paymentMethod": "User not provided payment method", "currency": "INR"}
]

Input: "Transferred 10000 from savings to wallet"
Output: [{"type": "transfer", "amount": 10000, "category": "Transfer", "subcategory": "Transfer", "paymentMethod": "User not provided payment method", "currency": "INR", "description": "From savings to wallet"}]

Input: "Bought shoes for 2500 and a shirt for 1200 via UPI"
Output: [
  {"type": "expense", "amount": 2500, "category": "Shopping", "subcategory": "Clothing", "paymentMethod": "UPI", "currency": "INR", "description": "shoes"},
  {"type": "expense", "amount": 1200, "category": "Shopping", "subcategory": "Clothing", "paymentMethod": "UPI", "currency": "INR", "description": "shirt"}
]

Input: "Got 1000 cashback from Paytm and spent 300 on groceries"
Output: [
  {"type": "income", "amount": 1000, "category": "Refunds & Cashback", "subcategory": "Cashback", "creditFrom": "Online Payment", "currency": "INR", "description": "Paytm cashback"},
  {"type": "expense", "amount": 300, "category": "Food & Dining", "subcategory": "Groceries", "paymentMethod": "User not provided payment method", "currency": "INR"}
]

Input: "Paid 8000 EMI for laptop via bank transfer"
Output: [{"type": "expense", "amount": 8000, "category": "Bills & Utilities", "subcategory": "EMI", "paymentMethod": "Net Banking", "currency": "INR", "description": "laptop EMI"}]

Input: "Received 15000 from freelance project"
Output: [{"type": "income", "amount": 15000, "category": "Freelance & Business", "subcategory": "Freelance", "creditFrom": "User not provided credit source", "currency": "INR"}]

Input: "Petrol 500 cash and gym 2000 UPI"
Output: [
  {"type": "expense", "amount": 500, "category": "Transportation", "subcategory": "Fuel", "paymentMethod": "Cash", "currency": "${defaultCurrency}"},
  {"type": "expense", "amount": 2000, "category": "Health & Fitness", "subcategory": "Gym", "paymentMethod": "UPI", "currency": "${defaultCurrency}"}
]

Input: "Movie tickets 600 and popcorn 250"
Output: [
  {"type": "expense", "amount": 600, "category": "Entertainment", "subcategory": "Movies", "paymentMethod": "User not provided payment method", "currency": "${defaultCurrency}", "description": "movie tickets"},
  {"type": "expense", "amount": 250, "category": "Food & Dining", "subcategory": "Snacks", "paymentMethod": "User not provided payment method", "currency": "${defaultCurrency}", "description": "popcorn"}
]

Input: "Electricity bill 3500 and wifi 1200 auto-debit"
Output: [
  {"type": "expense", "amount": 3500, "category": "Bills & Utilities", "subcategory": "Electricity", "paymentMethod": "Auto Debit", "currency": "${defaultCurrency}"},
  {"type": "expense", "amount": 1200, "category": "Bills & Utilities", "subcategory": "Internet", "paymentMethod": "Auto Debit", "currency": "${defaultCurrency}"}
]

Input: "Papa ne 5000 bheje pocket money ke liye"
Output: [{"type": "income", "amount": 5000, "category": "Salary & Wages", "subcategory": "Pocket Money", "creditFrom": "User not provided credit source", "currency": "INR", "description": "pocket money from dad"}]

Input: "Spent some money on food"
Output: {"error": "Parsing failed", "message": "Could you please specify the amount? For example: 'spent 200 on food'"}

RESPONSE FORMAT (MUST be valid JSON array):
[
  {
    "type": "expense" | "income" | "transfer",
    "amount": number,
    "category": "string",
    "subcategory": "string",
    "paymentMethod": "string (for expenses, default: 'User not provided payment method')",
    "creditFrom": "string (for income, default: 'User not provided credit source')",
    "currency": "string (default: 'INR')",
    "description": "string (optional)"
  }
]

ERROR FORMAT (only if you cannot parse amount):
{
  "error": "Parsing failed",
  "message": "descriptive message asking for clarification"
}`;
  }

  static async parseExpense(
    userMessage: string,
    trackerId?: string,
    trackerCurrency?: string
  ): Promise<
    | { expenses: ParsedExpense[]; usage: OpenAIUsage | undefined }
    | { error: string; message?: string; missingCategories?: string[]; usage?: OpenAIUsage | undefined }
  > {
    if (!openai) {
      return {
        error: 'Configuration error',
        message: 'OpenAI API key not configured. Cannot parse expense.',
      };
    }

    try {
      // Fetch categories dynamically grouped by type
      const categoriesMap: CategoriesMap = {
        expense: [],
        income: [],
        debitModes: [],
        creditModes: [],
      };

      if (trackerId) {
        const { CategoryService } = await import('../apis/category/category.services');

        const [expenseCats, incomeCats, debitModeCats, creditModeCats] = await Promise.all([
          CategoryService.getAllCategories(trackerId, 'expense'),
          CategoryService.getAllCategories(trackerId, 'income'),
          CategoryService.getAllCategories(trackerId, 'debit_mode'),
          CategoryService.getAllCategories(trackerId, 'credit_mode'),
        ]);

        categoriesMap.expense = expenseCats.map(cat => ({
          name: cat.name,
          _id: cat._id?.toString(),
          subcategories: cat.subcategories?.map((s: { name: string }) => ({ name: s.name })) || [],
        }));
        categoriesMap.income = incomeCats.map(cat => ({
          name: cat.name,
          _id: cat._id?.toString(),
          subcategories: cat.subcategories?.map((s: { name: string }) => ({ name: s.name })) || [],
        }));
        categoriesMap.debitModes = debitModeCats.flatMap(
          cat => cat.subcategories?.map((s: { name: string }) => s.name) || []
        );
        categoriesMap.creditModes = creditModeCats.flatMap(
          cat => cat.subcategories?.map((s: { name: string }) => s.name) || []
        );
      } else {
        categoriesMap.expense = Object.values(EXPENSE_CATEGORIES).map(cat => ({
          name: cat.name,
          subcategories: cat.subcategories?.map(s => ({ name: s })) || [],
        }));
        categoriesMap.debitModes = PAYMENT_METHODS;
      }

      // Add fallback defaults
      if (categoriesMap.debitModes.length === 0) {
        categoriesMap.debitModes = PAYMENT_METHODS;
      }
      if (categoriesMap.creditModes.length === 0) {
        categoriesMap.creditModes = ['Bank Transfer', 'UPI', 'Cash', 'Cheque', 'Online Payment'];
      }

      const allCategories = [...categoriesMap.expense, ...categoriesMap.income];
      if (allCategories.length === 0) {
        return {
          error: 'No categories found',
          message: 'No categories found for this tracker. Please add categories first.',
        };
      }

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: this.buildSystemPrompt(categoriesMap, trackerCurrency || 'INR') },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.3,
        max_tokens: 800,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        return { error: 'No response from AI' };
      }

      const usage = completion.usage;
      logger.info('OpenAI transaction parsing completed', {
        prompt_tokens: usage?.prompt_tokens,
        completion_tokens: usage?.completion_tokens,
        total_tokens: usage?.total_tokens,
      });

      const parsed = JSON.parse(response);

      if (parsed.error) {
        return { ...parsed, usage };
      }

      const transactionsArray = Array.isArray(parsed) ? parsed : [parsed];

      const validatedExpenses: ParsedExpense[] = [];
      const missingCategories: string[] = [];

      for (let i = 0; i < transactionsArray.length; i++) {
        const txn = transactionsArray[i];

        if (!txn.amount || !txn.category || !txn.subcategory) {
          return {
            error: 'Validation error',
            message: `Transaction at index ${i}: Missing required fields (amount, category, subcategory)`,
            usage,
          };
        }

        const txnType = txn.type || 'expense';

        // Choose category pool based on type
        const categoryPool =
          txnType === 'income' ? categoriesMap.income : categoriesMap.expense;

        // Find the category ID
        const categoryEntry = categoryPool.find(cat => cat.name === txn.category);

        // For transfers, use a placeholder categoryId
        if (txnType === 'transfer') {
          validatedExpenses.push({
            type: 'transfer',
            amount: txn.amount,
            category: txn.category || 'Transfer',
            subcategory: txn.subcategory || 'Transfer',
            categoryId: 'transfer',
            paymentMethod: txn.paymentMethod || 'User not provided payment method',
            creditFrom: txn.creditFrom,
            currency: txn.currency || 'INR',
            description: txn.description,
            timestamp: new Date(),
          });
          continue;
        }

        if (!categoryEntry) {
          if (!missingCategories.includes(txn.category)) {
            missingCategories.push(txn.category);
          }
          continue;
        }

        validatedExpenses.push({
          type: txnType,
          amount: txn.amount,
          category: txn.category,
          subcategory: txn.subcategory,
          categoryId: (categoryEntry._id || categoryEntry.id || '').toString(),
          paymentMethod: txnType === 'expense' ? (txn.paymentMethod || 'User not provided payment method') : undefined,
          creditFrom: txnType === 'income' ? (txn.creditFrom || 'User not provided credit source') : undefined,
          currency: txn.currency || 'INR',
          description: txn.description,
          timestamp: new Date(),
        });
      }

      if (missingCategories.length > 0) {
        return {
          error: 'Category not found',
          message: `Please add these categories first: ${missingCategories.join(', ')}`,
          missingCategories,
          usage,
        };
      }

      return { expenses: validatedExpenses, usage };
    } catch (error) {
      logger.error('Error parsing expense', { error });
      return {
        error: 'Parsing failed',
        message: 'Failed to parse expense. Please try again.',
      };
    }
  }

  static async getChatResponse(
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<{ response: string; usage?: OpenAIUsage | undefined }> {
    if (!openai) {
      return {
        response: 'OpenAI API key not configured. Cannot provide chat responses.',
      };
    }

    try {
      const messages = [
        {
          role: 'system' as const,
          content:
            'You are a helpful financial tracking assistant. Help users log their expenses and income naturally. Be concise and friendly.',
        },
        ...conversationHistory.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: userMessage },
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 150,
      });

      const usage = completion.usage;
      logger.info('OpenAI chat response completed', {
        prompt_tokens: usage?.prompt_tokens,
        completion_tokens: usage?.completion_tokens,
        total_tokens: usage?.total_tokens,
      });

      return {
        response:
          completion.choices[0]?.message?.content || "I'm here to help track your finances!",
        usage,
      };
    } catch (error) {
      logger.error('Error getting chat response', { error });
      return {
        response: "Sorry, I'm having trouble responding right now.",
      };
    }
  }
}
