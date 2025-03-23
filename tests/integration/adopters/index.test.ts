import fs from 'fs';
import path from 'path';
import { buildAdoptersList } from '../../../scripts/adopters/index';

const configDir = path.resolve(__dirname, '../../../config');
const inputYmlPath = path.join(configDir, 'dummy_adopters.yml');
const outputJsonPath = path.join(configDir, 'dummy_adopters.json');

describe('Integration Test for buildAdoptersList', () => {
  beforeAll(() => {
    const dummyYaml = `
- companyName: Dummy Company1
  useCase: Dummy use case for testing
  resources:
  - title: Dummy Resource1
    link: https://example1.com
`;
    fs.writeFileSync(inputYmlPath, dummyYaml, 'utf8');
  });

  test('should create dummy_adopters.json with valid JSON data', async () => {
    await buildAdoptersList('config/dummy_adopters.yml', 'dummy_adopters.json');

    const exists = fs.existsSync(outputJsonPath);
    expect(exists).toBe(true);

    const content = fs.readFileSync(outputJsonPath, 'utf8');
    let jsonData;
    try {
      jsonData = JSON.parse(content);
    } catch (e) {
      throw new Error('Output file is not valid JSON');
    }
    expect(jsonData).toBeDefined();
    jsonData.forEach((adopter: any) => {
      expect(adopter).toHaveProperty('companyName');
      expect(typeof adopter.companyName).toBe('string');
      
      expect(adopter).toHaveProperty('useCase');
      expect(typeof adopter.useCase).toBe('string');
      
      expect(adopter).toHaveProperty('resources');
      expect(Array.isArray(adopter.resources)).toBe(true);

      adopter.resources.forEach((resource: any) => {
        expect(resource).toHaveProperty('title');
        expect(typeof resource.title).toBe('string');
        expect(resource).toHaveProperty('link');
        expect(typeof resource.link).toBe('string');
      });
    });
  });

  afterAll(() => {
    if (fs.existsSync(outputJsonPath)) fs.unlinkSync(outputJsonPath);
    if (fs.existsSync(inputYmlPath)) fs.unlinkSync(inputYmlPath);
  });
});
