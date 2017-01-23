import { Separator, Char } from './terminal';
import { Nonterminal, Word } from './nonterminal';
import { Token } from './token';

describe(`Word`, () => {

	it(`can be constructed with value: : Array<Token<Char>> argument`, () => {
		const token = Token.create<Char>(['h', 'e', 'y'], Char)	
		const word = new Word(token);

		expect(word).toBeDefined()
	})

	it(`returns the existing token if a token with the same value is constructed`, () => {
		const s = new Separator('-')
		const c = new Char('a')
		const token1 = new Token<Separator>(s);
		const token2 = new Token<Char>(c);
		const token3 = new Token<Separator>(s);
		const token4 = new Token<Char>(c);
		
		expect(token1).toBe(token3)
		expect(token2).toBe(token4)
		// FIXME
		// expect(new Char(value2)).toThrow(new Error('Chars cannot be Chars'))
	})

	it(`has a static toLiteral method which returns the string value of a token`, () => {
		const s = new Separator('-')
		const c = new Char('a')
		const token1 = new Token<Separator>(s);
		const token2 = new Token<Char>(c);
		
		expect(Token.toLiteral(token1)).toBe('-')
		expect(Token.toLiteral(token2)).toBe('a')
	})

	it(`has a static create method which returns a token for a given value`, () => {
		const s = Token.create<Separator>('-', Separator)
		const c = Token.create<Char>('a', Char)
		
		expect(Token.toLiteral(s)).toBe('-')
		expect(Token.toLiteral(c)).toBe('a')
	})


})

