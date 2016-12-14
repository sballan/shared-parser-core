import { Word } from './word';
import { Map } from '../utils/map';

export class Node<T> {
	public key: string;
	public value: T;
	public map: Map<Node<T>> = {};
	public freq: number = 1;
	
	constructor(key?: string, value?: T) {
		this.value = value;
	}

	protected _addNode(key: string, value: T, path: string[] = []): Node<T> {
		let node: Node<T>;

		if (path.length > 0) {
			return this._findNode(path)._addNode(key, value);
		}
		else if (this.map[key]) return this.map[key]
		else return this.map[key] = new Node<T>(key, value);
	}

	protected _getNode(path: string | string[]) {
		if (Array.isArray(path)) return this._findNode(path);
		return this.map[path];
	}
	
  protected _findNode(path: string[]) {
  	const length = path.length;
		let map = this.map;
    let currentNode: Node<T>;   
      
		for (let i = 0; i < length; i++) {
      currentNode = map[path[i]];
      map = currentNode.map  
    } 
      
    return currentNode;
	}

	protected _has(key: string) : boolean {
		return this.map[key] ? true : false;
	}

}