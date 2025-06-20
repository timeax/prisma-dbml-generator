import { GeneratorOptions } from '@prisma/generator-helper';
import { parseEnvValue } from '@prisma/internals';
import { promises } from 'fs';
import { join } from 'path';
import { generateDBMLSchema } from '../generator/dbml.js';
import { getProjectOptions } from '../generator/project.js';

const { mkdir, writeFile } = promises;

export const defaultDBMLFileName = 'schema.dbml';

export async function generate(options: GeneratorOptions) {
  const { output, config } = options.generator;
  const outputDir = parseEnvValue(output!);

  const dbmlFileName =
    typeof config.outputName === 'string'
      ? config.outputName
      : defaultDBMLFileName;
  const allowManyToMany = config.manyToMany === 'false' ? false : true;
  const mapToDbSchema = config.mapToDbSchema === 'false' ? false : true;
  const includeRelationFields =
    config.includeRelationFields === 'false' ? false : true;
  const projectOptions = await getProjectOptions(config);

  try {
    await mkdir(outputDir, { recursive: true });

    // for debugging dmmf schema
    // await writeFile('./test.json', JSON.stringify(options.dmmf.datamodel));

    const dbmlSchema = generateDBMLSchema(
      options.dmmf,
      allowManyToMany,
      mapToDbSchema,
      includeRelationFields,
      projectOptions,
    );

    await writeFile(join(outputDir, dbmlFileName), dbmlSchema);
  } catch (e) {
    console.error('Error: unable to write files for Prisma DBML Generator');
    throw e;
  }
}
