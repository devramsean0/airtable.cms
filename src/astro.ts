import { Loader, LoaderContext } from 'astro/loaders';
import { fetch } from '@sapphire/fetch'
export function airtableLoader(options: IAirtableLoaderOptions): Loader {
    /**
     * Load data from Airtable in an Astro compatible way
     * @param options - Options for the loader
     * @returns - Data from airtable in Astro compatible format
     * @example
     * ```ts
     * import { defineCollection, z } from 'astro:content';
     * import { airtableLoader } from 'airtable.cms';
     * 
     * export const guestlog = defineCollection({
     *  loader: airtableLoader({
     *     table: 'Guestlog',
     *     base: '<BASE ID HERE>',
     *     view: 'Grid view',
     *     apiKey: '<API KEY HERE>',
     *  }),
     *  schema: /* your schema here, like normal
     * });
     * ```
     */
    return {
        name: 'airtable-loader',
        load: async (context: LoaderContext) => {
            const { table, base, view, apiKey } = options;
            const url = `https://api.airtable.com/v0/${base}/${table}?view=${view}`;
            const headers = {
                Authorization: `Bearer ${apiKey}`,
            };
            const res = await fetch<{
                records: Array<{
                    id: string,
                    createdTime: string,
                    fields: Record<string, any>
                }>
            }>(url, {
                headers,
            });
            res.records.forEach(record => {
                context.store.set({ id: record.fields.id, data: record.fields });
            })
        }
    }
}

interface IAirtableLoaderOptions {
    /**
     * Airtable Loader Options
     * @param table - The name of the table in Airtable
     * @param base - The base ID of the Airtable base
     * @param view - The name of the view in Airtable
     * @param apiKey - The API key for the Airtable base
     */
    table: String,
    base: String,
    view: String,
    apiKey: String,
}