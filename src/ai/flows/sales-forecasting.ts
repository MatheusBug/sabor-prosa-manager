// Sales forecasting flow
'use server';

/**
 * @fileOverview Provides sales forecasting for the next week based on past sales data.
 *
 * - salesForecast - A function that returns a sales forecast.
 * - SalesForecastInput - The input type for the salesForecast function.
 * - SalesForecastOutput - The return type for the salesForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SalesDataSchema = z.array(
  z.object({
    date: z.string().describe('Date of the sales record (YYYY-MM-DD).'),
    totalSales: z.number().describe('Total sales for the day.'),
  })
);

const SalesForecastInputSchema = z.object({
  salesData: SalesDataSchema.describe(
    'An array of historical sales data, including date and total sales.'
  ),
});

export type SalesForecastInput = z.infer<typeof SalesForecastInputSchema>;

const SalesForecastOutputSchema = z.object({
  forecast: z
    .array(
      z.object({
        date: z.string().describe('Date of the forecast (YYYY-MM-DD).'),
        predictedSales: z
          .number()
          .describe('Predicted total sales for the day.'),
      })
    )
    .describe('Sales forecast for the next 7 days.'),
});

export type SalesForecastOutput = z.infer<typeof SalesForecastOutputSchema>;

export async function salesForecast(input: SalesForecastInput): Promise<SalesForecastOutput> {
  return salesForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'salesForecastPrompt',
  input: {schema: SalesForecastInputSchema},
  output: {schema: SalesForecastOutputSchema},
  prompt: `You are an expert sales forecaster. Given the historical sales data, you will predict the sales for the next 7 days.

Sales Data:
{{#each salesData}}
- Date: {{this.date}}, Sales: {{this.totalSales}}
{{/each}}

Forecast the sales for the next 7 days. Return a JSON object with an array of objects, each containing the date (YYYY-MM-DD) and predictedSales.
`,
});

const salesForecastFlow = ai.defineFlow(
  {
    name: 'salesForecastFlow',
    inputSchema: SalesForecastInputSchema,
    outputSchema: SalesForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
