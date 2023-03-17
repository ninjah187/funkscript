/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import { emit } from './emitter';
import { parse } from './parser';
import { tokenize } from './tokenizer';

type FunkScript = string;
type JavaScript = string;

export function compile(input: FunkScript): JavaScript {

  const tokens = tokenize(input);
  const [tree] = parse(tokens);
  const emitted = emit(tree);

  return emitted;

}
