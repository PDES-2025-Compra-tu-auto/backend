import { ChildEntity } from 'typeorm';
import { User } from './User';

@ChildEntity('ADMIN')
export class Admin extends User {}
