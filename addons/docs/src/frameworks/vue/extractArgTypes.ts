import { ArgTypes } from '@storybook/api';
import { ArgTypesExtractor, hasDocgen, extractComponentProps } from '../../lib/docgen';
import { trimQuotes } from '../../lib/sbtypes/utils';

const SECTIONS = ['props', 'events', 'slots'];

const trim = (val: any) => (val && typeof val === 'string' ? trimQuotes(val) : val);

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (!hasDocgen(component)) {
    return null;
  }
  const results: ArgTypes = {};
  SECTIONS.forEach((section) => {
    const props = extractComponentProps(component, section);
    props.forEach(({ propDef, jsDocTags }) => {
      const { name, type, description, defaultValue } = propDef;
      results[name] = {
        name,
        defaultValue: defaultValue && trim(defaultValue.detail || defaultValue.summary),
        table: {
          type,
          jsDocTags,
          defaultValue,
          category: section,
        },
      };
    });
  });
  return results;
};
