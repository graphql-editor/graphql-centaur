import inquirer from 'inquirer';
import * as templates from '@/code/systems/common/templates';
import { addStucco, getPaths, functionParams, HandleTemplates } from '@/code/common';
import { AutocompleteInputPrompt } from '@/utils';

export const common = async ({ resolverParentName, resolverField, rootTypes }: functionParams) => {
  const { resolverPath, basePath, resolverLibPath } = getPaths(resolverParentName, resolverField);
  const commonResolvers = ['resolver', 'pipe', 'rest'];
  const resolverType = await AutocompleteInputPrompt(commonResolvers, {
    name: 'resolverType',
    message: `Specify resolver type`,
  });
  if (resolverType === 'resolver') {
    HandleTemplates.action({
      content: templates.resolver({
        field: resolverField,
        resolverParent: resolverParentName,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'pipe') {
    HandleTemplates.action({
      content: templates.pipe({
        field: resolverField,
        resolverParent: resolverParentName,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  if (resolverType === 'rest') {
    HandleTemplates.action({
      content: templates.rest({
        field: resolverField,
        resolverParent: resolverParentName,
        url: (
          await inquirer.prompt([
            {
              name: 'url',
              message: 'Specify rest endpoint url',
              type: 'input',
              default: 'id',
            },
          ])
        ).url,
      }),
      path: resolverPath,
      type: 'add',
    });
  }
  addStucco({ basePath, stuccoResolverName: `${resolverParentName}.${resolverField.name}`, resolverLibPath });
};
