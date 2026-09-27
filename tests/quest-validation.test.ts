import {describe,expect,it} from 'vitest';import {validateQuestContent} from '../src/lib/quest-validation';
describe('quest content safety',()=>{it('maps every reachable objective to implemented content',()=>expect(validateQuestContent()).toEqual([]))});
