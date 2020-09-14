import { ParserField } from 'graphql-zeus';

export const oneInputCreate = ({
  collection,
  resolverParent,
  field,
  input,
  sourceType,
  modelName,
}: {
  collection: string;
  resolverParent: string;
  field: ParserField;
  input: string;
  modelName: string;
  sourceType?: string;
}) => {
  const zeusImports: string[] = [];
  if (field.args && field.args.length > 0) {
    zeusImports.push('ResolverType');
    zeusImports.push('ValueTypes');
  }
  return `
import { FieldResolveInput, FieldResolveOutput } from "stucco-js";
import { DB } from "../db/mongo";
import { Orm } from "../db/orm";
import { ${modelName}${sourceType ? `, ${sourceType}` : ''} } from "../db/models";
${zeusImports.length > 0 ? `import { ${zeusImports.join(', ')} } from "../graphql-zeus";` : ``}

export const handler = async (
  input: FieldResolveInput<ResolverType<ValueTypes["${resolverParent}"]["${field.name}"]>${
    sourceType ? `,${sourceType}` : ''
  }>,
): Promise<FieldResolveOutput<string>> => {
    const {
      arguments:{
        ${input}
      }${
        sourceType
          ? `,
      source
      `
          : ''
      }
    } = input;
    const db = await DB();
    const o = await Orm<${modelName}>(db,'${collection}').create(${input})
    return o.insertedId.toHexString()
};
`;
};
