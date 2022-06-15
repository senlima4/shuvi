import { createFileWithoutName } from '@shuvi/service/lib/project';
import { getPublicRuntimeConfig } from '../../../../../../runtime/runtimeConfig';
import { ProjectContext } from '../../../../projectContext';

export default (context: ProjectContext) =>
  createFileWithoutName({
    content: () => {
      const runtimeConfigContent = getPublicRuntimeConfig()
        ? JSON.stringify(getPublicRuntimeConfig())
        : null;
      return `export default ${runtimeConfigContent}`;
    }
  });