import * as bluebird from 'bluebird';

const redis = require('redis');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

export class Manager {
	public keyCounter: number;

	constructor(
		public client,
		public config: string[]
	) { }

	makeKeys(input: string[]) : bluebird<any> {
		if (input.length <= 0) return null;

		const value = input.pop();

		return this.client.setAsync(this.keyCounter++, value)
			.then(res => {
				return this.makeKeys(input);
			})
	}

	readKeys() {
		
	}
	
	initialize() : bluebird<any> {
		return this.makeKeys(this.config)
	}
}

export abstract class r {
	public get key() { return `${r.classKey}:${this._key}` }
	public value: any;

	constructor(
			public client,
			protected _key: string
	) {}
	
	static classKey: string = '';

}

export class Key extends r {
	protected _key: string;
	public get key() { return `${Key.classKey}:${this._key}` }

	constructor(
		client,
		key: string,
		public value: string
	) {
		super(client, key);
	}
	
	init() {
		return this.client.setAsync(this.key, this.value);
	}

}

export class rList extends r {
    protected _key: string;
    public get key() { return `${rList.classKey}:${this._key}` }
    public value = [];

    push(values: string[]) : bluebird<number>{
        this.value.push(...values);
        return this.client.rpushAsync([this.key, ...values]) as bluebird<number>
    }

    pop() : bluebird<string> {
			this.value.pop();
			return this.client.rpopAsync(this.key) as bluebird<string>
    }

    unshift(values: string[]) : bluebird<number>{
        this.value.push(...values);
        return this.client.lpushAsync(values) as bluebird<number>
    }

    shift() : bluebird<string> {
        this.value.pop();
        return this.client.rpopAsync(this.key) as bluebird<string>
    }
    
    static classKey: string = '';
}

export class rMap extends r {
	protected _key: string;
	public get key() { return `${rMap.classKey}:${this._key}` }
	public value: Map<string, string> = new Map();

	private setArray(array: string[]) : bluebird<string> {
		for (let i = 0; i < array.length; i+=2) {
			this.value.set(array[i], array[i+1])
		}
		return this.client.hmsetAsync([this.key, ...array]) as bluebird<string>
	}
	
	set(key: string | string[], value: string): bluebird<string> {
		if (Array.isArray(key)) return this.setArray(key);
		else {
			this.value.set(key, value);
			return this.client.hmsetAsync([this.key, key, value]) as bluebird<string>
		}
	}

	get(key: string) : bluebird<Object> {
			this.value.get(key);
			return this.client.hmgetAsync([this.key, key]) as bluebird<Object>
	}

	static classKey: string = '';
}

export class rTerminal extends Key {
	protected _key: string;
	public get key() { return `${rTerminal.classKey}:${this._key}` }

	constructor(
		client,
		key: string,
		public value: string
	) {
		super(client, key, value);
	}
	
	static classKey: string = 'terminal';
	static make(key) {

	}
}

export class rNonterminal extends rList {
	protected _key: string;
	public get key() { return `${rNonterminal.classKey}:${this._key}` }
	
	static classKey: string = 'nonterminal';

	static make(client, key: string) {
		const nonterminal = new rNonterminal(client, key);
		const letters = key.split('');

	}
}

export class rNode extends rMap {
	protected _key: string;
	public get key() { return `${rNode.classKey}:${this._key}` }
	
	static classKey: string = 'node';
}

export class Word extends r {
	public get key() { return `${Word.classKey}:${this._key}` }
	public map: rNode;
	public value: rTerminal[]

	constructor(
		public client,
		protected _key: string
	) {
		super(client, _key);
	}

	init() {

		return this.client.rpush([this.key, this.value])
			.then(res => {
				this.map.set
			})
	}
	
	static classKey: string = 'word';

	static make(client, key, value) : bluebird<Word> {
		const word = new Word(client, key);


		client.hmset(word.key)

	}
}

export class Phrase extends r {
	public get key() { return `${Phrase.classKey}:${this._key}` }
	public value: Word[];
	public map: rNode;

	constructor(
		public client,
		protected _key: string
	) {
		super(client, _key);
	}
	
	static classKey: string = 'word';
}

const client = redis.createClient();
const myList = new rNonterminal(client, 'MyStuff');
myList.push(['myPhone', 'myOtherStuff']).then(s => console.log(s));
myList.pop().then(s => console.log(s));