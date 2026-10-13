import mSearchClient from './m-search';

export class ClassesService {
  static async getClassesForModelYear(model, year) {
    try {
      const response = await mSearchClient.searchVariants({
        filters: {
          'model.slug': model,
          'generations.start_year': year,
        },
      });
      return response;
    } catch (error) {
      console.error('Elasticsearch error:', error.meta?.body?.error || error);
      throw new Error('Failed to fetch all classes');
    }
  }
}
