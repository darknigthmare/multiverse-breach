import path from 'node:path';
import { parseAst } from 'rolldown/parseAst';
import { getUnavailableDlcAdapter, getUnavailableDlcExport } from './dlcProfileAdapters.mjs';

const slash = value => value.split(path.sep).join('/');
const cleanId = value => value.split('?')[0].split('#')[0];
const inside = (node, edit) => node.start >= edit.start && node.end <= edit.end;

function visit(node, parents, callback) {
  if (!node || typeof node.type !== 'string') return;
  callback(node, parents);
  for (const [key, value] of Object.entries(node)) {
    if (key === 'comments' || key === 'tokens') continue;
    if (Array.isArray(value)) {
      for (const child of value) visit(child, [node, ...parents], callback);
    } else if (value && typeof value.type === 'string') {
      visit(value, [node, ...parents], callback);
    }
  }
}

function bindingNames(node, result = []) {
  if (!node) return result;
  if (node.type === 'Identifier') result.push(node);
  else if (node.type === 'RestElement') bindingNames(node.argument, result);
  else if (node.type === 'AssignmentPattern') bindingNames(node.left, result);
  else if (node.type === 'ArrayPattern') {
    for (const element of node.elements) bindingNames(element, result);
  } else if (node.type === 'ObjectPattern') {
    for (const property of node.properties) bindingNames(property.type === 'RestElement' ? property.argument : property.value, result);
  }
  return result;
}

function isReference(node, parents) {
  const parent = parents[0];
  if (!parent) return false;
  if (/^Import/.test(parent.type)) return false;
  if (parent.type === 'VariableDeclarator' && parent.id === node) return false;
  if (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) return false;
  if (parent.type === 'Property' && parent.key === node && !parent.computed && !parent.shorthand) return false;
  if ((parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') && parent.key === node && !parent.computed) return false;
  if (parent.type === 'LabeledStatement' || parent.type === 'BreakStatement' || parent.type === 'ContinueStatement') return false;
  if (parent.type === 'ExportSpecifier' && parent.exported === node && parent.local !== node) return false;
  return true;
}

function applyEdits(source, edits, fail) {
  const ordered = edits.sort((a, b) => a.start - b.start || b.end - a.end);
  const selected = [];
  for (const edit of ordered) {
    const previous = selected.at(-1);
    if (previous && edit.start < previous.end) {
      if (edit.end <= previous.end) {
        if (edit.start === previous.start && edit.end === previous.end && edit.text !== previous.text) fail('Conflicting profile edits');
        continue;
      }
      fail('Overlapping profile edits require an explicit adapter');
    }
    selected.push(edit);
  }
  let result = '';
  let cursor = 0;
  for (const edit of selected) {
    result += source.slice(cursor, edit.start) + edit.text;
    cursor = edit.end;
  }
  return { code: result + source.slice(cursor), edits: selected };
}

/**
 * Remove optional pack contributions before Vite/Rolldown resolves imports.
 * This is source assembly for an immutable distribution, not a runtime download.
 *
 * @param {{ root: string, manifests: Array<object>, installedPackIds: Iterable<string> }} options
 * @returns {{ transform: (source: string, filename: string) => object|null }}
 */
export function createDlcProfileTransformer({ root, manifests, installedPackIds }) {
  if (typeof root !== 'string' || !Array.isArray(manifests) || installedPackIds == null || typeof installedPackIds === 'string') {
    throw new TypeError('DLC transformer needs a root, complete manifests and installedPackIds');
  }
  const projectRoot = path.resolve(root);
  const installed = new Set(installedPackIds);
  const packsById = new Map();
  const packsByDirectory = new Map();
  const modules = new Map();
  for (const manifest of manifests) {
    if (typeof manifest.id !== 'string' || !/^DLC\/[^/]+$/.test(manifest.directory) || !Array.isArray(manifest.modules)) {
      throw new Error('Invalid DLC manifest in source profile');
    }
    if (packsById.has(manifest.id) || packsByDirectory.has(manifest.directory)) {
      throw new Error('Duplicate DLC identity or directory: ' + manifest.id);
    }
    packsById.set(manifest.id, manifest);
    packsByDirectory.set(manifest.directory, manifest);
    for (const module of manifest.modules) {
      if (typeof module.path !== 'string' || module.path.startsWith('/') || module.path.split('/').includes('..')) {
        throw new Error('Invalid DLC module path: ' + manifest.id);
      }
      const absolute = path.resolve(projectRoot, manifest.directory, module.path);
      if (modules.has(absolute)) throw new Error('Duplicate DLC module: ' + absolute);
      modules.set(absolute, { pack: manifest, module, absolute });
    }
  }
  for (const id of installed) {
    if (!packsById.has(id)) throw new Error('Unknown installed DLC pack: ' + id);
  }
  const reduced = installed.size !== packsById.size;
  const relative = filename => slash(path.relative(projectRoot, filename));

  function resolveDlcImport(specifier, filename, fail) {
    if (typeof specifier !== 'string' || (!specifier.startsWith('.') && !specifier.startsWith('/'))) return null;
    const resolved = specifier.startsWith('/DLC/')
      ? path.resolve(projectRoot, '.' + cleanId(specifier))
      : path.resolve(path.dirname(filename), cleanId(specifier));
    const localPath = relative(resolved);
    if (!localPath.startsWith('DLC/')) return null;
    // The independent lightweight metadata registry is present in every profile.
    if (['DLC/index.js', 'DLC/distribution.json', 'DLC/content-identities.json'].includes(localPath)) return null;
    const directory = localPath.split('/').slice(0, 2).join('/');
    const pack = packsByDirectory.get(directory);
    if (!pack) fail('Unknown DLC directory: ' + directory);
    const record = modules.get(resolved) || (!path.extname(resolved) && modules.get(resolved + '.js'));
    if (!record) fail('DLC import is not declared in its manifest: ' + localPath);
    return { ...record, omitted: !installed.has(pack.id) };
  }

  return {
    transform(source, filename) {
      if (!reduced) return null;
      const absolute = path.resolve(projectRoot, cleanId(filename));
      const file = relative(absolute);
      const fail = (message, node) => {
        const line = node ? source.slice(0, node.start).split('\n').length : 1;
        throw new Error('[dlc-profile] ' + file + ':' + line + ': ' + message);
      };
      const ownDirectory = file.split('/').slice(0, 2).join('/');
      const ownPack = packsByDirectory.get(ownDirectory);
      if (ownPack && !installed.has(ownPack.id)) fail('Excluded DLC module entered the source graph: ' + ownPack.id);
      if (!source.includes('DLC/') && !ownPack) return null;

      const parserOptions = absolute.endsWith('.jsx') ? { lang: 'jsx' } : null;
      const ast = parseAst(source, parserOptions, absolute);
      const nodes = [];
      const parentsByNode = new Map();
      visit(ast, [], (node, parents) => {
        nodes.push(node);
        parentsByNode.set(node, parents);
      });
      const imports = new Map();
      const omittedBindings = new Map();
      const importNodes = [];
      const reexports = [];
      const omittedPackIds = new Set();

      for (const statement of ast.body) {
        if (!['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(statement.type) || !statement.source) continue;
        const record = resolveDlcImport(statement.source.value, absolute, fail);
        if (!record) continue;
        if (statement.type === 'ImportDeclaration') {
          for (const specifier of statement.specifiers) {
            const binding = { ...record, kind: specifier.type, name: specifier.local.name, declaration: specifier.local };
            imports.set(binding.name, binding);
            if (record.omitted) omittedBindings.set(binding.name, binding);
          }
          if (record.omitted) {
            if (!statement.specifiers.length) fail('Side-effect DLC imports need an explicit profile contract', statement);
            importNodes.push(statement);
            omittedPackIds.add(record.pack.id);
          }
        } else if (record.omitted) {
          reexports.push({ statement, record });
          omittedPackIds.add(record.pack.id);
        }
      }

      // Do not let dynamic paths reintroduce packs removed from the static graph.
      for (const node of nodes) {
        if (node.type === 'ImportExpression') {
          if (typeof node.source?.value !== 'string') fail('Dynamic DLC imports need an explicit profile contract', node);
          const record = resolveDlcImport(node.source.value, absolute, fail);
          if (record?.omitted) fail('Dynamic import of excluded DLC: ' + record.pack.id, node);
        }
        if (node.type === 'CallExpression' && source.slice(node.callee.start, node.callee.end).startsWith('import.meta.glob')
          && node.arguments.some(argument => typeof argument.value === 'string' && argument.value.includes('DLC/'))) {
          fail('DLC globs need a profile-specific module list', node);
        }
      }

      if (reexports.length) {
        const { statement, record } = reexports[0];
        const contract = getUnavailableDlcAdapter(file, relative(record.absolute));
        if (reexports.length !== 1 || ast.body.length !== 1 || statement.type !== 'ExportAllDeclaration' || statement.exported || !contract) {
          fail('Unknown compatibility re-export; add an explicit absence contract', statement);
        }
        return { code: contract, removedImports: 1, removedContributions: 1, omittedPackIds: [...omittedPackIds].sort() };
      }
      if (!importNodes.length) return null;

      const edits = importNodes.map(node => ({ start: node.start, end: node.end, text: '' }));
      const removedNodes = new Set(importNodes);
      const listRemovals = new Map();
      let removedContributions = 0;
      const ownedDeclarations = new Set();
      const explicitExports = new Set(ast.body.filter(node => node.type === 'ExportNamedDeclaration')
        .flatMap(node => node.specifiers?.map(specifier => specifier.local.name) || []));

      function factoryOwner(node) {
        if (node?.type !== 'CallExpression' || node.optional) return null;
        const callee = node.callee;
        if (callee.type === 'MemberExpression' && !callee.computed && !callee.optional && callee.object.type === 'Identifier') {
          const binding = imports.get(callee.object.name);
          if (binding?.kind === 'ImportNamespaceSpecifier') return { ...binding, factory: callee.property.name };
        } else if (callee.type === 'Identifier') {
          const binding = imports.get(callee.name);
          if (binding && binding.kind !== 'ImportNamespaceSpecifier') return { ...binding, factory: callee.name };
        }
        return null;
      }

      function removeListMember(container, node) {
        if (removedNodes.has(node)) return;
        const selected = listRemovals.get(container) || new Set();
        selected.add(node);
        listRemovals.set(container, selected);
        removedNodes.add(node);
        removedContributions++;
      }

      const topLevel = ast.body.flatMap(statement => {
        const declaration = statement.type === 'ExportNamedDeclaration' ? statement.declaration : statement;
        if (declaration?.type !== 'VariableDeclaration') return [];
        return declaration.declarations.map(variable => ({
          variable, declaration,
          exported: statement.type === 'ExportNamedDeclaration' || explicitExports.has(variable.id.name)
        }));
      });
      // Propagate only direct private aliases. Destructuring and derived expressions
      // require an explicit contract instead of guessing ownership.
      let changed = true;
      while (changed) {
        changed = false;
        for (const { variable, declaration, exported } of topLevel) {
          if (ownedDeclarations.has(variable)) continue;
          const owner = factoryOwner(variable.init)
            || (variable.init?.type === 'Identifier' ? omittedBindings.get(variable.init.name) : null);
          if (!owner?.omitted) continue;
          if (variable.id.type !== 'Identifier' || declaration.kind !== 'const') fail('DLC factory bindings must be direct constants', variable);
          if (exported) {
            const replacement = getUnavailableDlcExport(file, variable.id.name, owner.pack.id, owner.factory);
            if (replacement === null) fail('Public DLC factory value needs an explicit absence contract: ' + variable.id.name, variable);
            edits.push({ start: variable.init.start, end: variable.init.end, text: replacement });
          } else {
            omittedBindings.set(variable.id.name, { ...owner, kind: 'PrivateValue', declaration: variable.id });
            removeListMember(declaration, variable);
          }
          ownedDeclarations.add(variable);
          changed = true;
        }
      }

      // Names are unique in the inspected aggregators. Fail if a future shadowing
      // binding would require lexical scope analysis before pruning.
      for (const node of nodes) {
        let bindings = [];
        if (node.type === 'VariableDeclarator') bindings = bindingNames(node.id);
        if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type)) {
          bindings = [...bindingNames(node.id), ...node.params.flatMap(parameter => bindingNames(parameter))];
        }
        if (node.type === 'CatchClause') bindings = bindingNames(node.param);
        if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') bindings = bindingNames(node.id);
        for (const bindingNode of bindings) {
          const binding = omittedBindings.get(bindingNode.name);
          if (binding && binding.declaration !== bindingNode) fail('Shadowed DLC binding needs an explicit adapter: ' + bindingNode.name, bindingNode);
        }
      }

      const covered = node => (parentsByNode.get(node) || []).some(parent => removedNodes.has(parent))
        || removedNodes.has(node) || edits.some(edit => inside(node, edit));
      const unresolved = [];
      for (const node of nodes) {
        const owner = factoryOwner(node);
        const reference = node.type === 'Identifier' && omittedBindings.has(node.name) && isReference(node, parentsByNode.get(node));
        if (!owner?.omitted && !reference) continue;
        if (covered(node)) continue;
        const parents = parentsByNode.get(node);
        const parent = parents[0];
        // Removing an argument needed by a retained pack is not an empty contribution.
        const retainedFactory = parents.find(ancestor => {
          const ancestorOwner = factoryOwner(ancestor);
          return ancestorOwner && !ancestorOwner.omitted;
        });
        if (retainedFactory) {
          unresolved.push({ node, reason: 'Retained DLC factory depends on an excluded pack' });
          continue;
        }
        if (parent?.type === 'ArrayExpression') removeListMember(parent, node);
        else if (parent?.type === 'Property' && parent.value === node && parents[1]?.type === 'ObjectExpression') {
          removeListMember(parents[1], parent);
        } else if (parent?.type === 'SpreadElement' && parent.argument === node
          && ['ArrayExpression', 'ObjectExpression'].includes(parents[1]?.type)) {
          removeListMember(parents[1], parent);
        } else unresolved.push({ node, reason: 'Unsupported use of excluded DLC binding' });
      }

      for (const [container, selected] of listRemovals) {
        const list = container.type === 'VariableDeclaration' ? container.declarations
          : container.type === 'ArrayExpression' ? container.elements : container.properties;
        if (list.some(node => node === null)) fail('Sparse contribution arrays require an explicit adapter', container);
        if (selected.size === list.length) {
          edits.push(container.type === 'VariableDeclaration'
            ? { start: container.start, end: container.end, text: '' }
            : { start: container.start + 1, end: container.end - 1, text: '' });
          continue;
        }
        for (let index = 0; index < list.length; index++) {
          if (!selected.has(list[index])) continue;
          const startIndex = index;
          while (index + 1 < list.length && selected.has(list[index + 1])) index++;
          const next = list[index + 1];
          edits.push(next
            ? { start: list[startIndex].start, end: next.start, text: '' }
            : { start: list[startIndex - 1].end, end: list[index].end, text: '' });
        }
      }
      const result = applyEdits(source, edits, fail);
      for (const { node, reason } of unresolved) {
        if (!result.edits.some(edit => inside(node, edit))) fail(reason + ': ' + source.slice(node.start, Math.min(node.end, node.start + 100)), node);
      }
      parseAst(result.code, parserOptions, absolute);
      return {
        code: result.code,
        removedImports: importNodes.length,
        removedContributions,
        omittedPackIds: [...omittedPackIds].sort()
      };
    }
  };
}
