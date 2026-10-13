import { ModelsService } from '../elasticsearch/models-service';

export class NewVehicleModelUrlValidatorService {
  async checkModelSlugExists(modelSlug) {
    try {
      const allModels = await ModelsService.getAllModels();
      if (allModels.error) return { exists: false };

      const modelSlugs = allModels.map((model) => model.slug);
      const exists = modelSlugs.includes(modelSlug);

      return { exists };
    } catch (error) {
      console.error('Error checking model slug:', error);
      return { exists: false };
    }
  }
}

export const newVehicleModelUrlValidator =
  new NewVehicleModelUrlValidatorService();
