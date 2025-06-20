import { DMMF } from '@prisma/generator-helper';
import { getModelByType } from './model.js';

export const oneToOne = '-';
export const oneToMany = '<';
export const manyToOne = '>';

export function generateRelations(
  models: DMMF.Model[],
  mapToDbSchema: boolean = false,
): string[] {
  const refs: string[] = [];
  models.forEach((model) => {
    model.fields
      .filter(
        (field) =>
          field.relationName &&
          field.relationToFields?.length &&
          field.relationFromFields?.length,
      )
      .forEach((field) => {
        const relationFrom = model.name;
        const relationTo = field.type;

        const relationOperator = getRelationOperator(
          models,
          relationFrom,
          relationTo,
        );

        const relationFormName =
          mapToDbSchema && model.dbName ? model.dbName : model.name;

        const relationToName = mapToDbSchema
          ? getModelByType(models, relationTo)?.dbName || relationTo
          : relationTo;

        const ref = `Ref: ${relationFormName}.${combineKeys(
          field.relationFromFields!,
        )} ${relationOperator} ${relationToName}.${combineKeys(
          field.relationToFields!!,
        )}`;

        const referentialActions = getReferentialActions(
          models,
          relationFrom,
          relationTo,
        );

        refs.push(`${ref}${referentialActions}`);
      });
  });
  return refs;
}

const getRelationOperator = (
  models: DMMF.Model[],
  from: string,
  to: string,
): string => {
  const model = models.find((model) => model.name === to);
  const field = model?.fields.find((field) => field.type === from);
  return field?.isList ? manyToOne : oneToOne;
};

// Composite foreign keys:
// Ref: merchant_periods.(merchant_id, country_code) > merchants.(id, country_code)
const combineKeys = (keys: string[]): string => {
  return keys.length > 1 ? `(${keys.join(', ')})` : keys[0];
};

const getReferentialActions = (
  models: DMMF.Model[],
  from: string,
  to: string,
): string => {
  const model = models.find((model) => model.name === from);
  const field = model?.fields.find((field) => field.type === to);
  const referentialActions: string[] = [];

  if (field?.relationOnDelete) {
    referentialActions.push(
      `delete: ${
        referentialActionsMap.get(field.relationOnDelete) ||
        field.relationOnDelete
      }`,
    );
  }

  if (referentialActions.length) {
    return ' [' + referentialActions.join(', ') + ']';
  }
  return '';
};

enum ReferentialAction {
  Cascade = 'Cascade',
  Restrict = 'Restrict',
  NoAction = 'No Action',
  SetNull = 'Set Null',
  SetDefault = 'Set Default',
}

const referentialEntries = Object.entries(ReferentialAction);
const referentialActionsMap = new Map(referentialEntries);
